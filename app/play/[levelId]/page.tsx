import { allLevels } from "@/content";
import { BattleScreen } from "@/components/game/BattleScreen";

export function generateStaticParams() {
  return allLevels.map((level) => ({ levelId: level.id }));
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  return <BattleScreen levelId={levelId} />;
}
