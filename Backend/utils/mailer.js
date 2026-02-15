const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMailinterview = async (to, subject, html, attachments = []) => {
  try {
    await transporter.sendMail({
      from: `"Orchivis Intern Hub" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Mail error:", err);
  }
};
