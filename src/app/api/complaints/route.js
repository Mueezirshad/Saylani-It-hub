import { NextResponse } from "next/server";
import Complaint from "@/models/Complaint";
import connectDB from "@/config/db";

// 1. GET ALL COMPLAINTS
export async function GET() {
  try {
    await connectDB();
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: complaints }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST NEW COMPLAINT
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { category, description, createdBy } = body;

    if (!category || !description || !createdBy) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const newComplaint = await Complaint.create({
      category,
      description,
      createdBy,
    });

    return NextResponse.json({ success: true, data: newComplaint }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}