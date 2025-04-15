import connectMongoDB from "@/../config/mongodb";
import Widget from "@/models/widgetSchema";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  await connectMongoDB();
  const item = await Widget.findOne({ _id: id });
  return NextResponse.json({ item }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const {
    widgetType: widgetType,
    position: position,
    label: label,
    stateValues: stateValues,
  } = await request.json();
  await connectMongoDB();
  await Widget.findByIdAndUpdate(id, {
    widgetType,
    position,
    label,
    stateValues,
  });
  return NextResponse.json({ message: "Item updated" }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });

  await connectMongoDB();
  const deletedItem = await Widget.findByIdAndDelete(id);

  if (!deletedItem)
    return NextResponse.json({ message: "Item not found" }, { status: 404 });

  return NextResponse.json({ message: "Item deleted" }, { status: 200 });
}
