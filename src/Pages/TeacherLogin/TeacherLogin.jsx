import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./TeacherLogin.module.css";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Handle Google OAuth callback
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const role = queryParams.get("role");

    if (token) {
      if (role === "teacher") {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", "teacher");
        fetchTeacherDetails(token);
      } else {
        setError("Only teacher accounts can access this page.");
        setTimeout(() => navigate(`/${role}login`), 2000); // Redirect based on role
      }
    }
  }, [location, navigate]);

  // ✅ Fetch teacher details using token
  const fetchTeacherDetails = async (token) => {
    try {
      const response = await axios.get(
        "https://gradyzebackend.onrender.com/api/teacher/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        sessionStorage.setItem("teacherId", response.data._id);
        sessionStorage.setItem("teacherName", response.data.name);
        sessionStorage.setItem("AdminId", response.data.adminId);
        navigate("/teacherdash"); // ✅ Redirect to teacher dashboard
      }
    } catch (err) {
      console.error("❌ Failed to fetch teacher details:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ Handle manual login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/login",
        formData
      );

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("teacherId", response.data.teacher._id);
        sessionStorage.setItem("teacherName", response.data.teacher.name);
        sessionStorage.setItem("AdminId", response.data.teacher.adminId);
        sessionStorage.setItem("role", "teacher");

        console.log("✅ Teacher Data stored in sessionStorage");
        navigate("/teacherdash"); // ✅ Redirect to teacher dashboard
      } else {
        throw new Error("Token missing in response");
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
    <div className={styles.teacherBg}>
      <div className={styles.loginContainer}>
        {/* Back Button */}
        <Link to="/">
          <button className={styles.backButton_Tlogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        {/* Login Header */}
        <div className={styles.loginHeader}>
          <h2>Teacher Login</h2>
        </div>

        {/* Error Message */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Login Form */}
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

          <button className={styles.Tlogin_but} type="submit">
            Login
          </button>
        </form>

        {/* ✅ Google Login Button */}
        <button className={styles.googleLogin} onClick={handleGoogleLogin}>
          <i className="fab fa-google"></i> Sign in with Google
        </button>

        <p>Don't have an account? Contact Your College/School Admin</p>
        <p>
          <Link to="/teacher-forget-password" className={styles.TeacherLogin_a}>
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;
