import { describe, expect, it } from "vitest";
import { allQuestions } from "@/content";
import { attemptSeed, presentChoices } from "../present";
import { hashString } from "../random";

const single = allQuestions.find((q) => q.kind === "single")!;
const orderQuestions = allQuestions.filter((q) => q.kind === "order");

describe("presentChoices", () => {
  it("зберігає всі варіанти без втрат і дублікатів", () => {
    for (const q of allQuestions) {
      const shown = presentChoices(q, attemptSeed(3));
      expect(shown).toHaveLength(q.choices.length);
      expect(new Set(shown.map((c) => c.id))).toEqual(new Set(q.choices.map((c) => c.id)));
    }
  });

  it("мітки завжди йдуть за позицією показу", () => {
    const shown = presentChoices(single, attemptSeed(11));
    expect(shown.map((c) => c.label)).toEqual(["A", "B", "C", "D"].slice(0, shown.length));
  });

  it("той самий seed дає той самий порядок", () => {
    const a = presentChoices(single, attemptSeed(7)).map((c) => c.id);
    const b = presentChoices(single, attemptSeed(7)).map((c) => c.id);
    expect(a).toEqual(b);
  });

  it("різні seed дають різні порядки хоча б інколи", () => {
    const orders = new Set(
      Array.from({ length: 12 }, (_, i) =>
        presentChoices(single, attemptSeed(i)).map((c) => c.id).join(""),
      ),
    );
    expect(orders.size).toBeGreaterThan(1);
  });

  it("різні питання з тим самим seed перемішуються по-різному", () => {
    const seed = attemptSeed(5);
    const orders = allQuestions
      .slice(0, 20)
      .map((q) => presentChoices(q, seed).map((c, i) => `${i}:${c.id}`).join(""));
    expect(new Set(orders).size).toBeGreaterThan(1);
  });

  it("для order показ ніколи не дорівнює правильній відповіді", () => {
    for (const q of orderQuestions) {
      for (let i = 0; i < 50; i++) {
        const shown = presentChoices(q, attemptSeed(i)).map((c) => c.id);
        expect(shown).not.toEqual(q.correct);
      }
    }
  });

  it("англійський текст підставляється з дубля, а не з української версії", () => {
    const q = allQuestions.find((x) => Object.keys(x.en.choices).length > 0)!;
    const shown = presentChoices(q, attemptSeed(1));
    for (const choice of shown) {
      expect(choice.textEn).toBe(q.en.choices[choice.id] ?? choice.text);
    }
  });
});

describe("розподіл правильних відповідей", () => {
  it("жодна позиція не збирає більше 40% правильних відповідей", () => {
    const counts = [0, 0, 0, 0, 0, 0];
    let total = 0;

    for (const q of allQuestions) {
      if (q.kind === "order") continue;
      for (let attempt = 0; attempt < 20; attempt++) {
        const shown = presentChoices(q, attemptSeed(attempt));
        const idx = shown.findIndex((c) => q.correct.includes(c.id));
        counts[idx] += 1;
        total += 1;
      }
    }

    const share = counts.map((c) => c / total);
    // До фіксу перша позиція тримала 100%.
    expect(Math.max(...share)).toBeLessThan(0.4);
    expect(share[0]).toBeGreaterThan(0.1);
  });
});

describe("hashString", () => {
  it("детермінований і різний для різних рядків", () => {
    expect(hashString("aa-1-q1")).toBe(hashString("aa-1-q1"));
    expect(hashString("aa-1-q1")).not.toBe(hashString("aa-1-q2"));
  });
});
