// src/TeacherLogin.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./TeacherLogin.module.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const gsiRendered = useRef(false); // Prevent duplicate renders

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
          role: "teacher",
        });

        const { token, teacherId, name, adminId } = res.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", "teacher");
        sessionStorage.setItem("teacherId", teacherId);
        sessionStorage.setItem("teacherName", name);
        sessionStorage.setItem("adminId", adminId);

        navigate("/teacherdash");
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
      const response = await axios.post(`${API_BASE_URL}/api/teacher/login`, {
        ...formData,
        role: "teacher",
      });

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("teacherId", response.data.teacher._id);
        sessionStorage.setItem("teacherName", response.data.teacher.name);
        sessionStorage.setItem("adminId", response.data.teacher.adminId);
        sessionStorage.setItem("role", "teacher");

        navigate("/teacherdash");
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
    <div className={styles.teacherBg}>
      <div className={styles.loginContainer}>
        <Link to="/">
          <button className={styles.backButtonTlogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        <div className={styles.loginHeader}>
          <h2>Teacher Login</h2>
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

          <button className={styles.TloginBut} type="submit">
            Login
          </button>
        </form>

        {/* Google Login Button */}
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
          <Link to="/teacher-forget-password" className={styles.teacherLoginA}>
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;
