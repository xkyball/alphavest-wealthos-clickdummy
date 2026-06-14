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

export const phaseOneBoundary = {
  label: "Phase 1 foundation",
  description:
    "Routes, shell, design tokens, mock data structure and safety messaging are present. Detailed board content and click interactions are reserved for later phases."
};
