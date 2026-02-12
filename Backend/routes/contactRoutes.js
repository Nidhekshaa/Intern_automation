const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// 1️⃣ Create transporter (TOP of file)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2️⃣ Route
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 3️⃣ Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 4️⃣ SEND EMAIL (THIS PART 👇)
    await transporter.sendMail({
      from: `"Orchivis Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,   // admin inbox (your Gmail)
      replyTo: email,               // user email
      subject: "New Contact Form Message",
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    // 5️⃣ Response to frontend
    res.status(201).json({ message: "Message sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
