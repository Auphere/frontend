"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ChatViewContainer } from "@/components/chat/chat-view";
import { withAuth } from "@/lib/auth/with-auth";

function ChatPage() {
  return (
    <AppLayout>
      <ChatViewContainer />
    </AppLayout>
  );
}

export default withAuth(ChatPage);
