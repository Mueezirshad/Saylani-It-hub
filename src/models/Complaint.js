import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Internet, Electricity, Water, Maintenance
  description: { type: String, required: true },
  status: { type: String, enum: ["Submitted", "In Progress", "Resolved"], default: "Submitted" },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);