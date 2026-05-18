"use client";

import { DIET_TEMPLATES } from "@/constants/dietTemplates";

interface DietTemplateViewerProps {
  selected: string;
  onSelect: (disease: string) => void;
}

export function DietTemplateViewer({ selected, onSelect }: DietTemplateViewerProps) {
  const template = selected ? DIET_TEMPLATES[selected] : null;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-zinc-700">Local Disease Templates</p>
        <p className="text-xs text-zinc-400 mt-0.5">
          Predefined diet templates used in prescriptions — no API call needed
        </p>
      </div>

      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
      >
        <option value="">Select a disease template…</option>
        {Object.keys(DIET_TEMPLATES).map((disease) => (
          <option key={disease} value={disease}>
            {disease}
          </option>
        ))}
      </select>

      {template && (
        <div className="overflow-auto max-h-80 border border-zinc-200 rounded-lg p-4 space-y-4 bg-zinc-50">
          {template.sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-zinc-700 mb-1.5">{section.title}</p>
              <ul className="space-y-0.5">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs text-zinc-600 flex gap-2">
                    <span className="text-zinc-300 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold text-zinc-700 mb-1.5">Guidelines</p>
            <ul className="space-y-0.5">
              {template.guidelines.map((g, i) => (
                <li key={i} className="text-xs text-zinc-600 flex gap-2">
                  <span className="text-zinc-300 shrink-0">•</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
