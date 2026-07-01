export const wealthActionsPageIds = ["031", "032"] as const;

export type WealthActionsPageId = (typeof wealthActionsPageIds)[number];

export function isWealthActionsPageId(pageId: string): pageId is WealthActionsPageId {
  return wealthActionsPageIds.includes(pageId as WealthActionsPageId);
}
