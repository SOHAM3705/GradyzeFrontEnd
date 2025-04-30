// src/LoginSection.jsx
import React from "react";
import styles from "./LoginSection.module.css";
import { Link } from "react-router-dom";

const LoginSection = () => {
  return (
    <div id="login" className={styles.loginSection}>
      <div className={`${styles.decorativeLine} ${styles.top}`}></div>
      <div className={styles.sectionHeader}>
        <h2>Access Portal</h2>
        <p>Choose your role to login to the system</p>
      </div>
      <div className={styles.loginCards}>
        {/* Student Login */}
        <div className={styles.loginCard}>
          <div className={styles.cardIcon}>
            <i className="fas fa-user-graduate"></i>
          </div>
          <h3>Student Portal</h3>
          <p>Access your evaluations, grades, and feedback</p>
          <Link to="/studentlogin">
            <button className={`${styles.btn} ${styles.studentBtn}`}>
              Login as Student
            </button>
          </Link>
        </div>

        {/* Teacher Login */}
        <div className={styles.loginCard}>
          <div className={`${styles.cardIcon} ${styles.teacherCard}`}>
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <h3>Teacher Portal</h3>
          <p>Manage evaluations and student assessments</p>
          <Link to="/teacherlogin">
            <button className={`${styles.btn} ${styles.teacherBtn}`}>
              Login as Teacher
            </button>
          </Link>
        </div>

        {/* Admin Login */}
        <div className={styles.loginCard}>
          <div className={`${styles.cardIcon} ${styles.adminCard}`}>
            <i className="fas fa-user-shield"></i>
          </div>
          <h3>Admin Portal</h3>
          <p>System management and administrative tools</p>
          <Link to="/adminlogin">
            <button className={`${styles.btn} ${styles.adminBtn}`}>
              Login as Admin
            </button>
          </Link>
        </div>
      </div>
      <div className={`${styles.decorativeLine} ${styles.bottom}`}></div>
    </div>
  );
};

export default LoginSection;
