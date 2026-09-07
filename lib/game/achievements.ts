import type { DomainId } from "@/lib/content/types";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const achievements: AchievementDef[] = [
  { id: "first-blood", title: "Перший бій", description: "Пройти будь-який рівень.", icon: "⚔" },
  { id: "flawless", title: "Бездоганно", description: "Отримати 3 ⭐ на рівні.", icon: "★" },
  { id: "combo-5", title: "Серія", description: "Зібрати комбо ×5.", icon: "≡" },
  { id: "combo-10", title: "Потік", description: "10 правильних відповідей поспіль.", icon: "⚡" },
  { id: "boss-slayer", title: "Переможець боса", description: "Здолати першого боса.", icon: "☠" },
  { id: "no-damage", title: "Без подряпин", description: "Пройти бос-рівень, не втративши жодного серця.", icon: "⛨" },
  { id: "world-master", title: "Володар світу", description: "Усі рівні одного світу на 3 ⭐.", icon: "◈" },
  { id: "cartographer", title: "Картограф", description: "Розблокувати всі п'ять світів.", icon: "▲" },
  { id: "codex-reader", title: "Читач Codex", description: "Відкрити 15 статей довідника.", icon: "▤" },
  { id: "bug-hunter", title: "Мисливець за помилками", description: "Довести 10 питань до 5-го боксу повторення.", icon: "✓" },
  { id: "streak-3", title: "Три дні поспіль", description: "Грати три дні поспіль.", icon: "◷" },
  { id: "streak-7", title: "Тиждень дисципліни", description: "Грати сім днів поспіль.", icon: "◶" },
  { id: "marathon", title: "Марафонець", description: "Відповісти на 150 питань сумарно.", icon: "∞" },
  { id: "certified", title: "Certified", description: "Скласти симуляцію екзамену на 720+.", icon: "◆" },
  { id: "top-score", title: "900+", description: "Набрати 900 і більше в симуляції екзамену.", icon: "♦" },
];

export const achievementById = new Map(achievements.map((a) => [a.id, a]));

export interface AchievementSignals {
  levelsCompleted: number;
  bestStarsAnyLevel: number;
  bossesCleared: number;
  bossNoDamage: boolean;
  maxCombo: number;
  fullStarWorlds: DomainId[];
  unlockedWorlds: number;
  unlockedCodex: number;
  masteredCards: number;
  streakDays: number;
  totalAnswers: number;
  bestExamScore: number;
}

/** Які ачівки заслужені за поточним станом. Функція чиста — легко тестувати. */
export function earnedAchievements(s: AchievementSignals): string[] {
  const out: string[] = [];
  if (s.levelsCompleted >= 1) out.push("first-blood");
  if (s.bestStarsAnyLevel >= 3) out.push("flawless");
  if (s.maxCombo >= 5) out.push("combo-5");
  if (s.maxCombo >= 10) out.push("combo-10");
  if (s.bossesCleared >= 1) out.push("boss-slayer");
  if (s.bossNoDamage) out.push("no-damage");
  if (s.fullStarWorlds.length >= 1) out.push("world-master");
  if (s.unlockedWorlds >= 5) out.push("cartographer");
  if (s.unlockedCodex >= 15) out.push("codex-reader");
  if (s.masteredCards >= 10) out.push("bug-hunter");
  if (s.streakDays >= 3) out.push("streak-3");
  if (s.streakDays >= 7) out.push("streak-7");
  if (s.totalAnswers >= 150) out.push("marathon");
  if (s.bestExamScore >= 720) out.push("certified");
  if (s.bestExamScore >= 900) out.push("top-score");
  return out;
}
