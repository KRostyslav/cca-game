import { notFound } from "next/navigation";
import { getDomain, getLevel, trackContent } from "@/content";
import { isTrackId } from "@/content/tracks";
import { BattleScreen } from "@/components/game/BattleScreen";

export function generateStaticParams({ params }: { params: { track: string } }) {
  if (!isTrackId(params.track)) return [];
  return trackContent(params.track).levels.map((level) => ({ levelId: level.id }));
}

export default async function PlayPage({ params }: PageProps<"/[track]/play/[levelId]">) {
  const { track, levelId } = await params;
  const level = getLevel(levelId);
  if (level && getDomain(level.domainId)?.track !== track) notFound();
  return <BattleScreen levelId={levelId} />;
}
