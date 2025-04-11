import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://gradyzebackend.onrender.com";

  // Handle OAuth Callback from Google
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window._gsiInitialized) return;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGSI;
      document.body.appendChild(script);
    };

    const initializeGSI = () => {
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (window.google && window.google.accounts && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("gsi-button"),
          {
            theme: "outline",
            size: "large",
          }
        );

        window._gsiInitialized = true;
      } else {
        console.warn("❗ Google API not loaded or Client ID missing.");
      }
    };

    const handleCredentialResponse = async (response) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
          credential: response.credential,
        });

        const { token, role, name, adminId } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("adminId", adminId);
        localStorage.setItem("adminName", name);

        console.log("✅ Google login success:", res.data);

        // Navigate first, then consider if reload is necessary
        navigate("/admindash");
      } catch (err) {
        console.error("❌ Google login failed:", err);
        setError("Google login failed. Try again.");
      }
    };

    loadGoogleScript();
  }, [navigate]);

  // Manual login handler
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
        formData
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("adminId", response.data.adminId);
        localStorage.setItem("adminName", response.data.name);
        localStorage.setItem("role", "admin");

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
          <button className={styles.backButton_Alogin}>
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

        {/* Google Login Button */}
        <div id="gsi-button" style={{ marginTop: "20px" }}></div>

        <p>
          Don't have an account?{" "}
          <Link to="/adminsignup" className={styles.AdminSignup_a}>
            Sign Up
          </Link>
        </p>

        <p>
          <Link to="/forgetpassword" className={styles.AdminSignup_a}>
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
