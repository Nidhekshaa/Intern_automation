import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.css";
import config from "../config";

const API = `${config.API_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    totalApplications: 0,
    applied: 0,
    interview: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchApplications();
  }, []);

  /* ---------- FETCH STATS ---------- */
  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(`${API}/admin/dashboard`, {
        withCredentials: true,
      });

      setStats(res.data.data || res.data); // supports both formats
    } catch (error) {
      console.error("Failed to load admin dashboard stats", error);
    }
  };

  /* ---------- FETCH APPLICATIONS ---------- */
  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API}/admin/applications`, {
        withCredentials: true,
      });
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to load applications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/admin/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  /* ============================= */
  /* FILTERING LOGIC */
  /* ============================= */

  const filteredApplications =
    selectedStatus === "All"
      ? applications
      : applications.filter((app) => app.status === selectedStatus);

  /* ============================= */
  /* PAGINATION LOGIC */
  /* ============================= */

  const totalPages = Math.ceil(
    filteredApplications.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentApplications = filteredApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">
            Overview of internship applications
          </p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="admin-cards">
        {[
          { label: "All", value: stats.totalApplications, class: "" },
          { label: "Applied", value: stats.applied, class: "applied" },
          { label: "Interview", value: stats.interview, class: "interview" },
          { label: "Approved", value: stats.approved, class: "approved" },
          { label: "Rejected", value: stats.rejected, class: "rejected" },
          { label: "Completed", value: stats.completed, class: "completed" },
        ].map((card) => (
          <div
            key={card.label}
            className={`admin-card ${card.class} ${
              selectedStatus === card.label ? "active-card" : ""
            }`}
            onClick={() => {
              setSelectedStatus(card.label === "All" ? "All" : card.label);
              setCurrentPage(1);
            }}
          >
            <h2>{card.value}</h2>
            <p>{card.label === "All" ? "Total Applications" : card.label}</p>
          </div>
        ))}
      </div>

      {/* ===== TABLE ===== */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Internship</th>
            <th>Status</th>
            <th>Applied On</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentApplications.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No applications found
              </td>
            </tr>
          ) : (
            currentApplications.map((app) => (
              <tr key={app._id}>
                <td>{app.user?.name}</td>
                <td>{app.internshipTitle}</td>
                <td className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin/applications/${app._id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
