export function HeartBar({ hearts, max }: { hearts: number; max: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${hearts} з ${max} сердець`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`text-sm leading-none transition-all duration-300 ${
            i < hearts ? "text-crimson" : "scale-90 text-hairline-bright"
          }`}
        >
          {i < hearts ? "◆" : "◇"}
        </span>
      ))}
    </div>
  );
}
