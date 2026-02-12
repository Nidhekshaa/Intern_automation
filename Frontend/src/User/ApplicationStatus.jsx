import React, { useEffect, useState } from "react";
import "../styles/ApplicationStatus.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const API = `${config.API_URL}/api`;

const baseSteps = [
  "Applied",
  "Attend Interview",
  "Approved",
  "Internship Completed",
];

const ApplicationStatus = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1-based (matches UI)
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const goDashboard = () => {
    navigate("/user-dashboard");
  };

  const fetchApplicationStatus = async () => {
    try {
      const res = await axios.get(`${API}/applications/status`, {
        withCredentials: true,
      });
      setCurrentStep(res.data.currentStep);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  const steps =
    status === "Rejected"
      ? ["Applied", "Attend Interview", "Rejected", "Internship Completed"]
      : baseSteps;

  return (
    <div className="status-wrapper">
      {/* CARD */}
      <div className="status-card">
        <div className="application-status-header ">
          <p onClick={goDashboard} className="back-link">
            ← Back to Dashboard
          </p>
        </div>
        <h1>My Internship Application</h1>
        <p className="subtitle">
          Track your application progress step by step.
        </p>
        <p className="status-text">
          Here’s the current status of your application:
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress-container">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          const isRejected = status === "Rejected" && step === "Rejected";

          return (
            <div className="step-container" key={index}>
              {index !== 0 && (
                <div
                  className={`line ${
                    isRejected
                      ? "rejected"
                      : stepNumber <= currentStep
                        ? "completed"
                        : ""
                  }`}
                />
              )}

              <div
                className={`circle ${
                  isRejected
                    ? "rejected"
                    : completed
                      ? "completed"
                      : active
                        ? "active"
                        : ""
                }`}
              >
                {isRejected ? "✖" : completed || active ? "✓" : stepNumber}
              </div>

              <span className="step-label">{step}</span>
            </div>
          );
        })}
      </div>

      {/* STATUS DETAILS */}
      <div className="status-section">
        <h2>Application Details</h2>

        {status === "Applied" && (
          <p>
            Your application has been successfully submitted. Our team will
            review your profile and contact you if you are shortlisted for an
            interview.
          </p>
        )}

        {status === "Interview" && (
          <p>
            You have been shortlisted! Please attend the interview as per the
            schedule shared with you.
          </p>
        )}

        {status === "Approved" && (
          <p>
            Congratulations 🎉 You have been approved. Further instructions will
            be shared soon.
          </p>
        )}

        {status === "Rejected" && (
          <p style={{ color: "#ef4444" }}>
            ❌ Unfortunately your application was rejected.
          </p>
        )}

        {status === "Internship Completed" && (
          <p>
            🎓 Internship completed successfully. Thank you for being a part of
            our program!
          </p>
        )}
      </div>

      <footer className="status-footer">
        © {new Date().getFullYear()} Intern Hub Automation Portal 🚀
      </footer>
    </div>
  );
};

export default ApplicationStatus;
