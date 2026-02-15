import { useState } from "react";
import "../styles/AuthCommon.css";
import "../styles/Register.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const API_URL = config.API_URL;
axios.defaults.withCredentials = true;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        registerData,
        { withCredentials: true },
      );

      alert(res.data.msg);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Error registering");
    }
  };

  return (
    <div className="AuthPage">
      <div className="auth-container">
        <form onSubmit={handleRegister}>
          <h1 className="register-title">Create Account</h1>
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
            type="text"
            placeholder="Name"
            id="name"
            name="name"
            autoComplete="name"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            autoComplete="email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            name="password"
            autoComplete="new-password"
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
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>Show Password</span>
          </label>

          <button type="submit">Sign Up</button>

          <p className="register-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/user-login")} className="link">
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
