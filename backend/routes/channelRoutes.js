import express from "express";
import Channel from "../models/Channel.js";

const router = express.Router();


// =========================
// ✅ CREATE CHANNEL
// =========================
router.post("/create", async (req, res) => {
  try {
    const newChannel = new Channel({
      name: req.body.name,
      instructor: req.body.createdBy,
    });

    await newChannel.save();
    res.json(newChannel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// ✅ GET ALL CHANNELS
// =========================
router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find();
    res.json(channels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// ✅ REQUEST TO JOIN (FIX FOR YOUR ERROR)
// =========================
router.post("/request/:id", async (req, res) => {
  try {
    const { student } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // already requested check
    const already = channel.requests.find(
      (r) => r.student === student
    );

    if (already) {
      return res.status(400).json({ message: "Already requested" });
    }

    channel.requests.push({
      student,
      status: "pending",
    });

    await channel.save();

    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// ✅ APPROVE REQUEST (TEACHER)
// =========================
router.post("/approve/:id", async (req, res) => {
  try {
    const { student } = req.body;

    const channel = await Channel.findById(req.params.id);

    channel.members.push({ student });

    channel.requests = channel.requests.map((r) =>
      r.student === student ? { ...r, status: "approved" } : r
    );

    await channel.save();

    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// ❌ REJECT REQUEST
// =========================
router.post("/reject/:id", async (req, res) => {
  try {
    const { student } = req.body;

    const channel = await Channel.findById(req.params.id);

    channel.requests = channel.requests.map((r) =>
      r.student === student ? { ...r, status: "rejected" } : r
    );

    await channel.save();

    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;