export const regulatoryDisclaimers = [
  "Demo only. Not legal, tax, investment, insurance, residency or citizenship advice.",
  "Triggers are review points, not final advice.",
  "No unapproved advice reaches the client.",
  "Digital first. Human reviewed. Evidence backed.",
  "Evidence replaces assumption."
] as const;

export const sensitiveRecommendationWorkflow = [
  "AI-DRAFT",
  "ANALYST",
  "ADVISOR",
  "COMPLIANCE",
  "CLIENT",
  "EVIDENCE",
  "REVIEW"
] as const;

export const fullReviewWorkflow = [
  "AUTO",
  ...sensitiveRecommendationWorkflow
] as const;

export const currentPhaseBoundary = {
  label: "Phase 4 v2 UX model",
  description:
    "Routes, shell, design tokens, mock data structure, safety messaging and reusable AlphaVest UI components are aligned to the v2 model. Client feature rebuilds remain reserved for later phases."
};
