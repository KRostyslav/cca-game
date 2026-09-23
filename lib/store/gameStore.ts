"use client";

import { useContext } from "react";
import { createStore, useStore } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { getLevel, levelsOfDomain, trackContent } from "@/content";
import { getTrack } from "@/content/tracks";
import type { DomainId, TrackId } from "@/lib/content/types";
import { earnedAchievements } from "@/lib/game/achievements";
import { startingArtifacts, type ArtifactId, artifactById } from "@/lib/game/artifacts";
import type { Stars } from "@/lib/game/scoring";
import { isMastered, review } from "@/lib/game/srs";
import { levelFromXp, titleForLevel } from "@/lib/game/xp";
import { TrackContext } from "./trackContext";
import type { ExamRun, LanguageMode, PersistedState } from "./types";

/**
 * Кожен тренажер має окреме збереження. Ключ Architect не змінився з часів,
 * коли тренажер був один, — старі збереження підхоплюються без міграції.
 */
export const SAVE_KEYS: Record<TrackId, string> = {
  architect: "cca-quest-save-v1",
  developer: "ccd-quest-save-v1",
};
export const SAVE_KEY = SAVE_KEYS.architect;

/**
 * Звертаємося до localStorage при кожній операції, а не один раз при імпорті модуля:
 * під час SSR його ще немає, а в приватних вікнах доступ може кидати виняток.
 */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return globalThis.localStorage?.getItem(name) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      globalThis.localStorage?.setItem(name, value);
    } catch {
      // Сховище недоступне — гра лишається робочою, просто без збереження.
    }
  },
  removeItem: (name) => {
    try {
      globalThis.localStorage?.removeItem(name);
    } catch {
      // те саме
    }
  },
};
export const SAVE_VERSION = 1;

export interface LevelResult {
  levelId: string;
  stars: Stars;
  accuracy: number;
  xpEarned: number;
  maxCombo: number;
  heartsLeft: number;
  failed: boolean;
}

interface Actions {
  /** До якого тренажера належить цей стан. Не зберігається — задається фабрикою. */
  trackId: TrackId;
  hasHydrated: boolean;
  setHydrated: (v: boolean) => void;
  createPlayer: (name: string) => void;
  touchStreak: () => void;
  recordAnswer: (input: { questionId: string; domainId: DomainId; correct: boolean }) => void;
  completeLevel: (result: LevelResult) => void;
  unlockCodex: (slug: string) => void;
  buyArtifact: (id: ArtifactId) => boolean;
  spendArtifact: (id: ArtifactId) => boolean;
  recordExamRun: (run: ExamRun) => void;
  resetProgress: () => void;
  importSave: (raw: string) => { ok: true } | { ok: false; error: string };
  exportSave: () => string;
  setSetting: <K extends keyof PersistedState["settings"]>(
    key: K,
    value: PersistedState["settings"][K],
  ) => void;
}

export type GameStore = PersistedState & Actions;

function emptyDomainStats(trackId: TrackId): Record<string, { seen: number; correct: number }> {
  return Object.fromEntries(
    trackContent(trackId).domains.map((d) => [d.id, { seen: 0, correct: 0 }]),
  );
}

export function initialState(trackId: TrackId = "architect"): PersistedState {
  return {
    player: { name: "", xp: 0, credits: 0, artifacts: { ...startingArtifacts } },
    progress: {},
    unlocked: { worlds: [trackContent(trackId).worldOrder[0]], codex: [] },
    srs: {},
    seen: {},
    stats: {
      perDomain: emptyDomainStats(trackId),
      totalAnswers: 0,
      maxCombo: 0,
      bossNoDamage: false,
      streakDays: 0,
      lastPlayedDay: null,
      examRuns: [],
    },
    achievements: {},
    settings: { sound: true, reducedMotion: false, language: "both" },
  };
}

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

/** Перераховує ачівки за поточним станом і додає ті, яких ще немає. */
function syncAchievements(
  trackId: TrackId,
  state: PersistedState,
  now: number,
): PersistedState["achievements"] {
  const { domains, levels } = trackContent(trackId);
  const bosses = levels.filter((l) => l.boss);
  const clearedBosses = bosses.filter((l) => (state.progress[l.id]?.stars ?? 0) > 0).length;
  const fullStarWorlds = domains
    .filter((d) =>
      levelsOfDomain(d.id).every((l) => (state.progress[l.id]?.stars ?? 0) === 3),
    )
    .map((d) => d.id);
  const bestStars = Math.max(0, ...Object.values(state.progress).map((p) => p.stars));
  const masteredCards = Object.values(state.srs).filter(isMastered).length;
  const bestExamScore = Math.max(0, ...state.stats.examRuns.map((r) => r.score));

  const earned = earnedAchievements({
    levelsCompleted: Object.values(state.progress).filter((p) => p.stars > 0).length,
    bestStarsAnyLevel: bestStars,
    bossesCleared: clearedBosses,
    bossNoDamage: state.stats.bossNoDamage,
    maxCombo: state.stats.maxCombo,
    fullStarWorlds,
    unlockedWorlds: state.unlocked.worlds.length,
    unlockedCodex: state.unlocked.codex.length,
    masteredCards,
    streakDays: state.stats.streakDays,
    totalAnswers: state.stats.totalAnswers,
    bestExamScore,
  });

  const next = { ...state.achievements };
  for (const id of earned) {
    if (!next[id]) next[id] = { unlockedAt: now };
  }
  return next;
}

/** Окремий persist-стор для кожного тренажера: однакова логіка, різні дані й ключ збереження. */
export function createGameStore(trackId: TrackId) {
  const track = getTrack(trackId);
  const sync = (state: PersistedState, now: number) => syncAchievements(trackId, state, now);
  const { worldOrder } = trackContent(trackId);
  return createStore<GameStore>()(
    persist(
      (set, get) => ({
        ...initialState(trackId),
        trackId,
        hasHydrated: false,
        setHydrated: (v) => set({ hasHydrated: v }),

        createPlayer: (name) =>
          set((s) => ({
            player: {
              ...s.player,
              name: name.trim().slice(0, 24) || (track?.defaultPlayerName ?? "Architect"),
            },
          })),

        touchStreak: () =>
          set((s) => {
            const today = dayKey(Date.now());
            const last = s.stats.lastPlayedDay;
            if (last === today) return s;
            const gap = last ? daysBetween(last, today) : Infinity;
            const streakDays = gap === 1 ? s.stats.streakDays + 1 : 1;
            const stats = { ...s.stats, streakDays, lastPlayedDay: today };
            return { stats, achievements: sync({ ...s, stats }, Date.now()) };
          }),

        recordAnswer: ({ questionId, domainId, correct }) =>
          set((s) => {
            const now = Date.now();
            const prev = s.stats.perDomain[domainId] ?? { seen: 0, correct: 0 };
            const perDomain = {
              ...s.stats.perDomain,
              [domainId]: { seen: prev.seen + 1, correct: prev.correct + (correct ? 1 : 0) },
            };
            const existing = s.srs[questionId];
            // У чергу повторення потрапляють лише помилки та вже наявні картки.
            const srs =
              correct && !existing
                ? s.srs
                : { ...s.srs, [questionId]: review(existing, correct, now) };
            const stats = { ...s.stats, perDomain, totalAnswers: s.stats.totalAnswers + 1 };
            const seen = { ...s.seen, [questionId]: now };
            return { stats, srs, seen, achievements: sync({ ...s, stats, srs, seen }, now) };
          }),

        completeLevel: (result) =>
          set((s) => {
            const now = Date.now();
            const level = getLevel(result.levelId);
            const prev = s.progress[result.levelId];
            const stars = Math.max(prev?.stars ?? 0, result.stars) as Stars;
            const progress = {
              ...s.progress,
              [result.levelId]: {
                stars,
                bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, result.accuracy),
                attempts: (prev?.attempts ?? 0) + 1,
                completedAt: result.failed ? (prev?.completedAt ?? null) : now,
              },
            };

            const xp = s.player.xp + result.xpEarned;
            const credits = s.player.credits + result.xpEarned;

            const codex =
              level && !result.failed && !s.unlocked.codex.includes(level.codexRef)
                ? [...s.unlocked.codex, level.codexRef]
                : s.unlocked.codex;

            // Бос відкриває наступний світ.
            let worlds = s.unlocked.worlds;
            if (level?.boss && !result.failed) {
              const at = worldOrder.indexOf(level.domainId);
              const next = worldOrder[at + 1];
              if (next && !worlds.includes(next)) worlds = [...worlds, next];
            }

            const stats = {
              ...s.stats,
              maxCombo: Math.max(s.stats.maxCombo, result.maxCombo),
              bossNoDamage:
                s.stats.bossNoDamage ||
                Boolean(level?.boss && !result.failed && result.heartsLeft === 5),
            };

            const nextState: PersistedState = {
              ...s,
              player: { ...s.player, xp, credits },
              progress,
              unlocked: { worlds, codex },
              stats,
            };
            return { ...nextState, achievements: sync(nextState, now) };
          }),

        unlockCodex: (slug) =>
          set((s) =>
            s.unlocked.codex.includes(slug)
              ? s
              : { unlocked: { ...s.unlocked, codex: [...s.unlocked.codex, slug] } },
          ),

        buyArtifact: (id) => {
          const def = artifactById.get(id);
          const s = get();
          if (!def || s.player.credits < def.cost) return false;
          set({
            player: {
              ...s.player,
              credits: s.player.credits - def.cost,
              artifacts: { ...s.player.artifacts, [id]: (s.player.artifacts[id] ?? 0) + 1 },
            },
          });
          return true;
        },

        spendArtifact: (id) => {
          const s = get();
          if ((s.player.artifacts[id] ?? 0) <= 0) return false;
          set({
            player: {
              ...s.player,
              artifacts: { ...s.player.artifacts, [id]: s.player.artifacts[id] - 1 },
            },
          });
          return true;
        },

        recordExamRun: (run) =>
          set((s) => {
            const stats = { ...s.stats, examRuns: [run, ...s.stats.examRuns].slice(0, 20) };
            return { stats, achievements: sync({ ...s, stats }, Date.now()) };
          }),

        resetProgress: () => set({ ...initialState(trackId), hasHydrated: true }),

        exportSave: () => {
          const s = get();
          const payload: PersistedState & { version: number; track: TrackId } = {
            version: SAVE_VERSION,
            track: trackId,
            player: s.player,
            progress: s.progress,
            unlocked: s.unlocked,
            srs: s.srs,
            seen: s.seen,
            stats: s.stats,
            achievements: s.achievements,
            settings: s.settings,
          };
          return JSON.stringify(payload, null, 2);
        },

        importSave: (raw) => {
          try {
            const parsed = JSON.parse(raw) as Partial<PersistedState> & { track?: TrackId };
            if (!parsed || typeof parsed !== "object" || !parsed.player) {
              return { ok: false, error: "Файл не схожий на збереження гри." };
            }
            // Збереження без позначки треку — зі старої версії, де був лише Architect.
            const saveTrack = parsed.track ?? "architect";
            if (saveTrack !== trackId) {
              return {
                ok: false,
                error: `Це збереження тренажера ${getTrack(saveTrack)?.label ?? saveTrack} — імпортуйте його там.`,
              };
            }
            delete parsed.track;
            const base = initialState(trackId);
            set({
              ...base,
              ...parsed,
              player: { ...base.player, ...parsed.player },
              unlocked: { ...base.unlocked, ...parsed.unlocked },
              stats: { ...base.stats, ...parsed.stats },
              settings: { ...base.settings, ...parsed.settings },
              hasHydrated: true,
            });
            return { ok: true };
          } catch {
            return { ok: false, error: "Не вдалося розібрати JSON." };
          }
        },

        setSetting: (key, value) =>
          set((s) => ({ settings: { ...s.settings, [key]: value } })),
      }),
      {
        name: SAVE_KEYS[trackId],
        version: SAVE_VERSION,
        storage: createJSONStorage(() => safeStorage),
        partialize: (s) => ({
          player: s.player,
          progress: s.progress,
          unlocked: s.unlocked,
          srs: s.srs,
          seen: s.seen,
          stats: s.stats,
          achievements: s.achievements,
          settings: s.settings,
        }),
        migrate: (persisted, version) => {
          // Старі або пошкоджені збереження зливаємо з дефолтами, а не відкидаємо.
          const base = initialState(trackId);
          if (!persisted || typeof persisted !== "object") return base;
          const p = persisted as Partial<PersistedState>;
          if (version < SAVE_VERSION) {
            return {
              ...base,
              ...p,
              player: { ...base.player, ...p.player },
              unlocked: { ...base.unlocked, ...p.unlocked },
              stats: { ...base.stats, ...p.stats },
              settings: { ...base.settings, ...p.settings },
            };
          }
          return { ...base, ...p } as PersistedState;
        },
        onRehydrateStorage: () => (state) => state?.setHydrated(true),
      },
    ),
  );
}

export type GameStoreApi = ReturnType<typeof createGameStore>;

export const gameStores: Record<TrackId, GameStoreApi> = {
  architect: createGameStore("architect"),
  developer: createGameStore("developer"),
};

/** Стор тренажера, в межах якого рендериться компонент (див. TrackProvider). */
export function useGameStoreApi(): GameStoreApi {
  return gameStores[useContext(TrackContext)];
}

/**
 * Той самий хук, що й до появи двох тренажерів: без аргументу повертає весь стан,
 * із селектором — його частину. Стор обирається за поточним треком.
 */
export function useGameStore(): GameStore;
export function useGameStore<T>(selector: (s: GameStore) => T): T;
export function useGameStore<T>(selector?: (s: GameStore) => T) {
  return useStore(useGameStoreApi(), selector ?? ((s) => s as unknown as T));
}

/** Мова питань — спільна для обох тренажерів, щоб перемикання не скидало вибір. */
export function setLanguageEverywhere(language: LanguageMode): void {
  for (const store of Object.values(gameStores)) store.getState().setSetting("language", language);
}

/** Селектори — щоб компоненти не тягнули весь стан. */
export function isWorldUnlocked(s: GameStore, id: DomainId): boolean {
  return s.unlocked.worlds.includes(id);
}

export function isLevelUnlocked(s: GameStore, levelId: string): boolean {
  const level = getLevel(levelId);
  if (!level) return false;
  if (!isWorldUnlocked(s, level.domainId)) return false;
  const siblings = levelsOfDomain(level.domainId);
  const pos = siblings.findIndex((l) => l.id === levelId);
  if (pos <= 0) return true;
  if (level.boss) {
    // Бос вимагає щонайменше 2 ⭐ на кожному звичайному рівні світу.
    return siblings
      .filter((l) => !l.boss)
      .every((l) => (s.progress[l.id]?.stars ?? 0) >= 2);
  }
  return (s.progress[siblings[pos - 1].id]?.stars ?? 0) > 0;
}

export function playerTitle(s: GameStore): string {
  return titleForLevel(levelFromXp(s.player.xp), s.trackId);
}
