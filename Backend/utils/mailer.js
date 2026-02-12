const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

exports.sendMailinterview = async (to, subject, html, attachments=[]) => {
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
