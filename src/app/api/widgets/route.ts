import connectMongoDB from "@/../config/mongodb";
import Widget from "models/widgetSchema";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { widgetType, position, stateValues, _id } = await request.json();
    await connectMongoDB();
    await Widget.create({_id, widgetType, position, stateValues});
    return NextResponse.json({ message: "Widget added succesfully" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const widgets = await Widget.find();
    return NextResponse.json({ widgets });
}