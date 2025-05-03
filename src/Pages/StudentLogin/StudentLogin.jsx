// src/StudentLogin.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./StudentLogin.module.css";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const gsiRendered = useRef(false); // Prevent duplicate renders

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Google Sign-In
  useEffect(() => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGSI;
      document.body.appendChild(script);
    };

    const initializeGSI = () => {
      if (!window.google || gsiRendered.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render button with fixed width and proper text
      window.google.accounts.id.renderButton(
        document.getElementById("gsi-button"),
        {
          theme: "outline",
          size: "large",
          text: "Login_with", // Forces "Sign in with Google"
          width: "100%", // Fix for shrinking issue
        }
      );

      gsiRendered.current = true;
    };

    const handleCredentialResponse = async (response) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
          token: response.credential,
          role: "student",
        });

        const { token, studentId, name, adminId } = res.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", "student");
        sessionStorage.setItem("studentId", studentId);
        sessionStorage.setItem("studentName", name);
        sessionStorage.setItem("adminId", adminId);

        navigate("/studentdash");
      } catch (err) {
        console.error("Google login failed:", err);
        setError("Google login failed. Try again.");
      }
    };

    if (!window.google) {
      loadGoogleScript();
    } else {
      initializeGSI();
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/student/login`,
        formData
      );

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("studentId", response.data.studentId);
        sessionStorage.setItem("studentName", response.data.name);
        sessionStorage.setItem("adminId", response.data.adminId);
        sessionStorage.setItem("role", "student");

        navigate("/studentdash");
      } else {
        throw new Error("Token missing in response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.studentBg}>
      <div className={styles.loginContainer}>
        <Link to="/">
          <button className={styles.backButtonSlogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        <div className={styles.loginHeader}>
          <h2>Student Login</h2>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {loading && <p className={styles.loadingMessage}>Loading...</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.submitStudentloginbut} type="submit">
            Login
          </button>
        </form>

        <div
          id="gsi-button"
          style={{
            marginTop: "10px",
            width: "100%", // Ensures full width
            minHeight: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        ></div>

        <p>Don't have an account? Contact Your College/School Admin</p>
        <p>
          <Link to="/student-forget-password" className={styles.StudentLoginA}>
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
