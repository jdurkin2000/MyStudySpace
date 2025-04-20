import connectMongoDB from "@/../config/mongodb";
import User from "models/userSchema";
import { NextResponse, NextRequest } from "next/server";

interface RouteParams {
  params: { email: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { email } = await params;
  await connectMongoDB();
  const query = { "email": email };
  const users = await User.find(query);
  return NextResponse.json({ users });
}
