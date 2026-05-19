"use client";

import { useState } from "react";
import type { ApiTab } from "@/constants/tabs";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DrugItem {
  name: string;
  composition: string;
  form: string;
  strengthLine: string;
  inn: string;
  drugClass: string;
}

interface AdviceCategory {
  categoryId: string;
  category: string;
  items: string[];
  emergency: string[];
}

// ── Parsers ───────────────────────────────────────────────────────────────────

function getLabelsSuggestions(data: unknown): string[] {
  if (!data || typeof data !== "object") return [];
  const arr = (data as Record<string, unknown>).data;
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of arr) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    const add = (v: unknown) => {
      if (typeof v === "string" && v && !seen.has(v)) { seen.add(v); result.push(v); }
    };
    add(item.name);
    if (Array.isArray(item.aliases)) item.aliases.forEach(add);
  }
  return result;
}

function getDrugItems(data: unknown): DrugItem[] {
  if (!data || typeof data !== "object") return [];
  const arr = (data as Record<string, unknown>).data;
  if (!Array.isArray(arr)) return [];
  return arr.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const name = String(item.prodName ?? item.genericName ?? item.name ?? item.medicine ?? item.DrugID ?? "");
    const rawComp = item.composition ?? item.contains;
    const composition = Array.isArray(rawComp)
      ? (rawComp as unknown[]).filter(Boolean).map(String).join(", ")
      : String(rawComp ?? "").trim();
    const form = String(item.Form ?? item.form ?? "").trim();
    const strengths = Array.isArray(item.strengths) ? item.strengths : [];
    const vals = (strengths as Record<string, unknown>[])
      .map((s) => String(s?.valueRaw ?? s?.value ?? ""))
      .filter(Boolean);
    const unit = String(item.strengthUnit ?? "").trim();
    const strengthLine = vals.length ? `${vals.join(", ")} ${unit}`.trim() : "";
    const inn = String(item.inn_name ?? item.innName ?? item.inn ?? "");
    const drugClass = String(item.drugClass ?? "");
    return [{ name, composition, form, strengthLine, inn, drugClass }];
  });
}

function getDietItems(data: unknown): string[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  const arr = Array.isArray(d.data) ? d.data : Array.isArray(d.items) ? d.items : Array.isArray(d.results) ? d.results : [];
  return (arr as unknown[])
    .map((i) => {
      if (typeof i === "string") return i;
      if (i && typeof i === "object") {
        const o = i as Record<string, unknown>;
        return String(o.name ?? o.item ?? "");
      }
      return "";
    })
    .filter(Boolean);
}

function getAdviceTemplates(data: unknown): AdviceCategory[] {
  if (!data || typeof data !== "object") return [];
  const arr = (data as Record<string, unknown>).data;
  if (!Array.isArray(arr)) return [];
  return arr.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    return [{
      categoryId: String(item.categoryId ?? ""),
      category: String(item.category ?? ""),
      items: Array.isArray(item.items) ? (item.items as unknown[]).map(String) : [],
      emergency: Array.isArray(item.emergency) ? (item.emergency as unknown[]).map(String) : [],
    }];
  });
}

interface LabOrderMeta {
  tests: string[];
  count: number;
  query: string;
  mode: string;
}

function getLabOrderMeta(data: unknown): LabOrderMeta {
  const empty: LabOrderMeta = { tests: [], count: 0, query: "", mode: "" };
  if (!data || typeof data !== "object") return empty;
  const d = data as Record<string, unknown>;
  const tests = Array.isArray(d.mergedAndSortedArray)
    ? (d.mergedAndSortedArray as unknown[]).filter((v) => typeof v === "string").map(String)
    : [];
  return {
    tests,
    count: typeof d.count === "number" ? d.count : tests.length,
    query: String(d.query ?? ""),
    mode: String(d.mode ?? ""),
  };
}

function getAdviceSearch(data: unknown): { categories: AdviceCategory[]; items: Array<{ text: string; categoryName: string; isEmergency: boolean }> } {
  const empty = { categories: [], items: [] };
  if (!data || typeof data !== "object") return empty;
  const nested = (data as Record<string, unknown>).data;
  if (!nested || typeof nested !== "object") return empty;
  const nd = nested as Record<string, unknown>;
  const categories: AdviceCategory[] = Array.isArray(nd.categories)
    ? (nd.categories as Record<string, unknown>[]).map((c) => ({
        categoryId: String(c.categoryId ?? ""),
        category: String(c.category ?? ""),
        items: Array.isArray(c.items) ? (c.items as unknown[]).map(String) : [],
        emergency: Array.isArray(c.emergency) ? (c.emergency as unknown[]).map(String) : [],
      }))
    : [];
  const items = Array.isArray(nd.items)
    ? (nd.items as Record<string, unknown>[]).map((i) => ({
        text: String(i.text ?? ""),
        categoryName: String(i.categoryName ?? ""),
        isEmergency: !!i.isEmergency,
      }))
    : [];
  return { categories, items };
}

// ── Shared UI primitives ──────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
      {children}
    </p>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return <p className="text-xs text-zinc-400 italic">{msg}</p>;
}

function TagBadge({ label, variant = "default" }: { label: string; variant?: "default" | "emergency" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
        variant === "emergency"
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-zinc-100 text-zinc-700 border-zinc-200"
      }`}
    >
      {variant === "emergency" && <span>⚠</span>}
      {label}
      <span className="text-zinc-400 ml-0.5">✕</span>
    </span>
  );
}

function PillBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded border border-zinc-200">
      {children}
    </span>
  );
}

function AdviceChip({ label, state = "unselected" }: { label: string; state?: "unselected" | "partial" | "full" }) {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full border font-medium ${
        state === "full"
          ? "bg-green-50 text-green-700 border-green-300"
          : state === "partial"
          ? "bg-blue-50 text-blue-700 border-blue-300"
          : "bg-white text-zinc-600 border-zinc-300"
      }`}
    >
      {label}
    </span>
  );
}

function ShowMoreButton({ count, expanded, onToggle }: { count: number; expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-zinc-500 hover:text-blue-600 border border-zinc-200 hover:border-blue-200 rounded-lg bg-zinc-50 hover:bg-blue-50 transition-colors"
    >
      {expanded ? (
        <><span>▲</span> Show less</>
      ) : (
        <><span>▼</span> Show {count} more</>
      )}
    </button>
  );
}

// function StoredArrayPreview({ items }: { items: string[] }) {
//   return (
//     <div>
//       <SectionTitle>Final stored string[ ]</SectionTitle>
//       <pre
//         className="text-xs text-zinc-300 p-3 bg-zinc-950 rounded-lg overflow-auto max-h-40"
//         style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
//       >
//         {JSON.stringify(items, null, 2)}
//       </pre>
//     </div>
//   );
// }

// ── Dropdown list shared for diagnosis / complaint / diet ─────────────────────

function SuggestionDropdownList({ labels, maxShow = 8 }: { labels: string[]; maxShow?: number }) {
  const [expanded, setExpanded] = useState(false);
  if (!labels.length) return <EmptyState msg="No suggestion labels extracted from response" />;
  const shown = expanded ? labels : labels.slice(0, maxShow);
  const rest = labels.length - maxShow;
  return (
    <div className="space-y-2">
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white divide-y divide-zinc-100">
        {shown.map((label, i) => (
          <div key={i} className="px-3 py-2 text-sm text-zinc-700">
            {label}
          </div>
        ))}
      </div>
      {rest > 0 && (
        <ShowMoreButton count={rest} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      )}
    </div>
  );
}

// ── Tab views ─────────────────────────────────────────────────────────────────

function DiagnosisView({ data }: { data: unknown }) {
  const labels = getLabelsSuggestions(data);
  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>
          Suggestion dropdown — name + aliases flattened &amp; deduplicated ({labels.length} total · max 8 shown)
        </SectionTitle>
        <SuggestionDropdownList labels={labels} />
      </div>

      {labels.length > 0 && (
        <div>
          <SectionTitle>Selected tag badges preview</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {labels.slice(0, 4).map((label, i) => (
              <TagBadge key={i} label={label} />
            ))}
          </div>
        </div>
      )}

      {/* <StoredArrayPreview items={labels.slice(0, 5)} /> */}
    </div>
  );
}

function ComplaintView({ data }: { data: unknown }) {
  const [tableExpanded, setTableExpanded] = useState(false);
  const labels = getLabelsSuggestions(data);
  const tablePageSize = 4;
  const tableShown = tableExpanded ? labels : labels.slice(0, tablePageSize);
  const tableRest = labels.length - tablePageSize;

  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>
          Suggestion dropdown — name + aliases flattened &amp; deduplicated ({labels.length} total · max 8 shown)
        </SectionTitle>
        <SuggestionDropdownList labels={labels} />
      </div>

      {/* {labels.length > 0 && (
        <div className="space-y-2">
          <SectionTitle>Table row preview (complaint from API · severity &amp; duration = user input)</SectionTitle>
          <div className="border border-zinc-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left px-3 py-2 text-zinc-500 font-medium">Complaint</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-medium">Severity</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {tableShown.map((label, i) => (
                  <tr key={i} className="border-t border-zinc-100">
                    <td className="px-3 py-2 text-zinc-800 font-medium">{label}</td>
                    <td className="px-3 py-2 text-zinc-300 italic">user input</td>
                    <td className="px-3 py-2 text-zinc-300 italic">user input</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tableRest > 0 && (
            <ShowMoreButton count={tableRest} expanded={tableExpanded} onToggle={() => setTableExpanded((v) => !v)} />
          )}
        </div>
      )} */}

      {/* <StoredArrayPreview items={labels.slice(0, 5)} /> */}
    </div>
  );
}

function DrugView({ data }: { data: unknown }) {
  const [expanded, setExpanded] = useState(false);
  const items = getDrugItems(data);
  if (!items.length) return <EmptyState msg="No drug items extracted from response" />;
  const pageSize = 6;
  const shown = expanded ? items : items.slice(0, pageSize);
  const rest = items.length - pageSize;

  return (
    <div className="space-y-3">
      <SectionTitle>Drug table rows ({items.length} items · dosage/when/duration = user input)</SectionTitle>
      <div className="space-y-2">
        {shown.map((item, i) => (
          <div key={i} className="border border-zinc-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2.5 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {item.name || <span className="text-zinc-300 italic">no name</span>}
                  </p>
                  {item.composition && (
                    <p className="text-xs text-zinc-400 truncate">{item.composition}</p>
                  )}
                </div>
                {/* <div className="text-right text-xs text-zinc-300 italic shrink-0 space-y-0.5">
                  <p>1-0-1</p>
                  <p>After Food</p>
                  <p>5 Days</p>
                </div> */}
              </div>
              {(item.form || item.strengthLine || item.inn || item.drugClass) && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.form && <PillBadge>Form: {item.form}</PillBadge>}
                  {item.strengthLine && <PillBadge>Strength: {item.strengthLine}</PillBadge>}
                  {item.inn && <PillBadge>INN: {item.inn}</PillBadge>}
                  {item.drugClass && <PillBadge>Class: {item.drugClass}</PillBadge>}
                </div>
              )}
            </div>
            {/* <div className="px-3 py-1.5 bg-zinc-50 border-t border-zinc-100">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-0.5">Dropdown item</p>
              <p className="text-xs font-medium text-zinc-700">{item.name}</p>
              {item.form && (
                <p className="text-xs text-zinc-500">{item.form}</p>
              )}
              {item.composition && (
                <p className="text-xs text-zinc-400">{item.composition}</p>
              )}
            </div> */}
          </div>
        ))}
        {rest > 0 && (
          <ShowMoreButton count={rest} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        )}
      </div>
    </div>
  );
}

function DietView({ data }: { data: unknown }) {
  const items = getDietItems(data);
  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>Food item dropdown ({items.length} items · only name shown)</SectionTitle>
        {items.length === 0
          ? <EmptyState msg="No food items extracted from response" />
          : (
            <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white divide-y divide-zinc-100">
              {items.map((name, i) => (
                <div key={i} className="px-3 py-2 text-sm text-zinc-700">{name}</div>
              ))}
            </div>
          )
        }
      </div>
      {/* {items.length > 0 && <StoredArrayPreview items={items} />} */}
    </div>
  );
}

function AdviceTemplatesView({ data }: { data: unknown }) {
  const cats = getAdviceTemplates(data);
  if (!cats.length) return <EmptyState msg="No advice categories extracted from response" />;

  const totalItems = cats.reduce((n, c) => n + c.items.length + c.emergency.length, 0);

  return (
    <div className="space-y-4">
      {/* Category chips */}
      <div>
        <SectionTitle>Category chips ({cats.length})</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {cats.map((cat, i) => (
            <AdviceChip
              key={cat.categoryId || i}
              label={cat.category}
              state={i === 0 ? "full" : i === 1 ? "partial" : "unselected"}
            />
          ))}
        </div>
        <p className="text-[10px] text-zinc-400 mt-1.5">
          Green = all selected · Blue = partial · White = none selected
        </p>
      </div>

      {/* Full item dropdown list grouped by category */}
      <div>
        <SectionTitle>All advice items ({totalItems} total)</SectionTitle>
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white divide-y divide-zinc-100">
          {cats.map((cat, ci) => (
            <div key={cat.categoryId || ci}>
              <div className="px-3 py-1.5 bg-zinc-50 border-b border-zinc-100">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
                  {cat.category}
                </p>
              </div>
              {cat.items.map((text, ii) => (
                <div key={`i-${ci}-${ii}`} className="px-3 py-2 text-sm text-zinc-700">
                  {text}
                </div>
              ))}
              {cat.emergency.map((text, ei) => (
                <div key={`e-${ci}-${ei}`} className="px-3 py-2 text-sm text-red-600 flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">⚠</span>
                  {text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdviceSearchView({ data }: { data: unknown }) {
  const { categories, items } = getAdviceSearch(data);

  if (!categories.length && !items.length) {
    return <EmptyState msg="No advice data extracted from response" />;
  }

  const storedSample = items
    .slice(0, 5)
    .map((i) => (i.isEmergency ? `Emergency: ${i.text}` : i.text));

  return (
    <div className="space-y-4">
      {categories.length > 0 && (
        <div>
          <SectionTitle>Categories ({categories.length})</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <AdviceChip key={cat.categoryId || i} label={cat.category} />
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div>
          <SectionTitle>Advice items ({items.length})</SectionTitle>
          <div className="border border-zinc-200 rounded-lg overflow-hidden divide-y divide-zinc-100 bg-white">
            {items.map((item, i) => (
              <div key={i} className="px-3 py-2">
                <p className="text-[10px] text-zinc-400 mb-0.5">{item.categoryName}</p>
                <p className="text-sm text-zinc-700">
                  {item.isEmergency && <span className="mr-1 text-red-500">⚠</span>}
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <StoredArrayPreview items={storedSample} /> */}
    </div>
  );
}

function LabOrderView({ data }: { data: unknown }) {
  const [expanded, setExpanded] = useState(false);
  const { tests, count, query, mode } = getLabOrderMeta(data);
  if (!tests.length) return <EmptyState msg="No lab tests extracted from response" />;
  const pageSize = 8;
  const shown = expanded ? tests : tests.slice(0, pageSize);
  const rest = tests.length - pageSize;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <SectionTitle>
          Suggestion dropdown — mergedAndSortedArray ({count} total · max {pageSize} shown)
        </SectionTitle>
        <div className="flex gap-1.5 mb-2">
          {query && <PillBadge>query: {query}</PillBadge>}
          {mode && <PillBadge>mode: {mode}</PillBadge>}
        </div>
      </div>
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white divide-y divide-zinc-100">
        {shown.map((test, i) => (
          <div key={i} className="px-3 py-2 text-sm text-zinc-700">
            {test}
          </div>
        ))}
      </div>
      {rest > 0 && (
        <ShowMoreButton count={rest} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface ParsedPreviewProps {
  tab: ApiTab;
  data: unknown;
}

export function ParsedPreview({ tab, data }: ParsedPreviewProps) {
  switch (tab) {
    case "diagnosis":
      return <DiagnosisView data={data} />;
    case "complaint":
      return <ComplaintView data={data} />;
    case "drug":
      return <DrugView data={data} />;
    case "diet":
      return <DietView data={data} />;
    case "advice-templates":
      return <AdviceTemplatesView data={data} />;
    case "advice-search":
      return <AdviceSearchView data={data} />;
    case "lab-order":
      return <LabOrderView data={data} />;
    default:
      return null;
  }
}
