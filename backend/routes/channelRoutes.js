import express from "express";
import Channel from "../models/Channel.js";

const router = express.Router();


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



router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find();
    res.json(channels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post("/request/:id", async (req, res) => {
  try {
    const { student } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    const existingRequest = channel.requests.find(
      (r) => r.student === student
    );

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


router.post("/approve/:id", async (req, res) => {
  try {
    const { student } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    const alreadyMember = channel.members.find(
      (m) => m.student === student
    );

    if (!alreadyMember) {
      channel.members.push({
        student,
      });
    }

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


router.delete("/:id", async (req, res) => {
  try {
    await Channel.findByIdAndDelete(req.params.id);

    res.json({ message: "Channel deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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