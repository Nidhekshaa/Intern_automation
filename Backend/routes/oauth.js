const express = require("express");
const passport = require("passport");

const router = express.Router();

/* ================= GOOGLE ================= */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    // ✅ Redirect to React dashboard
    res.redirect("http://localhost:5173/user-dashboard");
  }
);

/* ================= FACEBOOK ================= */

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/user-dashboard");
  }
);

/* ================= GITHUB ================= */

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/user-dashboard");
  }
);

module.exports = router;
