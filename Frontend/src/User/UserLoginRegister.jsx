import { useState } from "react";
import "../styles/UserLoginRegister.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const API_URL = config.API_URL;
// ✅ ENSURE COOKIES ARE ALWAYS SENT
axios.defaults.withCredentials = true;

const LoginRegister = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // ================= REGISTER STATE =================
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ================= LOGIN STATE =================
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        registerData,
        { withCredentials: true },
      );

      alert(res.data.msg);
      setIsActive(false); // switch to login
    } catch (err) {
      alert(err.response?.data?.msg || "Error registering");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, loginData, {
        withCredentials: true,
      });

      alert(res.data.msg);

      navigate("/user-dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="UserLoginRegister">
      <div className={`container ${isActive ? "active" : ""}`}>
        {/* ================= SIGN UP ================= */}
        <div className="form-container sign-up">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>

            <div className="social-icons">
              <a href={`${API_URL}/auth/google`} className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href={`${API_URL}/auth/facebook`} className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href={`${API_URL}/auth/github`} className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
            </div>

            <span>or</span>
            <div className="password-options">
            <input
              type="text"
              placeholder="Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />

            <input
              type={showRegisterPassword ? "text" : "password"}
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                })
              }
              required
            />

            <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={showLoginPassword}
                  onChange={() => setShowLoginPassword(!showLoginPassword)}
                />
                <span>Show Password</span>
              </label>
            </div>

            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* ================= LOGIN ================= */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1>Log In</h1>

            <div className="social-icons">
              <a href={`${API_URL}/auth/google`} className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href={`${API_URL}/auth/facebook`} className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href={`${API_URL}/auth/github`} className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
            </div>

            <span>or</span>
            <div className="password-options">
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
            />

            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />

            <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={showLoginPassword}
                  onChange={() => setShowLoginPassword(!showLoginPassword)}
                />
                <span>Show Password</span>
              </label>
            </div>
            <a href="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </a>

            <button type="submit">Log In</button>
          </form>
        </div>

        {/* ================= TOGGLE PANEL ================= */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details</p>
              <button
                type="button"
                className="hidden"
                onClick={() => setIsActive(false)}
              >
                Log In
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Hello, Friends!</h1>
              <p>Register with your personal details</p>
              <button
                type="button"
                className="hidden"
                onClick={() => setIsActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
