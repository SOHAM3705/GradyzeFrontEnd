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
    process.env.REACT_APP_API_URL || "https://gradyzebackend.onrender.com";

  // Handle OAuth Callback (Google Login)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      sessionStorage.setItem("token", token);
      fetchUserRole(token);
    }
  }, [location, navigate]);

  // Fetch User Role & Details
  const fetchUserRole = async (token) => {
    try {
      const roles = ["admin", "teacher", "student"];
      for (let role of roles) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/${role}/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data) {
            sessionStorage.setItem("role", role);
            sessionStorage.setItem(`${role}Id`, response.data._id);
            sessionStorage.setItem(`${role}Name`, response.data.name);

            console.log(`✅ ${role} logged in successfully`);

            // Redirect based on role
            navigate(`/${role}dash`);
            return;
          }
        } catch (error) {
          // Ignore and try next role
        }
      }
      setError("Authentication failed. User role not found.");
    } catch (err) {
      console.error("❌ Failed to fetch user role:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle Manual Login (Email & Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/adminlogin`,
        formData
      );

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("adminId", response.data.adminId);
        sessionStorage.setItem("adminName", response.data.name);
        sessionStorage.setItem("role", "admin");

        console.log("✅ Admin logged in successfully");
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

  // Handle Google Login
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
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
        <button className={styles.googleLogin} onClick={handleGoogleLogin}>
          <i className="fab fa-google"></i> Sign in with Google
        </button>

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
