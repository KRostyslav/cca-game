import type { ArtifactId } from "@/lib/game/artifacts";
import type { SrsCard } from "@/lib/game/srs";
import type { Stars } from "@/lib/game/scoring";
import type { DomainId } from "@/lib/content/types";

export interface LevelProgress {
  stars: Stars;
  bestAccuracy: number;
  attempts: number;
  completedAt: number | null;
}

export interface ExamRun {
  id: string;
  startedAt: number;
  finishedAt: number;
  score: number;
  passed: boolean;
  perDomain: Record<string, { correct: number; total: number }>;
  wrongQuestionIds: string[];
}

export interface DomainStat {
  seen: number;
  correct: number;
}

/** Режим показу текстів питань: англійська, українська або обидві. */
export type LanguageMode = "en" | "uk" | "both";

export interface PersistedState {
  player: {
    name: string;
    xp: number;
    credits: number;
    artifacts: Record<ArtifactId, number>;
  };
  progress: Record<string, LevelProgress>;
  unlocked: {
    worlds: DomainId[];
    codex: string[];
  };
  srs: Record<string, SrsCard>;
  stats: {
    perDomain: Record<string, DomainStat>;
    totalAnswers: number;
    maxCombo: number;
    bossNoDamage: boolean;
    streakDays: number;
    lastPlayedDay: string | null;
    examRuns: ExamRun[];
  };
  achievements: Record<string, { unlockedAt: number }>;
  settings: {
    sound: boolean;
    reducedMotion: boolean;
    language: LanguageMode;
  };
}
