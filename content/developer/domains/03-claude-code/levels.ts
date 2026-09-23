import type { Level } from "@/lib/content/types";

const d = "dev-claude-code" as const;

export const levels: Level[] = [
  {
    id: "dc-1",
    domainId: d,
    index: 1,
    title: "Перший день у Claude Code",
    subtitle: "Встановлення, сесії, контекст репозиторію, CLAUDE.md і базові команди.",
    boss: false,
    codexRef: "dev-cc-workflow",
  },
  {
    id: "dc-2",
    domainId: d,
    index: 2,
    title: "Plan mode та ітерації",
    subtitle: "Explore → plan → code → commit, уточнення задачі, контроль змін.",
    boss: false,
    codexRef: "dev-cc-plan-mode",
  },
  {
    id: "dc-3",
    domainId: d,
    index: 3,
    title: "Git, коміти та PR",
    subtitle: "Гілки, осмислені коміти, огляд diff, PR і робота з конфліктами.",
    boss: false,
    codexRef: "dev-cc-git",
  },
  {
    id: "dc-4",
    domainId: d,
    index: 4,
    title: "Тести і TDD",
    subtitle: "Спершу тест, червоний → зелений, перевірка результату замість віри на слово.",
    boss: false,
    codexRef: "dev-cc-tdd",
  },
  {
    id: "dc-5",
    domainId: d,
    index: 5,
    title: "Автоматизація",
    subtitle: "Slash-команди, hooks, subagents, headless-режим і GitHub Actions.",
    boss: false,
    codexRef: "dev-cc-automation",
  },
  {
    id: "dc-boss",
    domainId: d,
    index: 6,
    title: "БОС: Рефакторинг великого репо",
    subtitle: "Спланувати й безпечно провести масштабну зміну з Claude Code.",
    boss: true,
    codexRef: "dev-cc-boss",
  },
];
