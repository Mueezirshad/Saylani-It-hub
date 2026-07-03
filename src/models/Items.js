import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["lost", "found"], required: true },
  imageUrl: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  createdBy: { type: String, required: true }, // User email ya name
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);