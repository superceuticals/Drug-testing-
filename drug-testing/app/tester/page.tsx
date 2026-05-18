"use client";

import { useState, useEffect, useCallback } from "react";
import { Zap, Settings } from "lucide-react";
import { ConfigPanel } from "@/components/ConfigPanel";
import { RequestPanel } from "@/components/RequestPanel";
import { ResponsePanel } from "@/components/ResponsePanel";
import { DietTemplateViewer } from "@/components/DietTemplateViewer";
import { TAB_META, ALL_TABS, type ApiTab } from "@/constants/tabs";
import { type TabState, initialTabState } from "@/types";
import { callApi, buildUrl } from "@/lib/api";

const PRESETS = {
  local: "http://localhost:2001",
  qa: "https://qa.sc.superceuticals.in",
  prod: "https://api.superceuticals.in",
};

function makeInitialTabStates(): Record<ApiTab, TabState> {
  return Object.fromEntries(
    ALL_TABS.map((tab) => [tab, initialTabState()])
  ) as Record<ApiTab, TabState>;
}

export default function TesterPage() {
  const [baseUrl, setBaseUrl] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_API_URL ?? "http://localhost:2001"
  );
  const [token, setToken] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_TOKEN ?? ""
  );
  const [configOpen, setConfigOpen] = useState(false);
  const [tokenVisible, setTokenVisible] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  const [activeTab, setActiveTab] = useState<ApiTab>("diagnosis");
  const [tabStates, setTabStates] = useState<Record<ApiTab, TabState>>(makeInitialTabStates);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    const savedUrl = localStorage.getItem("sc_api_url");
    const savedToken = localStorage.getItem("sc_api_token");
    if (savedUrl) setBaseUrl(savedUrl);
    if (savedToken) setToken(savedToken);
  }, []);

  const handleSaveConfig = useCallback(() => {
    localStorage.setItem("sc_api_url", baseUrl.trim().replace(/\/$/, ""));
    localStorage.setItem("sc_api_token", token.trim());
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  }, [baseUrl, token]);

  const handlePreset = useCallback((preset: "local" | "qa" | "prod") => {
    setBaseUrl(PRESETS[preset]);
  }, []);

  const updateTabState = useCallback((tab: ApiTab, updates: Partial<TabState>) => {
    setTabStates((prev) => ({ ...prev, [tab]: { ...prev[tab], ...updates } }));
  }, []);

  const sendRequest = useCallback(
    async (tab: ApiTab, query: string, disease: string) => {
      const meta = TAB_META[tab];

      if (!token.trim()) {
        setConfigOpen(true);
        updateTabState(tab, {
          error: "No Bearer token — open Config and paste your JWT token.",
          loading: false,
        });
        return;
      }

      const params: Record<string, string> = {};
      if (meta.hasQuery && query) params.q = query;
      if (tab === "diet" && disease) params.disease = disease;

      const url = buildUrl(baseUrl, meta.endpoint, params);
      updateTabState(tab, { loading: true, error: null, response: undefined });

      const result = await callApi(url, token);
      updateTabState(tab, {
        loading: false,
        response: result.data,
        status: result.status,
        statusText: result.statusText,
        timing: result.timing,
        error: result.error,
      });
    },
    [token, baseUrl, updateTabState]
  );

  const handleSend = useCallback(
    (tab: ApiTab) => {
      const state = tabStates[tab];
      sendRequest(tab, state.query, state.disease);
    },
    [tabStates, sendRequest]
  );

  const handleQuickFill = useCallback(
    (tab: ApiTab, value: string) => {
      const disease = tabStates[tab].disease;
      updateTabState(tab, { query: value });
      sendRequest(tab, value, disease);
    },
    [tabStates, updateTabState, sendRequest]
  );

  const hasToken = !!token.trim();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-blue-600" />
          <span className="font-semibold text-zinc-900 text-sm">SC API Tester</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              hasToken ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${hasToken ? "bg-green-500" : "bg-zinc-400"}`}
            />
            {hasToken ? "Token set" : "No token"}
          </span>
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-600 font-medium"
          >
            <Settings size={13} /> Config {configOpen ? "▲" : "▾"}
          </button>
        </div>
      </header>

      {/* Config Panel */}
      {configOpen && (
        <ConfigPanel
          baseUrl={baseUrl}
          token={token}
          tokenVisible={tokenVisible}
          configSaved={configSaved}
          onBaseUrlChange={setBaseUrl}
          onTokenChange={setToken}
          onToggleToken={() => setTokenVisible((v) => !v)}
          onSave={handleSaveConfig}
          onPreset={handlePreset}
        />
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b border-zinc-200 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-none">
            {ALL_TABS.map((tab) => {
              const meta = TAB_META[tab];
              const Icon = meta.icon;
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? `border-blue-600 ${meta.colorClass}`
                      : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  <Icon size={14} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {ALL_TABS.map((tab) => (
            <div key={tab} className={tab === activeTab ? "block" : "hidden"}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left: Request Panel */}
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                  <RequestPanel
                    tab={tab}
                    state={tabStates[tab]}
                    baseUrl={baseUrl}
                    onQueryChange={(v) => updateTabState(tab, { query: v })}
                    onDiseaseChange={(v) => updateTabState(tab, { disease: v })}
                    onSend={() => handleSend(tab)}
                    onQuickFill={(v) => handleQuickFill(tab, v)}
                  />
                </div>

                {/* Right: Response Panel + Diet Templates */}
                <div className="space-y-5">
                  <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm min-h-[280px]">
                    <ResponsePanel
                      tab={tab}
                      state={tabStates[tab]}
                      onClear={() =>
                        updateTabState(tab, {
                          response: undefined,
                          status: null,
                          statusText: "",
                          timing: null,
                          error: null,
                        })
                      }
                    />
                  </div>

                  {tab === "diet" && (
                    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                      <DietTemplateViewer
                        selected={selectedTemplate}
                        onSelect={setSelectedTemplate}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
