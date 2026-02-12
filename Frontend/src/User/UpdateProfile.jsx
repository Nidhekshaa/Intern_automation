import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UpdateProfile.css";
import { useNavigate } from "react-router-dom";
import config from "../config";

const API = `${config.API_URL}/api`;

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [resumeUrl, setResumeUrl] = useState("");
  const [showReplace, setShowReplace] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    skills: "",
    resume: null,
  });

  const goDashboard = () => {
    navigate("/user-dashboard");
  };

  /* =========================
     FETCH PROFILE DATA
  ========================== */
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/profile`, {
        withCredentials: true,
      });

      if (!res.data?.user) return;

      const user = res.data.user;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        college: user.college || "",
        degree: user.degree || "",
        skills: user.skills?.join(", ") || "",
        resume: null,
      });

      setResumeUrl(user.resumeUrl || "");
      setShowReplace(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        navigate("/user-login");
      }
    }
  };

  /* =========================
     FETCH PROFILE COMPLETION
  ========================== */
  const fetchProfileStatus = async () => {
    try {
      const res = await axios.get(`${API}/profile-status`, {
        withCredentials: true,
      });

      setPercentage(res.data?.percentage ?? 0);
    } catch (err) {
      console.error("Failed to fetch profile status:", err);
      setPercentage(0);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================== */
  useEffect(() => {
    fetchProfile();
    fetchProfileStatus();
  }, []);

  /* =========================
     HANDLE INPUT CHANGE
  ========================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* =========================
     UPDATE PROFILE
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("phone", formData.phone);
      data.append("college", formData.college);
      data.append("degree", formData.degree);
      data.append("skills", formData.skills);

      if (formData.resume) {
        data.append("resume", formData.resume);
      }

      const res = await axios.put(`${API}/update`, data, {
        withCredentials: true,
      });

      setMessage(res.data?.msg || "Profile updated ✅");

      await fetchProfile();
      await fetchProfileStatus();
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("Profile update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/user-login");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <p onClick={goDashboard} className="back-link">
          ← Back to Dashboard
        </p>
        <h2>Update Profile</h2>
        <p className="subtitle">
          Keep your details updated for better opportunities
        </p>

        {/* ===== Progress Bar ===== */}
        <div className="progress-wrapper">
          <span>Profile Completion: {percentage}%</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Auto-filled */}
          <input value={formData.name} disabled />
          <input value={formData.email} disabled />

          {/* Editable */}
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            name="college"
            placeholder="College / University"
            value={formData.college}
            onChange={handleChange}
          />

          <input
            name="degree"
            placeholder="Degree"
            value={formData.degree}
            onChange={handleChange}
          />

          <textarea
            name="skills"
            placeholder="Skills (React, Node, Python...)"
            value={formData.skills}
            onChange={handleChange}
          />

          {/* ===== Resume Section ===== */}
          {resumeUrl && !showReplace ? (
            <div className="resume-box">
              <p>📄 Resume uploaded</p>

              <a
                href={`http://localhost:5000/uploads/${resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-resume"
              >
                View Resume
              </a>

              <button
                type="button"
                className="replace-btn"
                onClick={() => setShowReplace(true)}
              >
                Replace Resume
              </button>
            </div>
          ) : (
            <input
              type="file"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
            />
          )}

          <div className="btn-group">
            <button className="update-btn" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              className="user-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default UpdateProfile;
