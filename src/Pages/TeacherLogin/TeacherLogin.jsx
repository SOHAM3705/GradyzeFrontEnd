// src/TeacherLogin.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./TeacherLogin.module.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import api from "../../utils/axiosConfig";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const gsiRendered = useRef(false);
  const gapiLoaded = useRef(false);

  // Google Classroom API scopes
  const CLASSROOM_SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses",
    "https://www.googleapis.com/auth/classroom.rosters",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/drive",
  ].join(" ");

  // Load GAPI script for Classroom API
  useEffect(() => {
    if (gapiLoaded.current || document.getElementById("google-gapi-script"))
      return;

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.id = "google-gapi-script";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google GAPI script loaded successfully");
      gapiLoaded.current = true;
    };

    script.onerror = () => {
      console.error("Failed to load Google GAPI script");
    };

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById("google-gapi-script");
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGSI;
      document.body.appendChild(script);
    };

    const initializeGSI = () => {
      if (!window.google || gsiRendered.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("gsi-button"),
        {
          theme: "outline",
          size: "large",
          text: "login_with",
          width: "100%",
        }
      );

      gsiRendered.current = true;
    };

    const handleCredentialResponse = async (response) => {
      try {
        // First authenticate with your backend
        const res = await api.post(`${API_BASE_URL}/api/auth/google`, {
          token: response.credential,
          role: "teacher",
        });

        const { token, teacherId, name, adminId } = res.data;

        // Store authentication data
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", "teacher");
        sessionStorage.setItem("teacherId", teacherId);
        sessionStorage.setItem("teacherName", name);
        sessionStorage.setItem("adminId", adminId);

        // Now request additional Classroom API permissions
        await requestClassroomAccess(response.credential);

        navigate("/teacherdash");
      } catch (err) {
        console.error("Google login failed:", err);
        setError("Google login failed. Try again.");
      }
    };

    const requestClassroomAccess = async (idToken) => {
      if (!window.google?.accounts?.oauth2) {
        console.error("Google OAuth2 library not loaded");
        return;
      }

      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: CLASSROOM_SCOPES,
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              // Store the Classroom access token
              sessionStorage.setItem(
                "classroomToken",
                tokenResponse.access_token
              );

              // Initialize GAPI client if needed
              if (window.gapi?.client && !window.gapi.client.getToken()) {
                await initGapiClient(tokenResponse.access_token);
              }
            }
          },
          error_callback: (error) => {
            console.error("Classroom access error:", error);
          },
        });

        // Request access token
        tokenClient.requestAccessToken({ prompt: "consent" });
      } catch (err) {
        console.error("Error requesting Classroom access:", err);
      }
    };

    const initGapiClient = async (accessToken) => {
      try {
        await window.gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          discoveryDocs: [
            "https://classroom.googleapis.com/$discovery/rest?version=v1",
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
        });
        window.gapi.client.setToken({ access_token: accessToken });
        console.log("GAPI client initialized with Classroom access");
      } catch (err) {
        console.error("Error initializing GAPI client:", err);
      }
    };

    if (!window.google) {
      loadGoogleScript();
    } else {
      initializeGSI();
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`${API_BASE_URL}/api/teacher/login`, {
        ...formData,
        role: "teacher",
      });

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("teacherId", response.data.teacher._id);
        sessionStorage.setItem("teacherName", response.data.teacher.name);
        sessionStorage.setItem("adminId", response.data.teacher.adminId);
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

          <button className={styles.TloginBut} type="submit">
            Login
          </button>
        </form>

        <div
          id="gsi-button"
          style={{
            marginTop: "10px",
            width: "100%",
            minHeight: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        ></div>

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
