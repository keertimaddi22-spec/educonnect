import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    createdBy: String,

    students: [
      {
        type: String, // 🔥 IMPORTANT
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);