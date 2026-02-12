const Application = require("../models/Application");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();

    const Applied = await Application.countDocuments({ status: "Applied" });
    const interview = await Application.countDocuments({ status: "Interview" });
    const approved = await Application.countDocuments({ status: "Approved" });
    const completed = await Application.countDocuments({ status: "Completed" });

    res.status(200).json({
      totalApplications,
      Applied,
      interview,
      approved,
      completed,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
