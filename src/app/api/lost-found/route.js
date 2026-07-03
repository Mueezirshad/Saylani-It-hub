import { NextResponse } from "next/server";
import connectDB from "@/config/db.js";
import Item from "@/models/Items.js";

// 1. GET ALL ITEMS
export async function GET() {
  try {
    console.log("=== API: Connecting to DB ===");
    await connectDB();
    console.log("=== API: DB Connected, Fetching Items ===");
    
    const items = await Item.find({}).sort({ createdAt: -1 });
    console.log("=== API: Fetch Success, Total Items:", items.length);
    
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    // Khas taur par backend terminal par error dekhne ke liye
    console.error("❌ CRITICAL BACKEND ERROR IN LOST-FOUND GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST NEW ITEM
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, type, imageUrl, createdBy } = body;

    if (!title || !description || !type || !createdBy) {
      return NextResponse.json({ success: false, error: "Required fields missing" }, { status: 400 });
    }

    const newItem = await Item.create({ title, description, type, imageUrl, createdBy });
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error("❌ CRITICAL BACKEND ERROR IN LOST-FOUND POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}