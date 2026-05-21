import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: String,        
    courseId: String,    
    message: String,
    rating: Number,      
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);