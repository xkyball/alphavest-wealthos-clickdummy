import { requireActorContext } from "../../lib/control-layer/actor-context";
import { fileMetadataService } from "../../lib/file-metadata-service";

export const controlLayerActors = {
  bennettCompliance: requireActorContext({ roleKey: "compliance_officer", tenantSlug: "bennett" }),
  bennettPrincipal: requireActorContext({ roleKey: "principal", tenantSlug: "bennett" }),
  summitCompliance: requireActorContext({ roleKey: "compliance_officer", tenantSlug: "summit" }),
};

export const safeExportFile = fileMetadataService.prepareDemoFileMetadata({
  category: "exports",
  checksumSeed: "wcl-final-export-safe",
  fileName: "WCL-final-export-redacted.zip",
  fileSizeBytes: 128000,
  mimeType: "application/zip",
  tenantSlug: "summit",
});
