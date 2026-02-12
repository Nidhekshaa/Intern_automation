const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// ===== MULTER FOR RESUME =====
const storage = multer.diskStorage({
  destination: "uploads/Resumes",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// =======================================
// GET PROFILE (auto fill name + email)
// =======================================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PROFILE STATUS
router.get("/profile-status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let completed = 0;
    const total = 5;

    if (user.phone) completed++;
    if (user.college) completed++;
    if (user.degree) completed++;
    if (user.skills && user.skills.length > 0) completed++;
    if (user.resumeUrl) completed++;

    const percentage = Math.round((completed / total) * 100);
    const profileComplete = percentage === 100;

    res.json({
      percentage,
      profileComplete,
    });
  } catch (err) {
    console.error("Profile status error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =======================================
// UPDATE PROFILE
// =======================================
router.put(
  "/update",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      const updates = {};

      if (req.body.phone) updates.phone = req.body.phone;
      if (req.body.college) updates.college = req.body.college;
      if (req.body.degree) updates.degree = req.body.degree;

      if (req.body.skills) {
        updates.skills = req.body.skills.split(",").map((s) => s.trim());
      }

      if (req.file) {
        updates.resumeUrl = req.file.filename;
      }

      await User.findByIdAndUpdate(req.userId, updates);

      res.json({ msg: "Profile updated successfully" });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  },
);

module.exports = router;
