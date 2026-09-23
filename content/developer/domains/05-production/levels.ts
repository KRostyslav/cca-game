import type { Level } from "@/lib/content/types";

const d = "dev-production" as const;

export const levels: Level[] = [
  {
    id: "dp-1",
    domainId: d,
    index: 1,
    title: "Evals і тести промптів",
    subtitle: "Набори тестів, метрики, LLM-as-judge, регресії при зміні промпта чи моделі.",
    boss: false,
    codexRef: "dev-evals",
  },
  {
    id: "dp-2",
    domainId: d,
    index: 2,
    title: "Кешування і вартість",
    subtitle: "Prompt caching, cache_control, вибір моделі за ціною, облік токенів.",
    boss: false,
    codexRef: "dev-caching-cost",
  },
  {
    id: "dp-3",
    domainId: d,
    index: 3,
    title: "Batches і latency",
    subtitle: "Message Batches API, асинхронна обробка, streaming і час до першого токена.",
    boss: false,
    codexRef: "dev-batch-latency",
  },
  {
    id: "dp-4",
    domainId: d,
    index: 4,
    title: "Безпека",
    subtitle: "Prompt injection, недовірені дані, секрети, мінімальні дозволи інструментів.",
    boss: false,
    codexRef: "dev-security",
  },
  {
    id: "dp-5",
    domainId: d,
    index: 5,
    title: "Observability і rollout",
    subtitle: "Логи, трейси, моніторинг якості, feature flags і поступовий реліз.",
    boss: false,
    codexRef: "dev-observability",
  },
  {
    id: "dp-boss",
    domainId: d,
    index: 6,
    title: "БОС: Реліз LLM-фічі",
    subtitle: "Провести фічу від прототипу до продакшну: якість, вартість, безпека.",
    boss: true,
    codexRef: "dev-production-boss",
  },
];
