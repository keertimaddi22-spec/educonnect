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
// ✅ REQUEST TO JOIN
// =========================
router.post("/request/:id", async (req, res) => {
  try {
    const { student } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // already requested
    const existingRequest = channel.requests.find(
      (r) => r.student === student
    );

    // already member
    const existingMember = channel.members.find(
      (m) => m.student === student
    );

    if (existingMember) {
      return res.status(400).json({
        message: "Already joined",
      });
    }

    if (existingRequest) {
      return res.status(400).json({
        message: "Already requested",
      });
    }

    channel.requests.push({
      student,
      status: "pending",
    });

    await channel.save();

    res.json(channel);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// =========================
// ✅ APPROVE REQUEST
// =========================
router.post("/approve/:id", async (req, res) => {
  try {
    const { student } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // add member if not already
    const alreadyMember = channel.members.find(
      (m) => m.student === student
    );

    if (!alreadyMember) {
      channel.members.push({
        student,
      });
    }

    // update request status
    channel.requests = channel.requests.map((r) => {
      if (r.student === student) {
        return {
          ...r._doc,
          status: "approved",
        };
      }

      return r;
    });

    await channel.save();

    res.json(channel);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// =========================
// ❌ REJECT REQUEST
// =========================
router.post("/reject/:id", async (req, res) => {
  try {
    const { student } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    channel.requests = channel.requests.map((r) => {
      if (r.student === student) {
        return {
          ...r._doc,
          status: "rejected",
        };
      }

      return r;
    });

    await channel.save();

    res.json(channel);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;