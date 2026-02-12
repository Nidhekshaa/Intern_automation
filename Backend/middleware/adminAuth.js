module.exports = (req, res, next) => {
  console.log("Session:", req.session);

  if (!req.session.admin) {
    return res.status(401).json({ message: "Not logged in" });
  }

  if (req.session.admin.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  if (!req.session.admin) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    });
  }

  next();
};
