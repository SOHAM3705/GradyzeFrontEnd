import React, { useEffect, useState } from "react";
import styles from "./contactus.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Add successMessage state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `https://gradyzebackend.onrender.com/api/Gsheet/contactus`,
        formData
      );
      setResponseMessage(response.data.message);
      setSuccessMessage(
        "Thank you for your message! We'll get back to you soon."
      ); // Set success message
      setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
    } catch (error) {
      setResponseMessage("Error submitting the form. Try again.");
      setSuccessMessage(""); // Clear success message in case of an error
    }

    setLoading(false);
  };

  useEffect(() => {
    // Hide loading overlay after page loads
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      setTimeout(() => {
        loadingOverlay.style.opacity = "0";
        setTimeout(() => (loadingOverlay.style.display = "none"), 500);
      }, 1000);
    }

    // Reveal animation on scroll
    const revealElements = document.querySelectorAll(`.${styles.reveal}`);
    function revealOnScroll() {
      revealElements.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
          el.classList.add(styles.visible);
        }
      });
    }
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    return () => {
      window.removeEventListener("scroll", revealOnScroll);
    };
  }, [styles.reveal, styles.visible]);

  return (
    <div>
      <div className={styles.heroSection}>
        <h1>Get in Touch</h1>
        <p>
          We're here to help and answer any questions you might have about our
          Student Evaluation System
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.infoCards}>
          <div className={`${styles.card} ${styles.reveal}`}>
            <div className={styles.cardHeader}>
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Email Us</h3>
                <p>support@gradyze.com</p>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.reveal}`}>
            <div className={styles.cardHeader}>
              <i className="fas fa-phone"></i>
              <div>
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.reveal}`}>
            <div className={styles.cardHeader}>
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Visit Us</h3>
                <p>123 Education Street, Academic City</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={`${styles.sideContent} ${styles.reveal}`}>
            <div className={styles.locationMap}>
              <img src="contact-us.jpg" alt="Location map" />
            </div>
          </div>

          <div
            className={`${styles.contactForm} ${styles.reveal}`}
            id="contactForm"
          >
            <div className={styles.formHeader}>
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you soon</p>
            </div>

            <form id="form" onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Send Message"}
              </button>
              {responseMessage && <p>{responseMessage}</p>}
            </form>

            {successMessage && (
              <div className={styles.successMessage} id="successMessage">
                <h3>
                  <i className="fas fa-check-circle"></i> Thank you for your
                  message!
                </h3>
                <p>We'll get back to you as soon as possible.</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.connectWithUs}>
          <h2>Connect with Us</h2>
          <p>
            Follow us on social media to stay updated with our latest news and
            updates.
          </p>
          <div className={styles.socialIcons}>
            <a
              href="https://www.facebook.com/profile.php?id=61570261174985&mibextid=ZbWKw"
              className={styles.socialIcon}
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a
              href="https://x.com/incorbis?t=yRcNnKknmtATHWpOXWnA6w&s=09"
              className={styles.socialIcon}
            >
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/incorbis/"
              className={styles.socialIcon}
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="https://www.instagram.com/incorbis.official?igsh=OTlyb2VmZWVpdWly"
              className={styles.socialIcon}
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <Link to="/" className={styles.backButton}>
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
    </div>
  );
};

export default ContactUs;
