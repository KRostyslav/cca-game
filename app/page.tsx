"use client";

import { trackContent } from "@/content";
import { tracks } from "@/content/tracks";
import type { Track } from "@/lib/content/types";
import { ButtonLink } from "@/components/ui/Button";
import { Meter } from "@/components/ui/Meter";
import { allWorldSummaries, totalStars } from "@/lib/game/selectors";
import { levelProgress, titleForLevel } from "@/lib/game/xp";
import { useGameStore } from "@/lib/store/gameStore";
import { TrackProvider } from "@/lib/store/TrackProvider";
import { useHydrated } from "@/lib/store/useHydrated";

/** Екран вибору тренажера. Прогрес кожного читається з його власного збереження. */
export default function ChooseTrackPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <section className="grid-paper relative border border-hairline p-6 sm:p-10">
        <p className="eyebrow">Anthropic · Claude Certifications</p>
        <h1 className="display mt-4 text-[clamp(2rem,6vw,3.4rem)]">
          Оберіть <span className="text-coral">тренажер</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment-dim">
          Два ігрові тренажери з однаковою механікою: світи-домени, бої з питань, боси,
          довідник, інтервальне повторення і симуляція екзамену. Прогрес кожного
          зберігається окремо, тож між ними можна вільно перемикатися з хедера.
        </p>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {tracks.map((track, i) => (
          <TrackProvider key={track.id} track={track.id}>
            <TrackCard track={track} index={i} />
          </TrackProvider>
        ))}
      </section>
    </div>
  );
}

function TrackCard({ track, index }: { track: Track; index: number }) {
  const hydrated = useHydrated();
  const store = useGameStore();
  const content = trackContent(track.id);
  const started = hydrated && Boolean(store.player.name);
  const progress = levelProgress(store.player.xp);
  const stars = totalStars(store);
  const bosses = allWorldSummaries(store).filter((s) => s.bossCleared).length;

  return (
    <article
      className="panel rise flex flex-col justify-between p-6 sm:p-8"
      style={{ animationDelay: `${index * 70}ms`, borderTop: `2px solid ${track.accent}` }}
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow" style={{ color: track.accent }}>
            {track.code}
          </p>
          <span className="mono text-[0.68rem] text-muted">
            {content.domains.length} світів · {content.levels.length} рівнів ·{" "}
            {content.questions.length} питань
          </span>
        </div>
        <h2 className="display mt-4 text-2xl">{track.label}</h2>
        <p className="mono mt-1 text-[0.72rem] text-parchment-dim">{track.title}</p>
        <p className="mt-4 text-[0.92rem] leading-relaxed text-parchment-dim">{track.blurb}</p>

        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
          {content.domains.map((d) => (
            <li key={d.id} className="mono text-[0.68rem] text-muted">
              <span style={{ color: d.accent }}>{d.icon}</span> {d.titleUk}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        {started ? (
          <div className="mb-5">
            <div className="mono mb-2 flex justify-between text-[0.68rem] text-muted">
              <span>
                {store.player.name} · {titleForLevel(progress.level, track.id)} · рівень{" "}
                {progress.level}
              </span>
              <span>
                ★ {stars.stars}/{stars.max} · боси {bosses}/{content.domains.length}
              </span>
            </div>
            <Meter value={stars.max === 0 ? 0 : stars.stars / stars.max} />
          </div>
        ) : (
          <p className="mono mb-5 text-[0.68rem] text-muted">
            {hydrated ? "Ще не розпочато" : "Завантаження збереження…"}
          </p>
        )}
        <ButtonLink href={`/${track.id}`} variant="primary" className="w-full">
          {started ? "Продовжити" : "Почати"} →
        </ButtonLink>
      </div>
    </article>
  );
}
