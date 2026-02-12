const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const profileRoutes = require("./routes/profile");
const User = require("./models/User");
const recoveryRoutes = require("./recovery");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://intern-automation.vercel.app"
    ],
    credentials: true,
  }),
);

const session = require("express-session");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(express.json());
// app.use(cookieParser());

// app.set("trust proxy", 1);   // ⭐⭐⭐ ADD THIS

// app.use(
//   session({
//     name: "admin.sid",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

// app.use(
//   session({
//     name: "admin.sid",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false, // true only for HTTPS
//       sameSite: "lax",
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   }),
// );

const MongoStore = require("connect-mongo");

app.set("trust proxy", 1);

app.use(
  session({
    name: "admin.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,
      secure: true,      // true in production (Render uses HTTPS)
      sameSite: "none",  // required for cross-origin frontend
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// app.use((req, res, next) => {
//   console.log("Incoming:", req.method, req.url);
//   next();
// });


const passport = require("passport");

/* ----------------------- Application Routes ----------------------- */

app.use("/api/applications", applicationRoutes);

/* ----------------------- Admin Routes ----------------------- */

app.use("/api/admin", adminRoutes);

/* ----------------------- Profile Routes ----------------------- */

app.use("/uploads", express.static("uploads"));

app.use("/api", profileRoutes);

/* ----------------------- OAuth Routes ----------------------- */

app.use(passport.initialize());

require("./passport");

app.use("/auth", require("./routes/oauth"));

/* ----------------------  Contact  ------------------------ */
const contactRoutes = require("./routes/contactRoutes");

app.use("/api", contactRoutes);

/* ----------------------  User Login/Register  ------------------------ */
app.use("/api/auth", require("./routes/auth"));

/* ----------------------  Password Recovery  ------------------------ */
app.use("/", recoveryRoutes);

/* ----------------------  ResetPassword Login  ------------------------ */

app.post("/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Token invalid or expired" });

  user.password = newPassword;

  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  res.json({ message: "Password updated successfully" });
});

/* ----------------------  OTP Send and Verify  ------------------------ */

const crypto = require("crypto");
app.post("/auth/send-otp", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = crypto.randomInt(100000, 999999).toString();

  user.otp = await bcrypt.hash(otp, 10);
  user.otpExpiry = Date.now() + 60 * 1000; // 60 seconds

  await user.save();

  await transporter.sendMail({
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. Valid for 60 seconds.`,
  });

  res.json({ message: "OTP sent" });
});

/* ----------------------  OTP Verify  ------------------------ */

app.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.otpExpiry || user.otpExpiry < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  const valid = await bcrypt.compare(otp, user.otp);
  if (!valid) return res.status(400).json({ message: "Invalid OTP" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.json({ token });
});

// app.get("/api/test-session", (req, res) => {
//   res.json(req.session);
// });


/* ----------------------  Admin Login  ------------------------ */

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // ✅ THIS IS THE MISSING LINE
    req.session.admin = {
      email,
      role: "admin",
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
