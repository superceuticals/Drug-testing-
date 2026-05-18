export interface DietSection {
  title: string;
  items: string[];
}

export interface DietTemplate {
  sections: DietSection[];
  guidelines: string[];
}

export const DIET_TEMPLATES: Record<string, DietTemplate> = {
  Diabetes: {
    sections: [
      {
        title: "Early Morning (6–7 AM)",
        items: [
          "Warm water with methi seeds (soaked overnight)",
          "5–6 soaked almonds",
          "1 walnut",
        ],
      },
      {
        title: "Breakfast (8–9 AM)",
        items: [
          "2 moong dal chilla with mint chutney",
          "1 bowl vegetable upma (less rice semolina)",
          "Green tea / herbal tea (no sugar)",
        ],
      },
      {
        title: "Mid-Morning (11 AM)",
        items: ["1 small fruit (guava, pear, or apple)", "Buttermilk (no sugar, low fat)"],
      },
      {
        title: "Lunch (1–2 PM)",
        items: [
          "2 multigrain/jowar roti",
          "1 bowl sabzi (non-starchy)",
          "1 bowl dal",
          "Small bowl low-fat curd",
          "Salad (cucumber, tomato, carrot)",
        ],
      },
      {
        title: "Evening Snack (4–5 PM)",
        items: ["Handful roasted chana", "Sprout salad", "Green tea"],
      },
      {
        title: "Dinner (7–8 PM)",
        items: ["2 roti (small)", "1 bowl sabzi", "Clear vegetable soup"],
      },
    ],
    guidelines: [
      "Avoid sugar, sweets, maida products, white rice",
      "Eat every 2–3 hours in small portions",
      "Exercise 30–45 min daily",
      "Drink 8–10 glasses water/day",
    ],
  },

  Hypertension: {
    sections: [
      {
        title: "Early Morning (6–7 AM)",
        items: ["Warm water with lemon (no salt)", "5–6 soaked almonds"],
      },
      {
        title: "Breakfast (8–9 AM)",
        items: ["Oats/daliya with low-fat milk", "2 moong dal chilla", "Herbal tea (no sugar)"],
      },
      {
        title: "Lunch (1–2 PM)",
        items: [
          "2 whole wheat roti",
          "1 bowl sabzi (low oil, no excess salt)",
          "Dal (no extra salt)",
          "Low-fat curd",
          "Green salad",
        ],
      },
      {
        title: "Evening Snack (4–5 PM)",
        items: ["Roasted seeds (pumpkin/sunflower)", "Sprout salad"],
      },
      {
        title: "Dinner (7–8 PM)",
        items: ["2 roti (small)", "1 bowl light sabzi", "Clear soup"],
      },
    ],
    guidelines: [
      "Limit salt to < 2g/day",
      "Avoid pickles, papads, canned foods",
      "Eat potassium-rich foods — banana, spinach, sweet potato",
      "Avoid alcohol and smoking",
      "Exercise 30 min daily (walking, yoga)",
    ],
  },

  PCOS: {
    sections: [
      {
        title: "Early Morning",
        items: ["Warm water with cinnamon/methi seeds", "5–6 soaked almonds"],
      },
      {
        title: "Breakfast",
        items: ["Moong dal chilla with green chutney", "Oats with low-fat milk and seeds"],
      },
      {
        title: "Lunch",
        items: [
          "2 multigrain roti",
          "1 bowl sabzi (low-oil, green leafy)",
          "Dal",
          "Curd (low fat)",
          "Salad",
        ],
      },
      {
        title: "Evening Snack",
        items: ["Handful mixed seeds (flax, chia, sunflower)", "Green tea", "1 fruit"],
      },
      {
        title: "Dinner",
        items: ["2 small roti", "Light sabzi", "Soup"],
      },
    ],
    guidelines: [
      "Avoid refined carbs, sugar, excess dairy",
      "Include anti-inflammatory foods — turmeric, ginger",
      "Eat fiber-rich foods to balance hormones",
      "Exercise 30–45 min daily",
      "Maintain healthy weight",
    ],
  },

  Cancer: {
    sections: [
      {
        title: "Early Morning",
        items: [
          "Warm water with turmeric and lemon",
          "6–7 soaked almonds",
          "1 tsp flaxseeds",
        ],
      },
      {
        title: "Breakfast",
        items: [
          "Oatmeal with berries and seeds",
          "Vegetable smoothie (spinach, carrot, beet)",
          "Green tea",
        ],
      },
      {
        title: "Lunch",
        items: [
          "Whole grain roti or brown rice",
          "Cruciferous vegetables (broccoli, cauliflower)",
          "Lentil soup",
          "Salad with olive oil dressing",
        ],
      },
      {
        title: "Evening Snack",
        items: ["Handful walnuts", "Fresh seasonal fruits"],
      },
      {
        title: "Dinner",
        items: ["Light vegetable soup", "Steamed vegetables", "1–2 roti"],
      },
    ],
    guidelines: [
      "Eat anti-cancer foods: berries, cruciferous veg, turmeric",
      "Avoid processed, packaged, and red meats",
      "Stay well hydrated",
      "Eat small frequent meals if appetite is low",
      "Limit alcohol completely",
    ],
  },

  Anemia: {
    sections: [
      {
        title: "Early Morning",
        items: [
          "Warm water with lemon (vitamin C aids iron absorption)",
          "Soaked raisins and dates (2–3 each)",
        ],
      },
      {
        title: "Breakfast",
        items: [
          "Sprouted moong dal chilla",
          "Beetroot-spinach paratha",
          "Fortified cereal with milk",
        ],
      },
      {
        title: "Lunch",
        items: [
          "2 roti",
          "Spinach sabzi / palak dal",
          "Rajma or chana",
          "Salad with lemon dressing",
        ],
      },
      {
        title: "Evening Snack",
        items: ["Handful roasted seeds (pumpkin, sesame)", "Dates and figs (2–3 pieces)"],
      },
      {
        title: "Dinner",
        items: ["Lentil soup", "Leafy green sabzi", "2 roti"],
      },
    ],
    guidelines: [
      "Eat vitamin C alongside iron-rich foods for better absorption",
      "Avoid tea/coffee immediately after meals",
      "Include iron-rich foods: spinach, lentils, seeds, jaggery",
      "Cook in iron utensils when possible",
    ],
  },

  Thyroid: {
    sections: [
      {
        title: "Early Morning",
        items: ["Warm water with soaked methi seeds", "2–4 soaked almonds and walnuts"],
      },
      {
        title: "Breakfast",
        items: ["Poha/upma (no excess oil)", "Moong dal chilla", "Herbal tea"],
      },
      {
        title: "Lunch",
        items: [
          "2 multigrain roti",
          "Sabzi (mushrooms, eggs or dal)",
          "Salad with selenium-rich seeds",
          "Curd",
        ],
      },
      {
        title: "Evening Snack",
        items: ["Pumpkin seeds / sunflower seeds", "Fruits (avoid soy)"],
      },
      {
        title: "Dinner",
        items: ["2 small roti", "Light sabzi", "Lentil soup"],
      },
    ],
    guidelines: [
      "Take thyroid medication on empty stomach, 30–60 min before food",
      "Avoid raw cruciferous vegetables (broccoli, cabbage) in large amounts",
      "Include selenium-rich foods: Brazil nuts, eggs, mushrooms",
      "Avoid processed foods, sugar",
      "Exercise regularly to support metabolism",
    ],
  },
};
