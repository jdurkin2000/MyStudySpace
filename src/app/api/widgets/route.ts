import connectMongoDB from "@/../config/mongodb";
import Widget from "models/widgetSchema";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { widgetType, position, label, stateValues, _id, owner } =
      await request.json();
    await connectMongoDB();
    await Widget.create({ _id, owner, widgetType, position, label, stateValues });
    return NextResponse.json(
      { message: "Widget added succesfully" },
      { status: 201 }
    );
}