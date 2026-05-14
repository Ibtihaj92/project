import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  eventId: { type: String, default: "" },
  title: { type: String, required: true },
  date: { type: Date, required: true }, 
  image: { type: String },
  attended: { type: Boolean, default: false },
  userName: { type: String, default: "" },
});

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
