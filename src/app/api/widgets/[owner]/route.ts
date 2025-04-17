import connectMongoDB from "@/../config/mongodb";
import Widget from "models/widgetSchema";
import { NextResponse, NextRequest } from "next/server";

interface RouteParams {
  params: { owner: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { owner } = await params;
  await connectMongoDB();
  const query = { "owner": owner };
  const widgets = await Widget.find(query);
  return NextResponse.json({ widgets });
}
