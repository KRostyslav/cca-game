"use client";

import { allDomains } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Meter } from "@/components/ui/Meter";
import { EXAM_PASS_SCORE, EXAM_QUESTIONS } from "@/lib/game/constants";
import { examQuota } from "@/lib/game/examBuilder";
import { allWorldSummaries } from "@/lib/game/selectors";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

export default function ExamPage() {
  const hydrated = useHydrated();
  const store = useGameStore();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <p className="eyebrow">Завантаження…</p>
      </div>
    );
  }

  const unlocked = allWorldSummaries(store).every((s) => s.bossCleared);
  const quota = examQuota();
  const runs = store.stats.examRuns;
  const best = runs.reduce((acc, r) => Math.max(acc, r.score), 0);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="eyebrow">Фінальне випробування</p>
      <h1 className="display mt-4 text-[clamp(2rem,6vw,3rem)]">Симуляція екзамену</h1>
      <p className="mt-4 max-w-2xl text-parchment-dim">
        {EXAM_QUESTIONS} питань, 120 хвилин, шкала до 1000 балів. Прохідний бал —{" "}
        <span className="text-coral">{EXAM_PASS_SCORE}</span>. Пояснень під час екзамену
        немає: розбір буде наприкінці, а всі помилки автоматично підуть у чергу повторення.
      </p>

      <section className="mt-10 border border-hairline">
        <h2 className="eyebrow border-b border-hairline px-4 py-3">Розподіл питань</h2>
        <ul className="divide-y divide-hairline">
          {allDomains.map((d) => (
            <li key={d.id} className="flex items-center gap-4 px-4 py-3">
              <span className="w-5 shrink-0" style={{ color: d.accent }}>
                {d.icon}
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.9rem] text-parchment-dim">
                {d.titleUk}
              </span>
              <span className="mono w-24 shrink-0 text-right text-[0.7rem] text-muted">
                {quota[d.id]} питань
              </span>
              <span className="mono w-12 shrink-0 text-right text-[0.7rem]" style={{ color: d.accent }}>
                {Math.round(d.weight * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </section>

      {runs.length > 0 && (
        <section className="mt-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="display text-lg">Ваші спроби</h2>
            <span className="mono text-[0.7rem] text-muted">найкращий: {best}</span>
          </div>
          <ul className="space-y-2">
            {runs.slice(0, 5).map((run) => (
              <li key={run.id} className="border border-hairline bg-panel p-4">
                <div className="mono flex flex-wrap items-baseline justify-between gap-2 text-[0.72rem]">
                  <span className="text-muted">
                    {new Date(run.finishedAt).toLocaleString("uk-UA")}
                  </span>
                  <span className={run.passed ? "text-jade" : "text-crimson"}>
                    {run.score} / 1000 · {run.passed ? "склав" : "не склав"}
                  </span>
                </div>
                <div className="mt-2">
                  <Meter
                    value={run.score}
                    max={1000}
                    color={run.passed ? "var(--jade)" : "var(--crimson)"}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-11 flex flex-wrap gap-3">
        {unlocked ? (
          <ButtonLink href="/exam/run" variant="primary">
            Почати екзамен →
          </ButtonLink>
        ) : (
          <p className="mono max-w-md text-sm text-muted">
            🔒 Екзамен відкриється, коли ви здолаєте босів усіх п’яти світів. Це навмисно:
            симуляція має сенс лише після проходження всіх доменів.
          </p>
        )}
        <ButtonLink href="/">На карту</ButtonLink>
      </div>
    </div>
  );
}
