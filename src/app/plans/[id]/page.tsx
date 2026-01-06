"use client";

import { use } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PlanDetailViewContainer } from "@/components/plans/plan-detail-view";
import { withAuth } from "@/lib/auth/with-auth";

function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <AppLayout>
      <PlanDetailViewContainer planId={id} />
    </AppLayout>
  );
}

export default withAuth(PlanDetailPage);
