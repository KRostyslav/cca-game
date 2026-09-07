"use client";

import Link from "next/link";
import { levelsOfDomain } from "@/content";
import type { Domain } from "@/lib/content/types";
import { Stars } from "@/components/ui/Stars";
import { isLevelUnlocked, useGameStore } from "@/lib/store/gameStore";

export function LevelPath({ domain }: { domain: Domain }) {
  const store = useGameStore();
  const levels = levelsOfDomain(domain.id);

  return (
    <ol className="relative space-y-3">
      <span
        className="absolute bottom-6 left-[27px] top-6 w-px"
        style={{ background: "var(--hairline)" }}
        aria-hidden
      />
      {levels.map((level, i) => {
        const progress = store.progress[level.id];
        const stars = progress?.stars ?? 0;
        const unlocked = isLevelUnlocked(store, level.id);
        const done = stars > 0;

        const node = (
          <>
            <span
              className={`mono relative z-10 flex h-14 w-14 shrink-0 items-center justify-center border text-sm transition-all duration-300 ${
                !unlocked
                  ? "border-hairline bg-void text-hairline-bright"
                  : done
                    ? "bg-void"
                    : "bg-void pulse-ring"
              }`}
              style={
                unlocked
                  ? { borderColor: domain.accent, color: domain.accent }
                  : undefined
              }
            >
              {!unlocked ? "🔒" : level.boss ? "☠" : String(level.index).padStart(2, "0")}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span
                  className={`display text-lg ${unlocked ? "text-parchment" : "text-muted"}`}
                >
                  {level.title}
                </span>
                {done && <Stars value={stars} />}
                {level.boss && unlocked && !done && (
                  <span className="mono text-[0.62rem] uppercase tracking-[0.16em] text-crimson">
                    Бос
                  </span>
                )}
              </span>
              <span className="mt-1 block text-[0.88rem] leading-relaxed text-parchment-dim">
                {unlocked
                  ? level.subtitle
                  : level.boss
                    ? "Потрібно щонайменше 2 ★ на кожному рівні світу"
                    : "Пройдіть попередній рівень"}
              </span>
              <span className="mono mt-1.5 block text-[0.66rem] text-muted">
                {level.questionIds.length} питань
                {progress?.attempts ? ` · спроб: ${progress.attempts}` : ""}
              </span>
            </span>
          </>
        );

        const cls = "flex items-start gap-5 border border-transparent p-3 transition-colors";

        return (
          <li key={level.id} className="rise" style={{ animationDelay: `${i * 55}ms` }}>
            {unlocked ? (
              <Link href={`/play/${level.id}`} className={`${cls} hover:border-hairline hover:bg-panel`}>
                {node}
              </Link>
            ) : (
              <div className={`${cls} opacity-50`}>{node}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
