const nodemailer = require("nodemailer");

const sendMail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Orchivis Intern Hub" <${process.env.ADMIN_EMAIL}>`,
    ...mailOptions,
  });
};

module.exports = sendMail;
