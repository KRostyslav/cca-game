"use client";

import Link from "next/link";
import { allDomains, getQuestion } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Meter } from "@/components/ui/Meter";
import { EXAM_PASS_SCORE } from "@/lib/game/constants";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

export default function ExamResultPage() {
  const hydrated = useHydrated();
  const run = useGameStore((s) => s.stats.examRuns[0]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <p className="eyebrow">Підрахунок балів…</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="eyebrow">Спроб ще не було</p>
        <ButtonLink href="/exam" className="mt-6">
          До екзамену
        </ButtonLink>
      </div>
    );
  }

  const minutes = Math.round((run.finishedAt - run.startedAt) / 60000);
  const wrong = run.wrongQuestionIds.map(getQuestion).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <div className="panel hatch p-8 text-center">
        <p className="eyebrow">Результат симуляції</p>
        <p
          className={`display mt-5 text-[clamp(3.5rem,14vw,6rem)] leading-none ${
            run.passed ? "text-jade" : "text-crimson"
          }`}
        >
          {run.score}
        </p>
        <p className="mono mt-2 text-sm text-muted">із 1000 · прохідний {EXAM_PASS_SCORE}</p>

        <div className="relative mx-auto mt-8 max-w-lg">
          <Meter
            value={run.score}
            max={1000}
            height={8}
            color={run.passed ? "var(--jade)" : "var(--crimson)"}
          />
          <span
            className="absolute -top-1 h-[16px] w-px bg-gold"
            style={{ left: `${(EXAM_PASS_SCORE / 1000) * 100}%` }}
            aria-hidden
          />
        </div>

        <p className={`display mt-7 text-2xl ${run.passed ? "text-jade" : "text-crimson"}`}>
          {run.passed ? "Складено" : "Не складено"}
        </p>
        <p className="mono mt-2 text-[0.7rem] text-muted">
          {minutes} хв · помилок: {run.wrongQuestionIds.length}
        </p>
      </div>

      <section className="mt-10">
        <h2 className="display text-lg">За доменами</h2>
        <ul className="mt-4 space-y-3">
          {allDomains.map((d) => {
            const stat = run.perDomain[d.id] ?? { correct: 0, total: 0 };
            const ratio = stat.total === 0 ? 0 : stat.correct / stat.total;
            return (
              <li key={d.id}>
                <div className="mono mb-1.5 flex items-baseline justify-between text-[0.7rem]">
                  <span className="text-parchment-dim">
                    <span style={{ color: d.accent }}>{d.icon}</span> {d.titleUk}
                  </span>
                  <span className={ratio >= 0.72 ? "text-jade" : "text-crimson"}>
                    {Math.round(ratio * 100)}%
                  </span>
                </div>
                <Meter value={ratio} color={d.accent} />
              </li>
            );
          })}
        </ul>
        <p className="mono mt-4 text-[0.68rem] text-muted">
          Домени нижче 72% — перше, куди варто повернутися.
        </p>
      </section>

      {wrong.length > 0 && (
        <section className="mt-12">
          <h2 className="display text-lg">Помилки</h2>
          <p className="mono mt-1 text-[0.7rem] text-muted">
            Усі вони вже в черзі повторення
          </p>
          <ul className="mt-5 space-y-3">
            {wrong.map(
              (q) =>
                q && (
                  <li key={q.id} className="border-l-2 border-crimson bg-panel p-4">
                    <p className="text-[0.92rem] text-parchment">{q.prompt}</p>
                    <p className="mt-2 text-[0.85rem] leading-relaxed text-parchment-dim">
                      {q.explanation}
                    </p>
                    <Link
                      href={`/codex/${q.codexRef}`}
                      className="mono mt-3 inline-block text-[0.66rem] uppercase tracking-[0.14em] text-coral hover:underline"
                    >
                      {q.codexRef} →
                    </Link>
                  </li>
                ),
            )}
          </ul>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href="/train" variant="primary">
          Опрацювати помилки
        </ButtonLink>
        <ButtonLink href="/exam">Спробувати ще раз</ButtonLink>
        <ButtonLink href="/stats" variant="ghost">
          Профіль
        </ButtonLink>
      </div>
    </div>
  );
}
