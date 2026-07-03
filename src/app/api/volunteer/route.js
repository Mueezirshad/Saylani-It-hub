import { NextResponse } from "next/server";
import Volunteer from "@/models/Volunteer";
import connectDB from "@/config/db";
// 1. GET ALL VOLUNTEERS
export async function GET() {
  try {
    await connectDB();
    const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: volunteers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST NEW VOLUNTEER REGISTRATION
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { name, event, availability, createdBy } = body;

    if (!name || !event || !availability || !createdBy) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const newVolunteer = await Volunteer.create({
      name,
      event,
      availability,
      createdBy,
    });

    return NextResponse.json({ success: true, data: newVolunteer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}