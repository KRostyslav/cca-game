"use client";

import type { ReactNode } from "react";
import { getLevel, trackContent } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";
import { useTrackHref, useTrackId } from "@/lib/store/trackContext";

export function CodexGate({ slug, children }: { slug: string; children: ReactNode }) {
  const trackId = useTrackId();
  const href = useTrackHref();
  const hydrated = useHydrated();
  const unlocked = useGameStore((s) => s.unlocked.codex);

  if (!hydrated) {
    return <p className="eyebrow py-10">Перевірка доступу…</p>;
  }

  if (unlocked.includes(slug)) return <>{children}</>;

  const level = trackContent(trackId).levels.find((l) => l.codexRef === slug);
  const target = level ? getLevel(level.id) : undefined;

  return (
    <div className="panel hatch mt-8 p-8 text-center">
      <p className="eyebrow">Стаття заблокована</p>
      <p className="mt-4 max-w-md mx-auto text-parchment-dim">
        {target
          ? `Цю сторінку довідника відкриє проходження рівня «${target.title}».`
          : "Цю сторінку ще не відкрито."}
      </p>
      {target && (
        <ButtonLink href={href(`/play/${target.id}`)} variant="primary" className="mt-7">
          До рівня →
        </ButtonLink>
      )}
    </div>
  );
}
