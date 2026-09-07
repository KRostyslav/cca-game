"use client";

import { useEffect } from "react";
import { allDomains, getLevel } from "@/content";
import { Onboarding } from "@/components/game/Onboarding";
import { WorldCard } from "@/components/map/WorldCard";
import { ButtonLink } from "@/components/ui/Button";
import { Meter } from "@/components/ui/Meter";
import { allWorldSummaries, nextPlayableLevel, totalStars } from "@/lib/game/selectors";
import { levelProgress, titleForLevel } from "@/lib/game/xp";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

export default function HomePage() {
  const hydrated = useHydrated();
  const store = useGameStore();
  const touchStreak = useGameStore((s) => s.touchStreak);

  useEffect(() => {
    if (hydrated && store.player.name) touchStreak();
    // Позначаємо день гри один раз після гідратації.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="eyebrow">Завантаження збереження…</p>
      </div>
    );
  }

  if (!store.player.name) return <Onboarding />;

  const summaries = allWorldSummaries(store);
  const nextId = nextPlayableLevel(store);
  const nextLevel = nextId ? getLevel(nextId) : undefined;
  const progress = levelProgress(store.player.xp);
  const stars = totalStars(store);
  const examUnlocked = summaries.every((s) => s.bossCleared);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      {/* Герой */}
      <section className="grid-paper relative border border-hairline p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">Карта світів</p>
            <h1 className="display mt-4 text-[clamp(2rem,6vw,3.4rem)]">
              Вітаю, <span className="text-coral">{store.player.name}</span>.
            </h1>
            <p className="mt-4 max-w-lg text-parchment-dim">
              {nextLevel
                ? `Наступний виклик — «${nextLevel.title}». ${nextLevel.subtitle}`
                : "Усі рівні пройдено на три зірки. Лишилася симуляція екзамену."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {nextId && (
                <ButtonLink href={`/play/${nextId}`} variant="primary">
                  {store.stats.totalAnswers > 0 ? "Продовжити" : "Перший бій"} →
                </ButtonLink>
              )}
              <ButtonLink href="/train">Тренування</ButtonLink>
              {examUnlocked && <ButtonLink href="/exam">Симуляція екзамену</ButtonLink>}
            </div>
          </div>

          <dl className="panel grid grid-cols-2 gap-px self-start border-hairline bg-hairline">
            <Stat label="Рівень" value={String(progress.level)} note={titleForLevel(progress.level)} />
            <Stat label="Кредити" value={String(store.player.credits)} note="на артефакти" />
            <Stat label="Зірки" value={`${stars.stars}/${stars.max}`} note="усього" />
            <Stat
              label="Стрік"
              value={`${store.stats.streakDays}`}
              note={store.stats.streakDays === 1 ? "день" : "дні поспіль"}
            />
            <div className="col-span-2 bg-panel p-4">
              <div className="mono mb-2 flex justify-between text-[0.68rem] text-muted">
                <span>XP до рівня {progress.level + 1}</span>
                <span>
                  {progress.current}/{progress.needed || "—"}
                </span>
              </div>
              <Meter value={progress.ratio} />
            </div>
          </dl>
        </div>
      </section>

      {/* Світи */}
      <section className="mt-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="display text-2xl">Світи</h2>
          <span className="eyebrow">5 доменів екзамену</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {allDomains.map((domain, i) => (
            <WorldCard
              key={domain.id}
              domain={domain}
              summary={summaries[i]}
              index={i}
            />
          ))}
          <div
            className={`panel rise flex flex-col justify-between p-6 ${examUnlocked ? "" : "opacity-55"}`}
            style={{ animationDelay: `${allDomains.length * 70}ms` }}
          >
            <div>
              <p className="eyebrow">Фінал</p>
              <h3 className="display mt-4 text-xl">Симуляція екзамену</h3>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-parchment-dim">
                60 питань за 120 хвилин, шкала до 1000 балів, прохідний — 720. Розподіл
                питань точно за вагами доменів.
              </p>
            </div>
            <div className="mt-6">
              {examUnlocked ? (
                <ButtonLink href="/exam" variant="primary" className="w-full">
                  Скласти екзамен
                </ButtonLink>
              ) : (
                <p className="mono text-[0.68rem] text-muted">
                  🔒 Відкриється, коли всі п’ять босів будуть здолані
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-panel p-4">
      <dt className="eyebrow">{label}</dt>
      <dd className="mono mt-1.5 text-2xl text-parchment">{value}</dd>
      <dd className="mono mt-0.5 text-[0.65rem] text-muted">{note}</dd>
    </div>
  );
}
