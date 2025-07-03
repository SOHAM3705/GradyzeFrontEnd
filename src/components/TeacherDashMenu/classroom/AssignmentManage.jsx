import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Book,
  ChevronRight,
  School,
  Users,
  Calendar,
  BookPlus,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  Settings,
  Download,
  Upload,
  MoreVertical,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { API_BASE_URL } from "../../../config";
import AssignmentTab from "./AssignmentTab";

const GoogleClassroomIntegration = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [googleStatus, setGoogleStatus] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
  const [newCourse, setNewCourse] = useState({
    name: "",
    section: "",
    room: "",
    description: "",
  });
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    materials: [],
  });

  const navigate = useNavigate();

  const checkGoogleStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/auth/classroom/status`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to check Google status");

      const data = await response.json();
      setGoogleStatus(data);

      if (data.isExpired) {
        setNeedsAuth(true);
        setError("Google access expired. Please reconnect your account.");
      }
    } catch (err) {
      console.error("Error checking Google status:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateOAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/initiate-oauth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
        throw new Error(
          typeof errorText === "string"
            ? errorText
            : errorText.message || "Unknown error"
        );
      }

      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("OAuth URL not received.");
      }
    } catch (err) {
      setError(err.message || "Error initiating OAuth");
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/classroom/courses`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data.courses || []);

      for (const course of data.courses || []) {
        await fetchAssignments(course.id);
      }

      setSuccess(`Successfully loaded ${data.courses?.length || 0} courses`);
      setNeedsAuth(false);
    } catch (err) {
      if (
        err.message.includes("expired") ||
        err.message.includes("permissions")
      ) {
        setNeedsAuth(true);
        setError("Google access expired. Please reconnect your account.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/classroom/courses/${courseId}/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();
      setAssignmentsByCourse((prev) => ({
        ...prev,
        [courseId]: data.assignments || [],
      }));
    } catch (err) {
      setError(err.message || "Assignment fetch failed");
    }
  };

  const createCourse = async () => {
    if (!newCourse.name) {
      setError("Course name is required");
      return;
    }
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/classroom/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create course");
      }

      const data = await response.json();
      setSuccess(`Created '${data.course.name}'`);
      setShowCourseModal(false);
      setNewCourse({
        name: "",
        section: "",
        room: "",
        description: "",
      });
      await fetchCourses();
    } catch (err) {
      setError(err.message || "Course creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { title, description, dueDate, dueTime, materials } = newAssignment;

      if (!selectedCourse || !title || !dueDate || !dueTime) {
        setError("Missing required fields");
        return;
      }

      const dueDateParts = dueDate.split("-");
      const dueTimeParts = dueTime.split(":");

      const payload = {
        title,
        description,
        dueDate: {
          year: parseInt(dueDateParts[0]),
          month: parseInt(dueDateParts[1]),
          day: parseInt(dueDateParts[2]),
        },
        dueTime: {
          hours: parseInt(dueTimeParts[0]),
          minutes: parseInt(dueTimeParts[1]),
        },
        materials: Array.isArray(materials)
          ? materials.filter(
              (mat) =>
                mat?.driveFile?.driveFile?.id &&
                typeof mat.driveFile.driveFile.id === "string"
            )
          : [],
      };

      const response = await fetch(
        `${API_BASE_URL}/api/classroom/courses/${selectedCourse}/assignments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create assignment");
      }

      const data = await response.json();
      setAssignmentsByCourse((prev) => ({
        ...prev,
        [selectedCourse]: [...(prev[selectedCourse] || []), data.assignment],
      }));
      setShowAssignmentModal(false);
      setNewAssignment({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        materials: [],
      });
      setSuccess("Assignment created");
    } catch (err) {
      setError(err.message || "Assignment creation failed");
    }
  };

  const revokeGoogleAccess = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/classroom/revoke`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to revoke access");

      setGoogleStatus({ hasGoogleAccess: false });
      setCourses([]);
      setNeedsAuth(false);
      setSuccess("Google access revoked successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    checkGoogleStatus();
    fetchCourses();
  }, []);

  const hasGoogleAccess = googleStatus?.hasGoogleAccess;

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <School className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Google Classroom Integration
            </h1>
            <p className="text-gray-600">
              Connect your Google Classroom to import and manage your courses
            </p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={clearMessages}
            className="text-red-500 hover:text-red-700"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-800">{success}</span>
          </div>
          <button
            onClick={clearMessages}
            className="text-green-500 hover:text-green-700"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
          <span className="text-blue-800">Loading...</span>
        </div>
      )}

      {/* Connection Status Card */}
      {googleStatus && (
        <div
          className={`mb-6 rounded-lg border-2 p-4 ${
            googleStatus.hasGoogleAccess
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  googleStatus.hasGoogleAccess ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <div>
                <span
                  className={`font-semibold ${
                    googleStatus.hasGoogleAccess
                      ? "text-green-800"
                      : "text-gray-800"
                  }`}
                >
                  {googleStatus.hasGoogleAccess ? "Connected" : "Not Connected"}
                </span>
                {googleStatus.hasGoogleAccess && (
                  <p className="text-sm text-green-600">
                    Connected as: {googleStatus.connectedEmail}
                  </p>
                )}
              </div>
            </div>
            {googleStatus.hasGoogleAccess && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>
        </div>
      )}

      {/* Connection Flow */}
      {!hasGoogleAccess && !needsAuth && (
        <div className="mb-8 text-center">
          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Connect Google Classroom
            </h3>
            <p className="text-gray-600 mb-6">
              Link your Google Classroom account to access and manage your
              courses directly from here.
            </p>
            <button
              onClick={initiateOAuth}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Connect with Google
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reauth Prompt */}
      {needsAuth && (
        <div className="mb-8 text-center">
          <div className="max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Reconnection Required
            </h3>
            <p className="text-gray-600 mb-6">
              Your Google access has expired. Please reconnect to continue
              accessing your courses.
            </p>
            <button
              onClick={initiateOAuth}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Reconnect
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content - When Connected */}
      {hasGoogleAccess && !needsAuth && (
        <div className="space-y-6">
          {/* Search and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchCourses}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <BookOpen className="mr-2 h-4 w-4" />
                )}
                Refresh Courses
              </button>

              <button
                onClick={() => setShowCourseModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </button>

              <button
                onClick={revokeGoogleAccess}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                Disconnect
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("courses")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "courses"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Book className="inline mr-2 h-4 w-4" />
                Courses ({courses.length})
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "assignments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BookPlus className="inline mr-2 h-4 w-4" />
                Assignments
              </button>
              <button
                onClick={() => setActiveTab("manualAssignments")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "manualAssignments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Edit className="inline mr-2 h-4 w-4" />
                Manual Assignments
              </button>
            </nav>
          </div>

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                            {course.name}
                          </h4>
                          {course.section && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              {course.section}
                            </span>
                          )}
                        </div>
                      </div>

                      {course.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {course.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        {course.room && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{course.room}</span>
                          </div>
                        )}
                        {course.enrollmentCode && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Code: {course.enrollmentCode}</span>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  course.enrollmentCode
                                )
                              }
                              className="text-blue-500 hover:text-blue-700"
                              title="Copy enrollment code"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {course.alternateLink && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCourse(course.id);
                              setShowAssignmentModal(true);
                            }}
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm mb-2"
                          >
                            <BookPlus className="w-4 h-4" />
                            <span>Create Assignment</span>
                          </button>
                          <br />
                          <a
                            href={course.alternateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <span>Open in Classroom</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Courses Found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm
                      ? "No courses match your search criteria."
                      : "You don't have any active courses in Google Classroom."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Manual Assignments Tab */}
          {activeTab === "manualAssignments" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Manual Assignments</h2>
              <p>
                This is where you can manually create and manage assignments.
              </p>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && <AssignmentTab />}

          {/* Course Modal */}
          {showCourseModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">
                  Create Google Classroom Course
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={newCourse.name}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, name: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Section"
                    value={newCourse.section}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, section: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Room"
                    value={newCourse.room}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, room: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                  <textarea
                    placeholder="Description"
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowCourseModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCourse}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Modal */}
          {showAssignmentModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">Create Assignment</h2>

                {/* Title */}
                <input
                  type="text"
                  placeholder="Title"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />

                {/* Description */}
                <textarea
                  placeholder="Description"
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />

                {/* Due Date & Time */}
                <h3 className="text-lg font-semibold">Due Date/Time</h3>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="time"
                  value={newAssignment.dueTime}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      dueTime: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />

                {/* File Upload */}
                <h3 className="text-lg font-semibold">
                  Attachments (Google Drive)
                </h3>
                <input
                  type="file"
                  accept="*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      const res = await fetch(
                        `${API_BASE_URL}/api/classroom/drive/upload`,
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${sessionStorage.getItem(
                              "token"
                            )}`,
                          },
                          body: formData,
                        }
                      );

                      const data = await res.json();

                      if (res.ok) {
                        const newMaterial = {
                          driveFile: {
                            driveFile: {
                              id: data.id,
                              title: data.title,
                            },
                            shareMode: "VIEW", // Change to "STUDENT_COPY" if needed
                          },
                        };

                        setNewAssignment((prev) => ({
                          ...prev,
                          materials: [...(prev.materials || []), newMaterial],
                        }));
                      } else {
                        alert(data.error || "Upload failed");
                      }
                    } catch (err) {
                      console.error("Upload error:", err.message);
                      alert("Drive upload failed");
                    }
                  }}
                  className="w-full border p-2 rounded"
                />

                {/* Uploaded File Preview */}
                {(newAssignment.materials || []).length > 0 && (
                  <ul className="text-sm mt-2 text-gray-700">
                    {Array.isArray(newAssignment.materials) &&
                      newAssignment.materials.map((mat, i) => (
                        <li key={i}>
                          📎{" "}
                          {mat?.driveFile?.driveFile?.title || "Unnamed file"}
                        </li>
                      ))}
                  </ul>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowAssignmentModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAssignment}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleClassroomIntegration;
