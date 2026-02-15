import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";
import "../styles/ForgotPassword.css";

const API_URL = config.API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const navigate = useNavigate();

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    try {
      setError("");
      setLoadingSend(true);
      await axios.post(
        `${API_URL}/auth/send-otp`,
        { email },
        { withCredentials: true },
      );

      startTimer();
      alert("OTP sent");
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoadingSend(false);
    }
  };

  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");

    const newOtp = [...otpArray];

    if (value) {
      newOtp[index] = value;
      setOtpArray(newOtp);

      // move to next input
      if (index < 5) {
        e.target.nextSibling?.focus();
      }
    } else {
      newOtp[index] = "";
      setOtpArray(newOtp);
    }

    setOtp(newOtp.join(""));
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpArray];

      if (otpArray[index]) {
        // If current box has value → clear it
        newOtp[index] = "";
        setOtpArray(newOtp);
      } else if (index > 0) {
        // If empty → move to previous and clear it
        e.target.previousSibling?.focus();
        newOtp[index - 1] = "";
        setOtpArray(newOtp);
      }

      setOtp(newOtp.join(""));
    }
  };

  const verifyOtp = async () => {
    try {
      setError("");
      setLoadingVerify(true);

      const res = await axios.post(
        `${API_URL}/auth/verify-otp`,
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        },
      );

      navigate(`/reset-password?token=${res.data.token}`);
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setLoadingVerify(false); // ✅ stop loading
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2 className="forgot-password-title">Forgot Password</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="forgot-password-input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="forgot-password-button"
          onClick={sendOtp}
          disabled={timer > 0 || loadingSend}
        >
          {loadingSend
            ? "Sending..."
            : timer > 0
              ? `Resend in ${timer}s`
              : "Send OTP"}
        </button>
        <br />
        {/* OTP boxes */}
        <div className="otp-container">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-box"
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
            />
          ))}
        </div>

        <button
          className="forgot-password-button"
          onClick={verifyOtp}
          disabled={loadingVerify}
        >
          {loadingVerify ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
