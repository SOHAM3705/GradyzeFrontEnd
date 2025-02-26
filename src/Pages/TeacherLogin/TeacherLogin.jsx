import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./TeacherLogin.module.css";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("/api/teacher/teacherRoute/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/teacherdash"); // Redirect to Teacher Dashboard
    } catch (error) {}
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
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.Tlogin_but}>
            Login
          </button>
        </form>
        <p>Don't have an account? Contact Your College/School Admin</p>
        <p>
          <Link to="/teacher-forgot-password" className={styles.TeacherLogin_a}>
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;
