import React, { useState } from "react";
import styles from "./StudentLogin.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  // Handle Student Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/student/login",
        { email, password }
      );

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("studentId", response.data.student._id);
      sessionStorage.setItem("studentName", response.data.student.name);

      // Redirect to Student Dashboard
      navigate("/studentdash");
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    setForgotPasswordMessage("");

    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordMessage("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/password/verify-email",
        { email: forgotPasswordEmail }
      );
      setForgotPasswordMessage(response.data.message);
    } catch (error) {
      setForgotPasswordMessage("Error sending reset link. Try again.");
    }
  };

  return (
    <div className={styles.studentBg}>
      <div className={styles.loginContainer}>
        {/* Header with Back Button and Title */}
        <div className={styles.loginHeader}>
          <Link to="/">
            <button className={styles.backButton_Slogin}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>
          <h2>Student Login</h2>
        </div>

        <form id="studentLoginForm" onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="studentEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="studentPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className={styles.submitStudentloginbut}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/studentsignup" className={styles.StudentLogin_a}>
            Sign Up
          </Link>
        </p>
        <p>
          <button
            onClick={() => setShowForgotPasswordModal(true)}
            className={styles.StudentLogin_a}
          >
            Forgot Password?
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
            <p className="text-gray-600 mb-3">
              Enter your email to receive a reset link.
            </p>

            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg mb-3"
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
            />

            <button
              onClick={handleForgotPassword}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-800"
            >
              Send Reset Link
            </button>

            {forgotPasswordMessage && (
              <p className="text-green-600 mt-2">{forgotPasswordMessage}</p>
            )}

            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="mt-4 text-red-600 hover:text-red-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLogin;
