---
title: MCP-сервер з нуля
domain: dev-agents-mcp
summary: Як написати MCP-сервер на офіційних SDK, описати схеми вводу й виводу та правильно повертати результати й помилки.
---

## TypeScript

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "tickets", version: "1.0.0" });
server.registerTool("get_ticket", {
  title: "Отримати тікет",
  description: "Повертає тікет за id",
  inputSchema: { id: z.string().describe("Ідентифікатор, напр. T-123") },
}, async ({ id }) => ({ content: [{ type: "text", text: JSON.stringify(await db.find(id)) }] }));

await server.connect(new StdioServerTransport());
```

Кроки: встановити `@modelcontextprotocol/sdk` і `zod` → `new McpServer` → `registerTool` → `server.connect(transport)` → додати в клієнт. Без `connect` сервер не отримає жодного повідомлення. `inputSchema` — zod-схема: SDK робить із неї JSON Schema для `tools/list` і валідує аргументи. `name` — стабільний ідентифікатор для `tools/call`, `title` — підпис для людей.

## Python: FastMCP

```python
from mcp.server.fastmcp import FastMCP
mcp = FastMCP("weather")

@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """Прогноз погоди на 3 дні для координат."""
    ...

mcp.run(transport="stdio")
```

Анотації типів стають `inputSchema`, docstring — `description`.

## Результат

`content` — масив блоків `text`, `image`, `audio`, `resource` (вбудований) або `resource_link`. Якщо оголошено `outputSchema`, результат несе `structuredContent` за схемою, а той самий JSON варто дублювати текстом для старих клієнтів.

Великі відповіді роздувають контекст: додавайте фільтри, `limit`, пагінацію, повертайте лише потрібні поля, а повний експорт віддавайте посиланням на ресурс.

## Два види помилок

| Ситуація | Як повертати |
|---|---|
| Невідомий інструмент, зламаний запит | JSON-RPC `error` (протокол) |
| API впав, 404, невалідні бізнес-дані | Результат з `isError: true` і текстом «що не так і що робити» |

Порожній `content` чи «error» без `isError` модель не зрозуміє й повторюватиме виклик. Формат полів краще описати в схемі (`.describe`, `z.enum`) і повертати помилку з прикладом правильного значення.

## Інше

- **Секрети** — через змінні середовища (`env` у `.mcp.json`, `claude mcp add --env`), а не аргументи чи описи.
- **Анотації** `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` — лише підказки для клієнта. Вони нічого не забороняють, а від недовірених серверів їм не довіряють.
- **`listChanged: true`** у `capabilities.tools` дозволяє надсилати `notifications/tools/list_changed`; клієнт знову викликає `tools/list`.
- **Прогрес**: якщо запит має `_meta.progressToken`, сервер надсилає `notifications/progress` з `progress`, `total`, `message`.

Транспорти описано в [[dev-mcp-transports]], налагодження — у [[dev-mcp-debugging]].
