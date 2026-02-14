const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // ❌ NO bcrypt.hash here
    const user = new User({
      name,
      email,
      password, // plain password
    });

    await user.save(); // model hashes it

    res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ CREATE JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // ✅ SET COOKIE
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   sameSite: "lax",   // works on localhost
    //   secure: false,    // must be false for http
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // ✅ required for cross-origin
      secure: true, // ✅ required for HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ msg: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= LOGOUT =================
router.post("/logout", (req, res) => {
  // res.clearCookie("token", {
  //   httpOnly: true,
  //   sameSite: "lax",
  //   secure: false,
  // });
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({ msg: "Logged out" });
});

module.exports = router;
