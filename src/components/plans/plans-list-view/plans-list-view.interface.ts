import type { Plan } from "@/lib/types";

export interface PlansListViewProps {
  plans: Plan[];
  isLoading: boolean;
  onCreatePlan: () => void;
}

