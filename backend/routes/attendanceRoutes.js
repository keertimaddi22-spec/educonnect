import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// 📌 MARK ATTENDANCE (Student)
router.post("/mark", async (req, res) => {
  try {
    const { student, date, status } = req.body;

    const existing = await Attendance.findOne({ student, date });

    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json(existing);
    }

    const newEntry = new Attendance({
      student,
      date,
      status,
    });

    await newEntry.save();

    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 GET ALL ATTENDANCE (Teacher dashboard)
router.get("/", async (req, res) => {
  try {
    const data = await Attendance.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;