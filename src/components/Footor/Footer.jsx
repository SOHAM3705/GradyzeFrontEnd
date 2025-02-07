// src/Footer.jsx
import React from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This makes the scroll smooth
    });
  }
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Gradyze</h4>
          <p>Making student evaluation simple and effective.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <Link
                to="/aboutus"
                onAnimationEnd={null}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                  navigate("/aboutus");
                }}
              >
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>
              <Link
                to="/privacypolicy"
                onAnimationEnd={null}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                  navigate("/privacypolicy");
                }}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/documentation"
                onAnimationEnd={null}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                  navigate("/documentation");
                }}
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                to="/contactus"
                onAnimationEnd={null}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                  navigate("/contactus");
                }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@gradyze.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Gradyze. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
