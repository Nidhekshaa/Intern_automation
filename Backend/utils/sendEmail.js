const nodemailer = require("nodemailer");

const sendMail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Orchivis Intern Hub" <${process.env.ADMIN_EMAIL}>`,
    ...mailOptions,
  });
};

module.exports = sendMail;
