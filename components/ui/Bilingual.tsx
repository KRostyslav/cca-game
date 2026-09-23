"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

/** Фрагменти в бектиках (`max_tokens`) показуємо як inline-код, решту — як звичайний текст. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`\n]+`)/g);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        part.length > 2 && part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="inline-code">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * Показує англійський оригінал і український переклад згідно з режимом мови.
 * Англійська — основна: саме її формулювання буде на реальному екзамені.
 */
export function Bilingual({
  en,
  uk,
  inline = false,
  tone = "default",
  size = "body",
}: {
  en: string;
  uk: string;
  /** Для однорядкових підписів — обидві мови в один рядок через розділювач. */
  inline?: boolean;
  tone?: "default" | "muted";
  /** У заголовках переклад має бути помітно дрібнішим за оригінал. */
  size?: "body" | "heading";
}) {
  const hydrated = useHydrated();
  const language = useGameStore((s) => s.settings.language);
  // До гідратації показуємо обидві мови — це дефолт, тож розмітка збігається.
  const mode = hydrated ? language : "both";

  if (mode === "uk") return <Rich text={uk} />;
  if (mode === "en") return <Rich text={en} />;
  if (en === uk) return <Rich text={en} />;

  if (inline) {
    return (
      <>
        <Rich text={en} /> <span className="text-hairline-bright">·</span>{" "}
        <span className="opacity-70">
          <Rich text={uk} />
        </span>
      </>
    );
  }

  return (
    <>
      <span className="block">
        <Rich text={en} />
      </span>
      <span
        className={`block ${
          size === "heading"
            ? "mt-2.5 text-[0.62em] font-normal leading-normal tracking-normal"
            : "mt-1.5 text-[0.88em] leading-relaxed"
        } ${tone === "muted" ? "text-muted/80" : "text-parchment-dim/80"}`}
      >
        <Rich text={uk} />
      </span>
    </>
  );
}
