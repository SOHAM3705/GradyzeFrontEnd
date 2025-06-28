import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./TeacherLogin.module.css";
import api from "../../utils/api";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/auth/email-login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, teacher } = response.data;

      if (token && teacher) {
        // Store session data
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("teacherId", teacher._id);
        sessionStorage.setItem("teacherName", teacher.name);
        sessionStorage.setItem("adminId", teacher.adminId);
        sessionStorage.setItem("role", "teacher");
        sessionStorage.setItem(
          "hasGoogleAccess",
          teacher.hasGoogleAccess ? "true" : "false"
        );

        setSuccess("Login successful! Redirecting...");

        // Small delay to show success message
        setTimeout(() => {
          navigate("/teacherdash");
        }, 1000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/auth/google-login", {
        googleJWT: credentialResponse.credential,
      });

      const { token, teacher } = response.data;

      if (token && teacher) {
        // Store session data
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("teacherId", teacher._id);
        sessionStorage.setItem("teacherName", teacher.name);
        sessionStorage.setItem("adminId", teacher.adminId);
        sessionStorage.setItem("role", "teacher");
        sessionStorage.setItem(
          "hasGoogleAccess",
          teacher.hasGoogleAccess ? "true" : "false"
        );

        setSuccess("Google login successful! Redirecting...");

        setTimeout(() => {
          navigate("/teacherdash");
        }, 1000);
      }
    } catch (err) {
      console.error("Google login error:", err);
      const errorMessage = err.response?.data?.message || "Google login failed";
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    setIsGoogleLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (token && role === "teacher") {
      navigate("/teacherdash");
    }
  }, [navigate]);

  return (
    <div className={styles.teacherBg}>
      <div className={styles.loginContainer}>
        <Link to="/">
          <button
            className={styles.backButtonTlogin}
            aria-label="Go back to home"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        <div className={styles.loginHeader}>
          <h2>Teacher Login</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className={styles.errorMessage}>
            <span>{error}</span>
            <button
              onClick={clearMessages}
              className={styles.closeBtn}
              aria-label="Close error message"
            >
              &times;
            </button>
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <span>{success}</span>
            <button
              onClick={clearMessages}
              className={styles.closeBtn}
              aria-label="Close success message"
            >
              &times;
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {(loading || isGoogleLoading) && (
          <div className={styles.loadingIndicator}>Loading...</div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.togglePassword}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Google Login Button */}
        <div className={styles.googleLoginContainer}>
          <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={isGoogleLoading}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
