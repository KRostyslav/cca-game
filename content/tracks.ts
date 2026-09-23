import type { Track, TrackId } from "@/lib/content/types";

/** Два тренажери: однакова механіка, різні світи, питання, довідник і збереження. */
export const tracks: Track[] = [
  {
    id: "architect",
    code: "CCA-F",
    title: "Claude Certified Architect – Foundations",
    label: "Architect",
    playerNoun: "Архітектор",
    playerVocative: "архітекторе",
    defaultPlayerName: "Architect",
    blurb:
      "Агентна архітектура, Claude Code, промпт-інжиніринг, MCP і надійність. Для тих, хто проєктує системи на Claude.",
    accent: "#D97757",
  },
  {
    id: "developer",
    code: "CCD-F",
    title: "Claude Certified Developer – Foundations",
    label: "Developer",
    playerNoun: "Розробник",
    playerVocative: "розробнику",
    defaultPlayerName: "Developer",
    blurb:
      "Claude API і SDK, tool use у коді, Claude Code у щоденній роботі, Agent SDK, MCP-сервери, evals і продакшн.",
    accent: "#6EA8FE",
  },
];

export const trackIds: TrackId[] = tracks.map((t) => t.id);

const trackById = new Map(tracks.map((t) => [t.id, t]));

export function getTrack(id: string): Track | undefined {
  return trackById.get(id as TrackId);
}

export function isTrackId(id: string): id is TrackId {
  return trackById.has(id as TrackId);
}

/** Шлях усередині тренажера: trackHref("developer", "/play/da-1") → "/developer/play/da-1". */
export function trackHref(track: TrackId, path = "/"): string {
  return path === "/" ? `/${track}` : `/${track}${path}`;
}
