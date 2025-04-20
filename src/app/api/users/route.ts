import connectMongoDB from "@/../config/mongodb";
import User from "models/userSchema";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { email, password } =
      await request.json();
    await connectMongoDB();
    await User.create({ email, password });
    return NextResponse.json(
      { message: "User added succesfully" },
      { status: 201 }
    );
}