import React, { useEffect, useState } from "react";
import styles from "./contactus.module.css";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    nameError: "",
    emailError: "",
    subjectError: "",
    messageError: "",
  });
  const [successMessage, setSuccessMessage] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    // Name validation
    if (formData.name.trim() === "") {
      setErrors({ ...errors, nameError: "Name is required." });
      isValid = false;
    } else {
      setErrors({ ...errors, nameError: "" });
    }

    // Email validation
    if (
      formData.email.trim() === "" ||
      !/^\S+@\S+\.\S+$/.test(formData.email.trim())
    ) {
      setErrors({ ...errors, emailError: "Enter a valid email." });
      isValid = false;
    } else {
      setErrors({ ...errors, emailError: "" });
    }

    // Subject validation
    if (formData.subject.trim() === "") {
      setErrors({ ...errors, subjectError: "Subject is required." });
      isValid = false;
    } else {
      setErrors({ ...errors, subjectError: "" });
    }

    // Message validation
    if (formData.message.trim() === "") {
      setErrors({ ...errors, messageError: "Message cannot be empty." });
      isValid = false;
    } else {
      setErrors({ ...errors, messageError: "" });
    }

    // If valid, show success message
    if (isValid) {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
    }
  };

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
                <div className={styles.error} id="nameError">
                  {errors.nameError}
                </div>
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
                <div className={styles.error} id="emailError">
                  {errors.emailError}
                </div>
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
                <div className={styles.error} id="subjectError">
                  {errors.subjectError}
                </div>
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
                <div className={styles.error} id="messageError">
                  {errors.messageError}
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <i className="fas fa-paper-plane"></i> Send Message
              </button>
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
