import "../styles/Footer.css";
import logo from "/Orchivis_Logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-brand">
          <img src={logo} alt="Orchivis Logo" className="footer-logo" />
          <p className="tagline">Powering Dreams, Shaping Futures</p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h3>Services</h3>
          <ul>
            <li>Women Empowerment</li>
            <li>Graduate Readiness</li>
            <li>Staffing Solutions</li>
            <li>Career Mentorship</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li>Pollachi, Tamil Nadu</li>
            <li>+91 98765 43210</li>
            <li>
              <a href="mailto:contact@orchivis.com">
                contact@orchivis.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        Made with ❤️ by Orchivis Technology Solutions © 2025
      </div>
    </footer>
  );
}
