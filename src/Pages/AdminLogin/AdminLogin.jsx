import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null); // Store error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/admin/adminlogin",
        formData
      );

      console.log("🔹 Login Response Data:", response.data);

      if (response.data.token) {
        sessionstorage.setItem("token", response.data.token);
        sessionstorage.setItem("adminId", response.data.adminId);
        sessionstorage.setItem("adminName", response.data.name);

        console.log("✅ Token Stored in sessionstorage:", response.data.token);

        // ✅ Force refresh user profile after login
        setTimeout(() => {
          window.location.reload();
        }, 500); // Reload to apply token updates

        navigate("/admindash");
      } else {
        throw new Error("Token not received from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      console.error("❌ Login Error:", err.response?.data);
    }
  };

  return (
    <div className={styles.adminBg}>
      <div className={styles.loginContainer}>
        {/* Header with Back Button and Title */}
        <Link to="/">
          <button className={styles.backButton_Alogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        <div className={styles.loginHeader}>
          <h2>Admin Login</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && <p className={styles.errorMessage}>{error}</p>}{" "}
          {/* Show error message if any */}
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

        <p>
          Don't have an account?{" "}
          <Link to="/adminsignup" className={styles.AdminSignup_a}>
            Sign Up
          </Link>
        </p>

        <p>
          <a href="#" className={styles.AdminSignup_a}>
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
