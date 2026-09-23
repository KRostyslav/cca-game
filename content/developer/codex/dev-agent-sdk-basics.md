---
title: Agent SDK: перший агент
domain: dev-agents-mcp
summary: Як запустити агента через query(), читати потік повідомлень, задати системний промпт і працювати з сесіями.
---

## Що це

Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`, Python `claude-agent-sdk`) — харнес Claude Code у вигляді бібліотеки. Цикл агента, вбудовані інструменти (`Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebSearch`, `WebFetch`), дозволи, hooks і сесії вже реалізовані. Інструменти виконуються **у вашому процесі** з його правами, тому продакшн-агента запускають в ізольованому контейнері. Ключ API SDK бере зі змінної `ANTHROPIC_API_KEY`.

## query() і потік повідомлень

```ts
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const m of query({ prompt: "Полагодь тести", options: { cwd: repo, maxTurns: 20 } })) {
  if (m.type === "system" && m.subtype === "init") save(m.session_id);
  if (m.type === "result") {
    if (m.subtype === "success") console.log(m.result);
    else console.error("не завершено:", m.subtype);
  }
}
```

| Повідомлення | Що в ньому |
|---|---|
| `system` / `init` | `session_id`, модель, список інструментів, статуси MCP-серверів |
| `assistant` | Хід моделі: текст і `tool_use` |
| `user` | `tool_result`, повернутий моделі |
| `stream_event` | Часткові події, лише з `includePartialMessages: true` |
| `result` | Останнє: `subtype`, `result` (лише для `success`), `total_cost_usd`, `num_turns`, `usage`, `session_id` |

Порядок: `init` → ходи моделі й результати інструментів → фінальний текст → `result`. Помилкові `subtype` (`error_max_turns`, `error_during_execution`) не мають поля `result`, тож спершу перевіряйте `subtype`.

## Ключові опції

| Опція | Навіщо |
|---|---|
| `systemPrompt` | Рядок **замінює** промпт; `{ type: "preset", preset: "claude_code", append }` дає промпт Claude Code плюс ваші правила |
| `settingSources` | За замовчуванням SDK не читає налаштування з диска; `["project"]` підключає `CLAUDE.md` і `.claude/settings.json` |
| `cwd` | Робочий каталог для шляхів інструментів і `Bash` |
| `maxTurns` | Жорстка межа ходів; перевищення дає `result` з `error_max_turns` |
| `includePartialMessages` | Текст по мірі генерації через `stream_event` |

`max_tokens` обмежує одну відповідь, а не кількість кроків, а прохання в промпті взагалі нічого не гарантує.

## Сесії

- `resume: sessionId` продовжує конкретну розмову з повною історією, включно з інструментами.
- `resume` + `forkSession: true` створює **нову** сесію з новим id від того самого стану; оригінал не змінюється.
- `continue: true` бере найсвіжішу сесію в робочому каталозі, тож для багатьох користувачів не підходить.

Сесії зберігаються на локальному диску процесу (див. [[dev-agents-boss]]).

## Python: query() чи ClaudeSDKClient

`query()` — одноразовий запуск. `ClaudeSDKClient` тримає сесію для багатоходової розмови: наступні `client.query()` продовжують ту саму розмову, `receive_response()` читає відповідь, `interrupt()` зупиняє агента. Обидва асинхронні.

Далі: власні інструменти й дозволи — [[dev-agent-sdk-tools]].
