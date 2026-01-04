"use client";

import { usePlanQuery } from "@/api-queries/queries/plans";
import { PlanDetailView } from "./plan-detail-view";

interface PlanDetailViewContainerProps {
  planId: string;
}

export function PlanDetailViewContainer({ planId }: PlanDetailViewContainerProps) {
  const { data: plan, isLoading } = usePlanQuery(planId);

  return <PlanDetailView plan={plan || null} isLoading={isLoading} />;
}

