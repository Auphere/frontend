import { Place, EveningPlan } from "./place";

export type ChatMode = "explore" | "plan";

export interface Message {
  role: "user" | "assistant";
  content: string;
  places?: Place[];
  plan?: EveningPlan;
  planSavedId?: string; // ID of the saved plan if it was already saved
  suggestions?: string[];
}

export interface PlanContext {
  mode: ChatMode;
  places: Place[];
  preferences: {
    vibe?: string;
    date?: string;
    groupSize?: number;
    budget?: string;
    startTime?: string;
  };
}
