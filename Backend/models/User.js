const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    // ===== PROFILE FIELDS =====
    phone: { type: String, default: "" },
    college: { type: String, default: "" },
    degree: { type: String, default: "" },

    // skills should be ARRAY (important)
    skills: { type: [String], default: [] },

    // resume URL or file path
    resumeUrl: { type: String, default: "" },

    // ===== PASSWORD RESET =====
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);


// ============================
// PROFILE COMPLETION CHECK
// ============================
userSchema.methods.isProfileComplete = function () {
  return (
    this.name &&
    this.email &&
    this.phone &&
    this.college &&
    this.degree &&
    this.resumeUrl &&
    Array.isArray(this.skills) &&
    this.skills.length > 0
  );
};


// ============================
// PASSWORD HASHING
// ============================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


// ============================
// PASSWORD COMPARISON
// ============================
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
