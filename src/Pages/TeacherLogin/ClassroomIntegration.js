import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "./ClassroomIntegration.css";

const ClassroomIntegration = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const checkGoogleAccess = () => {
    return sessionStorage.getItem("hasGoogleAccess") === "true";
  };

  const initiateOAuth = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/initiate-oauth", {}, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      });
      
      // Redirect to Google OAuth screen
      window.location.href = response.data.authUrl;
    } catch (err) {
      setError("Failed to initiate Google authentication");
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/api/auth/classroom/courses", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      });
      
      setCourses(response.data.courses || []);
    } catch (err) {
      if (err.response?.data?.requiresReauth) {
        setNeedsAuth(true);
      } else {
        setError(err.response?.data?.message || "Failed to fetch courses");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for OAuth success/error in URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get("googleAuthSuccess")) {
      // Update session storage
      sessionStorage.setItem("hasGoogleAccess", "true");
      // Remove query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch courses
      fetchCourses();
    } else if (params.get("googleAuthError")) {
      setError("Google authentication failed");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="classroom-container">
      <h3>Google Classroom Integration</h3>
      
      {!checkGoogleAccess() && (
        <div className="auth-prompt">
          <p>Connect your Google Classroom account to access courses</p>
          <button 
            onClick={initiateOAuth} 
            disabled={loading}
            className="connect-button"
          >
            {loading ? "Connecting..." : "Connect with Google"}
          </button>
        </div>
      )}

      {needsAuth && (
        <div className="reauth-prompt">
          <p>Your Google access has expired. Please reconnect.</p>
          <button onClick={initiateOAuth} className="connect-button">
            Reconnect
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {checkGoogleAccess() && !needsAuth && (
        <div className="courses-section">
          <button 
            onClick={fetchCourses} 
            disabled={loading}
            className="fetch-button"
          >
            {loading ? "Loading..." : "Fetch My Courses"}
          </button>
          
          {courses.length > 0 && (
            <div className="courses-list">
              <h4>Your Active Courses:</h4>
              <ul>
                {courses.map(course => (
                  <li key={course.id}>
                    <strong>{course.name}</strong> ({course.section})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassroomIntegration;