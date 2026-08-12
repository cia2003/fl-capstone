import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Comparison API placeholder",
    data: null,
  });
}
