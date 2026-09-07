"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";
import type { LanguageMode } from "@/lib/store/types";

const MODES: { id: LanguageMode; label: string; title: string }[] = [
  { id: "en", label: "EN", title: "Тільки англійська — як на справжньому екзамені" },
  { id: "both", label: "EN+UA", title: "Англійський оригінал і український переклад" },
  { id: "uk", label: "UA", title: "Тільки українська" },
];

export function LanguageToggle() {
  const hydrated = useHydrated();
  const language = useGameStore((s) => s.settings.language);
  const setSetting = useGameStore((s) => s.setSetting);
  const active = hydrated ? language : "both";

  return (
    <div className="flex border border-hairline" role="group" aria-label="Мова питань">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          title={mode.title}
          aria-pressed={active === mode.id}
          onClick={() => setSetting("language", mode.id)}
          className={`mono px-2 py-1 text-[0.6rem] uppercase tracking-[0.1em] transition-colors ${
            active === mode.id
              ? "bg-coral text-void"
              : "text-muted hover:text-parchment"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
