"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { PlanDetailViewContainer } from "@/components/plans/plan-detail-view";
import { withAuth } from "@/lib/auth/with-auth";

function PlanDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <PlanDetailViewContainer planId={params.id} />
    </AppLayout>
  );
}

export default withAuth(PlanDetailPage);
