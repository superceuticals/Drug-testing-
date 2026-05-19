import { syntaxHighlight } from "@/lib/highlight";

interface JsonViewerProps {
  data: unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const json = JSON.stringify(data, null, 2);
  const highlighted = syntaxHighlight(json);

  return (
    <pre
      className="text-xs leading-relaxed p-4 rounded-lg  bg-zinc-950 text-zinc-100 overflow-auto"
      style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
