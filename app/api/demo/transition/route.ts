import { NextResponse } from "next/server";
import type { DemoTransitionInput } from "@/lib/demo-runtime";
import { transitionDemoSession } from "@/lib/demo-store";

export async function POST(request: Request) {
  const input = (await request.json()) as DemoTransitionInput;

  try {
    return NextResponse.json(await transitionDemoSession(input));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown demo transition error" },
      { status: 400 }
    );
  }
}
