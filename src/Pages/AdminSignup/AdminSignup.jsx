import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminSignUp.module.css";
import { Link, useNavigate } from "react-router-dom";

const AdminSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    college: "",
  });
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
    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/admin/signup",
        formData
      );

      // Store Token, ID, and Name in Local Storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminId", response.data.adminId);
      localStorage.setItem("adminName", response.data.name); // Store name

      navigate("/admindash");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error("Signup Error:", err.response?.data);
    }
  };

  return (
    <div className={styles.adminBg}>
      <div className={styles.signupContainer}>
        <div className={styles.signupHeader}>
          <Link to="/">
            <button className={styles.backButton_Asignup}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>
          <h2>Admin Sign-Up</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
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
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="university"
              placeholder="University"
              value={formData.university}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="college"
              placeholder="College"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>
          <button className={styles.submitAdminsignupbut} type="submit">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/adminlogin" className={styles.AdminSignup_a}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignUp;
