import React from "react";
import styles from "./StudentLogin.module.css";
import { Link } from "react-router-dom";

const StudentLogin = () => {
  return (
    <div className={styles.studentBg}>
      <div className={styles.loginContainer}>
        {/* Header with Back Button and Title */}
        <div className={styles.loginHeader}>
          <Link to="/">
            <button className={styles.backButton_Slogin}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>
          <h2>Student Login</h2>
        </div>

        <form id="studentLoginForm">
          <div className={styles.inputGroup}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="studentEmail"
              placeholder="Email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="studentPassword"
              placeholder="Password"
              required
            />
          </div>
          <button className={styles.submitStudentloginbut} type="submit">
            Login
          </button>
        </form>
        <p>Don't have an account? Contact Your College/School Admin.</p>
        <p>
          <a href="#" className={styles.StudentLogin_a}>
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
