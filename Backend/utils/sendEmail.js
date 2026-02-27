const nodemailer = require("nodemailer");

const sendMail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 2525,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  try {
    await transporter.sendMail({
      from: `"Orchivis Intern Hub" <${process.env.ADMIN_EMAIL}>`,
      ...mailOptions,
    });
  } catch (err) {
    console.error("MAIL ERROR:", err);
  }
};

module.exports = sendMail;
