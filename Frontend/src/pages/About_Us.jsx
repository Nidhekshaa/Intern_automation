import "../styles/About_Us.css";
import logo from "/Orchivis_Logo_1.png";
import Footer from "./Footer";

function About_Us() {
  return (
    <div className="about">
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
      {/* ===== ABOUT ===== */}
      <div className="about-top">
        <div className="about-text">
          <h2>About Us</h2>
          <p>
            Orchivis Technology Solutions is a purpose-driven technology startup
            headquartered in Pollachi, Tamil Nadu, India. Founded in 2025 by
            seasoned technology leaders, we specialize in bridging the
            education-to-employment gap through innovative workforce solutions.
            Our platform leverages data-driven insights and industry
            partnerships to create meaningful career pathways for graduates,
            career-break professionals, and underrepresented talent across Tier
            2 & Tier 3 cities in India.
          </p>
        </div>

        <div className="about-image">
          <img src="/about us.jpg" alt="Teamwork" />
        </div>
      </div>

      {/* ===== VISION + MISSION ===== */}
      <div className="vision-mission">
        <div>
          <h3>Vision</h3>
          <p>
            To democratize access to quality career opportunities and
            professional development across India’s emerging talent hubs,
            creating a sustainable ecosystem where talent meets opportunity.
          </p>
        </div>

        <div>
          <h3>Mission</h3>
          <p>
            Our mission goes beyond placement — we’re committed to creating
            meaningful career pathways for graduates, career-break
            professionals, and under-represented talent across Tier 2 & Tier 3
            cities in India.
          </p>
        </div>
      </div>

      {/* ===== TEAM ===== */}
      <h2 className="team-title">Meet Our Team</h2>

      <div className="team-grid">
        <div className="team-card">
          <img src="/Arun img.png" alt="Arun" />
          <h4>Arun Prasad B.E, MSc (UK)</h4>
          <p className="role">Co-Founder & Managing Director</p>
          <p>
            20+ years in Technology & Delivery Management. Global experience
            across Japan, UK, and Middle East.
          </p>
        </div>

        <div className="team-card">
          <img src="/srini img.png" alt="Srinivasan" />
          <h4>Srinivasan Sankar MSc, SMP (IIM-Indore)</h4>
          <p className="role">Co-Founder & CTO</p>
          <p>
            20+ years in technology leadership, enterprise architecture and
            digital transformation at scale.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About_Us;
