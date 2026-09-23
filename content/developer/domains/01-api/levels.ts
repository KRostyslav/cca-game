import type { Level } from "@/lib/content/types";

const d = "dev-api" as const;

export const levels: Level[] = [
  {
    id: "da-1",
    domainId: d,
    index: 1,
    title: "Messages API",
    subtitle: "Запит і відповідь: ролі, system, content blocks, stateless-історія.",
    boss: false,
    codexRef: "dev-api-messages",
  },
  {
    id: "da-2",
    domainId: d,
    index: 2,
    title: "Моделі та параметри",
    subtitle: "Вибір моделі, max_tokens, temperature, stop_sequences, extended thinking.",
    boss: false,
    codexRef: "dev-api-models-params",
  },
  {
    id: "da-3",
    domainId: d,
    index: 3,
    title: "Streaming",
    subtitle: "Server-sent events, типи подій, збирання відповіді та UX потокового виводу.",
    boss: false,
    codexRef: "dev-api-streaming",
  },
  {
    id: "da-4",
    domainId: d,
    index: 4,
    title: "Токени та usage",
    subtitle: "Підрахунок токенів, поле usage, контекстне вікно, stop_reason і обрізання.",
    boss: false,
    codexRef: "dev-api-tokens",
  },
  {
    id: "da-5",
    domainId: d,
    index: 5,
    title: "Помилки та ретраї",
    subtitle: "HTTP-коди, 429 і 529, експоненційний backoff, таймаути, ідемпотентність.",
    boss: false,
    codexRef: "dev-api-errors",
  },
  {
    id: "da-boss",
    domainId: d,
    index: 6,
    title: "БОС: Продакшн-клієнт API",
    subtitle: "Зібрати надійний клієнт: SDK, streaming, ретраї, ліміти й облік вартості.",
    boss: true,
    codexRef: "dev-api-boss",
  },
];
