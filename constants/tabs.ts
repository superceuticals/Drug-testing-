import {
  Stethoscope,
  MessageSquare,
  Pill,
  Apple,
  BookOpen,
  Search,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

export type ApiTab =
  | "diagnosis"
  | "complaint"
  | "drug"
  | "diet"
  | "advice-templates"
  | "advice-search"
  | "lab-order";

export interface TabParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface TabMeta {
  label: string;
  icon: LucideIcon;
  endpoint: string;
  method: "GET";
  description: string;
  hasQuery: boolean;
  placeholder?: string;
  colorClass: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  params: TabParam[];
}

export const TAB_META: Record<ApiTab, TabMeta> = {
  diagnosis: {
    label: "Diagnosis",
    icon: Stethoscope,
    endpoint: "/diagnosisSuggestion/search",
    method: "GET",
    description:
      "Search for diagnosis suggestions by keyword. Returns matching diagnoses with IDs, names, categories, and aliases.",
    hasQuery: true,
    placeholder: "e.g. fever, diabetes, hypertension, dengue",
    colorClass: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200",
    accentText: "text-blue-700",
    params: [
      { name: "q", type: "string", required: true, description: "Search keyword for diagnosis lookup" },
    ],
  },
  complaint: {
    label: "Chief Complaint",
    icon: MessageSquare,
    endpoint: "/chiefComplaintSuggestion/search",
    method: "GET",
    description:
      "Search for chief complaint suggestions. Returns complaints with IDs, names, categories, and aliases.",
    hasQuery: true,
    placeholder: "e.g. headache, chest pain, cough, fatigue",
    colorClass: "text-sky-500",
    accentBg: "bg-sky-50",
    accentBorder: "border-sky-200",
    accentText: "text-sky-700",
    params: [
      { name: "q", type: "string", required: true, description: "Search keyword for chief complaint lookup" },
    ],
  },
  drug: {
    label: "Drug / Medicine",
    icon: Pill,
    endpoint: "/drugSuggestion/new-search-global",
    method: "GET",
    description:
      "Search drugs by product or generic name. Pass DoctorID for a personalised formulary. Field names vary: prodName, genericName, name.",
    hasQuery: true,
    placeholder: "e.g. paracetamol, metformin, amoxicillin, combi",
    colorClass: "text-orange-500",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-200",
    accentText: "text-orange-700",
    params: [
      { name: "q", type: "string", required: true, description: "Drug product name or generic name" },
      { name: "DoctorID", type: "string", required: false, description: "Doctor ID for personalised drug list (e.g. DC26C000001)" },
      { name: "force", type: "boolean", required: false, description: "Force cache refresh — default false" },
    ],
  },
  diet: {
    label: "Diet Chart",
    icon: Apple,
    endpoint: "/dietSuggestion/search",
    method: "GET",
    description:
      "Search food items. Add disease context to rank disease-specific foods higher. Returns max 8 deduplicated results.",
    hasQuery: true,
    placeholder: "e.g. warm water, salad, rice, fruit, nuts",
    colorClass: "text-pink-500",
    accentBg: "bg-pink-50",
    accentBorder: "border-pink-200",
    accentText: "text-pink-700",
    params: [
      { name: "q", type: "string", required: true, description: "Food item search keyword" },
      {
        name: "disease",
        type: "string",
        required: false,
        description: "Context: Diabetes, Hypertension, PCOS, Cancer, Anemia, Thyroid",
      },
    ],
  },
  "advice-templates": {
    label: "Advice Templates",
    icon: BookOpen,
    endpoint: "/advice/templates",
    method: "GET",
    description:
      "Fetch all advice templates grouped by category. No query params needed. Returns the full template library.",
    hasQuery: false,
    placeholder: undefined,
    colorClass: "text-cyan-500",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    accentText: "text-cyan-700",
    params: [],
  },
  "advice-search": {
    label: "Advice Search",
    icon: Search,
    endpoint: "/advice/search",
    method: "GET",
    description:
      "Search advice items across all categories. Returns matched items with category context and emergency flag.",
    hasQuery: true,
    placeholder: "e.g. exercise, diet, rest, water, sleep",
    colorClass: "text-yellow-500",
    accentBg: "bg-yellow-50",
    accentBorder: "border-yellow-200",
    accentText: "text-yellow-700",
    params: [
      { name: "q", type: "string", required: true, description: "Search keyword for advice items" },
    ],
  },
  "lab-order": {
    label: "Lab Order",
    icon: FlaskConical,
    endpoint: "/labTestSuggestion/getNew",
    method: "GET",
    description:
      "Search lab tests by name or abbreviation. Query is passed as a path segment: /labTestSuggestion/getNew/{query}.",
    hasQuery: true,
    placeholder: "e.g. CBC, HbA1c, lipid, urine routine, thyroid",
    colorClass: "text-violet-500",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200",
    accentText: "text-violet-700",
    params: [
      { name: "query", type: "string (path)", required: true, description: "Lab test name or abbreviation — appended as a URL path segment" },
    ],
  },
};

export const ALL_TABS: ApiTab[] = [
  "diagnosis",
  "complaint",
  "drug",
  "diet",
  // "advice-templates",
  "advice-search",
  "lab-order",
];
