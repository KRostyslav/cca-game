import { notFound } from "next/navigation";
import { getDomain, trackContent } from "@/content";
import { getTrack, isTrackId } from "@/content/tracks";
import { WorldView } from "@/components/map/WorldView";

export function generateStaticParams({ params }: { params: { track: string } }) {
  if (!isTrackId(params.track)) return [];
  return trackContent(params.track).domains.map((d) => ({ domainId: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/[track]/world/[domainId]">) {
  const { track, domainId } = await params;
  const domain = getDomain(domainId);
  const code = getTrack(track)?.code ?? "CCA-F";
  return { title: domain ? `${domain.titleUk} — ${code} Quest` : `${code} Quest` };
}

export default async function WorldPage({ params }: PageProps<"/[track]/world/[domainId]">) {
  const { track, domainId } = await params;
  const domain = getDomain(domainId);
  // Світ чужого тренажера на цьому маршруті не показуємо.
  if (!domain || domain.track !== track) notFound();
  return <WorldView domainId={domain.id} />;
}
