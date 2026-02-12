const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const Application = require("../models/Application");
const ctrl = require("../controllers/adminMeeting");
const upload = require("../middleware/uploadCertificate"); // your existing multer

router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();

    const applied = await Application.countDocuments({ status: "Applied" });
    const interview = await Application.countDocuments({ status: "Interview" });
    const approved = await Application.countDocuments({ status: "Approved" });
    const rejected = await Application.countDocuments({ status: "Rejected" });
    const completed = await Application.countDocuments({ status: "Completed" });

    res.json({
      totalApplications,
      applied,
      interview,
      approved,
      rejected,
      completed,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= APPLICATION DETAILS ================= */

router.get("/applications", adminAuth, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= UPDATE STATUS ================= */
router.put("/applications/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;

  await Application.findByIdAndUpdate(req.params.id, { status });

  res.json({ message: "Status updated" });
});

router.get("/applications/:id", adminAuth, ctrl.getApplicationDetails);
router.post(
  "/applications/:id/schedule",
  adminAuth,
  ctrl.scheduleInterview
);

router.post(
  "/applications/:id/approve",
  adminAuth,
  upload.fields([{ name: "offerLetter", maxCount: 1 }]),   // ⭐ important
  ctrl.approveApplication
);

router.post("/applications/:id/reject", adminAuth, ctrl.rejectApplication);

router.post(
  "/applications/:id/complete",
  adminAuth,
  upload.fields([{ name: "certificate", maxCount: 1 }]),   // ⭐ important
  ctrl.completeApplication
);

router.post("/logout", adminAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("admin_sid");
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
