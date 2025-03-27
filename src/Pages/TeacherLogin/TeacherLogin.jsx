import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./TeacherLogin.module.css";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("⚠ Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/login",
        formData
      );

      console.log("🔹 Login Response Data:", response.data);

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("teacherId", response.data.teacher._id);
        sessionStorage.setItem("teacherName", response.data.teacher.name);
        sessionStorage.setItem("AdminId", response.data.teacher.adminId);

        console.log("✅ Token Stored in sessionStorage:", response.data.token);

        // ✅ Force refresh user profile after login
        setTimeout(() => {
          window.location.reload();
        }, 500); // Reload to apply token updates

        navigate("/teacherdash");
      } else {
        throw new Error("Token not received from server");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
      console.error("❌ Login Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.teacherBg}>
      <div className={styles.loginContainer}>
        <Link to="/">
          <button className={styles.backButton_Tlogin}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </Link>

        <h2>Teacher Login</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}

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
            type="submit"
            className={styles.Tlogin_but}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

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
