import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { CodexEntry, DomainId, TrackId } from "./types";
import { codexEntrySchema } from "./schema";

/**
 * Статті Architect лишилися на старому місці; у Developer — свій каталог.
 * Шляхи записані літералами, щоб бандлер трасував лише ці два каталоги, а не весь проєкт.
 */
function codexDir(track: TrackId): string {
  return track === "developer"
    ? join(process.cwd(), "content", "developer", "codex")
    : join(process.cwd(), "content", "codex");
}

/** Мінімальний парсер frontmatter — зайва залежність тут не потрібна. */
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: raw };
  const head = raw.slice(4, end);
  const body = raw.slice(end + 4).replace(/^\n/, "");
  const meta: Record<string, string> = {};
  for (const line of head.split("\n")) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { meta, body };
}

export function readCodexEntry(track: TrackId, slug: string): CodexEntry | null {
  // slug приходить з URL — не даємо вийти за межі каталогу.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  let raw: string;
  try {
    raw = readFileSync(join(codexDir(track), `${slug}.md`), "utf8");
  } catch {
    return null;
  }
  const { meta, body } = parseFrontmatter(raw);
  const entry = {
    slug,
    domainId: meta.domain as DomainId,
    title: meta.title ?? slug,
    summary: meta.summary ?? "",
    body,
  };
  return codexEntrySchema.safeParse(entry).success ? entry : null;
}

export function listCodexEntries(track: TrackId): CodexEntry[] {
  return readdirSync(codexDir(track))
    .filter((f) => f.endsWith(".md"))
    .map((f) => readCodexEntry(track, f.replace(/\.md$/, "")))
    .filter((e): e is CodexEntry => e !== null);
}
