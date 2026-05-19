"use client";

import { Send, Loader2, X } from "lucide-react";
import { TAB_META, type ApiTab } from "@/constants/tabs";
import { QUICK_FILLS } from "@/constants/quickFills";
import { buildUrl } from "@/lib/api";
import type { TabState } from "@/types";
import { ParamRow } from "./ParamRow";

const DISEASE_OPTIONS = ["Diabetes", "Hypertension", "PCOS", "Cancer", "Anemia", "Thyroid"];

interface RequestPanelProps {
  tab: ApiTab;
  state: TabState;
  baseUrl: string;
  onQueryChange: (value: string) => void;
  onDiseaseChange: (value: string) => void;
  onSend: () => void;
  onQuickFill: (value: string) => void;
}

export function RequestPanel({
  tab,
  state,
  baseUrl,
  onQueryChange,
  onDiseaseChange,
  onSend,
  onQuickFill,
}: RequestPanelProps) {
  const meta = TAB_META[tab];
  const quickFills = QUICK_FILLS[tab];
  const Icon = meta.icon;

  const previewParams: Record<string, string> = {};
  if (meta.hasQuery && state.query) previewParams.q = state.query;
  if (tab === "diet" && state.disease) previewParams.disease = state.disease;
  const previewUrl = buildUrl(baseUrl, meta.endpoint, previewParams);

  return (
    <div className="space-y-4">
      {/* API Info */}
      <div
        className={`p-4 rounded-lg border ${meta.accentBg} ${meta.accentBorder}`}
      >
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded">
            GET
          </span>
          <code
            className={`text-xs ${meta.accentText} break-all`}
            style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
          >
            {meta.endpoint}
          </code>
        </div>
        <p className="text-xs text-zinc-600">{meta.description}</p>
      </div>

      {/* Query Form */}
      {meta.hasQuery && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">
              Search Query <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={state.query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !state.loading && onSend()}
                placeholder={meta.placeholder}
                className="w-full px-3 py-2 pr-8 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              />
              {state.query && (
                <button
                  onClick={() => onQueryChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {tab === "diet" && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700">Disease Context</label>
              <select
                value={state.disease}
                onChange={(e) => onDiseaseChange(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">None</option>
                {DISEASE_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* URL Preview */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Request Preview
        </label>
        <div className="px-3 py-2.5 bg-zinc-100 rounded-lg">
          <code
            className="text-xs text-zinc-600 break-all"
            style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
          >
            <span className="text-green-600 font-bold">GET</span> {previewUrl}
          </code>
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={onSend}
        disabled={state.loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {state.loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send size={16} /> Send Request
          </>
        )}
      </button>

      {/* Parameters Table */}
      {meta.params.length > 0 && (
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Parameters
          </label>
          <div className="border border-zinc-200 rounded-lg divide-y divide-zinc-100 overflow-hidden bg-white">
            {meta.params.map((param) => (
              <ParamRow
                key={param.name}
                name={param.name}
                type={param.type}
                required={param.required}
                description={param.description}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Fill */}
      {quickFills.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Quick Fill
          </label>
          <div className="flex flex-wrap gap-2">
            {quickFills.map((fill) => (
              <button
                key={fill}
                onClick={() => onQuickFill(fill)}
                className="px-3 py-1 text-xs bg-zinc-100 text-zinc-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors border border-zinc-200 hover:border-blue-200"
              >
                {fill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
