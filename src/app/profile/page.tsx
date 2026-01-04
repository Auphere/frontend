"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ProfileViewContainer } from "@/components/profile/profile-view";
import { withAuth } from "@/lib/auth/with-auth";

function ProfilePage() {
  return (
    <AppLayout>
      <ProfileViewContainer />
    </AppLayout>
  );
}

export default withAuth(ProfilePage);
