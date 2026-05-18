interface ParamRowProps {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export function ParamRow({ name, type, required, description }: ParamRowProps) {
  return (
    <div className="flex items-start gap-3 px-3 py-2.5 text-xs">
      <span
        className="text-zinc-800 w-20 shrink-0"
        style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
      >
        {name}
      </span>
      <span className="text-zinc-400 w-14 shrink-0">{type}</span>
      <span className={`w-16 shrink-0 ${required ? "text-red-500" : "text-zinc-400"}`}>
        {required ? "required" : "optional"}
      </span>
      <span className="text-zinc-500">{description}</span>
    </div>
  );
}
