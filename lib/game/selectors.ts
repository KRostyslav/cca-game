import { allDomains, allLevels, levelsOfDomain } from "@/content";
import type { DomainId } from "@/lib/content/types";
import type { GameStore } from "@/lib/store/gameStore";
import { isLevelUnlocked, isWorldUnlocked } from "@/lib/store/gameStore";

export interface WorldSummary {
  domainId: DomainId;
  unlocked: boolean;
  levels: number;
  cleared: number;
  stars: number;
  maxStars: number;
  bossCleared: boolean;
}

export function worldSummary(s: GameStore, id: DomainId): WorldSummary {
  const levels = levelsOfDomain(id);
  const stars = levels.reduce((acc, l) => acc + (s.progress[l.id]?.stars ?? 0), 0);
  const boss = levels.find((l) => l.boss);
  return {
    domainId: id,
    unlocked: isWorldUnlocked(s, id),
    levels: levels.length,
    cleared: levels.filter((l) => (s.progress[l.id]?.stars ?? 0) > 0).length,
    stars,
    maxStars: levels.length * 3,
    bossCleared: boss ? (s.progress[boss.id]?.stars ?? 0) > 0 : false,
  };
}

export function allWorldSummaries(s: GameStore): WorldSummary[] {
  return allDomains.map((d) => worldSummary(s, d.id));
}

/** Наступний рівень, який має сенс пройти: перший розблокований і не завершений. */
export function nextPlayableLevel(s: GameStore): string | undefined {
  const notCleared = allLevels.find(
    (l) => isLevelUnlocked(s, l.id) && (s.progress[l.id]?.stars ?? 0) === 0,
  );
  if (notCleared) return notCleared.id;
  // Усе пройдено — пропонуємо перший рівень без трьох зірок.
  const imperfect = allLevels.find(
    (l) => isLevelUnlocked(s, l.id) && (s.progress[l.id]?.stars ?? 0) < 3,
  );
  return imperfect?.id;
}

export function totalStars(s: GameStore): { stars: number; max: number } {
  return {
    stars: allLevels.reduce((acc, l) => acc + (s.progress[l.id]?.stars ?? 0), 0),
    max: allLevels.length * 3,
  };
}
