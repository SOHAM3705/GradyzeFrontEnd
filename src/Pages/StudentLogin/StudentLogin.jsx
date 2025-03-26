import React, { useState } from "react";
import styles from "./StudentLogin.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/student/login",
        { email, password }
      );

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("studentId", response.data.student._id);
      sessionStorage.setItem("studentName", response.data.student.name);
      sessionStorage.setItem("adminId", response.data.student.adminId); // Store Admin ID
      sessionStorage.setItem("teacherId", response.data.student.teacherId); // Store Teacher ID

      navigate("/studentdash");
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.studentBg}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <Link to="/">
            <button className={styles.backButton_Slogin}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>
          <h2>Student Login</h2>
        </div>

        <form id="studentLoginForm" onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="studentEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="studentPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className={styles.submitStudentloginbut}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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
