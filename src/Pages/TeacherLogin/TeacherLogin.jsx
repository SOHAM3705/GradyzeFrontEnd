import React, { useState } from "react";
import styles from "./TeacherLogin.module.css";
import { Link } from "react-router-dom";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter both email and password.");
    } else {
      alert("Teacher Login Successful!");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className={styles.teacherBg}>
      <div className={styles.loginContainer}>
        {/* Back Button */}
        <Link to="/">
          <button className={styles.backButton_Tlogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>
        <h2>Teacher Login</h2>
        <form id="teacherLoginForm" onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="teacherEmail"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="teacherPassword"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.Tlogin_but}>
            Login
          </button>
        </form>
        <p>Don't have an account? Contact Your College/School Admin</p>
        <p>
          <a href="#" className={styles.TeacherLogin_a}>
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;
