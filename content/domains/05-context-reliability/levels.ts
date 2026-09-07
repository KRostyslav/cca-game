import type { Level } from "@/lib/content/types";

const d = "context-reliability" as const;

export const levels: Level[] = [
  {
    id: "cr-1",
    domainId: d,
    index: 1,
    title: "Вікно контексту",
    subtitle: "Токени, ліміти, вартість і чому «просто вкинути все» не працює.",
    boss: false,
    codexRef: "context-window",
  },
  {
    id: "cr-2",
    domainId: d,
    index: 2,
    title: "Prompt caching",
    subtitle: "Cache breakpoints, порядок блоків, TTL і що ламає кеш.",
    boss: false,
    codexRef: "prompt-caching",
  },
  {
    id: "cr-3",
    domainId: d,
    index: 3,
    title: "Компакція і пам'ять",
    subtitle: "Довгі сесії: підсумовування, зовнішня пам'ять, файли як стан.",
    boss: false,
    codexRef: "compaction-memory",
  },
  {
    id: "cr-4",
    domainId: d,
    index: 4,
    title: "Retrieval і фільтрація",
    subtitle: "RAG проти повного дампа, just-in-time контекст, релевантність.",
    boss: false,
    codexRef: "retrieval-context",
  },
  {
    id: "cr-5",
    domainId: d,
    index: 5,
    title: "Надійність і помилки",
    subtitle: "Ретраї з backoff, rate limits, ідемпотентність, деградація і спостережуваність.",
    boss: false,
    codexRef: "reliability-errors",
  },
  {
    id: "cr-boss",
    domainId: d,
    index: 6,
    title: "БОС: Довгограючий агент",
    subtitle: "Агент, що працює годинами: контекст, вартість і відновлення після падіння.",
    boss: true,
    codexRef: "context-boss",
  },
];
