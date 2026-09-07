import { beforeEach, describe, expect, it } from "vitest";
import { levelsOfDomain, worldOrder } from "@/content";
import { initialState, isLevelUnlocked, SAVE_KEY, useGameStore } from "../gameStore";

/** Мінімальний localStorage, щоб persist-middleware працював у node-середовищі. */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() { return this.map.size; }
  clear() { this.map.clear(); }
  getItem(k: string) { return this.map.get(k) ?? null; }
  key(i: number) { return [...this.map.keys()][i] ?? null; }
  removeItem(k: string) { this.map.delete(k); }
  setItem(k: string, v: string) { this.map.set(k, v); }
}

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
  useGameStore.setState({ ...initialState(), hasHydrated: true });
});

function clearLevel(levelId: string, stars: 1 | 2 | 3 = 3, xp = 100) {
  useGameStore.getState().completeLevel({
    levelId,
    stars,
    accuracy: 1,
    xpEarned: xp,
    maxCombo: 5,
    heartsLeft: 5,
    failed: false,
  });
}

describe("прогрес рівня", () => {
  it("завершення нараховує XP і кредити та відкриває статтю довідника", () => {
    clearLevel("aa-1", 3, 120);
    const s = useGameStore.getState();
    expect(s.player.xp).toBe(120);
    expect(s.player.credits).toBe(120);
    expect(s.progress["aa-1"].stars).toBe(3);
    expect(s.unlocked.codex).toContain("agentic-loop");
  });

  it("зірки не знижуються при слабшому повторному проходженні", () => {
    clearLevel("aa-1", 3);
    clearLevel("aa-1", 1);
    const s = useGameStore.getState();
    expect(s.progress["aa-1"].stars).toBe(3);
    expect(s.progress["aa-1"].attempts).toBe(2);
  });

  it("провал не відкриває довідник і не ставить дату проходження", () => {
    useGameStore.getState().completeLevel({
      levelId: "aa-2",
      stars: 0,
      accuracy: 0.2,
      xpEarned: 10,
      maxCombo: 1,
      heartsLeft: 0,
      failed: true,
    });
    const s = useGameStore.getState();
    expect(s.unlocked.codex).not.toContain("task-decomposition");
    expect(s.progress["aa-2"].completedAt).toBeNull();
  });
});

describe("розблокування", () => {
  it("перший рівень першого світу доступний одразу, другий — ні", () => {
    const s = useGameStore.getState();
    expect(isLevelUnlocked(s, "aa-1")).toBe(true);
    expect(isLevelUnlocked(s, "aa-2")).toBe(false);
  });

  it("проходження рівня відкриває наступний", () => {
    clearLevel("aa-1", 1);
    expect(isLevelUnlocked(useGameStore.getState(), "aa-2")).toBe(true);
  });

  it("бос вимагає 2★ на всіх звичайних рівнях світу", () => {
    const levels = levelsOfDomain("agentic-architecture").filter((l) => !l.boss);
    for (const l of levels) clearLevel(l.id, 1);
    expect(isLevelUnlocked(useGameStore.getState(), "aa-boss")).toBe(false);
    for (const l of levels) clearLevel(l.id, 2);
    expect(isLevelUnlocked(useGameStore.getState(), "aa-boss")).toBe(true);
  });

  it("бос відкриває наступний світ", () => {
    expect(useGameStore.getState().unlocked.worlds).toEqual([worldOrder[0]]);
    clearLevel("aa-boss", 2);
    expect(useGameStore.getState().unlocked.worlds).toContain(worldOrder[1]);
  });
});

describe("SRS і статистика", () => {
  it("помилка створює картку повторення, правильна відповідь без картки — ні", () => {
    const { recordAnswer } = useGameStore.getState();
    recordAnswer({ questionId: "aa-1-q1", domainId: "agentic-architecture", correct: false });
    recordAnswer({ questionId: "aa-1-q2", domainId: "agentic-architecture", correct: true });
    const s = useGameStore.getState();
    expect(s.srs["aa-1-q1"].box).toBe(1);
    expect(s.srs["aa-1-q2"]).toBeUndefined();
    expect(s.stats.perDomain["agentic-architecture"]).toEqual({ seen: 2, correct: 1 });
  });

  it("правильна відповідь просуває наявну картку", () => {
    const { recordAnswer } = useGameStore.getState();
    recordAnswer({ questionId: "aa-1-q1", domainId: "agentic-architecture", correct: false });
    recordAnswer({ questionId: "aa-1-q1", domainId: "agentic-architecture", correct: true });
    expect(useGameStore.getState().srs["aa-1-q1"].box).toBe(2);
  });
});

describe("ачівки", () => {
  it("перший пройдений рівень і три зірки дають ачівки", () => {
    clearLevel("aa-1", 3);
    const s = useGameStore.getState();
    expect(s.achievements["first-blood"]).toBeDefined();
    expect(s.achievements["flawless"]).toBeDefined();
  });

  it("успішний екзамен дає ачівку Certified", () => {
    useGameStore.getState().recordExamRun({
      id: "run-1",
      startedAt: 0,
      finishedAt: 1000,
      score: 800,
      passed: true,
      perDomain: {},
      wrongQuestionIds: [],
    });
    expect(useGameStore.getState().achievements["certified"]).toBeDefined();
    expect(useGameStore.getState().achievements["top-score"]).toBeUndefined();
  });
});

describe("артефакти", () => {
  it("купівля списує кредити, використання зменшує кількість", () => {
    clearLevel("aa-1", 3, 500);
    const before = useGameStore.getState().player.artifacts["prompt-cache"];
    expect(useGameStore.getState().buyArtifact("prompt-cache")).toBe(true);
    expect(useGameStore.getState().player.artifacts["prompt-cache"]).toBe(before + 1);
    expect(useGameStore.getState().player.credits).toBe(500 - 120);
    expect(useGameStore.getState().spendArtifact("prompt-cache")).toBe(true);
    expect(useGameStore.getState().player.artifacts["prompt-cache"]).toBe(before);
  });

  it("без кредитів купити не можна", () => {
    expect(useGameStore.getState().buyArtifact("prompt-cache")).toBe(false);
  });

  it("не можна використати артефакт, якого немає", () => {
    expect(useGameStore.getState().spendArtifact("compact-context")).toBe(false);
  });
});

describe("збереження", () => {
  it("persist пише у localStorage", async () => {
    useGameStore.getState().createPlayer("Тестер");
    clearLevel("aa-1", 3, 42);
    await new Promise((r) => setTimeout(r, 0));
    const raw = localStorage.getItem(SAVE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).state.player.name).toBe("Тестер");
  });

  it("експорт та імпорт відновлюють прогрес", () => {
    useGameStore.getState().createPlayer("Архітектор");
    clearLevel("aa-1", 3, 200);
    const dump = useGameStore.getState().exportSave();

    useGameStore.getState().resetProgress();
    expect(useGameStore.getState().player.name).toBe("");

    expect(useGameStore.getState().importSave(dump)).toEqual({ ok: true });
    const s = useGameStore.getState();
    expect(s.player.name).toBe("Архітектор");
    expect(s.player.xp).toBe(200);
    expect(s.progress["aa-1"].stars).toBe(3);
  });

  it("імпорт сміття не ламає стан", () => {
    const result = useGameStore.getState().importSave("не json");
    expect(result.ok).toBe(false);
    expect(useGameStore.getState().player.name).toBe("");
  });

  it("часткове старе збереження зливається з дефолтами", () => {
    const partial = JSON.stringify({ player: { name: "Старий", xp: 50 } });
    expect(useGameStore.getState().importSave(partial)).toEqual({ ok: true });
    const s = useGameStore.getState();
    expect(s.player.name).toBe("Старий");
    expect(s.player.credits).toBe(0);
    expect(s.settings.sound).toBe(true);
    expect(s.unlocked.worlds).toEqual([worldOrder[0]]);
  });

  it("ім'я обрізається і має запасне значення", () => {
    useGameStore.getState().createPlayer("   ");
    expect(useGameStore.getState().player.name).toBe("Architect");
    useGameStore.getState().createPlayer("x".repeat(50));
    expect(useGameStore.getState().player.name).toHaveLength(24);
  });
});
