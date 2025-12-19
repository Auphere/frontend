/**
 * Z-Index Constants
 * Centralized z-index management to prevent conflicts and improve maintainability
 */

export const Z_INDEX = {
  // Base layers
  BASE: 0,
  HEADER: 30,

  // Overlays and modals (low priority)
  LOCATION_SELECTOR_BACKDROP: 80,
  LOCATION_SELECTOR: 90,

  // Sidebar layers
  SIDEBAR_BACKDROP: 100,
  SIDEBAR: 110,
  CHAT_SIDEBAR_BACKDROP: 112,
  CHAT_SIDEBAR: 115,
  HAMBURGER_BUTTON: 120,

  // Drawer layers (high priority)
  DRAWER_BACKDROP: 130,
  DRAWER: 140,
} as const;

export type ZIndex = (typeof Z_INDEX)[keyof typeof Z_INDEX];
