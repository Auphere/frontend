import { create } from "zustand";

interface UIStore {
  // Sidebar state
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Place drawer state
  isPlaceDrawerOpen: boolean;
  selectedPlaceId: string | null;
  openPlaceDrawer: (placeId: string) => void;
  closePlaceDrawer: () => void;

  // Chat mode
  chatMode: "chat" | "planner";
  setChatMode: (mode: "chat" | "planner") => void;

  // Selected plan (for navigation/context)
  selectedPlanId: string | null;
  setSelectedPlanId: (planId: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Sidebar
  isSidebarOpen: false,
  isSidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebarCollapse: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  // Place drawer
  isPlaceDrawerOpen: false,
  selectedPlaceId: null,
  openPlaceDrawer: (placeId) =>
    set({ isPlaceDrawerOpen: true, selectedPlaceId: placeId }),
  closePlaceDrawer: () =>
    set({ isPlaceDrawerOpen: false, selectedPlaceId: null }),

  // Chat mode
  chatMode: "chat",
  setChatMode: (mode) => set({ chatMode: mode }),

  // Selected plan
  selectedPlanId: null,
  setSelectedPlanId: (planId) => set({ selectedPlanId: planId }),
}));
