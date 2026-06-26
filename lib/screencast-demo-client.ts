"use client";

export async function runScreencastDemoAction(actionId: string, nextRoute?: string) {
  const response = await fetch("/api/demo-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actionId }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
    throw new Error(body?.error ?? `Screencast demo action failed with HTTP ${response.status}.`);
  }

  const body = (await response.json()) as {
    result?: {
      auditEventId?: string;
      message?: string;
    };
  };

  if (nextRoute) {
    window.location.assign(nextRoute);
  }

  return body;
}
