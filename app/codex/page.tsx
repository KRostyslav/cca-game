import { allDomains } from "@/content";
import { listCodexEntries } from "@/lib/content/codex.server";
import { CodexIndex } from "@/components/codex/CodexIndex";

export const metadata = { title: "Codex — довідник CCA-F Quest" };

export default function CodexPage() {
  const entries = listCodexEntries();
  return (
    <CodexIndex
      entries={entries.map(({ slug, domainId, title, summary }) => ({
        slug,
        domainId,
        title,
        summary,
      }))}
      domains={allDomains}
    />
  );
}
