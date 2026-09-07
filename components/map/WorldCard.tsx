"use client";

import Link from "next/link";
import type { Domain } from "@/lib/content/types";
import type { WorldSummary } from "@/lib/game/selectors";
import { Meter } from "@/components/ui/Meter";

export function WorldCard({
  domain,
  summary,
  index,
}: {
  domain: Domain;
  summary: WorldSummary;
  index: number;
}) {
  const locked = !summary.unlocked;
  const body = (
    <>
      <div
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: locked ? "var(--hairline)" : domain.accent }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            className="mono text-[0.7rem]"
            style={{ color: locked ? "var(--muted)" : domain.accent }}
          >
            {String(domain.index).padStart(2, "0")}
          </span>
          <span
            className="text-2xl leading-none"
            style={{ color: locked ? "var(--hairline-bright)" : domain.accent }}
          >
            {locked ? "🔒" : domain.icon}
          </span>
        </div>
        <span className="mono text-[0.68rem] text-muted">{Math.round(domain.weight * 100)}%</span>
      </div>

      <h3 className="display mt-5 text-xl text-parchment">{domain.titleUk}</h3>
      <p className="mono mt-1.5 text-[0.7rem] leading-relaxed text-muted">{domain.title}</p>

      <p className="mt-4 line-clamp-3 text-[0.9rem] leading-relaxed text-parchment-dim">
        {locked
          ? "Світ замкнений. Здолайте боса попереднього світу, щоб відкрити шлях."
          : domain.blurb}
      </p>

      <div className="mt-6">
        <div className="mono mb-2 flex items-center justify-between text-[0.68rem] text-muted">
          <span>
            {summary.cleared}/{summary.levels} рівнів
          </span>
          <span className="text-gold">
            ★ {summary.stars}/{summary.maxStars}
          </span>
        </div>
        <Meter
          value={summary.stars}
          max={summary.maxStars}
          color={locked ? "var(--hairline-bright)" : domain.accent}
        />
      </div>
    </>
  );

  const shell =
    "panel rise group relative block overflow-hidden p-6 transition-all duration-300";

  if (locked) {
    return (
      <div
        className={`${shell} opacity-55`}
        style={{ animationDelay: `${index * 70}ms` }}
        aria-disabled
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/world/${domain.id}`}
      className={`${shell} hover:-translate-y-1`}
      style={{ animationDelay: `${index * 70}ms` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = domain.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
      }}
    >
      {body}
      <span
        className="mono mt-6 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: domain.accent }}
      >
        {summary.bossCleared ? "Пройдено" : summary.cleared > 0 ? "Продовжити" : "Увійти"} →
      </span>
    </Link>
  );
}
