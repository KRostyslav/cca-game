import type { Domain } from "@/lib/content/types";

/**
 * Домени тренажера для розробників. Ваги задають розподіл питань в екзамені
 * і перевіряються валідатором так само, як у треку Architect.
 */
export const domains: Domain[] = [
  {
    id: "dev-api",
    track: "developer",
    index: 1,
    title: "Claude API & SDKs",
    titleUk: "Порт API",
    weight: 0.25,
    blurb:
      "Messages API, моделі й параметри, streaming, токени, помилки й ретраї, офіційні SDK для Python і TypeScript.",
    icon: "⌁",
    accent: "#D97757",
  },
  {
    id: "dev-tools",
    track: "developer",
    index: 2,
    title: "Tool Use in Code",
    titleUk: "Майстерня Інструментів",
    weight: 0.2,
    blurb:
      "Визначення tools, цикл tool_use → tool_result, tool_choice, паралельні виклики, server tools і структурований вивід.",
    icon: "⚙",
    accent: "#5FD3A6",
  },
  {
    id: "dev-claude-code",
    track: "developer",
    index: 3,
    title: "Claude Code for Developers",
    titleUk: "Термінал",
    weight: 0.2,
    blurb:
      "Щоденний workflow у Claude Code: plan mode, git і PR, тести й TDD, subagents, hooks і headless-режим.",
    icon: "❯",
    accent: "#6EA8FE",
  },
  {
    id: "dev-agents-mcp",
    track: "developer",
    index: 4,
    title: "Agent SDK & MCP Servers",
    titleUk: "Лабораторія Агентів",
    weight: 0.2,
    blurb:
      "Claude Agent SDK, власні інструменти й дозволи, розробка MCP-серверів, транспорти, resources і налагодження.",
    icon: "◈",
    accent: "#C08BEA",
  },
  {
    id: "dev-production",
    track: "developer",
    index: 5,
    title: "Testing, Evals & Production",
    titleUk: "Полігон",
    weight: 0.15,
    blurb:
      "Evals і тести промптів, prompt caching, вартість і latency, Batches, безпека від prompt injection, observability.",
    icon: "◎",
    accent: "#E8B84B",
  },
];
