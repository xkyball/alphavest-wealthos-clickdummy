import { clientVisibilityStage6ForbiddenPayloadFields, forbiddenClientVisibilityStage6PayloadFieldsPresent } from "../../lib/client-visibility-payload-contract";

export const forbiddenClientPayloadFields = clientVisibilityStage6ForbiddenPayloadFields;

export function forbiddenFieldsPresent(payload: Record<string, unknown>) {
  return forbiddenClientVisibilityStage6PayloadFieldsPresent(payload);
}
