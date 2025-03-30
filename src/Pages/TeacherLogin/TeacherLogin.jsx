import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./TeacherLogin.module.css";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/teacherlogin",
        formData
      );

      console.log("🔹 Teacher Login Response:", response.data);

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("teacherId", response.data.teacherId);
        sessionStorage.setItem("teacherName", response.data.name);
        sessionStorage.setItem("AdminId", response.data.adminId);

        console.log("✅ Teacher Data stored in sessionStorage");

        setTimeout(() => {
          window.location.reload();
        }, 500);

        navigate("/teacherdash");
      } else {
        throw new Error("Token missing in response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      console.error("❌ Login Error:", err.response?.data);
    }
  };

  // ✅ Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get(
        "https://gradyzebackend.onrender.com/api/auth/google",
        { withCredentials: true }
      );

      console.log("🔹 Google Login Response:", response.data);

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("teacherId", response.data.teacherId);
        sessionStorage.setItem("teacherName", response.data.name);
        sessionStorage.setItem("AdminId", response.data.adminId);

        console.log("✅ Google Token Stored:", response.data.token);

        setTimeout(() => {
          window.location.reload();
        }, 500);

        navigate("/teacherdash");
      } else {
        throw new Error("Google login failed");
      }
    } catch (err) {
      setError("Google login failed. Try again.");
      console.error("❌ Google Login Error:", err);
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

        {/* Login Header */}
        <div className={styles.loginHeader}>
          <h2>Teacher Login</h2>
        </div>

        {/* Login Form */}
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

          <button className={styles.submitTeacherloginbut} type="submit">
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
