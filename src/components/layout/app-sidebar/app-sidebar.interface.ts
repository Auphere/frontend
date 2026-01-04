export interface ChatSessionItem {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: string;
}

export interface ChatGroup {
  label: string;
  chats: ChatSessionItem[];
}

export interface UserInfo {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AppSidebarProps {
  currentPath: string;
  activeChatId?: string | null;
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  userInfo: UserInfo;
  chatGroups: ChatGroup[];
  isLoadingChats?: boolean;
  onNavigate: (path: string) => void;
  onChatSelect: (chatId: string) => void;
  onChatDelete: (chatId: string) => void;
  onClose: () => void;
  onToggleCollapse: () => void;
  onProfileClick: () => void;
  onLogoutClick: () => void;
  onNewChat: () => void;
  onNewPlan: () => void;
}
