import type { Level } from "@/lib/content/types";

const d = "dev-tools" as const;

export const levels: Level[] = [
  {
    id: "dt-1",
    domainId: d,
    index: 1,
    title: "Визначення інструментів",
    subtitle: "name, description, input_schema: як описати tool, щоб модель його правильно викликала.",
    boss: false,
    codexRef: "dev-tool-definitions",
  },
  {
    id: "dt-2",
    domainId: d,
    index: 2,
    title: "Цикл tool_use",
    subtitle: "tool_use → виконання в коді → tool_result: як правильно замкнути цикл.",
    boss: false,
    codexRef: "dev-tool-loop",
  },
  {
    id: "dt-3",
    domainId: d,
    index: 3,
    title: "tool_choice і паралельні виклики",
    subtitle: "auto, any, tool, none; кілька tool_use в одній відповіді та порядок результатів.",
    boss: false,
    codexRef: "dev-tool-choice",
  },
  {
    id: "dt-4",
    domainId: d,
    index: 4,
    title: "Server tools",
    subtitle: "Web search, code execution та інші інструменти, які виконує платформа, а не ваш код.",
    boss: false,
    codexRef: "dev-server-tools",
  },
  {
    id: "dt-5",
    domainId: d,
    index: 5,
    title: "Структурований вивід",
    subtitle: "JSON через tools і схеми, валідація, повторні спроби при невалідній відповіді.",
    boss: false,
    codexRef: "dev-structured-output",
  },
  {
    id: "dt-boss",
    domainId: d,
    index: 6,
    title: "БОС: Агент з інструментами",
    subtitle: "Зібрати робочий tool-use агент: цикл, помилки, ліміти ітерацій і безпека.",
    boss: true,
    codexRef: "dev-tools-boss",
  },
];
