import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Handle OAuth callback (Google Login)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const role = queryParams.get("role");

    if (token && role) {
      // ✅ Store token & role dynamically
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);

      // ✅ Fetch user details dynamically based on role
      fetchUserDetails(token, role);
    }
  }, [location, navigate]);

  // ✅ Fetch user details dynamically based on role
  const fetchUserDetails = async (token, role) => {
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/${role}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        sessionStorage.setItem(`${role}Id`, response.data._id);
        sessionStorage.setItem(`${role}Name`, response.data.name);

        console.log(`✅ ${role} details fetched successfully`);

        // ✅ Redirect to respective dashboard based on role
        navigate(`/${role}dash`);
      }
    } catch (err) {
      console.error("❌ Failed to fetch user details:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ Handle Admin Login (Manual Login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/admin/adminlogin",
        formData
      );

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("adminId", response.data.adminId);
        sessionStorage.setItem("adminName", response.data.name);
        sessionStorage.setItem("role", "admin");

        console.log("✅ Admin logged in successfully");

        // ✅ Redirect to Admin Dashboard
        navigate("/admindash");
      } else {
        throw new Error("Token not received from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      console.error("❌ Login Error:", err.response?.data);
    }
  };

  // ✅ Handle Google Login
  const handleGoogleLogin = () => {
    window.location.href =
      "https://gradyzebackend.onrender.com/api/auth/google";
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

        {/* ✅ Google Login Button */}
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
