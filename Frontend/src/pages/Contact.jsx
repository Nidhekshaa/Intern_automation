import "../styles/Contact.css";
import logo from "/Orchivis_Logo_1.png";
import Footer from "./Footer";
import { FaHome, FaPhone, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import config from "../config";

const API_URL = config.API_URL;

function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Message sent successfully ✅");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Server error ❌");
    }
  };

  return (
    <div className="contact">
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Orchivis" className="logo" />
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about-us">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>
      </nav>
      <div className="contact-section">
        <div className="contact-text">
          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? Get in touch with us, and we’ll respond
            as soon as possible.
          </p>
          <div className="contact-info">
            <div className="info-item">
              <FaHome className="icon" />
              <div>
                <h3>Address</h3>
                <p>
                  5/29/17 Kandasamy Puram layout,
                  <br />
                  Udumalai Road, Pollachi
                  <br />
                  Tamil Nadu- 642003
                </p>
              </div>
            </div>

            <div className="info-item">
              <FaPhone className="icon" />
              <div>
                <h3>Phone</h3>
                <p>12345 67890</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="icon" />
              <div>
                <h3>Email</h3>
                <p>office@orchivis.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h3>Send Message</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <textarea
              name="message"
              placeholder="Type Your Message...."
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
