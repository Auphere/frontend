"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { PlansListViewContainer } from "@/components/plans/plans-list-view";
import { withAuth } from "@/lib/auth/with-auth";

function PlansPage() {
  return (
    <AppLayout>
      <PlansListViewContainer />
    </AppLayout>
  );
}

export default withAuth(PlansPage);
