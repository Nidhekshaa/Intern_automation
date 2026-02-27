const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
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
