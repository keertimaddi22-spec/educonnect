import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: String,        // student name/email
    courseId: String,    // optional
    message: String,
    rating: Number,      // 1 to 5
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);