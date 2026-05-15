import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: String,
  date: String,
  status: String,
});

export default mongoose.model("Attendance", attendanceSchema);