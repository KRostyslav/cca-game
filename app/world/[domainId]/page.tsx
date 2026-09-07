import { notFound } from "next/navigation";
import { allDomains, getDomain } from "@/content";
import { WorldView } from "@/components/map/WorldView";

export function generateStaticParams() {
  return allDomains.map((d) => ({ domainId: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domainId: string }>;
}) {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  return { title: domain ? `${domain.titleUk} — CCA-F Quest` : "CCA-F Quest" };
}

export default async function WorldPage({
  params,
}: {
  params: Promise<{ domainId: string }>;
}) {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  if (!domain) notFound();
  return <WorldView domainId={domain.id} />;
}
