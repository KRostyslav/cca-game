import { describe, expect, it } from "vitest";
import { awardXp, comboMultiplier, levelFromXp, levelProgress, titleForLevel, xpForLevel, MAX_PLAYER_LEVEL } from "../xp";

describe("комбо", () => {
  it("множник зростає на 3 та 5 правильних поспіль", () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(2)).toBe(1);
    expect(comboMultiplier(3)).toBe(1.5);
    expect(comboMultiplier(4)).toBe(1.5);
    expect(comboMultiplier(5)).toBe(2);
    expect(comboMultiplier(12)).toBe(2);
  });

  it("бос дає подвійний базовий XP", () => {
    expect(awardXp(2, true, 0)).toBe(awardXp(2, false, 0) * 2);
  });

  it("складніші питання дають більше XP", () => {
    expect(awardXp(3, false, 0)).toBeGreaterThan(awardXp(1, false, 0));
  });
});

describe("рівні персонажа", () => {
  it("рівень 1 починається з нуля XP", () => {
    expect(xpForLevel(1)).toBe(0);
    expect(levelFromXp(0)).toBe(1);
  });

  it("пороги строго зростають", () => {
    for (let l = 1; l < MAX_PLAYER_LEVEL; l++) {
      expect(xpForLevel(l + 1)).toBeGreaterThan(xpForLevel(l));
    }
  });

  it("levelFromXp узгоджений із xpForLevel", () => {
    for (let l = 1; l <= MAX_PLAYER_LEVEL; l++) {
      expect(levelFromXp(xpForLevel(l))).toBe(l);
      if (l > 1) expect(levelFromXp(xpForLevel(l) - 1)).toBe(l - 1);
    }
  });

  it("рівень не перевищує максимум", () => {
    expect(levelFromXp(10_000_000)).toBe(MAX_PLAYER_LEVEL);
    expect(levelProgress(10_000_000).ratio).toBe(1);
  });

  it("прогрес у межах 0..1", () => {
    for (const xp of [0, 50, 100, 999, 5000]) {
      const p = levelProgress(xp);
      expect(p.ratio).toBeGreaterThanOrEqual(0);
      expect(p.ratio).toBeLessThanOrEqual(1);
    }
  });

  it("титул змінюється з рівнем", () => {
    expect(titleForLevel(1)).toBe("Intern");
    expect(titleForLevel(20)).toBe("Claude Certified Architect");
  });
});
