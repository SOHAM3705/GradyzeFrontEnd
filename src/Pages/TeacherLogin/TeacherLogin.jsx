import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./TeacherLogin.module.css";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "https://gradyzebackend.onrender.com";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const role = queryParams.get("role");

    if (token && role === "teacher") {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", "teacher");
      fetchTeacherDetails(token);
    } else if (token) {
      setError("Only teacher accounts can access this page.");
      setTimeout(() => navigate(`/${role}login`), 2000);
    }
  }, [location, navigate]);

  const fetchTeacherDetails = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teacher/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        sessionStorage.setItem("teacherId", response.data._id);
        sessionStorage.setItem("teacherName", response.data.name);
        sessionStorage.setItem("AdminId", response.data.adminId);
        navigate("/teacherdash");
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/teacher/login`,
        formData
      );

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("teacherId", response.data.teacher._id);
        sessionStorage.setItem("teacherName", response.data.teacher.name);
        sessionStorage.setItem("AdminId", response.data.teacher.adminId);
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

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className={styles.teacherBg}>
      <div className={styles.loginContainer}>
        <Link to="/">
          <button className={styles.backButton_Tlogin}>
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

          <button className={styles.Tlogin_but} type="submit">
            Login
          </button>
        </form>

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
