import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ApplicationDetails.css";
import Swal from "sweetalert2";
import config from "../config";

const API = `${config.API_URL}/api/admin`;

const ApplicationDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [status, setStatus] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [offerLetter, setOfferLetter] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Only ONE fetchData function
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/applications/${id}`, {
        withCredentials: true,
      });

      setApp(res.data);
      setStatus(res.data.status);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setSessionExpired(true);
      } else {
        console.error("Error fetching application:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (type) => {
    try {
      await axios.post(
        `${API}/applications/${id}/${type}`,
        {},
        { withCredentials: true },
      );
      fetchData();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const scheduleInterview = async () => {
    if (!dateTime) {
      Swal.fire({
        icon: "warning",
        title: "Please select date and time",
      });
      return;
    }

    try {
      setActionLoading(true);

      Swal.fire({
        title: "Scheduling Interview...",
        text: "Kindly wait for a few seconds",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await axios.post(
        `${API}/applications/${id}/schedule`,
        { dateTime },
        { withCredentials: true },
      );

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Interview Scheduled 🎉",
      });

      setShowInterviewModal(false);
      await fetchData();
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Failed to schedule interview",
      });
      console.error("Error scheduling interview:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const approveWithUpload = async () => {
    if (!offerLetter) return alert("Upload offer letter PDF");

    const formData = new FormData();
    formData.append("offerLetter", offerLetter);

    await axios.post(`${API}/applications/${id}/approve`, formData, {
      withCredentials: true,
    });

    setShowApproveModal(false);
    setOfferLetter(null);
    fetchData();
  };

  const completeWithUpload = async () => {
    if (!certificate) return alert("Upload certificate PDF");

    const formData = new FormData();
    formData.append("certificate", certificate);

    await axios.post(`${API}/applications/${id}/complete`, formData, {
      withCredentials: true,
    });

    setShowCompleteModal(false);
    setCertificate(null);
    fetchData();
  };

  if (sessionExpired) {
    return (
      <div className="session-expired-container">
        <div className="session-card">
          <h2>🔒 Session Expired</h2>
          <p>Your admin session has expired.</p>
          <p>Please login again to continue.</p>

          <button onClick={() => (window.location.href = "/admin-login")}>
            Login Again
          </button>
        </div>
      </div>
    );
  }

  if (!app) return <p>Loading...</p>;

  return (
    <div className="application-details">
      <div className="back-header">
        <button
          className="back-btn"
          onClick={() => (window.location.href = "/admin-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
      <h2>Application Details</h2>

      {/* USER INFO */}
      <div className="card">
        <h3>Student Info</h3>
        <p>
          <b>Name:</b> {app.user?.name}
        </p>
        <p>
          <b>Email:</b> {app.user?.email}
        </p>
        <p>
          <b>College:</b> {app.user?.college}
        </p>
        <p>
          <b>Skills:</b> {app.user?.skills}
        </p>
      </div>

      {/* RESUME */}
      <div className="card">
        <h3>Resume</h3>
        {app.user?.resumeUrl && (
          <a
            href={`http://localhost:5000/uploads/${app.user.resumeUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            View PDF
          </a>
        )}
      </div>

      {/* STATUS */}
      <div className="card">
        <h3>Status</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Completed</option>
        </select>
      </div>
      {/* ===== Offer Letter ===== */}
      {app.offerLetter && (
        <div className="card">
          <h3>Offer Letter</h3>
          <a
            href={`http://localhost:5000/uploads/OfferLetters/${app.offerLetter}`}
            target="_blank"
            rel="noreferrer"
          >
            View PDF
          </a>
        </div>
      )}

      {/* ===== Completion Certificate ===== */}
      {app.certificate && (
        <div className="card">
          <h3>Completion Certificate</h3>
          <a
            href={`http://localhost:5000/uploads/Certificates/${app.certificate}`}
            target="_blank"
            rel="noreferrer"
          >
            View PDF
          </a>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="actions">
        <button onClick={() => setShowInterviewModal(true)}>
          Take Interview
        </button>

        <button onClick={() => setShowApproveModal(true)}>Approve</button>

        <button onClick={() => updateStatus("reject")}>Reject</button>

        <button onClick={() => setShowCompleteModal(true)}>
          Internship Completed
        </button>
      </div>

      {/* INTERVIEW DETAILS */}
      {app.meetingLink && (
        <div className="card">
          <h3>Interview Details</h3>
          <p>
            Date:{" "}
            {app.interviewDateTime
              ? new Date(app.interviewDateTime).toLocaleString()
              : "Not Scheduled"}
          </p>

          <a href={app.meetingLink} target="_blank" rel="noreferrer">
            Join Meeting
          </a>
        </div>
      )}
      {showInterviewModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Schedule Interview</h3>

            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />

            <button onClick={scheduleInterview}>Submit</button>

            <button onClick={() => setShowInterviewModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ================= APPROVE MODAL ================= */}
      {showApproveModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload Offer Letter (PDF)</h3>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setOfferLetter(e.target.files[0])}
            />

            <button onClick={approveWithUpload}>Upload & Approve</button>
            <button onClick={() => setShowApproveModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ================= COMPLETE MODAL ================= */}
      {showCompleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload Completion Certificate (PDF)</h3>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setCertificate(e.target.files[0])}
            />

            <button onClick={completeWithUpload}>Upload & Complete</button>
            <button onClick={() => setShowCompleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      <div className="card">
        <h3>Status Timeline</h3>
        <ul>
          {app.timeline?.map((item, index) => (
            <li key={index}>
              {item.status} → {new Date(item.date).toLocaleDateString()}
            </li>
          ))}

          {app.meetingLink && (
            <li>
              Interview Link →{" "}
              <a href={app.meetingLink} target="_blank" rel="noreferrer">
                Join Meeting
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* MODAL */}
    </div>
  );
};

export default ApplicationDetails;
