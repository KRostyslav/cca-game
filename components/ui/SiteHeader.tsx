"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTrack, isTrackId } from "@/content/tracks";
import type { TrackId } from "@/lib/content/types";
import { useGameStore } from "@/lib/store/gameStore";
import { TrackProvider } from "@/lib/store/TrackProvider";
import { useHydrated } from "@/lib/store/useHydrated";
import { levelProgress, titleForLevel } from "@/lib/game/xp";
import { dueQuestionIds } from "@/lib/game/srs";
import { useNow } from "@/lib/game/useNow";
import { LanguageToggle } from "./LanguageToggle";
import { TrackSwitcher } from "./TrackSwitcher";
import { useMemo } from "react";

const NAV = [
  { href: "/", label: "Карта" },
  { href: "/train", label: "Тренування" },
  { href: "/exam", label: "Екзамен" },
  { href: "/codex", label: "Codex" },
  { href: "/stats", label: "Профіль" },
];

/**
 * Хедер живе в кореневому layout, поза маршрутом тренажера, тож трек визначає сам — за URL.
 * На екрані вибору (/) тренажера ще немає: показуємо лише перемикач і мову.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const track = isTrackId(segment) ? segment : null;

  if (!track) {
    return (
      <header className="sticky top-0 z-30 border-b border-hairline bg-void/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="display text-lg text-parchment transition-colors group-hover:text-coral">
              Claude
            </span>
            <span className="eyebrow hidden sm:inline">Quest</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <TrackSwitcher pathname={pathname} current={null} />
            <LanguageToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <TrackProvider track={track}>
      <TrackHeader pathname={pathname} track={track} />
    </TrackProvider>
  );
}

function TrackHeader({ pathname, track }: { pathname: string; track: TrackId }) {
  const def = getTrack(track)!;
  const base = `/${track}`;
  const hydrated = useHydrated();
  const player = useGameStore((s) => s.player);
  const srs = useGameStore((s) => s.srs);
  const now = useNow();
  // Кількість карток «до повторення» залежить від поточного часу — тому через useNow.
  const dueCount = useMemo(() => dueQuestionIds(srs, now).length, [srs, now]);

  const progress = levelProgress(player.xp);
  const inBattle =
    pathname.startsWith(`${base}/play/`) || pathname.startsWith(`${base}/exam/run`);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
        <Link href={base} className="group flex items-baseline gap-2.5">
          <span className="display text-lg text-parchment transition-colors group-hover:text-coral">
            {def.code}
          </span>
          <span className="eyebrow hidden sm:inline">Quest</span>
        </Link>

        {!inBattle && (
          <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto sm:order-none sm:mx-0 sm:w-auto">
            {NAV.map((item) => {
              const href = item.href === "/" ? base : `${base}${item.href}`;
              const active =
                item.href === "/"
                  ? pathname === base || pathname.startsWith(`${base}/world/`)
                  : pathname.startsWith(href);
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`mono relative shrink-0 px-2.5 py-1.5 text-[0.68rem] uppercase tracking-[0.14em] transition-colors ${
                    active ? "text-coral" : "text-muted hover:text-parchment"
                  }`}
                >
                  {item.label}
                  {item.href === "/train" && hydrated && dueCount > 0 && (
                    <span className="ml-1.5 text-gold">{dueCount}</span>
                  )}
                  {active && (
                    <span className="absolute inset-x-2.5 -bottom-px h-px bg-coral" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
          {!inBattle && <TrackSwitcher pathname={pathname} current={track} />}
          <LanguageToggle />
          {hydrated && player.name ? (
            <>
              <div className="hidden text-right sm:block">
                <div className="mono text-xs text-parchment">{player.name}</div>
                <div className="eyebrow">{titleForLevel(progress.level, track)}</div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center border border-coral/50">
                  <span className="mono text-xs text-coral">{progress.level}</span>
                  <span
                    className="absolute bottom-0 left-0 h-0.5 bg-coral transition-[width] duration-500"
                    style={{ width: `${progress.ratio * 100}%` }}
                  />
                </div>
                <div className="mono hidden text-[0.7rem] text-muted sm:block">
                  <span className="text-gold">◈</span> {player.credits}
                </div>
              </div>
            </>
          ) : (
            <span className="eyebrow hidden sm:inline">{def.playerNoun}</span>
          )}
        </div>
      </div>
    </header>
  );
}
