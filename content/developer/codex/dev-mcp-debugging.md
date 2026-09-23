---
title: Тестування та налагодження MCP
domain: dev-agents-mcp
summary: MCP Inspector, логування без зламу stdio, контрактні тести, діагностика в Claude Code і версіонування інструментів.
---

## Золоте правило stdio

У stdio-сервері **stdout належить протоколу**. Будь-який рядок, що не є JSON-RPC, ламає handshake або окремі відповіді.

| Мова | Небезпечно | Безпечно |
|---|---|---|
| Python | `print(...)` | `logging` у stderr, `print(..., file=sys.stderr)` |
| Node.js | `console.log`, `console.info`, `console.debug`, `process.stdout.write` | `console.error`, `console.warn` |

Щоб передати логи клієнту через протокол, оголосіть можливість `logging` і надсилайте `notifications/message` з рівнем. Клієнт змінює поріг через `logging/setLevel`. У результати інструментів логи не пишуть: вони засмічують контекст моделі.

## MCP Inspector

```bash
npx @modelcontextprotocol/inspector node build/index.js
npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/list
```

Вебінтерфейс показує `tools/list`, дає викликати інструменти, читати ресурси й бачити сповіщення. CLI-режим підходить для smoke-тестів у CI.

## Перевірка знизу вгору

1. Запустити команду сервера вручну: чи стартує без помилок у stderr.
2. Inspector: `tools/list` зі схемами.
3. Inspector: виклик з тестовими аргументами.
4. Claude Code: `/mcp` (статус і кількість інструментів), `claude --debug` для подробиць.
5. Реальна задача агента.

Типові причини «сервер є, інструментів немає»: падіння при старті (немає змінної середовища), відносний шлях у `command`/`args`, сміття у stdout. Анотації на кшталт `readOnlyHint` інструментів не приховують. Якщо старт довгий, відповідайте на `initialize` одразу, а важке завантажуйте ліниво; `MCP_TIMEOUT` збільшує час очікування.

## Контрактні тести

```ts
const [ct, st] = InMemoryTransport.createLinkedPair();
await server.connect(st);
const client = new Client({ name: "test", version: "1.0.0" });
await client.connect(ct);
expect(await client.listTools()).toMatchSnapshot();
```

Швидко й детерміновано, справжній протокол без процесів. Stdout цей тест не перевіряє, тому потрібен ще окремий smoke-тест через stdio. Що перевіряти:

- імена й схеми в `tools/list` (snapshot);
- очікуваний `content`/`structuredContent` на валідних аргументах;
- `isError: true` зі зрозумілим текстом при збої залежності.

Зміна `description` у snapshot — це зміна промпта: оновлюйте свідомо після рев'ю. Чи обирає модель інструмент, перевіряє **eval**: набір сценаріїв через агента з перевіркою викликів і частки успіху. Один ручний прогін чи мок моделі цього не показують.

## Зависання

Власний тайм-аут на upstream, `isError` з порадою, обробка `notifications/cancelled` з перериванням роботи. Порожній «успіх» і нескінченні повтори шкодять.

## Версіонування

- `protocolVersion` — версія специфікації MCP, а не вашого API. Якщо сервер не підтримує версію клієнта, він відповідає іншою, а клієнт може розірвати з'єднання.
- Додавати опційні поля безпечно. Перейменування й видалення проводять через перехідний період (приймати обидва, deprecated) або нову назву інструмента, піднімаючи `version` сервера. `list_changed` не виправить чужі скрипти.

Див. також [[dev-mcp-server]] і [[dev-evals]].
