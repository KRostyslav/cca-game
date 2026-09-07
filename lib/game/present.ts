import type { Question } from "@/lib/content/types";
import { hashString, makeRng, shuffle } from "./random";

export interface PresentedChoice {
  /** Оригінальний id — саме його очікують scoring і збереження відповідей. */
  id: string;
  /** Мітка за фактичною позицією показу: A, B, C… */
  label: string;
  text: string;
  textEn: string;
  whyWrong?: string;
  whyWrongEn?: string;
}

const LABELS = "ABCDEFGH";

/**
 * Порядок варіантів визначається на показі, а не в даних: інакше правильна
 * відповідь назавжди лишилася б там, де її записав автор питання.
 * Перемішування детерміноване від seed, щоб не стрибати між перерендерами.
 */
export function presentChoices(question: Question, seed: number): PresentedChoice[] {
  const rng = makeRng(seed ^ hashString(question.id));
  let order = shuffle(question.choices, rng);

  if (question.kind === "order") {
    // Для питань на впорядкування показ не має бути готовою відповіддю.
    const matchesAnswer = order.every((c, i) => c.id === question.correct[i]);
    if (matchesAnswer && order.length > 1) {
      order = [...order.slice(1), order[0]];
    }
  }

  return order.map((choice, index) => ({
    id: choice.id,
    label: LABELS[index] ?? String(index + 1),
    text: choice.text,
    textEn: question.en.choices[choice.id] ?? choice.text,
    whyWrong: choice.whyWrong,
    whyWrongEn: question.en.whyWrong?.[choice.id],
  }));
}

/**
 * Вибірка питань для однієї спроби рівня.
 * Спершу йдуть ті, яких гравець ще не бачив, — щоб повторне проходження
 * давало новий матеріал, а не перевірку пам'яті на позиції відповідей.
 * Коли непобачених забракло, добираються найдавніше бачені.
 */
export function pickLevelQuestions(
  pool: readonly Question[],
  seen: Record<string, number>,
  count: number,
  seed: number,
): Question[] {
  const rng = makeRng(seed);
  const fresh = shuffle(
    pool.filter((q) => seen[q.id] === undefined),
    rng,
  );
  if (fresh.length >= count) return fresh.slice(0, count);

  const stale = pool
    .filter((q) => seen[q.id] !== undefined)
    .sort((a, b) => seen[a.id] - seen[b.id]);

  return [...fresh, ...stale].slice(0, count);
}

/** Seed для конкретної спроби: різні спроби — різний порядок варіантів. */
export function attemptSeed(salt: number): number {
  return (salt * 2654435761) >>> 0;
}
