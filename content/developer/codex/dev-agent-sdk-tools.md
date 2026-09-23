---
title: Інструменти й дозволи в Agent SDK
domain: dev-agents-mcp
summary: Власні інструменти через in-process MCP, режими дозволів, allowedTools, canUseTool, hooks і субагенти.
---

## Власні інструменти

Власний інструмент — це in-process MCP-сервер, що працює у вашому процесі:

```ts
const lookup = tool("lookup_order", "Шукає замовлення за id", { id: z.string() },
  async ({ id }) => ({ content: [{ type: "text", text: await find(id) }] }));
const shop = createSdkMcpServer({ name: "shop", version: "1.0.0", tools: [lookup] });

query({ prompt, options: { mcpServers: { shop }, allowedTools: ["mcp__shop__lookup_order"] } });
```

Ім'я інструмента: `mcp__<ключ у mcpServers>__<tool>`. Помилку хендлер повертає як `{ content: [...], isError: true }` з поясненням. Вигаданий «OK» чи виняток, що обриває весь `query()`, гірші.

## Дозволи

| `permissionMode` | Поведінка |
|---|---|
| `default` | Звичайні перевірки |
| `acceptEdits` | Автоматично схвалює редагування й базові файлові операції; `Bash` та інше проходять звичайну перевірку |
| `plan` | Лише планування, без змін |
| `bypassPermissions` | Жодних запитів на дозвіл |

`allowedTools` і `disallowedTools` несиметричні: перший лише **попередньо схвалює**, другий **забороняє**. У `bypassPermissions` інструмент не з `allowedTools` усе одно виконається; зупинить його лише `disallowedTools` або hook. Агент «лише читати» — це `allowedTools: ["Read","Grep","Glob"]` плюс `disallowedTools: ["Write","Edit","Bash"]`, а не прохання в промпті.

`canUseTool` викликається, коли правила й режим не вирішили: показати діалог, дочекатися людини й повернути `{ behavior: "allow", updatedInput }` або `{ behavior: "deny", message }`.

Порядок обробки виклику: `tool_use` → `PreToolUse` hook → правила, режим, `canUseTool` → виконання → `PostToolUse` → `tool_result` моделі.

## Hooks

```ts
hooks: { PreToolUse: [{ matcher: "Bash", hooks: [blockRmRf] }] }
```

Ключ — подія, `matcher` — інструмент. `PreToolUse` через `hookSpecificOutput` може:

- `permissionDecision: "deny"` з `permissionDecisionReason`: інструмент не виконується, модель отримує причину і продовжує;
- `permissionDecision: "allow"`: схвалити без запиту;
- `updatedInput`: виправити аргументи.

Результату на цьому етапі ще немає; з результатом працює `PostToolUse`. Порожній `{}` означає «без втручання».

## Субагенти

```ts
agents: {
  "log-analyst": {
    description: "Аналізує логи й повертає стислий звіт про помилки",
    prompt: "Ти аналітик логів…",
    tools: ["Read", "Grep", "Glob"],
    model: "haiku",
  },
}
```

- `description` визначає, коли головний агент делегує. Якщо до субагента не звертаються, перевіряйте опис.
- Субагент працює у **власному контексті** й повертає лише підсумок: так сирі дані не забивають головний контекст.
- Без `tools` субагент успадковує всі інструменти запуску.
- Субагенти не запускають власних субагентів.

Основи запуску описано в [[dev-agent-sdk-basics]], повний MCP-сервер — у [[dev-mcp-server]].
