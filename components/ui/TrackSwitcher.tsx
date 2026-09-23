"use client";

import Link from "next/link";
import { tracks } from "@/content/tracks";
import type { TrackId } from "@/lib/content/types";

/** Розділи, які є в обох тренажерах, — перемикання лишає гравця в тому самому розділі. */
const SHARED_SECTIONS = ["/train", "/exam", "/stats", "/codex"];

/**
 * Куди вести при перемиканні: той самий розділ іншого тренажера.
 * Світи, рівні й статті в треків різні — для них ведемо на корінь розділу або на карту.
 */
export function switchTarget(pathname: string, from: TrackId | null, to: TrackId): string {
  if (!from) return `/${to}`;
  const rest = pathname.slice(`/${from}`.length);
  const section = SHARED_SECTIONS.find((s) => rest === s || rest.startsWith(`${s}/`));
  return section ? `/${to}${section}` : `/${to}`;
}

export function TrackSwitcher({ pathname, current }: { pathname: string; current: TrackId | null }) {
  return (
    <div className="flex border border-hairline" role="group" aria-label="Тренажер">
      {tracks.map((track) => {
        const active = track.id === current;
        return (
          <Link
            key={track.id}
            href={switchTarget(pathname, current, track.id)}
            aria-current={active ? "page" : undefined}
            title={track.title}
            className={`mono px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em] transition-colors ${
              active ? "bg-parchment text-void" : "text-muted hover:text-parchment"
            }`}
          >
            {track.label}
          </Link>
        );
      })}
    </div>
  );
}
