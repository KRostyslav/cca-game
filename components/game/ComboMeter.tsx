import { comboMultiplier } from "@/lib/game/xp";

export function ComboMeter({ streak }: { streak: number }) {
  const mult = comboMultiplier(streak);
  if (streak < 2) return <span className="mono text-[0.68rem] text-muted">комбо —</span>;
  return (
    <span
      className={`mono text-[0.68rem] transition-colors ${
        mult === 2 ? "text-coral" : mult === 1.5 ? "text-gold" : "text-parchment-dim"
      }`}
    >
      комбо ×{streak} {mult > 1 && `· XP ×${mult}`}
    </span>
  );
}
