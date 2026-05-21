import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { user, courseId, message, rating } = req.body;

    const feedback = await Feedback.create({
      user,
      courseId,
      message,
      rating,
    });

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;