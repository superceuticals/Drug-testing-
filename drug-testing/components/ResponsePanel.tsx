"use client";

import { Loader2, Copy, Trash2, AlertCircle, ArrowRight } from "lucide-react";
import type { ApiTab } from "@/constants/tabs";
import type { TabState } from "@/types";
import { JsonViewer } from "./JsonViewer";

function countResults(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (typeof d.count === "number") return d.count;
  if (Array.isArray(d.data)) return d.data.length;
  if (Array.isArray(d.medicines)) return d.medicines.length;
  if (Array.isArray(d.items)) return d.items.length;
  return null;
}

interface ResponsePanelProps {
  tab: ApiTab;
  state: TabState;
  onClear: () => void;
}

export function ResponsePanel({ tab, state, onClear }: ResponsePanelProps) {
  const { loading, response, status, statusText, timing, error } = state;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-56 gap-3">
        <Loader2 size={28} className="animate-spin text-blue-500" />
        <p className="text-sm text-zinc-400">Waiting for response…</p>
      </div>
    );
  }

  if (!error && response === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-56 gap-3">
        <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
          <ArrowRight size={22} className="text-zinc-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-400">Response will appear here</p>
          <p className="text-xs text-zinc-300 mt-1">Enter a query and send the request</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle size={15} className="text-red-500 shrink-0" />
          <span className="text-sm font-semibold text-red-700">ERROR</span>
          {timing !== null && (
            <span className="text-xs text-zinc-400 ml-auto">{timing}ms</span>
          )}
        </div>
        <code
          className="block text-xs text-red-600 break-all"
          style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
        >
          {error}
        </code>
        <div className="text-xs text-zinc-500 space-y-1 pt-1 border-t border-red-100">
          <p className="font-medium">Troubleshooting:</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Check Bearer token in Config</li>
            <li>Verify API server is running at the base URL</li>
            <li>Check browser console for CORS errors</li>
          </ul>
        </div>
      </div>
    );
  }

  const resultCount = countResults(response);
  const isSuccess = status !== null && status >= 200 && status < 300;

  return (
    <div className="space-y-3">
      {/* Status bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`px-2 py-0.5 text-xs font-bold rounded ${
            isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
          style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
        >
          {status} {statusText}
        </span>
        {timing !== null && (
          <span className="text-xs text-zinc-400">{timing}ms</span>
        )}
        {resultCount !== null && (
          <span className="text-xs text-zinc-400">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <Copy size={11} /> Copy
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <Trash2 size={11} /> Clear
          </button>
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="overflow-auto max-h-[420px] rounded-lg">
        <JsonViewer data={response} />
      </div>
    </div>
  );
}
