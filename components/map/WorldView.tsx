"use client";

import { getDomain, levelsOfDomain, questionsOfLevel } from "@/content";
import type { DomainId } from "@/lib/content/types";
import { LevelPath } from "./LevelPath";
import { ButtonLink } from "@/components/ui/Button";
import { Meter } from "@/components/ui/Meter";
import { worldSummary } from "@/lib/game/selectors";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

export function WorldView({ domainId }: { domainId: DomainId }) {
  const hydrated = useHydrated();
  const store = useGameStore();
  const domain = getDomain(domainId)!;
  const levels = levelsOfDomain(domainId);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <p className="eyebrow">Завантаження…</p>
      </div>
    );
  }

  const summary = worldSummary(store, domainId);
  const questions = levels.reduce((acc, l) => acc + questionsOfLevel(l.id).length, 0);

  if (!summary.unlocked) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="eyebrow">Світ замкнений</p>
        <h1 className="display mt-4 text-3xl">{domain.titleUk}</h1>
        <p className="mt-4 text-parchment-dim">
          Щоб потрапити сюди, здолайте боса попереднього світу.
        </p>
        <ButtonLink href="/" className="mt-8">
          ← На карту
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <header className="border-b border-hairline pb-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="text-3xl" style={{ color: domain.accent }}>
            {domain.icon}
          </span>
          <p className="eyebrow">
            Світ {domain.index} · {Math.round(domain.weight * 100)}% екзамену
          </p>
        </div>
        <h1 className="display mt-4 text-[clamp(2rem,6vw,3rem)]">{domain.titleUk}</h1>
        <p className="mono mt-2 text-sm" style={{ color: domain.accent }}>
          {domain.title}
        </p>
        <p className="mt-5 max-w-2xl text-parchment-dim">{domain.blurb}</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="mono mb-2 flex justify-between text-[0.68rem] text-muted">
              <span>
                {summary.cleared}/{summary.levels} рівнів · {questions} питань
              </span>
              <span className="text-gold">
                ★ {summary.stars}/{summary.maxStars}
              </span>
            </div>
            <Meter value={summary.stars} max={summary.maxStars} color={domain.accent} />
          </div>
          <ButtonLink href="/codex" variant="ghost">
            Довідник світу
          </ButtonLink>
        </div>
      </header>

      <div className="mt-10">
        <LevelPath domain={domain} />
      </div>
    </div>
  );
}
