import { describe, expect, it } from "vitest";
import { allDomains, allQuestions } from "@/content";
import { EXAM_QUESTIONS } from "../constants";
import { buildExam, examQuota } from "../examBuilder";
import { makeRng, shuffle } from "../random";

describe("квота екзамену", () => {
  it("сума квот дорівнює кількості питань екзамену", () => {
    const quota = examQuota();
    expect(Object.values(quota).reduce((a, b) => a + b, 0)).toBe(EXAM_QUESTIONS);
  });

  it("квота кожного домену близька до його ваги", () => {
    const quota = examQuota();
    for (const domain of allDomains) {
      expect(Math.abs(quota[domain.id] - domain.weight * EXAM_QUESTIONS)).toBeLessThan(1);
    }
  });
});

describe("генерація екзамену", () => {
  it("повертає рівно 60 унікальних питань", () => {
    const exam = buildExam(42);
    expect(exam).toHaveLength(EXAM_QUESTIONS);
    expect(new Set(exam.map((q) => q.id)).size).toBe(EXAM_QUESTIONS);
  });

  it("дотримується доменного розподілу", () => {
    const exam = buildExam(7);
    const quota = examQuota();
    for (const domain of allDomains) {
      const count = exam.filter((q) => q.domainId === domain.id).length;
      expect(count).toBe(quota[domain.id]);
    }
  });

  it("один seed дає той самий екзамен, різні — різні", () => {
    expect(buildExam(1).map((q) => q.id)).toEqual(buildExam(1).map((q) => q.id));
    expect(buildExam(1).map((q) => q.id)).not.toEqual(buildExam(2).map((q) => q.id));
  });

  it("усі питання екзамену існують у базі", () => {
    const known = new Set(allQuestions.map((q) => q.id));
    for (const q of buildExam(99)) expect(known.has(q.id)).toBe(true);
  });
});

describe("детермінований PRNG", () => {
  it("shuffle зберігає всі елементи", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input, makeRng(3));
    expect([...out].sort((a, b) => a - b)).toEqual(input);
  });

  it("однаковий seed дає однаковий порядок", () => {
    const input = ["a", "b", "c", "d", "e"];
    expect(shuffle(input, makeRng(11))).toEqual(shuffle(input, makeRng(11)));
  });
});
