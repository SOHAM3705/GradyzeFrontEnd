import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./TeacherLogin.module.css";
import api from "../../utils/axiosConfig";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const googleScopes = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/classroom.courses",
    "https://www.googleapis.com/auth/classroom.rosters",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.coursework.students",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/teacher/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, teacher } = response.data;
      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("teacherId", teacher._id);
        sessionStorage.setItem("teacherName", teacher.name);
        sessionStorage.setItem("adminId", teacher.adminId);
        sessionStorage.setItem("role", "teacher");

        if (teacher.hasGoogleAccess) {
          sessionStorage.setItem("hasGoogleAccess", "true");
        }

        navigate("/teacherdash");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/teacher/login", {
        googleAuthCode: credentialResponse.code,
      });

      const { token, teacher, googleAccessToken } = response.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("teacherId", teacher._id);
      sessionStorage.setItem("teacherName", teacher.name);
      sessionStorage.setItem("adminId", teacher.adminId);
      sessionStorage.setItem("role", "teacher");
      sessionStorage.setItem("hasGoogleAccess", "true");

      if (googleAccessToken) {
        sessionStorage.setItem("googleAccessToken", googleAccessToken);
      }

      navigate("/teacherdash");
    } catch (err) {
      console.error("Google login failed:", err);
      setError(
        err.response?.data?.message || "Google login failed. Try again."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    setIsGoogleLoading(false);
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
        {(loading || isGoogleLoading) && (
          <p className={styles.loadingMessage}>Loading...</p>
        )}

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

          <button
            className={styles.TloginBut}
            type="submit"
            disabled={loading || isGoogleLoading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.orDivider}>
          <span>OR</span>
        </div>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            auto_select
            ux_mode="popup"
            flow="auth-code"
            scope={googleScopes.join(" ")}
            prompt="consent"
          />
        </GoogleOAuthProvider>

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
