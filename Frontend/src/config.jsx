const config = {
  // Check environment: development (localhost) vs production (deployed)
  API_URL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://intern-automation.onrender.com"
};

export default config;
