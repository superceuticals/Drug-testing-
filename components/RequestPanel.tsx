"use client";

import { useEffect, useRef } from "react";
import { Loader2, X, RefreshCw } from "lucide-react";
import { TAB_META, type ApiTab } from "@/constants/tabs";
import { QUICK_FILLS } from "@/constants/quickFills";
import type { TabState } from "@/types";

const DISEASE_OPTIONS = ["Diabetes", "Hypertension", "PCOS", "Cancer", "Anemia", "Thyroid"];
const DEBOUNCE_MS = 400;

interface RequestPanelProps {
  tab: ApiTab;
  state: TabState;
  onQueryChange: (value: string) => void;
  onDiseaseChange: (value: string) => void;
  onDoctorIdChange: (value: string) => void;
  onForceChange: (value: boolean) => void;
  onSend: () => void;
  onQuickFill: (value: string) => void;
}

export function RequestPanel({
  tab,
  state,
  onQueryChange,
  onDiseaseChange,
  onDoctorIdChange,
  onForceChange,
  onSend,
  onQuickFill,
}: RequestPanelProps) {
  const meta = TAB_META[tab];
  const quickFills = QUICK_FILLS[tab];

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressRef = useRef(false);
  const diseaseMounted = useRef(false);
  const doctorIdMounted = useRef(false);
  const forceMounted = useRef(false);

  // Auto-search with debounce when query changes
  useEffect(() => {
    if (!meta.hasQuery || !state.query.trim()) return;
    if (suppressRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSend(), DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state.query]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fire immediately when disease changes (diet tab)
  useEffect(() => {
    if (!diseaseMounted.current) { diseaseMounted.current = true; return; }
    if (tab !== "diet" || !state.query.trim()) return;
    onSend();
  }, [state.disease]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fire with debounce when DoctorID changes (drug tab)
  useEffect(() => {
    if (!doctorIdMounted.current) { doctorIdMounted.current = true; return; }
    if (tab !== "drug" || !state.query.trim()) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSend(), DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state.doctorId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fire immediately when force toggles (drug tab)
  useEffect(() => {
    if (!forceMounted.current) { forceMounted.current = true; return; }
    if (tab !== "drug" || !state.query.trim()) return;
    onSend();
  }, [state.force]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleQuickFill = (fill: string) => {
    suppressRef.current = true;
    onQuickFill(fill);
    setTimeout(() => { suppressRef.current = false; }, DEBOUNCE_MS + 50);
  };

  return (
    <div className="space-y-4">
      {/* API Info */}
      <div className={`p-4 rounded-lg border ${meta.accentBg} ${meta.accentBorder}`}>
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

      {/* Query input with debounce */}
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
                placeholder={meta.placeholder}
                className="w-full px-3 py-2 pr-8 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              />
              {state.loading ? (
                <Loader2
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-400 animate-spin pointer-events-none"
                />
              ) : state.query ? (
                <button
                  onClick={() => onQueryChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>
          </div>

          {/* Diet: disease context */}
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
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {/* Drug: DoctorID + force */}
          {tab === "drug" && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Doctor ID</label>
                <input
                  type="text"
                  value={state.doctorId}
                  onChange={(e) => onDoctorIdChange(e.target.value)}
                  placeholder="e.g. DC26C000001"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => onForceChange(!state.force)}
                  className={`relative w-8 h-4.5 rounded-full transition-colors ${
                    state.force ? "bg-orange-500" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                      state.force ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-zinc-700">
                  Force refresh
                  <span className="ml-1.5 text-xs font-normal text-zinc-400">
                    (force={String(state.force)})
                  </span>
                </span>
              </label>
            </>
          )}
        </div>
      )}

      {/* Fetch button for no-query tabs (advice-templates) */}
      {!meta.hasQuery && (
        <button
          onClick={onSend}
          disabled={state.loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
        >
          {state.loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <RefreshCw size={13} />
          )}
          {state.loading ? "Loading…" : "Load Templates"}
        </button>
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
                onClick={() => handleQuickFill(fill)}
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
