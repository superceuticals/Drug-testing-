import type { ApiTab } from "./tabs";

export const QUICK_FILLS: Record<ApiTab, string[]> = {
  diagnosis: ["fever", "diabetes", "hypertension", "dengue", "thyroid", "anemia", "PCOS"],
  complaint: ["headache", "chest pain", "cough", "fatigue", "nausea", "back pain", "shortness of breath"],
  drug: ["paracetamol", "metformin", "amoxicillin", "atorvastatin", "omeprazole", "amlodipine", "cetirizine"],
  diet: ["warm water", "salad", "fruit", "rice", "milk", "nuts", "oats"],
  "advice-templates": [],
  "advice-search": ["exercise", "diet", "rest", "water", "stress", "sleep", "medication"],
  "lab-order": ["CBC", "HbA1c", "lipid", "urine routine", "thyroid", "LFT", "KFT"],
};
