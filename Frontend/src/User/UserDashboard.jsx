import "../styles/UserDashboard.css";
import { FaBriefcase, FaTasks, FaUserGraduate } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "/Orchivis_Logo_1.png";
import { useNavigate } from "react-router-dom";
import config from "../config";

const API = `${config.API_URL}/api`;

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Intern");
  const [profileComplete, setProfileComplete] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchProfileStatus();
  }, []);

  /* ================= FETCH USER ================= */
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/profile`, {
        withCredentials: true,
      });

      setUserName(res.data.user.name);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  /* ================= PROFILE STATUS ================= */
  const fetchProfileStatus = async () => {
    try {
      const res = await axios.get(`${API}/profile-status`, {
        withCredentials: true,
      });

      setPercentage(res.data?.percentage ?? 0);
      setProfileComplete(res.data?.profileComplete ?? false);
    } catch (err) {
      console.error("Failed to fetch profile status", err);
    }
  };

  /* ================= APPLY HANDLER ================= */
  const handleApply = async () => {
    // 🔴 First check profile completion properly
    if (!profileComplete) {
      Swal.fire({
        icon: "warning",
        title: "Profile Incomplete",
        text: "Please complete your profile before applying.",
        confirmButtonText: "Update Profile",
      }).then(() => {
        navigate("/update-profile");
      });
      return;
    }

    // 🔵 Ask for internship role
    const { value: role } = await Swal.fire({
      title: "Select Internship Role",
      input: "text",
      inputPlaceholder: "Enter internship role",
      showCancelButton: true,
    });

    if (!role) return;

    try {
      setLoading(true);

      Swal.fire({
        title: "Submitting Application...",
        text: "Kindly wait for a few seconds",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await axios.post(
        `${API}/applications/apply`,
        { internshipTitle: role },
        { withCredentials: true },
      );

      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Application Submitted 🎉",
        text: "Your application has been sent to the admin.",
        confirmButtonText: "View Status",
      }).then(() => navigate("/application-status"));
    } catch (err) {
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="nav-left">
        <img src={logo} alt="Orchivis" className="logo" />
      </div>
      {/* ===== Header ===== */}
      <header className="dashboard-header">
        <h1>Welcome, {userName} 👋</h1>
        <p>Your Internship Portal</p>

        {/* ===== Thought Section ===== */}
        <section className="thought-section">
          <h2 className="thought-title">Intern’s Insight</h2>
          <p className="thought-quote">“Every expert was once a beginner.”</p>
          <p className="thought-description">
            This platform automates and simplifies your internship journey.
          </p>
        </section>
      </header>

      {/* ===== Action Cards ===== */}
      <section className="dashboard-actions">
        <div className="action-card">
          <FaBriefcase className="action-icon" />
          <h3>Apply for Internship</h3>
          <p>
            {profileComplete
              ? "Explore available internships."
              : "Complete your profile to unlock applications."}
          </p>
          <button
            className="action-btn"
            onClick={handleApply}
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply Internship"}
          </button>
        </div>

        <div className="action-card">
          <FaTasks className="action-icon" />
          <h3>Application Status</h3>
          <p>Track all your internship applications.</p>
          <button
            className="action-btn"
            onClick={() => (window.location.href = "/application-status")}
          >
            Check Status
          </button>
        </div>

        <div className="action-card">
          <FaUserGraduate className="action-icon" />
          <h3>My Profile</h3>
          <p>Update your resume, skills, and details.</p>
          <button
            className="action-btn"
            onClick={() => (window.location.href = "/update-profile")}
          >
            Update Profile
          </button>
        </div>
      </section>

      <footer className="dashboard-footer">
        © {new Date().getFullYear()} Intern Hub Automation Portal 🚀
      </footer>
    </div>
  );
};

export default UserDashboard;
