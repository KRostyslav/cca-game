export function Meter({
  value,
  max = 1,
  color = "var(--coral)",
  height = 4,
}: {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max)) * 100;
  return (
    <div
      className="w-full overflow-hidden border border-hairline bg-void"
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
