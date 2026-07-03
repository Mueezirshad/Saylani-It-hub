import { NextResponse } from "next/server";
import Complaint from "@/models/Complaint";
import connectDB from "@/config/db";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const { status } = body; // Expected: "Submitted", "In Progress", "Resolved"

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json({ success: false, error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedComplaint }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}