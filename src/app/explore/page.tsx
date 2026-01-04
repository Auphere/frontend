"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ExploreViewContainer } from "@/components/explore/explore-view";
import { withAuth } from "@/lib/auth/with-auth";

function ExplorePage() {
  return (
    <AppLayout>
      <ExploreViewContainer />
    </AppLayout>
  );
}

export default withAuth(ExplorePage);
