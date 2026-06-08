"use client";

import { Eye, EyeOff, Save, Check, AlertTriangle } from "lucide-react";

const PRESETS = {
  local: "http://localhost:2001",
  qa: "https://qa.sc.superceuticals.in",
  prod: "https://api.superceuticals.in",
};

interface ConfigPanelProps {
  baseUrl: string;
  token: string;
  tokenVisible: boolean;
  configSaved: boolean;
  onBaseUrlChange: (url: string) => void;
  onTokenChange: (token: string) => void;
  onToggleToken: () => void;
  onSave: () => void;
  onPreset: (preset: "local" | "qa" | "prod") => void;
}

export function ConfigPanel({
  baseUrl,
  token,
  tokenVisible,
  configSaved,
  onBaseUrlChange,
  onTokenChange,
  onToggleToken,
  onSave,
  onPreset,
}: ConfigPanelProps) {
  return (
    <div className="border-b border-zinc-200 bg-white px-4 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => onBaseUrlChange(e.target.value)}
                className="flex-1 text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50"
                style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
                placeholder="https://qa.sc.superceuticals.in"
              />
              <div className="flex gap-1">
                {(["local", "qa", "prod"] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onPreset(preset)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      baseUrl === PRESETS[preset]
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {preset.charAt(0).toUpperCase() + preset.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Token */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Bearer Token
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={tokenVisible ? "text" : "password"}
                  value={token}
                  onChange={(e) => onTokenChange(e.target.value)}
                  className="w-full text-sm px-3 py-2 pr-9 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50"
                  style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
                  placeholder="Auto-filled after login, or paste a JWT token…"
                />
                <button
                  onClick={onToggleToken}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {tokenVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button
                onClick={onSave}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors shrink-0 ${
                  configSaved
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {configSaved ? (
                  <>
                    <Check size={14} /> Saved
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CORS note */}
        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>
            <strong>CORS:</strong> If testing against a remote server, ensure the API allows
            requests from this origin. Use a local proxy or browser extension if needed.
          </span>
        </div>
      </div>
    </div>
  );
}
