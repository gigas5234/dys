import { NextResponse } from "next/server";

export const runtime = "edge"; // free plan에도 적합(1초 제한 유의)

export async function GET() {
  return NextResponse.json({
    status: "ok",
    env: process.env.NEXT_PUBLIC_APP_NAME || "deyeonso",
    time: new Date().toISOString(),
  });
}
