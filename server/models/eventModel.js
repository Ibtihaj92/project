import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    volunteerName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    volunteerType: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("events", eventSchema);
