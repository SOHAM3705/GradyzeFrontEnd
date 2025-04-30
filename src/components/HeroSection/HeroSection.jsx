// src/HeroSection.jsx
import React from "react";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const scrollToLogin = () => {
    document.getElementById("login").scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1>Ready to Revolutionize Marks Management?</h1>
          <p className={styles.heroDescription}>
            Gradyze offers a comprehensive platform designed to streamline and
            digitize the process of managing academic marks for schools and
            colleges. Facilitate seamless coordination among Admin, Teacher, and
            Student roles.
          </p>
          <div className={styles.heroButtons}>
            <button
              onClick={scrollToLogin}
              className={`${styles.btn} ${styles.primaryBtn}`}
            >
              Get Started
            </button>
            <button
              onClick={scrollToFeatures}
              className={`${styles.btn} ${styles.secondaryBtn}`}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
