import type { Level } from "@/lib/content/types";

const d = "prompt-engineering" as const;

export const levels: Level[] = [
  {
    id: "pe-1",
    domainId: d,
    index: 1,
    title: "Анатомія промпта",
    subtitle: "System vs user, чіткість, роль, порядок блоків, контекст перед інструкцією.",
    boss: false,
    codexRef: "prompt-core",
  },
  {
    id: "pe-2",
    domainId: d,
    index: 2,
    title: "XML-теги і структура",
    subtitle: "Як розділяти дані та інструкції, щоб модель не плутала їх між собою.",
    boss: false,
    codexRef: "xml-structuring",
  },
  {
    id: "pe-3",
    domainId: d,
    index: 3,
    title: "Few-shot і міркування",
    subtitle: "Приклади, chain of thought, extended thinking і коли вони шкодять.",
    boss: false,
    codexRef: "few-shot-cot",
  },
  {
    id: "pe-4",
    domainId: d,
    index: 4,
    title: "Структурований вивід",
    subtitle: "JSON без сюрпризів: tool use, prefill, валідація і retry.",
    boss: false,
    codexRef: "structured-output",
  },
  {
    id: "pe-5",
    domainId: d,
    index: 5,
    title: "Оцінювання промптів",
    subtitle: "Evals, LLM-as-judge, датасети, метрики і робота з регресіями.",
    boss: false,
    codexRef: "prompt-evals",
  },
  {
    id: "pe-boss",
    domainId: d,
    index: 6,
    title: "БОС: Промпт для продакшну",
    subtitle: "Пайплайн, у якому промпт має бути стабільним, дешевим і перевіреним.",
    boss: true,
    codexRef: "prompt-production",
  },
];
