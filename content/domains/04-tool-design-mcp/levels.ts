import type { Level } from "@/lib/content/types";

const d = "tool-design-mcp" as const;

export const levels: Level[] = [
  {
    id: "td-1",
    domainId: d,
    index: 1,
    title: "Основи дизайну інструментів",
    subtitle: "Опис інструмента — це промпт. Найменування, межі, кількість інструментів.",
    boss: false,
    codexRef: "tool-design-fundamentals",
  },
  {
    id: "td-2",
    domainId: d,
    index: 2,
    title: "Схеми та помилки",
    subtitle: "JSON Schema, enum замість вільного тексту, структуровані помилки для моделі.",
    boss: false,
    codexRef: "tool-schemas-errors",
  },
  {
    id: "td-3",
    domainId: d,
    index: 3,
    title: "Основи MCP",
    subtitle: "Навіщо протокол, з чого складається і як він взаємодіє з host-застосунком.",
    boss: false,
    codexRef: "mcp-foundations",
  },
  {
    id: "td-4",
    domainId: d,
    index: 4,
    title: "MCP-сервери і клієнти",
    subtitle: "Tools, resources, prompts, транспорти stdio та HTTP, авторизація.",
    boss: false,
    codexRef: "mcp-servers",
  },
  {
    id: "td-boss",
    domainId: d,
    index: 5,
    title: "БОС: Інтеграція зовнішнього сервісу",
    subtitle: "Обрати між MCP-сервером, власним інструментом і звичайним API-викликом.",
    boss: true,
    codexRef: "mcp-integration",
  },
];
