import type { Question } from "@/lib/content/types";
import { EXAM_PASS_SCORE } from "./constants";

export type Stars = 0 | 1 | 2 | 3;

/** Порівняння відповіді з правильною. Для order важливий порядок, для решти — ні. */
export function isCorrect(question: Question, answer: string[]): boolean {
  if (question.kind === "order") {
    return (
      answer.length === question.correct.length &&
      answer.every((id, i) => id === question.correct[i])
    );
  }
  if (answer.length !== question.correct.length) return false;
  const expected = new Set(question.correct);
  return answer.every((id) => expected.has(id));
}

/**
 * Частковий бал 0..1 — використовується в симуляції екзамену для multi:
 * правильні мінус хибні позначки, поділені на кількість правильних.
 */
export function partialScore(question: Question, answer: string[]): number {
  if (question.kind !== "multi") return isCorrect(question, answer) ? 1 : 0;
  const expected = new Set(question.correct);
  const hits = answer.filter((id) => expected.has(id)).length;
  const misses = answer.filter((id) => !expected.has(id)).length;
  return Math.max(0, (hits - misses) / expected.size);
}

/** 3 ⭐ — без помилок, 2 ⭐ — одна, 1 ⭐ — рівень пройдено, 0 — провал. */
export function starsFor(mistakes: number, failed: boolean): Stars {
  if (failed) return 0;
  if (mistakes === 0) return 3;
  if (mistakes === 1) return 2;
  return 1;
}

/** Шкала екзамену: частка правильних → 0..1000, як у Pearson VUE. */
export function scaledScore(earned: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((earned / total) * 1000);
}

export function passed(score: number): boolean {
  return score >= EXAM_PASS_SCORE;
}
