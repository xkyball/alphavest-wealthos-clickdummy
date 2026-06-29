export type DataMaintenanceWorkflowAction =
  | "j04.portalUpload"
  | "j04.openUploadDocument"
  | "j04.uploadDocument"
  | "j04.confirmFinalize"
  | "j04.viewDetails"
  | "j04.refreshReviewQueue"
  | "j04.requestClarification"
  | "j05.createEntity"
  | "j05.continueEntity"
  | "j05.editEntity"
  | "j05.viewDetails"
  | "j05.markReady"
  | "j05.requestInfo"
  | "j09.portalUpload"
  | "j09.submitProfile"
  | "j09.addMember"
  | "j09.saveFamilyChanges"
  | "j09.openFamilyMap"
  | "j09.addRelationship";

export type DataMaintenanceCommand =
  | "DOCUMENT_PORTAL_UPLOAD_ENTRY"
  | "DOCUMENT_OPEN_UPLOAD"
  | "DOCUMENT_UPLOAD_FOR_REVIEW"
  | "DOCUMENT_CONFIRM_EXTRACTION"
  | "DOCUMENT_VIEW_CLARIFICATION"
  | "DOCUMENT_REFRESH_REVIEW_QUEUE"
  | "DOCUMENT_REQUEST_CLARIFICATION"
  | "ENTITY_CREATE_DRAFT_INTENT"
  | "ENTITY_SUBMIT_FOR_LEGAL_REVIEW"
  | "ENTITY_OPEN_EDIT"
  | "ACTION_VIEW_DETAILS"
  | "ACTION_BLOCK_READY"
  | "ACTION_REQUEST_INFO"
  | "PROFILE_PORTAL_UPLOAD_ENTRY"
  | "PROFILE_SUBMIT_FOR_REVIEW"
  | "FAMILY_ADD_MEMBER"
  | "FAMILY_SAVE_CHANGES"
  | "RELATIONSHIP_OPEN_FAMILY_MAP"
  | "RELATIONSHIP_ADD_EDGE";

export const dataMaintenanceCanonicalApiRoute = "/api/data-maintenance/actions" as const;

export const dataMaintenanceWorkflowActionIds = [
  "j04.portalUpload",
  "j04.openUploadDocument",
  "j04.uploadDocument",
  "j04.confirmFinalize",
  "j04.viewDetails",
  "j04.refreshReviewQueue",
  "j04.requestClarification",
  "j05.createEntity",
  "j05.continueEntity",
  "j05.editEntity",
  "j05.viewDetails",
  "j05.markReady",
  "j05.requestInfo",
  "j09.portalUpload",
  "j09.submitProfile",
  "j09.addMember",
  "j09.saveFamilyChanges",
  "j09.openFamilyMap",
  "j09.addRelationship",
] as const satisfies readonly DataMaintenanceWorkflowAction[];

export const dataMaintenanceCommandByAction = {
  "j04.portalUpload": "DOCUMENT_PORTAL_UPLOAD_ENTRY",
  "j04.openUploadDocument": "DOCUMENT_OPEN_UPLOAD",
  "j04.uploadDocument": "DOCUMENT_UPLOAD_FOR_REVIEW",
  "j04.confirmFinalize": "DOCUMENT_CONFIRM_EXTRACTION",
  "j04.viewDetails": "DOCUMENT_VIEW_CLARIFICATION",
  "j04.refreshReviewQueue": "DOCUMENT_REFRESH_REVIEW_QUEUE",
  "j04.requestClarification": "DOCUMENT_REQUEST_CLARIFICATION",
  "j05.createEntity": "ENTITY_CREATE_DRAFT_INTENT",
  "j05.continueEntity": "ENTITY_SUBMIT_FOR_LEGAL_REVIEW",
  "j05.editEntity": "ENTITY_OPEN_EDIT",
  "j05.viewDetails": "ACTION_VIEW_DETAILS",
  "j05.markReady": "ACTION_BLOCK_READY",
  "j05.requestInfo": "ACTION_REQUEST_INFO",
  "j09.portalUpload": "PROFILE_PORTAL_UPLOAD_ENTRY",
  "j09.submitProfile": "PROFILE_SUBMIT_FOR_REVIEW",
  "j09.addMember": "FAMILY_ADD_MEMBER",
  "j09.saveFamilyChanges": "FAMILY_SAVE_CHANGES",
  "j09.openFamilyMap": "RELATIONSHIP_OPEN_FAMILY_MAP",
  "j09.addRelationship": "RELATIONSHIP_ADD_EDGE",
} satisfies Record<DataMaintenanceWorkflowAction, DataMaintenanceCommand>;

const dataMaintenanceWorkflowActions = new Set<string>(dataMaintenanceWorkflowActionIds);

export function isDataMaintenanceWorkflowAction(value: unknown): value is DataMaintenanceWorkflowAction {
  return typeof value === "string" && dataMaintenanceWorkflowActions.has(value);
}

export function dataMaintenanceCommandForAction(actionId: DataMaintenanceWorkflowAction) {
  return dataMaintenanceCommandByAction[actionId];
}
