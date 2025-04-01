import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./StudentLogin.module.css";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", "student");

      axios
        .get("https://gradyzebackend.onrender.com/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          sessionStorage.setItem("studentId", res.data.studentId);
          sessionStorage.setItem("studentName", res.data.name);
          sessionStorage.setItem("AdminId", res.data.adminId);
          navigate("/studentdash");
        })
        .catch(() => {
          setError("Invalid or expired session. Please login again.");
        });

      // ✅ Remove token from URL after processing
      window.history.replaceState({}, document.title, "/studentlogin");
    }
  }, [location, navigate]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ Handle Manual Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/student/studentlogin",
        formData
      );

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("studentId", response.data.studentId);
        sessionStorage.setItem("studentName", response.data.name);
        sessionStorage.setItem("AdminId", response.data.adminId);
        sessionStorage.setItem("role", "student");

        console.log("✅ Student Data stored in sessionStorage");
        navigate("/studentdash");
      } else {
        throw new Error("Token missing in response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  // ✅ Handle Google Login
  const handleGoogleLogin = () => {
    window.location.href =
      "https://gradyzebackend.onrender.com/api/auth/google?role=student";
  };

  return (
    <div className={styles.studentBg}>
      <div className={styles.loginContainer}>
        {/* Back Button */}
        <Link to="/">
          <button className={styles.backButton_Slogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        {/* Login Header */}
        <div className={styles.loginHeader}>
          <h2>Student Login</h2>
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

          <button className={styles.submitStudentloginbut} type="submit">
            Login
          </button>
        </form>

        {/* ✅ Google Login Button */}
        <button className={styles.googleLogin} onClick={handleGoogleLogin}>
          <i className="fab fa-google"></i> Sign in with Google
        </button>

        <p>Don't have an account? Contact Your College/School Admin</p>
        <p>
          <Link to="/student-forget-password" className={styles.StudentLogin_a}>
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
