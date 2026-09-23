import { trackContent } from "@/content";
import { getTrack, isTrackId } from "@/content/tracks";
import { listCodexEntries } from "@/lib/content/codex.server";
import { CodexIndex } from "@/components/codex/CodexIndex";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[track]/codex">) {
  const { track } = await params;
  return { title: `Codex — довідник ${getTrack(track)?.code ?? "CCA-F"} Quest` };
}

export default async function CodexPage({ params }: PageProps<"/[track]/codex">) {
  const { track } = await params;
  if (!isTrackId(track)) notFound();
  const entries = listCodexEntries(track);
  return (
    <CodexIndex
      entries={entries.map(({ slug, domainId, title, summary }) => ({
        slug,
        domainId,
        title,
        summary,
      }))}
      domains={trackContent(track).domains}
    />
  );
}
