import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  event: { type: String, required: true },
  availability: { type: String, required: true }, // e.g., "Saturday 2PM - 6PM"
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Volunteer || mongoose.model("Volunteer", VolunteerSchema);