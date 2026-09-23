import type { Level } from "@/lib/content/types";

const d = "dev-agents-mcp" as const;

export const levels: Level[] = [
  {
    id: "dm-1",
    domainId: d,
    index: 1,
    title: "Agent SDK: перший агент",
    subtitle: "query(), цикл агента, системний промпт, вбудовані інструменти та сесії.",
    boss: false,
    codexRef: "dev-agent-sdk-basics",
  },
  {
    id: "dm-2",
    domainId: d,
    index: 2,
    title: "Інструменти й дозволи в SDK",
    subtitle: "Власні tools, permission modes, allowedTools, hooks і subagents у SDK.",
    boss: false,
    codexRef: "dev-agent-sdk-tools",
  },
  {
    id: "dm-3",
    domainId: d,
    index: 3,
    title: "MCP-сервер з нуля",
    subtitle: "Офіційні SDK, реєстрація tools, схеми вводу, повернення результатів і помилок.",
    boss: false,
    codexRef: "dev-mcp-server",
  },
  {
    id: "dm-4",
    domainId: d,
    index: 4,
    title: "Транспорти, resources, prompts",
    subtitle: "stdio проти Streamable HTTP, resources і prompts, авторизація.",
    boss: false,
    codexRef: "dev-mcp-transports",
  },
  {
    id: "dm-5",
    domainId: d,
    index: 5,
    title: "Тестування та налагодження MCP",
    subtitle: "MCP Inspector, логування без зламу stdio, контрактні тести, версіонування.",
    boss: false,
    codexRef: "dev-mcp-debugging",
  },
  {
    id: "dm-boss",
    domainId: d,
    index: 6,
    title: "БОС: Агент на MCP у продакшні",
    subtitle: "Поєднати Agent SDK і власні MCP-сервери у надійну систему.",
    boss: true,
    codexRef: "dev-agents-boss",
  },
];
