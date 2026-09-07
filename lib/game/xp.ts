import type { Difficulty } from "@/lib/content/types";

/** XP за правильну відповідь до множників. */
export function baseXp(difficulty: Difficulty, boss: boolean): number {
  const byDifficulty = { 1: 10, 2: 15, 3: 25 }[difficulty];
  return boss ? byDifficulty * 2 : byDifficulty;
}

/**
 * Множник за серію правильних відповідей поспіль.
 * 0-2 → ×1, 3-4 → ×1.5, 5+ → ×2.
 */
export function comboMultiplier(streak: number): number {
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

export function awardXp(difficulty: Difficulty, boss: boolean, streak: number): number {
  return Math.round(baseXp(difficulty, boss) * comboMultiplier(streak));
}

/** Скільки сумарно XP потрібно, щоб мати рівень n (рівень 1 = 0 XP). */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Плавно зростаючий поріг: 100, 250, 450, 700, ...
  return 25 * (level - 1) * (level + 2);
}

export const MAX_PLAYER_LEVEL = 20;

export function levelFromXp(xp: number): number {
  let level = 1;
  while (level < MAX_PLAYER_LEVEL && xp >= xpForLevel(level + 1)) level += 1;
  return level;
}

const TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 18, title: "Claude Certified Architect" },
  { minLevel: 15, title: "Orchestrator" },
  { minLevel: 12, title: "Context Keeper" },
  { minLevel: 9, title: "Tool Smith" },
  { minLevel: 6, title: "Prompt Apprentice" },
  { minLevel: 3, title: "Agent Wrangler" },
  { minLevel: 1, title: "Intern" },
];

export function titleForLevel(level: number): string {
  return TITLES.find((t) => level >= t.minLevel)?.title ?? "Intern";
}

/** Прогрес до наступного рівня, 0..1. */
export function levelProgress(xp: number): { level: number; current: number; needed: number; ratio: number } {
  const level = levelFromXp(xp);
  if (level >= MAX_PLAYER_LEVEL) return { level, current: 0, needed: 0, ratio: 1 };
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const current = xp - floor;
  const needed = ceil - floor;
  return { level, current, needed, ratio: needed === 0 ? 1 : current / needed };
}
