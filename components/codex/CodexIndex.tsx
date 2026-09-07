"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allLevels } from "@/content";
import type { Domain, DomainId } from "@/lib/content/types";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

interface Entry {
  slug: string;
  domainId: DomainId;
  title: string;
  summary: string;
}

export function CodexIndex({ entries, domains }: { entries: Entry[]; domains: Domain[] }) {
  const hydrated = useHydrated();
  const unlocked = useGameStore((s) => s.unlocked.codex);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.slug.includes(q),
    );
  }, [entries, query]);

  const openCount = hydrated ? unlocked.length : 0;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <header className="border-b border-hairline pb-7">
        <p className="eyebrow">Довідник</p>
        <h1 className="display mt-4 text-[clamp(2rem,6vw,3rem)]">Codex</h1>
        <p className="mt-4 max-w-2xl text-parchment-dim">
          Конспект усіх тем екзамену. Кожна стаття відкривається після проходження
          відповідного рівня — {openCount} із {entries.length}.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук за темою…"
          className="mono mt-6 w-full max-w-md border border-hairline bg-panel px-3.5 py-2.5 text-sm text-parchment outline-none transition-colors placeholder:text-muted focus:border-coral"
        />
      </header>

      <div className="mt-10 space-y-12">
        {domains.map((domain) => {
          const group = filtered.filter((e) => e.domainId === domain.id);
          if (group.length === 0) return null;
          return (
            <section key={domain.id}>
              <div className="mb-4 flex items-baseline gap-3">
                <span style={{ color: domain.accent }}>{domain.icon}</span>
                <h2 className="display text-lg">{domain.titleUk}</h2>
                <span className="mono text-[0.66rem] text-muted">{domain.title}</span>
              </div>
              <ul className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
                {group.map((entry) => {
                  const open = hydrated && unlocked.includes(entry.slug);
                  const level = allLevels.find((l) => l.codexRef === entry.slug);
                  return (
                    <li key={entry.slug} className="bg-panel">
                      <Link
                        href={`/codex/${entry.slug}`}
                        className={`block h-full p-4 transition-colors hover:bg-raised ${open ? "" : "opacity-55"}`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="display text-[0.98rem] text-parchment">
                            {entry.title}
                          </span>
                          <span className="mono shrink-0 text-[0.66rem] text-muted">
                            {open ? "◆" : "🔒"}
                          </span>
                        </span>
                        <span className="mt-1.5 block text-[0.85rem] leading-relaxed text-parchment-dim">
                          {open
                            ? entry.summary
                            : level
                              ? `Відкриє рівень «${level.title}»`
                              : "Заблоковано"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {filtered.length === 0 && (
          <p className="mono text-sm text-muted">Нічого не знайдено за запитом «{query}».</p>
        )}
      </div>
    </div>
  );
}
