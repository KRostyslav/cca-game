import Link from "next/link";
import { notFound } from "next/navigation";
import { getDomain, trackContent } from "@/content";
import { isTrackId } from "@/content/tracks";
import { listCodexEntries, readCodexEntry } from "@/lib/content/codex.server";
import { CodexGate } from "@/components/codex/CodexGate";
import { Markdown } from "@/components/codex/Markdown";

export function generateStaticParams({ params }: { params: { track: string } }) {
  if (!isTrackId(params.track)) return [];
  return listCodexEntries(params.track).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[track]/codex/[slug]">) {
  const { track, slug } = await params;
  const entry = isTrackId(track) ? readCodexEntry(track, slug) : null;
  return { title: entry ? `${entry.title} — Codex` : "Codex" };
}

export default async function CodexEntryPage({ params }: PageProps<"/[track]/codex/[slug]">) {
  const { track, slug } = await params;
  if (!isTrackId(track)) notFound();
  const entry = readCodexEntry(track, slug);
  if (!entry) notFound();

  const domain = getDomain(entry.domainId);
  const level = trackContent(track).levels.find((l) => l.codexRef === slug);

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link href={`/${track}/codex`} className="mono text-[0.68rem] text-muted hover:text-parchment">
        ← Codex
      </Link>

      <header className="mt-6 border-b border-hairline pb-7">
        {domain && (
          <p className="eyebrow" style={{ color: domain.accent }}>
            {domain.icon} {domain.titleUk}
          </p>
        )}
        <h1 className="display mt-4 text-[clamp(1.9rem,5.5vw,2.8rem)]">{entry.title}</h1>
        <p className="mt-3 text-parchment-dim">{entry.summary}</p>
        {level && (
          <Link
            href={`/${track}/play/${level.id}`}
            className="mono mt-5 inline-block text-[0.68rem] uppercase tracking-[0.14em] text-coral hover:underline"
          >
            Рівень «{level.title}» →
          </Link>
        )}
      </header>

      <CodexGate slug={slug}>
        <div className="mt-8">
          <Markdown source={entry.body} base={`/${track}`} />
        </div>
      </CodexGate>
    </article>
  );
}
