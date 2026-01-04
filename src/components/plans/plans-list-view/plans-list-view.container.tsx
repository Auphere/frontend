"use client";

import { usePlansQuery } from "@/api-queries/queries/plans";
import { PlansListView } from "./plans-list-view";

export function PlansListViewContainer() {
  // Mock user ID - in production this would come from auth
  const userId = "user-1";
  
  const { data: plans = [], isLoading } = usePlansQuery(userId);

  const handleCreatePlan = () => {
    // TODO: Implement create plan flow
    console.log("Create plan");
  };

  return (
    <PlansListView
      plans={plans}
      isLoading={isLoading}
      onCreatePlan={handleCreatePlan}
    />
  );
}

