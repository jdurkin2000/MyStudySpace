import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("https://api.animechan.io/v1/quotes/random");
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
