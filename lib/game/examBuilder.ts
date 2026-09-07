import { allDomains, questionsOfDomain } from "@/content";
import type { Question } from "@/lib/content/types";
import { EXAM_QUESTIONS } from "./constants";
import { makeRng, shuffle } from "./random";

/**
 * Скільки питань кожного домену потрапляє в екзамен.
 * Найбільші залишки округлення дістаються найважчим доменам — сума завжди рівно EXAM_QUESTIONS.
 */
export function examQuota(total = EXAM_QUESTIONS): Record<string, number> {
  const raw = allDomains.map((d) => ({ id: d.id, exact: d.weight * total }));
  const quota: Record<string, number> = {};
  let assigned = 0;
  for (const item of raw) {
    quota[item.id] = Math.floor(item.exact);
    assigned += quota[item.id];
  }
  const byRemainder = [...raw].sort(
    (a, b) => (b.exact - Math.floor(b.exact)) - (a.exact - Math.floor(a.exact)),
  );
  let i = 0;
  while (assigned < total) {
    quota[byRemainder[i % byRemainder.length].id] += 1;
    assigned += 1;
    i += 1;
  }
  return quota;
}

export function buildExam(seed: number, total = EXAM_QUESTIONS): Question[] {
  const rng = makeRng(seed);
  const quota = examQuota(total);
  const picked: Question[] = [];
  for (const domain of allDomains) {
    const pool = shuffle(questionsOfDomain(domain.id), rng);
    picked.push(...pool.slice(0, quota[domain.id]));
  }
  // Якщо в якомусь домені бракує питань — добираємо з решти, щоб екзамен був повним.
  if (picked.length < total) {
    const chosen = new Set(picked.map((q) => q.id));
    const rest = shuffle(
      allDomains.flatMap((d) => questionsOfDomain(d.id)).filter((q) => !chosen.has(q.id)),
      rng,
    );
    picked.push(...rest.slice(0, total - picked.length));
  }
  return shuffle(picked, rng);
}
