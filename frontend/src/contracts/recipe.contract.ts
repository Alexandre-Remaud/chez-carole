export type CreateRecipeContract = {
  title: string;
  description: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  steps: {
    order: number;
    instruction: string;
    duration?: number;
    durationUnit?: "min" | "sec";
    temperature?: number;
    temperatureUnit?: "C" | "F";
    note?: string;
  }[];
  servings?: number;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
};
