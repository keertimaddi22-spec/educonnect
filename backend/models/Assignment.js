import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  student: String,

  answer: String,

  status: {
    type: String,
    default: "submitted",
  },
});

const assignmentSchema = new mongoose.Schema({
  title: String,

  dueDate: String,

  submissions: [submissionSchema],
});

export default mongoose.model("Assignment", assignmentSchema);