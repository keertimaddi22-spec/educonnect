import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 🔥 REGISTER
router.post("/register", async (req, res) => {
  console.log("BODY 👉", req.body); // DEBUG

  const { name, email, password, role } = req.body;

  try {
    // ❌ EMPTY CHECK
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    // ❌ DUPLICATE CHECK
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    // ✅ CREATE USER
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({ message: "Registered ✅", user });
  } catch (error) {
    console.log("ERROR 👉", error); // 🔥 IMPORTANT
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY 👉", req.body);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    console.log("FOUND USER 👉", user);

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    res.json({
      message: "Login success ✅",
      user,
    });
  } catch (error) {
    console.log("ERROR 👉", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

export default router;