import type { Level } from "@/lib/content/types";

const d = "claude-code" as const;

export const levels: Level[] = [
  {
    id: "cc-1",
    domainId: d,
    index: 1,
    title: "Основи Claude Code",
    subtitle: "CLI, сесії, режими дозволів, plan mode і de-facto робочий цикл.",
    boss: false,
    codexRef: "claude-code-fundamentals",
  },
  {
    id: "cc-2",
    domainId: d,
    index: 2,
    title: "Ієрархія CLAUDE.md",
    subtitle: "Де живе пам'ять проєкту, як шари накладаються і що має пріоритет.",
    boss: false,
    codexRef: "claude-md-hierarchy",
  },
  {
    id: "cc-3",
    domainId: d,
    index: 3,
    title: "Settings і permissions",
    subtitle: "settings.json, рівні налаштувань, allow/ask/deny та безпечні дефолти.",
    boss: false,
    codexRef: "settings-permissions",
  },
  {
    id: "cc-4",
    domainId: d,
    index: 4,
    title: "Hooks",
    subtitle: "Детермінована автоматизація: події, exit-коди, блокування дії.",
    boss: false,
    codexRef: "hooks",
  },
  {
    id: "cc-5",
    domainId: d,
    index: 5,
    title: "Команди, skills і subagents",
    subtitle: "Slash-команди, Agent Skills та власні субагенти в .claude/.",
    boss: false,
    codexRef: "commands-skills",
  },
  {
    id: "cc-boss",
    domainId: d,
    index: 6,
    title: "БОС: Claude Code у CI/CD",
    subtitle: "Headless-режим, GitHub Actions, дозволи в автоматиці.",
    boss: true,
    codexRef: "claude-code-cicd",
  },
];
