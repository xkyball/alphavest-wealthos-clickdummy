import type { UxPageType } from "@/lib/ux-route-policy";

export type UxContentTier = "must-see" | "secondary" | "tertiary";

export type UxContentHierarchy = {
  mustSee: string[];
  secondary: string[];
  tertiary: string[];
};

export const uxContentHierarchyByPageType: Record<UxPageType, UxContentHierarchy> = {
  Detail: {
    mustSee: ["object header", "current status", "gated action rail", "safety note"],
    secondary: ["key facts", "evidence basis", "audit timeline"],
    tertiary: ["linked records", "drawer context", "supporting notes"],
  },
  Drawer: {
    mustSee: ["context title", "safety note"],
    secondary: ["active tab content", "selected record facts"],
    tertiary: ["inactive tab content", "related snippets"],
  },
  Hold: {
    mustSee: ["hold reason", "blocked state"],
    secondary: ["reference context"],
    tertiary: ["future scope note"],
  },
  Hub: {
    mustSee: ["orientation", "primary next work", "safety note"],
    secondary: ["priority queue", "source summaries"],
    tertiary: ["context tabs", "related handoffs"],
  },
  Modal: {
    mustSee: ["consequence", "confirmation requirement", "cancel path"],
    secondary: ["prerequisite detail", "supporting context"],
    tertiary: ["reference notes"],
  },
  P1: {
    mustSee: ["deferred guard", "non-MVP status"],
    secondary: ["scope note"],
    tertiary: ["future placeholder context"],
  },
  Reference: {
    mustSee: ["reference purpose", "non-product status"],
    secondary: ["catalogue content"],
    tertiary: ["supporting examples"],
  },
  Workbench: {
    mustSee: ["page job", "gate guidance", "primary next step", "safety note"],
    secondary: ["priority queue", "selected context", "action rail"],
    tertiary: ["filters", "tables", "drawer or tab context"],
  },
};

export function uxContentHierarchyForPageType(pageType: UxPageType) {
  return uxContentHierarchyByPageType[pageType];
}
