"use client";

import { createContext, useCallback, useContext } from "react";
import type { TrackId } from "@/lib/content/types";

/** Поточний тренажер. Поза треком (екран вибору) — Architect, як до появи другого. */
export const TrackContext = createContext<TrackId>("architect");

export function useTrackId(): TrackId {
  return useContext(TrackContext);
}

/** Побудова посилань усередині поточного тренажера: href("/play/aa-1") → "/architect/play/aa-1". */
export function useTrackHref(): (path?: string) => string {
  const track = useTrackId();
  return useCallback((path = "/") => (path === "/" ? `/${track}` : `/${track}${path}`), [track]);
}
