import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Book,
  ChevronLeft,
  Users,
  Calendar,
  FileText,
  User,
  Clock,
  Check,
  X,
  AlertCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assignments");
  const [expandedAssignments, setExpandedAssignments] = useState({});
  const [expandedStudent, setExpandedStudent] = useState(null);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
  });

  const fetchCourseDetails = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if we have a stored token
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      // Get course details
      let courseData;

      if (window.gapi?.client?.classroom) {
        // Use gapi client if available
        const response = await window.gapi.client.classroom.courses.get({
          id: courseId,
        });
        courseData = response.result;
      } else {
        // Use REST API
        const response = await fetch(
          `https://classroom.googleapis.com/v1/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        courseData = await response.json();
      }

      setCourse(courseData);

      // Get students for this course
      let studentsData = [];

      if (window.gapi?.client?.classroom) {
        // Fetch students using gapi
        const studentResponse =
          await window.gapi.client.classroom.courses.students.list({
            courseId: courseId,
          });
        studentsData = studentResponse.result.students || [];
      } else {
        // Fetch students using REST API
        const studentRes = await fetch(
          `https://classroom.googleapis.com/v1/courses/${courseId}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const studentData = await studentRes.json();
        studentsData = studentData.students || [];
      }

      setStudents(studentsData);

      // Get assignments for this course
      let assignmentsData = [];

      if (window.gapi?.client?.classroom) {
        // Fetch assignments using gapi
        const assignmentResponse =
          await window.gapi.client.classroom.courses.courseWork.list({
            courseId: courseId,
          });
        assignmentsData = assignmentResponse.result.courseWork || [];
      } else {
        // Fetch assignments using REST API
        const assignmentRes = await fetch(
          `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const assignmentData = await assignmentRes.json();
        assignmentsData = assignmentData.courseWork || [];
      }

      setAssignments(assignmentsData);

      // Get all submissions for each assignment
      const submissionsData = {};

      for (const assignment of assignmentsData) {
        let assignmentSubmissions = [];

        try {
          if (window.gapi?.client?.classroom) {
            // Fetch submissions using gapi
            const submissionResponse =
              await window.gapi.client.classroom.courses.courseWork.studentSubmissions.list(
                {
                  courseId: courseId,
                  courseWorkId: assignment.id,
                }
              );
            assignmentSubmissions =
              submissionResponse.result.studentSubmissions || [];
          } else {
            // Fetch submissions using REST API
            const submissionRes = await fetch(
              `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${assignment.id}/studentSubmissions`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const submissionData = await submissionRes.json();
            assignmentSubmissions = submissionData.studentSubmissions || [];
          }

          submissionsData[assignment.id] = assignmentSubmissions;
        } catch (error) {
          console.error(
            `Error fetching submissions for assignment ${assignment.id}:`,
            error
          );
          submissionsData[assignment.id] = [];
        }
      }

      setSubmissions(submissionsData);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "❌ Error fetching course details:",
        error?.message || error,
        error?.stack
      );
      setIsLoading(false);

      // If we get an auth error, clear the token
      if (error.status === 401 || error.message?.includes("auth")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  }, [courseId, navigate]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const toggleAssignmentExpand = (assignmentId) => {
    setExpandedAssignments((prev) => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }));
  };

  const toggleStudentExpand = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const getSubmissionStatus = (state) => {
    switch (state) {
      case "TURNED_IN":
        return {
          label: "Turned In",
          icon: (
            <Check size={16} className="status-icon status-icon-submitted" />
          ),
          class: "status-submitted",
        };
      case "RETURNED":
        return {
          label: "Graded",
          icon: <Check size={16} className="status-icon status-icon-graded" />,
          class: "status-graded",
        };
      case "LATE":
        return {
          label: "Late",
          icon: <Clock size={16} className="status-icon status-icon-late" />,
          class: "status-late",
        };
      case "MISSING":
        return {
          label: "Missing",
          icon: <X size={16} className="status-icon status-icon-missing" />,
          class: "status-missing",
        };
      default:
        return {
          label: "Not Submitted",
          icon: (
            <AlertCircle
              size={16}
              className="status-icon status-icon-notsubmitted"
            />
          ),
          class: "status-notsubmitted",
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubmissionStats = (assignmentId) => {
    const assignmentSubmissions = submissions[assignmentId] || [];
    const totalStudents = students.length;
    const turned_in = assignmentSubmissions.filter(
      (sub) => sub.state === "TURNED_IN" || sub.state === "RETURNED"
    ).length;

    return {
      total: totalStudents,
      submitted: turned_in,
      missing: totalStudents - turned_in,
    };
  };

  const openAttachment = (attachment) => {
    if (attachment && attachment.link) {
      window.open(attachment.link.url, "_blank");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="course-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-page">
        <div className="error-container">
          <AlertCircle size={48} className="error-icon" />
          <h2>Course Not Found</h2>
          <p>We couldn't find the course you're looking for.</p>
          <button onClick={handleBackToHome} className="back-button">
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="course-detail-header">
        <div className="container header-container">
          <div className="back-link">
            <button onClick={handleBackToHome} className="back-button">
              <ChevronLeft size={16} />
              Back to Dashboard
            </button>
          </div>
          <div className="course-header-content">
            <div className="course-icon">
              <Book size={24} />
            </div>
            <div className="course-header-info">
              <h1 className="course-title">{course.name}</h1>
              <div className="course-meta">
                <span className="meta-item">
                  {course.section || "No section"}
                </span>
                <span className="separator">•</span>
                <span className="meta-item">{students.length} students</span>
                <span className="separator">•</span>
                <span className="meta-item">
                  {assignments.length} assignments
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="course-detail-stats">
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Students</p>
                <h3 className="stat-value">{students.length}</h3>
              </div>
              <div className="stat-icon-container">
                <Users size={24} className="stat-icon" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Assignments</p>
                <h3 className="stat-value">{assignments.length}</h3>
              </div>
              <div className="stat-icon-container">
                <FileText size={24} className="stat-icon" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Upcoming Due</p>
                <h3 className="stat-value">
                  {
                    assignments.filter((a) => {
                      if (!a.dueDate) return false;
                      const dueDate = new Date(a.dueDate);
                      return dueDate > new Date();
                    }).length
                  }
                </h3>
              </div>
              <div className="stat-icon-container">
                <Calendar size={24} className="stat-icon" />
              </div>
            </div>
          </div>
        </div>

        <div className="course-detail-tabs">
          <button
            className={`tab-button ${
              activeTab === "assignments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("assignments")}
          >
            <FileText size={16} />
            Assignments
          </button>
          <button
            className={`tab-button ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            <Users size={16} />
            Students
          </button>
        </div>

        {activeTab === "assignments" && (
          <div className="assignments-container">
            <h2 className="section-title">Course Assignments</h2>

            {assignments.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} className="empty-icon" />
                <p>No assignments found for this course.</p>
              </div>
            ) : (
              <div className="assignments-list">
                {assignments.map((assignment) => {
                  const stats = getSubmissionStats(assignment.id);
                  const isExpanded = expandedAssignments[assignment.id];

                  return (
                    <div key={assignment.id} className="assignment-item">
                      <div
                        className="assignment-header"
                        onClick={() => toggleAssignmentExpand(assignment.id)}
                      >
                        <div className="assignment-info">
                          <div className="assignment-icon">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h3 className="assignment-title">
                              {assignment.title}
                            </h3>
                            <div className="assignment-meta">
                              <span className="meta-date">
                                <Clock size={14} />
                                Due: {formatDate(assignment.dueDate)}
                              </span>
                              <span className="meta-submissions">
                                <Check size={14} />
                                {stats.submitted}/{stats.total} submitted
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`expand-icon ${
                            isExpanded ? "expanded" : ""
                          }`}
                        >
                          ▼
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="assignment-details">
                          {assignment.description && (
                            <div className="assignment-description">
                              <h4>Description</h4>
                              <p>{assignment.description}</p>
                            </div>
                          )}

                          {assignment.materials &&
                            assignment.materials.length > 0 && (
                              <div className="assignment-materials">
                                <h4>Materials</h4>
                                <ul className="materials-list">
                                  {assignment.materials.map(
                                    (material, index) => (
                                      <li key={index} className="material-item">
                                        {material.driveFile && (
                                          <a
                                            href={
                                              material.driveFile.driveFile
                                                .alternateLink
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="material-link"
                                          >
                                            <FileText
                                              size={16}
                                              className="material-icon"
                                            />
                                            {material.driveFile.driveFile.title}
                                            <ExternalLink
                                              size={14}
                                              className="material-external-icon"
                                            />
                                          </a>
                                        )}
                                        {material.link && (
                                          <a
                                            href={material.link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="material-link"
                                          >
                                            <ExternalLink
                                              size={16}
                                              className="material-icon"
                                            />
                                            {material.link.title ||
                                              material.link.url}
                                            <ExternalLink
                                              size={14}
                                              className="material-external-icon"
                                            />
                                          </a>
                                        )}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                          <div className="assignment-submissions">
                            <h4>Student Submissions</h4>
                            <table className="submissions-table">
                              <thead>
                                <tr>
                                  <th>Student</th>
                                  <th>Status</th>
                                  <th>Submitted</th>
                                  <th>Attachments</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map((student) => {
                                  const studentSubmissions =
                                    submissions[assignment.id] || [];
                                  const submission = studentSubmissions.find(
                                    (sub) => sub.userId === student.userId
                                  );
                                  const status = submission
                                    ? getSubmissionStatus(submission.state)
                                    : getSubmissionStatus("NOT_SUBMITTED");

                                  return (
                                    <tr key={student.userId}>
                                      <td className="student-name-cell">
                                        <div className="student-name">
                                          <User
                                            size={16}
                                            className="student-icon"
                                          />
                                          {student.profile?.name?.fullName ||
                                            "Student"}
                                        </div>
                                      </td>
                                      <td>
                                        <div
                                          className={`submission-status ${status.class}`}
                                        >
                                          {status.icon}
                                          <span>{status.label}</span>
                                        </div>
                                      </td>
                                      <td>
                                        {submission && submission.updateTime
                                          ? formatDate(submission.updateTime)
                                          : "Not submitted"}
                                      </td>
                                      <td>
                                        {submission &&
                                        submission.assignmentSubmission
                                          ?.attachments?.length > 0 ? (
                                          <div className="attachment-list">
                                            {submission.assignmentSubmission.attachments.map(
                                              (attachment, idx) => (
                                                <button
                                                  key={idx}
                                                  className="attachment-button"
                                                  onClick={() =>
                                                    openAttachment(attachment)
                                                  }
                                                >
                                                  <Download size={14} />
                                                  {attachment.driveFile
                                                    ?.title ||
                                                    attachment.link?.title ||
                                                    "Attachment"}
                                                </button>
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          "No attachments"
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="students-container">
            <h2 className="section-title">Enrolled Students</h2>

            {students.length === 0 ? (
              <div className="empty-state">
                <Users size={48} className="empty-icon" />
                <p>No students enrolled in this course.</p>
              </div>
            ) : (
              <div className="students-list">
                {students.map((student) => {
                  const isExpanded = expandedStudent === student.userId;
                  const studentProfile = student.profile || {};

                  return (
                    <div key={student.userId} className="student-item">
                      <div
                        className="student-header"
                        onClick={() => toggleStudentExpand(student.userId)}
                      >
                        <div className="student-info">
                          <div className="student-avatar">
                            {studentProfile.photoUrl ? (
                              <img
                                src={studentProfile.photoUrl}
                                alt={studentProfile.name?.fullName}
                              />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div>
                            <h3 className="student-name">
                              {studentProfile.name?.fullName || "Student"}
                            </h3>
                            <div className="student-meta">
                              <span className="student-email">
                                {studentProfile.emailAddress || "No email"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`expand-icon ${
                            isExpanded ? "expanded" : ""
                          }`}
                        >
                          ▼
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="student-details">
                          <h4>Assignment Progress</h4>
                          <table className="student-submissions-table">
                            <thead>
                              <tr>
                                <th>Assignment</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Submission Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {assignments.map((assignment) => {
                                const assignmentSubmissions =
                                  submissions[assignment.id] || [];
                                const submission = assignmentSubmissions.find(
                                  (sub) => sub.userId === student.userId
                                );
                                const status = submission
                                  ? getSubmissionStatus(submission.state)
                                  : getSubmissionStatus("NOT_SUBMITTED");

                                return (
                                  <tr key={assignment.id}>
                                    <td className="assignment-name-cell">
                                      <div className="assignment-name">
                                        <FileText
                                          size={16}
                                          className="assignment-icon"
                                        />
                                        {assignment.title}
                                      </div>
                                    </td>
                                    <td>
                                      <div
                                        className={`submission-status ${status.class}`}
                                      >
                                        {status.icon}
                                        <span>{status.label}</span>
                                      </div>
                                    </td>
                                    <td>{formatDate(assignment.dueDate)}</td>
                                    <td>
                                      {submission && submission.updateTime
                                        ? formatDate(submission.updateTime)
                                        : "Not submitted"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
