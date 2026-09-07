import type { Level } from "@/lib/content/types";

const d = "agentic-architecture" as const;

export const levels: Level[] = [
  {
    id: "aa-1",
    domainId: d,
    index: 1,
    title: "Agent Loop",
    subtitle: "Що робить систему агентною і з чого складається цикл gather → act → verify.",
    boss: false,
    codexRef: "agentic-loop",
  },
  {
    id: "aa-2",
    domainId: d,
    index: 2,
    title: "Декомпозиція задач",
    subtitle: "Планування, розбиття на кроки і межа між workflow та автономним агентом.",
    boss: false,
    codexRef: "task-decomposition",
  },
  {
    id: "aa-3",
    domainId: d,
    index: 3,
    title: "Патерни оркестрації",
    subtitle: "Prompt chaining, routing, паралелізація, orchestrator-workers, evaluator-optimizer.",
    boss: false,
    codexRef: "orchestration-patterns",
  },
  {
    id: "aa-4",
    domainId: d,
    index: 4,
    title: "Subagents та ізоляція контексту",
    subtitle: "Коли віддавати роботу субагенту і як не втратити результат по дорозі.",
    boss: false,
    codexRef: "subagents",
  },
  {
    id: "aa-5",
    domainId: d,
    index: 5,
    title: "Claude Agent SDK",
    subtitle: "Agentic loop із коробки: сесії, дозволи, MCP, hooks у коді.",
    boss: false,
    codexRef: "agent-sdk",
  },
  {
    id: "aa-6",
    domainId: d,
    index: 6,
    title: "Guardrails і human-in-the-loop",
    subtitle: "Дозволи, ліміти, точки підтвердження та зупинка агента, що пішов не туди.",
    boss: false,
    codexRef: "guardrails",
  },
  {
    id: "aa-boss",
    domainId: d,
    index: 7,
    title: "БОС: Продакшн-агент",
    subtitle: "Три сценарії, у яких неправильна відповідь звучить як гарна інженерія.",
    boss: true,
    codexRef: "agentic-production",
  },
];
