"use client";

import type { TrackId } from "@/lib/content/types";
import { TrackContext } from "./trackContext";

/** Задає тренажер для всіх компонентів усередині: стор, контент і префікс посилань. */
export function TrackProvider({ track, children }: { track: TrackId; children: React.ReactNode }) {
  return <TrackContext.Provider value={track}>{children}</TrackContext.Provider>;
}
