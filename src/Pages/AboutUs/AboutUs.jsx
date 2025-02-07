import React, { useEffect } from "react";
import styles from "./AboutUs.module.css";
import { Link } from "react-router-dom";

const AboutUs = () => {
  useEffect(() => {
    // Smooth Counter Animation
    function animateCounter(id, start, end, duration) {
      let obj = document.getElementById(id),
        range = end - start,
        increment = range / (duration / 20),
        current = start,
        timer = setInterval(() => {
          current += increment;
          obj.textContent = Math.floor(current);
          if (current >= end) {
            clearInterval(timer);
            obj.textContent = end;
          }
        }, 20);
    }

    // Run animation when component mounts
    animateCounter("students", 0, 5000, 2000);
    animateCounter("exams", 0, 1200, 2000);
    animateCounter("reports", 0, 3500, 2000);
    animateCounter("teachers", 0, 200, 2000);
    animateCounter("admins", 0, 150, 2000);
  }, []);

  return (
    <div>
      <Link to="/" className={styles.backButton}>
        <i className="fas fa-arrow-left"></i>
      </Link>
      <header className={styles.header}>
        <h1>About Gradyze</h1>
        <p>Empowering Educators, Administrators, and Students</p>
      </header>

      <section className={styles.about}>
        <div className={styles.aboutContent}>
          <h2>Who We Are</h2>
          <p>
            Gradyze is a Student Evaluation System designed to simplify academic
            assessments. Our platform provides teachers, administrators, and
            students with powerful tools to manage results, track performance,
            and generate reports.
          </p>
        </div>
        <img src="aboutus.webp" alt="Our Team" />
      </section>

      <section className={styles.roles}>
        <div className={`${styles.roleCard} ${styles.student}`}>
          <h3>For Students</h3>
          <p>
            Personalized learning insights tailored to individual strengths,
            detailed feedback reports for improvement, and real-time academic
            progress tracking for better performance monitoring.
          </p>
        </div>
        <div className={`${styles.roleCard} ${styles.teacher}`}>
          <h3>For Teachers</h3>
          <p>
            Automated grading with AI-driven accuracy, in-depth performance
            analytics, and seamless student progress tracking for data-driven
            academic insights.
          </p>
        </div>
        <div className={`${styles.roleCard} ${styles.admin}`}>
          <h3>For Admins</h3>
          <p>
            Comprehensive data management with structured organization,
            real-time performance insights for informed decision-making, and
            secure reporting tools ensuring data integrity and accessibility.
          </p>
        </div>
      </section>

      <section className={styles.mission}>
        <h2>Our Mission</h2>
        <p>
          To revolutionize student evaluation by making it efficient,
          data-driven, and insightful.
        </p>
      </section>

      <section className={styles.stats}>
        <div className={styles.statBox}>
          <h3>
            <span id="students">0</span>+
          </h3>
          <p>Students Evaluated</p>
        </div>
        <div className={styles.statBox}>
          <h3>
            <span id="exams">0</span>+
          </h3>
          <p>Exams Conducted</p>
        </div>
        <div className={styles.statBox}>
          <h3>
            <span id="reports">0</span>+
          </h3>
          <p>Reports Generated</p>
        </div>
        <div className={styles.statBox}>
          <h3>
            <span id="teachers">0</span>+
          </h3>
          <p>Teachers Onboarded</p>
        </div>
        <div className={styles.statBox}>
          <h3>
            <span id="admins">0</span>+
          </h3>
          <p>Admins Onboarded</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Powered By INCORBIS</p>
        <p>© 2025 Gradyze. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
