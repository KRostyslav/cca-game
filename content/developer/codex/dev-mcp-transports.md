---
title: Транспорти, resources і prompts
domain: dev-agents-mcp
summary: stdio і Streamable HTTP, життєвий цикл з'єднання, сесії, ресурси, prompts і авторизація MCP-серверів.
---

## Життєвий цикл

1. Клієнт → `initialize` (`protocolVersion`, `capabilities`, `clientInfo`).
2. Сервер → свої `capabilities`, `serverInfo`, версія протоколу.
3. Клієнт → `notifications/initialized`.
4. Звичайна робота: `tools/list`, `tools/call`, `resources/read`…

## stdio

Клієнт запускає сервер підпроцесом (`command`, `args`, `env`) і обмінюється JSON-RPC через stdin/stdout, по одному повідомленню на рядок. Портів немає. Облікові дані сервер бере **із середовища**; OAuth-специфікація MCP для stdio не призначена.

## Streamable HTTP

Один ендпоінт (`/mcp`): клієнт шле кожне повідомлення POST-ом, GET відкриває SSE-потік для повідомлень сервера. На POST із запитом сервер відповідає `application/json` або `text/event-stream`, якщо спершу треба надіслати сповіщення (наприклад, прогрес), а потім відповідь. Старий транспорт HTTP+SSE з окремими `/sse` і `/messages` застарів.

**Сесії.** Сервер може видати `Mcp-Session-Id` у відповіді на `initialize`, і клієнт додає його в усі наступні запити. На 404 з цим id клієнт робить новий `initialize`. Це стан, а не автентифікація. Якщо стан тримається в пам'яті одного інстансу, за балансувальником потрібні sticky sessions, спільне сховище або stateless-режим.

**Безпека.** Перевіряти `Origin` (захист від DNS rebinding), локально слухати лише `127.0.0.1`, вимагати автентифікацію.

```json
{ "mcpServers": {
  "tickets": { "type": "http", "url": "https://mcp.example.com/mcp" },
  "local":   { "command": "node", "args": ["build/index.js"], "env": { "API_TOKEN": "${API_TOKEN}" } }
} }
```

Тип `sse` лишився для старих серверів.

## Авторизація (HTTP)

Запит без токена → **401** з `WWW-Authenticate`, що вказує на `/.well-known/oauth-protected-resource`. Клієнт знаходить сервер авторизації й проходить OAuth 2.1 з PKCE. Сервер валідує audience токена і **не пересилає** клієнтський токен в upstream API (token passthrough заборонено): для GitHub чи іншого сервісу в нього свої облікові дані. Ідентичність і tenant беруться з токена, а не з аргументів моделі.

## Resources

```ts
server.registerResource("app-config", "config://app", { mimeType: "application/json" },
  async (uri) => ({ contents: [{ uri: uri.href, text: JSON.stringify(config) }] }));
```

- `resources/list` дає перелік, `resources/read` — вміст за URI.
- Параметризовані ресурси — `ResourceTemplate` з URI template (`users://{userId}/profile`), видно в `resources/templates/list`.
- Підписка: `resources/subscribe` → `notifications/resources/updated` (лише URI) → `resources/read`. `list_changed` означає зміну переліку, а не вмісту.

## Prompts

Шаблони, які викликає **користувач**. `registerPrompt` з аргументами (обов'язковими чи ні), `prompts/get` повертає `messages`. Модель сервер не викликає. У Claude Code prompt з'являється як `/mcp__<server>__<prompt>`.

Про написання інструментів див. [[dev-mcp-server]].
