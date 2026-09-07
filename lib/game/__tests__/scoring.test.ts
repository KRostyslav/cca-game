import { describe, expect, it } from "vitest";
import { isCorrect, partialScore, passed, scaledScore, starsFor } from "../scoring";
import type { Question } from "@/lib/content/types";

const base = {
  id: "q",
  domainId: "agentic-architecture",
  levelId: "l",
  difficulty: 1,
  prompt: "?",
  explanation: "Пояснення довше за двадцять символів.",
  codexRef: "agentic-loop",
} as const;

const single: Question = {
  ...base,
  kind: "single",
  choices: [{ id: "a", text: "a" }, { id: "b", text: "b", whyWrong: "ні" }],
  correct: ["a"],
};

const multi: Question = {
  ...base,
  kind: "multi",
  choices: [
    { id: "a", text: "a" },
    { id: "b", text: "b" },
    { id: "c", text: "c", whyWrong: "ні" },
  ],
  correct: ["a", "b"],
};

const ordered: Question = {
  ...base,
  kind: "order",
  choices: [{ id: "a", text: "a" }, { id: "b", text: "b" }, { id: "c", text: "c" }],
  correct: ["a", "b", "c"],
};

describe("перевірка відповіді", () => {
  it("single", () => {
    expect(isCorrect(single, ["a"])).toBe(true);
    expect(isCorrect(single, ["b"])).toBe(false);
    expect(isCorrect(single, [])).toBe(false);
  });

  it("multi не залежить від порядку, але вимагає повного збігу", () => {
    expect(isCorrect(multi, ["b", "a"])).toBe(true);
    expect(isCorrect(multi, ["a"])).toBe(false);
    expect(isCorrect(multi, ["a", "b", "c"])).toBe(false);
  });

  it("order враховує порядок", () => {
    expect(isCorrect(ordered, ["a", "b", "c"])).toBe(true);
    expect(isCorrect(ordered, ["b", "a", "c"])).toBe(false);
  });
});

describe("частковий бал", () => {
  it("multi: половина правильних дає 0.5", () => {
    expect(partialScore(multi, ["a"])).toBe(0.5);
  });

  it("multi: хибна позначка знімає бал", () => {
    expect(partialScore(multi, ["a", "c"])).toBe(0);
    expect(partialScore(multi, ["a", "b", "c"])).toBe(0.5);
  });

  it("частковий бал ніколи не відʼємний", () => {
    expect(partialScore(multi, ["c"])).toBe(0);
  });

  it("для не-multi це 0 або 1", () => {
    expect(partialScore(single, ["a"])).toBe(1);
    expect(partialScore(single, ["b"])).toBe(0);
  });
});

describe("зірки та шкала екзамену", () => {
  it("зірки за кількістю помилок", () => {
    expect(starsFor(0, false)).toBe(3);
    expect(starsFor(1, false)).toBe(2);
    expect(starsFor(2, false)).toBe(1);
    expect(starsFor(0, true)).toBe(0);
  });

  it("шкала 0..1000", () => {
    expect(scaledScore(60, 60)).toBe(1000);
    expect(scaledScore(0, 60)).toBe(0);
    expect(scaledScore(30, 60)).toBe(500);
    expect(scaledScore(1, 0)).toBe(0);
  });

  it("прохідний бал 720", () => {
    expect(passed(719)).toBe(false);
    expect(passed(720)).toBe(true);
  });
});
