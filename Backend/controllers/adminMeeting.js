const Application = require("../models/Application");
const { sendMailinterview } = require("../utils/mailer");
const path = require("path");

// generate meeting
const generateMeetingLink = () =>
   `https://meet.jit.si/interview-${Date.now()}`;

// ================= GET DETAILS =================
exports.getApplicationDetails = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("user");

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MOVE TO INTERVIEW =================

exports.scheduleInterview = async (req, res) => {
  try {
    const { dateTime } = req.body;

    const app = await Application.findById(req.params.id)
      .populate("user");

    if (!app)
      return res.status(404).json({ message: "Application not found" });

    if (!dateTime) {
      return res.status(400).json({ message: "Date and time required" });
    }
    const meetingLink = generateMeetingLink();

    app.status = "Interview";
    app.meetingLink = meetingLink;
    app.interviewDateTime = new Date(dateTime);

    app.timeline.push({
      status: "Interview Scheduled",
      date: new Date(),
    });

    await app.save();

    const formattedDate = new Date(dateTime).toLocaleString();

    const mailContent = `
      <h3>Interview Scheduled</h3>
      <p>Your interview is scheduled on:</p>
      <b>${formattedDate}</b>
      <p>Meeting Link:</p>
      <a href="${meetingLink}">${meetingLink}</a>
    `;

    // Send to Intern
    await sendMailinterview(app.user.email, "Interview Scheduled", mailContent);

    // Send to Admin
    await sendMailinterview(process.env.ADMIN_EMAIL, "Interview Scheduled (Admin Copy)", mailContent);

    res.json({ message: "Interview scheduled successfully", app });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= APPROVE =================
exports.approveApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("user");

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.status = "Approved";

    // If file uploaded
    const file = req.files?.offerLetter?.[0];
    if (file) {
      app.offerLetter = file.path;
    }

    app.timeline.push({
      status: "Approved",
      date: new Date(),
    });

    await app.save();
    // ✅ SEND MAIL
    const mailContent = `
      <h2>Congratulations ${app.user.name}</h2>
      <p>Your internship application has been approved.</p>
      <p>Welcome to the team!</p>
      
    `;
    await sendMailinterview(
      app.user.email,
      "Internship Approved 🎉",
      mailContent,
      [
        {
          filename: file.filename,
          path: file.path,
        },
      ]
    );

    res.json({ message: "Application approved & mail sent" });

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= REJECT =================
exports.rejectApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("user");

    app.status = "Rejected";
    await app.save();

    await sendMailinterview(
      app.user.email,
      "Internship Application Update",
      `
      <h3>Hello ${app.user.name}</h3>
      <p>We regret to inform you that your application was not selected.</p>
      <p>Thank you for applying.</p>
      `
    );

    res.json({ message: "Rejected & mail sent" });

  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= COMPLETE =================
exports.completeApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("user");

    const file = req.files?.certificate?.[0];
    if (file) {
      app.certificate = file.path;
    }
    if (!file) {
      return res.status(400).json({ message: "Certificate PDF required" });
    }

    app.status = "Completed";    

    app.timeline.push({
      status: "Completed",
      date: new Date(),
    });

    await app.save();

    const mailContent = `
      <h2>Well done ${app.user.name}!</h2>
      <p>Your internship has been completed successfully.</p>
      <p>Completion certificate attached below.</p>
    `;

    await sendMailinterview(
      app.user.email,
      "Completion Certificate",
      mailContent,
      [
        {
          filename: file.filename,
          path: file.path,
        },
      ]
    );

    res.json({ message: "Completed + certificate sent", app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
