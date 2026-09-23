import { notFound } from "next/navigation";
import { getTrack, trackIds } from "@/content/tracks";
import { TrackProvider } from "@/lib/store/TrackProvider";

/** Лише два тренажери — інші сегменти віддають 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return trackIds.map((track) => ({ track }));
}

export async function generateMetadata({ params }: LayoutProps<"/[track]">) {
  const { track } = await params;
  const def = getTrack(track);
  if (!def) return {};
  return {
    title: `${def.code} Quest — тренажер для ${def.title}`,
    description: `Ігровий тренажер підготовки до ${def.title}: світи, рівні, боси, довідник і симуляція екзамену.`,
  };
}

export default async function TrackLayout({ children, params }: LayoutProps<"/[track]">) {
  const { track } = await params;
  const def = getTrack(track);
  if (!def) notFound();
  return <TrackProvider track={def.id}>{children}</TrackProvider>;
}
