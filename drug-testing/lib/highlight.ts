export function syntaxHighlight(json: string): string {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let color = "#fb923c"; // number (orange-400)
      if (/^"/.test(match)) {
        color = /:$/.test(match) ? "#60a5fa" : "#34d399"; // key=blue-400, string=emerald-400
      } else if (/true|false/.test(match)) {
        color = "#c084fc"; // boolean (purple-400)
      } else if (/null/.test(match)) {
        color = "#f87171"; // null (red-400)
      }
      return `<span style="color:${color}">${match}</span>`;
    }
  );
}
