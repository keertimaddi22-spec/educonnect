import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/auth.js";
import feedbackRoutes from "./routes/feedback.js";
import channelRoutes from "./routes/channelRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

dotenv.config();

const app = express();

// DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/attendance", attendanceRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});