"use client";

import { useCallback, useEffect, useState } from "react";
import type { DemoSessionSnapshot, DemoTransitionInput } from "@/lib/demo-runtime";

export function useDemoSession() {
  const [snapshot, setSnapshot] = useState<DemoSessionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/demo/session", { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Demo session failed: ${response.status}`);
      }

      setSnapshot((await response.json()) as DemoSessionSnapshot);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown demo session error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refresh]);

  const transition = useCallback(async (input: DemoTransitionInput) => {
    const response = await fetch("/api/demo/transition", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input)
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Demo transition failed");
      return null;
    }

    setSnapshot(payload as DemoSessionSnapshot);
    setError(null);
    return payload as DemoSessionSnapshot;
  }, []);

  const reset = useCallback(async () => {
    const response = await fetch("/api/demo/session", { method: "POST" });
    const payload = (await response.json()) as DemoSessionSnapshot;
    setSnapshot(payload);
    setError(null);
    return payload;
  }, []);

  return { snapshot, loading, error, refresh, transition, reset };
}

export function findDemoWorkflow(snapshot: DemoSessionSnapshot | null, id: DemoSessionSnapshot["workflows"][number]["id"]) {
  return snapshot?.workflows.find((workflow) => workflow.id === id);
}
