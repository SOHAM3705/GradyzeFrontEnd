// src/AdminLogin.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gsiRendered, setGsiRendered] = useState(false); // Track if GSI is rendered
  const navigate = useNavigate();
  const gsiContainerRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window._gsiInitialized) {
        initializeGSI();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window._gsiInitialized = true;
        initializeGSI();
      };
      document.body.appendChild(script);
    };

    const initializeGSI = () => {
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (
        window.google &&
        window.google.accounts &&
        GOOGLE_CLIENT_ID &&
        gsiContainerRef.current &&
        !gsiRendered
      ) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(gsiContainerRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
        });

        setGsiRendered(true);
      }
    };

    const handleCredentialResponse = async (response) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
          token: response.credential,
          role: "admin",
        });

        const { token, role, name, adminId } = res.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("adminId", adminId);
        sessionStorage.setItem("adminName", name);

        navigate("/admindash");
      } catch (err) {
        console.error("❌ Google login failed:", err);
        setError("Google login failed. Try again.");
      }
    };

    loadGoogleScript();
  }, [navigate, gsiRendered]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/adminlogin`,
        { ...formData, role: "admin" }
      );

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("adminId", response.data.adminId);
        sessionStorage.setItem("adminName", response.data.name);
        sessionStorage.setItem("role", "admin");

        navigate("/admindash");
      } else {
        throw new Error("Token not received from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      console.error("❌ Login Error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminBg}>
      <div className={styles.loginContainer}>
        <Link to="/">
          <button className={styles.backButtonAlogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        <div className={styles.loginHeader}>
          <h2>Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {loading && <p className={styles.loadingMessage}>Loading...</p>}
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

          <button className={styles.submitAdminbut} type="submit">
            Login
          </button>
        </form>

        <div
          ref={gsiContainerRef}
          style={{ marginTop: "20px", width: "100%" }}
        ></div>

        <p>
          Don't have an account?{" "}
          <Link to="/adminsignup" className={styles.AdminSignupA}>
            Sign Up
          </Link>
        </p>

        <p>
          <Link to="/forgotpassword" className={styles.AdminSignupA}>
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
