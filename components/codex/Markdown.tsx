import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/** Посилання виду [[slug]] у тексті статей ведуть на інші статті довідника. */
function linkifyWikiRefs(source: string): string {
  return source.replace(/\[\[([a-z0-9-]+)\]\]/g, (_, slug) => `[${slug}](/codex/${slug})`);
}

export function Markdown({ source }: { source: string }) {
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
        {linkifyWikiRefs(source)}
      </ReactMarkdown>
    </div>
  );
}
