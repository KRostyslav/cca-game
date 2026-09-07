import { DAY_MS, SRS_INTERVALS_DAYS } from "./constants";

export type SrsBox = 1 | 2 | 3 | 4 | 5;

export interface SrsCard {
  box: SrsBox;
  dueAt: number;
  lapses: number;
}

export function newCard(now: number): SrsCard {
  return { box: 1, dueAt: now + SRS_INTERVALS_DAYS[0] * DAY_MS, lapses: 1 };
}

/** Правильна відповідь підвищує бокс, помилка скидає в перший. */
export function review(card: SrsCard | undefined, correct: boolean, now: number): SrsCard {
  const base: SrsCard = card ?? { box: 1, dueAt: now, lapses: 0 };
  if (!correct) {
    return { box: 1, dueAt: now + SRS_INTERVALS_DAYS[0] * DAY_MS, lapses: base.lapses + 1 };
  }
  const box = Math.min(5, base.box + 1) as SrsBox;
  return { box, dueAt: now + SRS_INTERVALS_DAYS[box - 1] * DAY_MS, lapses: base.lapses };
}

export function isDue(card: SrsCard, now: number): boolean {
  return card.dueAt <= now;
}

/** Картку в 5-му боксі, на яку відповіли правильно, вважаємо вивченою. */
export function isMastered(card: SrsCard): boolean {
  return card.box >= 5;
}

export function dueQuestionIds(cards: Record<string, SrsCard>, now: number): string[] {
  return Object.entries(cards)
    .filter(([, card]) => isDue(card, now) && !isMastered(card))
    .sort((a, b) => a[1].dueAt - b[1].dueAt)
    .map(([id]) => id);
}
