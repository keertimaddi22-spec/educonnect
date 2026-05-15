import express from "express";
import Course from "../models/Course.js";

const router = express.Router();


// ✅ GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET SINGLE COURSE
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ CREATE COURSE (IMPORTANT FIX)
router.post("/create", async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      createdBy: req.body.instructor, // 🔥 FIXED
      students: [],
    });

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ENROLL COURSE
router.post("/enroll/:id", async (req, res) => {
  try {
    const { user } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // avoid duplicate
    if (!course.students.includes(user)) {
      course.students.push(user);
      await course.save();
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;