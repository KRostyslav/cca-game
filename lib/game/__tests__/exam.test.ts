import { describe, expect, it } from "vitest";
import { trackContent } from "@/content";
import { trackIds } from "@/content/tracks";
import { EXAM_QUESTIONS } from "../constants";
import { buildExam, examQuota } from "../examBuilder";
import { makeRng, shuffle } from "../random";

describe.each(trackIds)("екзамен треку %s", (track) => {
  const { domains, questions } = trackContent(track);

  it("сума квот дорівнює кількості питань екзамену", () => {
    const quota = examQuota(track);
    expect(Object.values(quota).reduce((a, b) => a + b, 0)).toBe(EXAM_QUESTIONS);
  });

  it("квота кожного домену близька до його ваги", () => {
    const quota = examQuota(track);
    for (const domain of domains) {
      expect(Math.abs(quota[domain.id] - domain.weight * EXAM_QUESTIONS)).toBeLessThan(1);
    }
  });

  it("повертає рівно 60 унікальних питань", () => {
    const exam = buildExam(track, 42);
    expect(exam).toHaveLength(EXAM_QUESTIONS);
    expect(new Set(exam.map((q) => q.id)).size).toBe(EXAM_QUESTIONS);
  });

  it("дотримується доменного розподілу", () => {
    const exam = buildExam(track, 7);
    const quota = examQuota(track);
    for (const domain of domains) {
      const count = exam.filter((q) => q.domainId === domain.id).length;
      expect(count).toBe(quota[domain.id]);
    }
  });

  it("один seed дає той самий екзамен, різні — різні", () => {
    expect(buildExam(track, 1).map((q) => q.id)).toEqual(buildExam(track, 1).map((q) => q.id));
    expect(buildExam(track, 1).map((q) => q.id)).not.toEqual(buildExam(track, 2).map((q) => q.id));
  });

  it("усі питання екзамену належать своєму треку", () => {
    const known = new Set(questions.map((q) => q.id));
    for (const q of buildExam(track, 99)) expect(known.has(q.id)).toBe(true);
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
