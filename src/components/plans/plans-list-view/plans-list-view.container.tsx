"use client";

import { useRouter } from "next/navigation";
import { usePlansQuery } from "@/api-queries/queries/plans";
import { PlansListView } from "./plans-list-view";

export function PlansListViewContainer() {
  const router = useRouter();
  const { data: plans = [], isLoading } = usePlansQuery();

  const handleCreatePlan = () => {
    // Navigate to chat in plan mode
    router.push("/chat?mode=plan");
  };

  return (
    <PlansListView
      plans={plans}
      isLoading={isLoading}
      onCreatePlan={handleCreatePlan}
    />
  );
}

