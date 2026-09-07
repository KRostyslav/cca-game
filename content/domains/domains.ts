import type { Domain } from "@/lib/content/types";

/**
 * Ваги відповідають розподілу балів на реальному екзамені CCA-F.
 * Якщо Anthropic оновить blueprint — правити тільки тут і в lib/game/examBuilder.ts.
 */
export const domains: Domain[] = [
  {
    id: "agentic-architecture",
    index: 1,
    title: "Agentic Architecture & Orchestration",
    titleUk: "Долина Агентів",
    weight: 0.27,
    blurb:
      "Agent loop, декомпозиція задач, оркестрація, subagents, guardrails і Claude Agent SDK. Найбільший домен екзамену.",
    icon: "◈",
    accent: "#D97757",
  },
  {
    id: "claude-code",
    index: 2,
    title: "Claude Code Configuration & Workflows",
    titleUk: "Фортеця Конфігурації",
    weight: 0.2,
    blurb:
      "CLAUDE.md, settings.json, permissions, hooks, slash-команди, skills і headless-режим у CI/CD.",
    icon: "▣",
    accent: "#6EA8FE",
  },
  {
    id: "prompt-engineering",
    index: 3,
    title: "Prompt Engineering & Structured Output",
    titleUk: "Бібліотека Промптів",
    weight: 0.2,
    blurb:
      "Структура промпта, XML-теги, few-shot, extended thinking, структурований вивід і оцінювання якості.",
    icon: "✎",
    accent: "#C08BEA",
  },
  {
    id: "tool-design-mcp",
    index: 4,
    title: "Tool Design & MCP Integration",
    titleUk: "Кузня Інструментів",
    weight: 0.18,
    blurb:
      "Описи інструментів, JSON Schema, обробка помилок, Model Context Protocol, сервери й клієнти MCP.",
    icon: "⚒",
    accent: "#5FD3A6",
  },
  {
    id: "context-reliability",
    index: 5,
    title: "Context Management & Reliability",
    titleUk: "Вежа Контексту",
    weight: 0.15,
    blurb:
      "Вікно контексту, prompt caching, компакція, retrieval, ретраї та надійність довгограючих агентів.",
    icon: "◐",
    accent: "#E8B84B",
  },
];
