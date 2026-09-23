"use client";

import { useState } from "react";
import { trackContent } from "@/content";
import { getTrack } from "@/content/tracks";
import { useGameStore } from "@/lib/store/gameStore";
import { useTrackId } from "@/lib/store/trackContext";
import { Button } from "@/components/ui/Button";

export function Onboarding() {
  const trackId = useTrackId();
  const track = getTrack(trackId)!;
  const content = trackContent(trackId);
  const createPlayer = useGameStore((s) => s.createPlayer);
  const touchStreak = useGameStore((s) => s.touchStreak);
  const [name, setName] = useState("");

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="eyebrow rise">Anthropic · {track.title}</p>
      <h1 className="display rise mt-5 text-[clamp(2.6rem,9vw,4.5rem)]" style={{ animationDelay: "60ms" }}>
        Перед вами —<br />
        <span className="text-coral">п’ять світів</span> екзамену.
      </h1>
      <p
        className="rise mt-6 max-w-xl text-parchment-dim"
        style={{ animationDelay: "120ms" }}
      >
        {content.levels.length} рівнів, {content.questions.length} питань і довідник, що
        відкривається по мірі проходження. Кожен світ — це домен екзамену, кожен бій — питання
        того ж типу, що на екзамені {track.code}. Прогрес зберігається у вашому браузері.
      </p>

      <form
        className="rise mt-12 panel hatch p-6 sm:p-8"
        style={{ animationDelay: "180ms" }}
        onSubmit={(e) => {
          e.preventDefault();
          createPlayer(name);
          touchStreak();
        }}
      >
        <label className="eyebrow block" htmlFor="player-name">
          Як вас звати, {track.playerVocative}?
        </label>
        <input
          id="player-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          autoComplete="off"
          placeholder="Ім’я"
          className="mono mt-3 w-full border-b border-hairline-bright bg-transparent pb-2 text-2xl text-parchment outline-none transition-colors placeholder:text-hairline-bright focus:border-coral"
        />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button type="submit" variant="primary">
            Почати шлях →
          </Button>
          <span className="mono text-[0.7rem] text-muted">
            Стартовий титул: Intern
          </span>
        </div>
      </form>
    </div>
  );
}
