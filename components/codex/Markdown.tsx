import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/** Посилання виду [[slug]] у тексті статей ведуть на інші статті довідника. */
function linkifyWikiRefs(source: string, base: string): string {
  return source.replace(/\[\[([a-z0-9-]+)\]\]/g, (_, slug) => `[${slug}](${base}/codex/${slug})`);
}

/** `base` — префікс тренажера (`/architect`, `/developer`), у якому живе стаття. */
export function Markdown({ source, base }: { source: string; base: string }) {
  return (
    <div className="prose-codex">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          table: ({ children }) => (
            <div className="table-scroll">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {linkifyWikiRefs(source, base)}
      </ReactMarkdown>
    </div>
  );
}
