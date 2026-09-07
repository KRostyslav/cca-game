import { describe, expect, it } from "vitest";
import { DAY_MS } from "../constants";
import { dueQuestionIds, isDue, isMastered, newCard, review, type SrsCard } from "../srs";

const NOW = Date.parse("2026-09-06T12:00:00Z");

describe("Leitner-бокси", () => {
  it("нова картка йде в перший бокс із інтервалом 1 день", () => {
    const card = newCard(NOW);
    expect(card.box).toBe(1);
    expect(card.dueAt).toBe(NOW + DAY_MS);
  });

  it("правильна відповідь підвищує бокс", () => {
    let card: SrsCard = { box: 1, dueAt: NOW, lapses: 1 };
    card = review(card, true, NOW);
    expect(card.box).toBe(2);
    expect(card.dueAt).toBe(NOW + 3 * DAY_MS);
    card = review(card, true, NOW);
    expect(card.box).toBe(3);
    expect(card.dueAt).toBe(NOW + 7 * DAY_MS);
  });

  it("помилка скидає в перший бокс і збільшує лічильник", () => {
    const card = review({ box: 4, dueAt: NOW, lapses: 2 }, false, NOW);
    expect(card.box).toBe(1);
    expect(card.lapses).toBe(3);
    expect(card.dueAt).toBe(NOW + DAY_MS);
  });

  it("бокс не перевищує п'ятий", () => {
    const card = review({ box: 5, dueAt: NOW, lapses: 0 }, true, NOW);
    expect(card.box).toBe(5);
    expect(isMastered(card)).toBe(true);
  });

  it("картка без історії створюється при помилці", () => {
    const card = review(undefined, false, NOW);
    expect(card.box).toBe(1);
    expect(card.lapses).toBe(1);
  });
});

describe("черга повторення", () => {
  const cards: Record<string, SrsCard> = {
    overdue: { box: 1, dueAt: NOW - 5 * DAY_MS, lapses: 2 },
    dueNow: { box: 2, dueAt: NOW, lapses: 1 },
    future: { box: 3, dueAt: NOW + DAY_MS, lapses: 1 },
    mastered: { box: 5, dueAt: NOW - DAY_MS, lapses: 3 },
  };

  it("isDue враховує момент часу", () => {
    expect(isDue(cards.dueNow, NOW)).toBe(true);
    expect(isDue(cards.future, NOW)).toBe(false);
  });

  it("у чергу потрапляють лише прострочені й невивчені, найдавніші першими", () => {
    expect(dueQuestionIds(cards, NOW)).toEqual(["overdue", "dueNow"]);
  });
});
