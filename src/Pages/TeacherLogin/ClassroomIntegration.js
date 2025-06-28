import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "./ClassroomIntegration.css";

const ClassroomIntegration = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [googleStatus, setGoogleStatus] = useState(null);
  const [success, setSuccess] = useState(null);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${sessionStorage.getItem("token")}`
  });

  const checkGoogleAccess = () => {
    return sessionStorage.getItem("hasGoogleAccess") === "true";
  };

  const checkGoogleStatus = async () => {
    try {
      const response = await api.get("/api/auth/classroom/status", {
        headers: getAuthHeaders()
      });
      setGoogleStatus(response.data);
      
      // Update session storage based on actual server status
      sessionStorage.setItem("hasGoogleAccess", response.data.hasGoogleAccess ? "true" : "false");
      
      if (response.data.isExpired) {
        setNeedsAuth(true);
      }
    } catch (err) {
      console.error("Error checking Google status:", err);
    }
  };

  const initiateOAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post("/api/auth/initiate-oauth", {}, {
        headers: getAuthHeaders()
      });
      
      // Store current page state before redirect
      sessionStorage.setItem("preAuthPath", window.location.pathname);
      
      // Redirect to Google OAuth screen
      window.location.href = response.data.authUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate Google authentication");
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.get("/api/auth/classroom/courses", {
        headers: getAuthHeaders()
      });
      
      setCourses(response.data.courses || []);
      setSuccess(`Successfully loaded ${response.data.courses?.length || 0} courses`);
      setNeedsAuth(false);
    } catch (err) {
      if (err.response?.data?.requiresReauth || err.response?.data?.requiresAuth) {
        setNeedsAuth(true);
        setError("Google access expired. Please reconnect your account.");
        sessionStorage.setItem("hasGoogleAccess", "false");
      } else {
        setError(err.response?.data?.message || "Failed to fetch courses");
      }
    } finally {
      setLoading(false);
    }
  };

  const revokeGoogleAccess = async () => {
    try {
      setLoading(true);
      await api.delete("/api/auth/classroom/revoke", {
        headers: getAuthHeaders()
      });
      
      // Update state
      sessionStorage.setItem("hasGoogleAccess", "false");
      setCourses([]);
      setNeedsAuth(false);
      setGoogleStatus({ hasGoogleAccess: false });
      setSuccess("Google access revoked successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to revoke Google access");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    // Check for OAuth success/error in URL params
    const params = new URLSearchParams(window.location.search);
    
    if (params.get("googleAuthSuccess")) {
      sessionStorage.setItem("hasGoogleAccess", "true");
      setSuccess("Google Classroom connected successfully!");
      setNeedsAuth(false);
      
      // Remove query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-fetch courses after successful auth
      setTimeout(() => {
        fetchCourses();
      }, 1000);
    } else if (params.get("googleAuthError")) {
      const errorType = params.get("error");
      let errorMessage = "Google authentication failed";
      
      switch (errorType) {
        case "access_denied":
          errorMessage = "Access denied. Please grant the required permissions.";
          break;
        case "teacher_not_found":
          errorMessage = "Teacher account not found.";
          break;
        case "callback_failed":
          errorMessage = "Authentication callback failed. Please try again.";
          break;
      }
      
      setError(errorMessage);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check Google status on component mount
    checkGoogleStatus();
  }, []);

  return (
    <div className="classroom-container">
      <div className="classroom-header">
        <h3>Google Classroom Integration</h3>
        <p className="classroom-subtitle">
          Connect your Google Classroom to import and manage your courses
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={clearMessages} className="close-btn">&times;</button>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <span>{success}</span>
          <button onClick={clearMessages} className="close-btn">&times;</button>
        </div>
      )}

      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      )}

      {/* Connection Status */}
      {googleStatus && (
        <div className={`status-card ${googleStatus.hasGoogleAccess ? 'connected' : 'disconnected'}`}>
          <div className="status-indicator">
            <span className={`status-dot ${googleStatus.hasGoogleAccess ? 'green' : 'red'}`}></span>
            <span className="status-text">
              {googleStatus.hasGoogleAccess ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          {googleStatus.hasGoogleAccess && (
            <div className="connected-info">
              <span>Connected as: {googleStatus.connectedEmail}</span>
            </div>
          )}
        </div>
      )}

      {/* Connection Actions */}
      {!checkGoogleAccess() && !needsAuth && (
        <div className="auth-prompt">
          <div className="auth-icon">🔗</div>
          <h4>Connect Google Classroom</h4>
          <p>Link your Google Classroom account to access and manage your courses directly from here.</p>
          <button
            onClick={initiateOAuth}
            disabled={loading}
            className="connect-button primary"
          >
            <span className="button-icon">🔐</span>
            {loading ? "Connecting..." : "Connect with Google"}
          </button>
        </div>
      )}

      {/* Reauth Prompt */}
      {needsAuth && (
        <div className="reauth-prompt">
          <div className="auth-icon">⚠️</div>
          <h4>Reconnection Required</h4>
          <p>Your Google access has expired. Please reconnect to continue accessing your courses.</p>
          <button 
            onClick={initiateOAuth} 
            disabled={loading}
            className="connect-button warning"
          >
            <span className="button-icon">🔄</span>
            Reconnect
          </button>
        </div>
      )}

      {/* Main Actions */}
      {checkGoogleAccess() && !needsAuth && (
        <div className="courses-section">
          <div className="action-buttons">
            <button
              onClick={fetchCourses}
              disabled={loading}
              className="fetch-button primary"
            >
              <span className="button-icon">📚</span>
              {loading ? "Loading..." : "Fetch My Courses"}
            </button>
            
            <button
              onClick={revokeGoogleAccess}
              disabled={loading}
              className="revoke-button secondary"
            >
              <span className="button-icon">🔓</span>
              Disconnect
            </button>
          </div>

          {/* Courses List */}
          {courses.length > 0 && (
            <div className="courses-list">
              <h4>Your Active Courses ({courses.length})</h4>
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course.id} className="course-card">
                    <div className="course-header">
                      <h5 className="course-name">{course.name}</h5>
                      {course.section && (
                        <span className="course-section">{course.section}</span>
                      )}
                    </div>
                    
                    {course.description && (
                      <p className="course-description">{course.description}</p>
                    )}
                    
                    <div className="course-details">
                      {course.room && (
                        <span className="course-detail">
                          <strong>Room:</strong> {course.room}
                        </span>
                      )}
                      {course.enrollmentCode && (
                        <span className="course-detail">
                          <strong>Code:</strong> {course.enrollmentCode}
                        </span>
                      )}
                    </div>
                    
                    {course.alternateLink && (
                      <a 
                        href={course.alternateLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="course-link"
                      >
                        Open in Classroom →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {courses.length === 0 && !loading && !error && (
            <div className="no-courses">
              <div className="no-courses-icon">📋</div>
              <h4>No Active Courses Found</h4>
              <p>You don't have any active courses in Google Classroom, or you may need to refresh your course list.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassroomIntegration;