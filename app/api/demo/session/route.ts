import { NextResponse } from "next/server";
import { readDemoSession, resetDemoSession } from "@/lib/demo-store";

export async function GET() {
  return NextResponse.json(await readDemoSession());
}

export async function POST() {
  return NextResponse.json(await resetDemoSession());
}
