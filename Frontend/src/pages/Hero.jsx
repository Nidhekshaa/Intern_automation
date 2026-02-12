import "../styles/Hero.css";
import logo from "/Orchivis_Logo_1.png";
import heroImg from "/Hero.png";
import { useState } from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Orchivis" className="logo" />
        </div>

        <div className="nav-links">
          <a href="/about-us">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">
        {/* Left content */}
        <div className="hero-text">
          <h1>
            Powering Dreams <br />
            Shaping Futures
          </h1>

          <p>
            Empowering interns with the tools, training and opportunities to
            launch successful careers.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Get Started
            </button>

            {showModal && (
              <div className="modal-overlay">
                <div className="hero-modal">
                  <h2>Select Your Role</h2>

                  <div className="role-buttons">
                    <button
                      className="role-btn user"
                      onClick={() => navigate("/user-login")}
                    >
                      User
                    </button>

                    <button
                      className="role-btn admin"
                      onClick={() => navigate("/admin-login")}
                    >
                      Admin
                    </button>
                  </div>

                  <span className="close" onClick={() => setShowModal(false)}>
                    ✕
                  </span>
                </div>
              </div>
            )}
            <button
              className="btn-outline"
              onClick={() => window.open("https://orchivis.com", "_blank")}
            >
              Explore Orchivis
            </button>
          </div>
        </div>

        {/* Right image */}
        <div className="hero-image">
          <img src={heroImg} alt="career woman" />
        </div>
      </section>
      <div className="thought-section">
        <h2 className="thought-title">Intern’s Insight</h2>

        <p className="thought-quote">
          “Success doesn’t come from what you do occasionally, it comes from
          what you do consistently.”
        </p>

        <p className="thought-description">
          Every small step you take today builds the professional you’ll become
          tomorrow. Stay curious, keep learning, and never underestimate the
          value of effort and patience.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default Hero;
