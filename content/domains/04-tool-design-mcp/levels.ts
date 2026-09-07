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
    questionIds: ["td-1-q1", "td-1-q2", "td-1-q3", "td-1-q4", "td-1-q5", "td-1-q6"],
  },
  {
    id: "td-2",
    domainId: d,
    index: 2,
    title: "Схеми та помилки",
    subtitle: "JSON Schema, enum замість вільного тексту, структуровані помилки для моделі.",
    boss: false,
    codexRef: "tool-schemas-errors",
    questionIds: ["td-2-q1", "td-2-q2", "td-2-q3", "td-2-q4", "td-2-q5", "td-2-q6"],
  },
  {
    id: "td-3",
    domainId: d,
    index: 3,
    title: "Основи MCP",
    subtitle: "Навіщо протокол, з чого складається і як він взаємодіє з host-застосунком.",
    boss: false,
    codexRef: "mcp-foundations",
    questionIds: ["td-3-q1", "td-3-q2", "td-3-q3", "td-3-q4", "td-3-q5", "td-3-q6"],
  },
  {
    id: "td-4",
    domainId: d,
    index: 4,
    title: "MCP-сервери і клієнти",
    subtitle: "Tools, resources, prompts, транспорти stdio та HTTP, авторизація.",
    boss: false,
    codexRef: "mcp-servers",
    questionIds: ["td-4-q1", "td-4-q2", "td-4-q3", "td-4-q4", "td-4-q5", "td-4-q6"],
  },
  {
    id: "td-boss",
    domainId: d,
    index: 5,
    title: "БОС: Інтеграція зовнішнього сервісу",
    subtitle: "Обрати між MCP-сервером, власним інструментом і звичайним API-викликом.",
    boss: true,
    codexRef: "mcp-integration",
    questionIds: ["td-b-q1", "td-b-q2", "td-b-q3"],
  },
];
