export function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-lg" : "text-[0.7rem]";
  return (
    <span className={`${cls} tracking-[0.15em] leading-none`} aria-label={`${value} з 3 зірок`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= value ? "text-gold" : "text-hairline-bright"}>
          ★
        </span>
      ))}
    </span>
  );
}
