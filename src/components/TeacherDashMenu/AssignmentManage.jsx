import React, { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";

const TeacherAssignmentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  // Form states
  const [newCourse, setNewCourse] = useState({
    name: "",
    section: "",
    room: "",
    description: "",
    subject: "",
    createInGoogle: false,
  });

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    totalMarks: 100,
    type: "assignment",
    courseId: "",
    instructions: "",
    attachments: [],
  });

  // Mock data for demonstration
  const mockCourses = [
    {
      _id: "1",
      name: "Mathematics Grade 10",
      section: "A",
      room: "101",
      description: "Advanced Mathematics",
      enrollmentCode: "MATH10A",
      students: 25,
      assignments: 8,
      isGoogleClass: false,
      createdAt: new Date("2024-01-15"),
      lastActive: "Yesterday",
    },
    {
      _id: "2",
      name: "Physics Grade 11",
      section: "B",
      room: "205",
      description: "Physics Fundamentals",
      enrollmentCode: "PHY11B",
      students: 30,
      assignments: 12,
      isGoogleClass: true,
      createdAt: new Date("2024-01-10"),
      lastActive: "2 days ago",
    },
  ];

  const mockAssignments = [
    {
      _id: "1",
      title: "Quadratic Equations Test",
      description: "Chapter 4 assessment on quadratic equations",
      dueDate: "2024-12-30",
      totalMarks: 100,
      type: "test",
      courseId: "1",
      courseName: "Mathematics Grade 10",
      submissions: 18,
      pending: 7,
      status: "active",
      createdAt: new Date("2024-12-20"),
    },
    {
      _id: "2",
      title: "Physics Lab Report",
      description: "Pendulum experiment analysis",
      dueDate: "2025-01-05",
      totalMarks: 50,
      type: "assignment",
      courseId: "2",
      courseName: "Physics Grade 11",
      submissions: 22,
      pending: 8,
      status: "active",
      createdAt: new Date("2024-12-18"),
    },
  ];

  // Simulate API calls
  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, this would be:
      // const response = await fetch('/api/classroom/courses', {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      // setCourses(data.courses);

      setCourses(mockCourses);
      setAssignments(mockAssignments);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check authentication
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/teacherlogin");
      return;
    }

    fetchCourses();
  }, [fetchCourses, navigate]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      // In real implementation:
      // const response = await fetch('/api/classroom/courses', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(newCourse)
      // });
      // const data = await response.json();

      // Mock implementation
      const courseData = {
        ...newCourse,
        _id: Date.now().toString(),
        enrollmentCode: Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase(),
        students: 0,
        assignments: 0,
        createdAt: new Date(),
        lastActive: "Just now",
      };

      setCourses([...courses, courseData]);
      setShowCreateModal(false);
      setNewCourse({
        name: "",
        section: "",
        room: "",
        description: "",
        subject: "",
        createInGoogle: false,
      });

      alert("✅ Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      // Mock implementation
      const assignmentData = {
        ...newAssignment,
        _id: Date.now().toString(),
        courseName:
          courses.find((c) => c._id === newAssignment.courseId)?.name || "",
        submissions: 0,
        pending:
          courses.find((c) => c._id === newAssignment.courseId)?.students || 0,
        status: "active",
        createdAt: new Date(),
      };

      setAssignments([...assignments, assignmentData]);
      setShowAssignmentModal(false);
      setNewAssignment({
        title: "",
        description: "",
        dueDate: "",
        totalMarks: 100,
        type: "assignment",
        courseId: "",
        instructions: "",
        attachments: [],
      });

      alert("✅ Assignment created successfully!");
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment. Please try again.");
    }
  };

  const handleCopyEnrollmentCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Enrollment code "${code}" copied to clipboard!`);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <nav className="top-nav">
        <div className="container nav-container">
          <div className="logo-container">
            <School size={28} />
            <h1 className="site-title">Teacher Portal</h1>
          </div>
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "courses" ? "active" : ""}`}
              onClick={() => setActiveTab("courses")}
            >
              <Book size={18} />
              Courses
            </button>
            <button
              className={`nav-tab ${
                activeTab === "assignments" ? "active" : ""
              }`}
              onClick={() => setActiveTab("assignments")}
            >
              <BookOpen size={18} />
              Assignments
            </button>
          </div>
          <div className="user-avatar">
            <div className="avatar-circle">
              <span className="avatar-initials">TC</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="main-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">
              {activeTab === "courses"
                ? "Course Management"
                : "Assignment Management"}
            </h1>
            <p className="page-subtitle">
              {activeTab === "courses"
                ? "Manage your classroom courses and enrollment"
                : "Create and manage assignments for your courses"}
            </p>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              className="create-button"
              onClick={() =>
                activeTab === "courses"
                  ? setShowCreateModal(true)
                  : setShowAssignmentModal(true)
              }
            >
              <Plus size={18} />
              {activeTab === "courses" ? "New Course" : "New Assignment"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-icon-container blue">
              <Book size={24} />
            </div>
            <div className="stats-content">
              <h3 className="stats-value">{courses.length}</h3>
              <p className="stats-label">Total Courses</p>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-icon-container green">
              <Users size={24} />
            </div>
            <div className="stats-content">
              <h3 className="stats-value">
                {courses.reduce(
                  (total, course) => total + (course.students || 0),
                  0
                )}
              </h3>
              <p className="stats-label">Total Students</p>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-icon-container orange">
              <BookOpen size={24} />
            </div>
            <div className="stats-content">
              <h3 className="stats-value">{assignments.length}</h3>
              <p className="stats-label">Active Assignments</p>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-icon-container purple">
              <TrendingUp size={24} />
            </div>
            <div className="stats-content">
              <h3 className="stats-value">
                {Math.round(
                  assignments.reduce(
                    (acc, a) =>
                      acc +
                      ((a.submissions / (a.submissions + a.pending)) * 100 ||
                        0),
                    0
                  ) / assignments.length || 0
                )}
                %
              </h3>
              <p className="stats-label">Avg Submission Rate</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading {activeTab}...</p>
            </div>
          ) : (
            <>
              {activeTab === "courses" ? (
                <div className="courses-grid">
                  {filteredCourses.map((course) => (
                    <div key={course._id} className="course-card">
                      <div className="course-header">
                        <div className="course-icon">
                          <Book size={20} />
                        </div>
                        <div className="course-actions">
                          <button className="action-btn">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="course-content">
                        <h3 className="course-name">{course.name}</h3>
                        <p className="course-section">
                          Section {course.section} • Room {course.room}
                        </p>
                        <p className="course-description">
                          {course.description}
                        </p>

                        <div className="course-stats">
                          <div className="stat-item">
                            <Users size={14} />
                            <span>{course.students} students</span>
                          </div>
                          <div className="stat-item">
                            <BookOpen size={14} />
                            <span>{course.assignments} assignments</span>
                          </div>
                          <div className="stat-item">
                            <Clock size={14} />
                            <span>{course.lastActive}</span>
                          </div>
                        </div>

                        <div className="enrollment-code">
                          <span className="code-label">Code:</span>
                          <code className="code-value">
                            {course.enrollmentCode}
                          </code>
                          <button
                            className="copy-btn"
                            onClick={() =>
                              handleCopyEnrollmentCode(course.enrollmentCode)
                            }
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="course-footer">
                        <button
                          className="course-btn secondary"
                          onClick={() => navigate(`/course/${course._id}`)}
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        <button
                          className="course-btn primary"
                          onClick={() => {
                            setSelectedCourse(course);
                            setNewAssignment({
                              ...newAssignment,
                              courseId: course._id,
                            });
                            setShowAssignmentModal(true);
                          }}
                        >
                          <Plus size={16} />
                          Add Assignment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="assignments-list">
                  {filteredAssignments.map((assignment) => (
                    <div key={assignment._id} className="assignment-card">
                      <div className="assignment-header">
                        <div className="assignment-info">
                          <h3 className="assignment-title">
                            {assignment.title}
                          </h3>
                          <p className="assignment-course">
                            {assignment.courseName}
                          </p>
                        </div>
                        <div className="assignment-type">
                          <span className={`type-badge ${assignment.type}`}>
                            {assignment.type}
                          </span>
                        </div>
                      </div>

                      <p className="assignment-description">
                        {assignment.description}
                      </p>

                      <div className="assignment-stats">
                        <div className="stat-group">
                          <div className="stat-item">
                            <Award size={16} />
                            <span>{assignment.totalMarks} marks</span>
                          </div>
                          <div className="stat-item">
                            <Calendar size={16} />
                            <span>
                              Due:{" "}
                              {new Date(
                                assignment.dueDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="submission-stats">
                          <div className="submission-item">
                            <span className="submission-count">
                              {assignment.submissions}
                            </span>
                            <span className="submission-label">Submitted</span>
                          </div>
                          <div className="submission-item">
                            <span className="submission-count pending">
                              {assignment.pending}
                            </span>
                            <span className="submission-label">Pending</span>
                          </div>
                        </div>
                      </div>

                      <div className="assignment-actions">
                        <button className="action-btn-sm">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button className="action-btn-sm">
                          <Eye size={16} />
                          View Submissions
                        </button>
                        <button className="action-btn-sm">
                          <Download size={16} />
                          Export
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Course</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="modal-form">
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Mathematics Grade 10"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Section</label>
                  <input
                    type="text"
                    value={newCourse.section}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, section: e.target.value })
                    }
                    placeholder="e.g., A"
                  />
                </div>
                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    value={newCourse.room}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, room: e.target.value })
                    }
                    placeholder="e.g., 101"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={newCourse.subject}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, subject: e.target.value })
                  }
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder="Brief description of the course..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newCourse.createInGoogle}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        createInGoogle: e.target.checked,
                      })
                    }
                  />
                  Create in Google Classroom
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showAssignmentModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>Create New Assignment</h2>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="modal-form">
              <div className="form-group">
                <label>Assignment Title *</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  required
                  placeholder="e.g., Chapter 4 Test"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Course *</label>
                  <select
                    value={newAssignment.courseId}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        courseId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name} - Section {course.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={newAssignment.type}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="assignment">Assignment</option>
                    <option value="test">Test</option>
                    <option value="quiz">Quiz</option>
                    <option value="project">Project</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        dueDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Marks</label>
                  <input
                    type="number"
                    value={newAssignment.totalMarks}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        totalMarks: parseInt(e.target.value),
                      })
                    }
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the assignment..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  value={newAssignment.instructions}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      instructions: e.target.value,
                    })
                  }
                  placeholder="Detailed instructions for students..."
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentDashboard;
