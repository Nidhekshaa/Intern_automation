const express = require("express");
const router = express.Router();
const path = require("path");
const authMiddleware = require("../middleware/authmiddleware");
const Application = require("../models/Application");
const User = require("../models/User");
const sendMail = require("../utils/sendEmail"); // make sure this exists

router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { internshipTitle } = req.body;

    // 🔹 Fetch user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ======================================================
       ⭐ CHECK EXISTING APPLICATION
    ====================================================== */

    const existing = await Application.findOne({ user: userId });

    if (existing) {
      // ❌ Block if still active
      if (
        ["Applied", "Interview", "Approved"].includes(existing.status)
      ) {
        return res.status(400).json({
          message: "You already have an active application in progress",
        });
      }

      // ✅ If rejected/completed → remove old (reset flow)
      if (
        ["Rejected", "Completed"].includes(existing.status)
      ) {
        await Application.deleteOne({ _id: existing._id });
      }
    }

    /* ======================================================
       ⭐ CREATE FRESH APPLICATION
    ====================================================== */

    const newApplication = await Application.create({
      user: userId,
      internshipTitle,
      status: "Applied", // 🔥 always start from step 1
      profileSnapshot: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        degree: user.degree,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
      },
    });

    /* ======================================================
       ⭐ EMAIL
    ====================================================== */

    const resumePath = path.join(__dirname, "..", "uploads", user.resumeUrl);

    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Internship Application",
      html: `
        <h2>New Internship Application</h2>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>College:</strong> ${user.college}</p>
        <p><strong>Degree:</strong> ${user.degree}</p>
        <p><strong>Skills:</strong> ${user.skills?.join(", ")}</p>
        <p><strong>Internship:</strong> ${internshipTitle}</p>
        <p><strong>Resume:</strong> Attached as PDF</p>
      `,
      attachments: [
        {
          filename: user.resumeUrl,
          path: resumePath,
          contentType: "application/pdf",
        },
      ],
    });

    res.json({
      message: "Application submitted successfully",
      application: newApplication,
    });

  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/applications/status
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const application = await Application.findOne({ user: userId });

    if (!application) {
      return res.json({ currentStep: 0, status: "None" });
    }

    let currentStep = 1;

    switch (application.status) {
      case "Applied":
        currentStep = 1;
        break;

      case "Interview":
        currentStep = 2;
        break;

      case "Approved":
        currentStep = 3;
        break;

      case "Rejected":
        currentStep = 3; // ⭐ same position as Approved
        break;

      case "Internship Completed":
      case "Completed":
        currentStep = 4;
        break;

      default:
        currentStep = 1;
    }

    res.json({
      currentStep,
      status: application.status, // ⭐ IMPORTANT
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;