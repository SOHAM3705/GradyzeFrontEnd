import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./StudentLogin.module.css";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "https://gradyzebackend.onrender.com";

  // Handle Google OAuth callback
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const role = queryParams.get("role");

    if (token && role === "student") {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", "student");

      axios
        .get(`${API_BASE_URL}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          sessionStorage.setItem("studentId", res.data._id);
          sessionStorage.setItem("studentName", res.data.name);
          sessionStorage.setItem("AdminId", res.data.adminId);
          navigate("/studentdash");
        })
        .catch(() => {
          setError("Invalid or expired session. Please login again.");
        });
    } else if (token && role !== "student") {
      setError("Only student accounts can access this page.");
      setTimeout(() => navigate(`/${role}login`), 2000);
    }

    // Remove token and role from URL
    window.history.replaceState({}, document.title, "/studentlogin");
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/student/studentlogin`,
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
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google?role=student`;
  };

  return (
    <div className={styles.studentBg}>
      <div className={styles.loginContainer}>
        <Link to="/">
          <button className={styles.backButton_Slogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        <div className={styles.loginHeader}>
          <h2>Student Login</h2>
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

          <button className={styles.submitStudentloginbut} type="submit">
            Login
          </button>
        </form>

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
