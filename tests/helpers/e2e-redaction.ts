import { av27Phase6ForbiddenPayloadFields, forbiddenAv27Phase6PayloadFieldsPresent } from "../../lib/av27-phase6-payload-contract";

export const forbiddenClientPayloadFields = av27Phase6ForbiddenPayloadFields;

export function forbiddenFieldsPresent(payload: Record<string, unknown>) {
  return forbiddenAv27Phase6PayloadFieldsPresent(payload);
}
