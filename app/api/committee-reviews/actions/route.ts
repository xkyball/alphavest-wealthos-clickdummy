import { NextResponse } from "next/server";

import {
  CommitteeReviewWorkflowActionError,
  committeeReviewCanonicalActionApiRoute,
  isCommitteeReviewWorkflowAction,
  runCommitteeReviewWorkflowAction,
} from "@/lib/committee-review-service";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { prismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => undefined)) as
    | { actionId?: unknown; targetId?: unknown }
    | undefined;

  if (
    !body ||
    !isCommitteeReviewWorkflowAction(body.actionId) ||
    typeof body.targetId !== "string" ||
    !uuidPattern.test(body.targetId)
  ) {
    return failClosedJson(
      {
        canonicalApiRoute: committeeReviewCanonicalActionApiRoute,
        error: "Committee review actions require a supported command and UUID targetId.",
        reasonCode: "INVALID_REQUEST",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: false,
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await runCommitteeReviewWorkflowAction(prismaClient(), {
      actionId: body.actionId,
      targetId: body.targetId,
    });

    return NextResponse.json({
      actionId: body.actionId,
      canonicalApiRoute: committeeReviewCanonicalActionApiRoute,
      clientVisible: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      result,
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
      targetId: body.targetId,
    });
  } catch (error) {
    if (error instanceof CommitteeReviewWorkflowActionError) {
      return failClosedJson(
        {
          actionId: body.actionId,
          canonicalApiRoute: committeeReviewCanonicalActionApiRoute,
          error: error.message,
          reasonCode: error.status === 404 ? "SCOPE_DENIED" : "INVALID_REQUEST",
          safety: {
            commandExecuted: false,
            hiddenRowsDisclosed: false,
            noAdviceExecution: true,
            noClientRelease: true,
            scoped: false,
          },
          targetId: body.targetId,
          targetReasonCode: error.reasonCode,
        },
        { status: error.status },
      );
    }

    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: committeeReviewCanonicalActionApiRoute,
        error: "Committee review action failed closed.",
        reasonCode: "SAFE_ERROR",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: true,
        },
      },
      { status: 409 },
    );
  }
}
