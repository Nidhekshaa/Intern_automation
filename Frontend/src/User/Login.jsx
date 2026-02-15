import { useState } from "react";
import "../styles/AuthCommon.css";
import "../styles/Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const API_URL = config.API_URL;
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

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
    <div className="AuthPage">
      <div className="auth-container">
        <form onSubmit={handleLogin}>
          <h1 className="login-title">Log In</h1>
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

          <span className="or">or</span>

          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            autoComplete="email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            name="password"
            autoComplete="current-password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
          />

          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>Show Password</span>
          </label>

          <a href="/forgot-password" className="forgot-password-link">
            Forgot your password?
          </a>

          <button type="submit">Log In</button>

          <p className="login-footer">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/user-register")} className="link">
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
