import "../styles/AdminLogin.css";
import Admin from "/Admin.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import config from "../config";

const API_URL = config.API_URL;

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/api/admin/login`,
        { email, password },
        { withCredentials: true },
      );

      if (response.data.success) {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid login credentials");
    }
  };

  return (
    <div className="adminlogin-container">
      <div className="adminlogin-left">
        <img src={Admin} alt="Admin" className="adminlogin-img" />
      </div>

      <div className="adminlogin-right">
        <h2>Login</h2>

        {/* ✅ onSubmit belongs to form */}
        <form className="adminlogin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;
