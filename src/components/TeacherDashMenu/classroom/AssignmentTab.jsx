import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config";

const AssignmentTab = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState(null); // assignment object
  const [submissions, setSubmissions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [studentMap, setStudentMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const token = sessionStorage.getItem("token");

  const handleManualMark = async (submission) => {
    const action = submission.state === "TURNED_IN" ? "reclaim" : "turnIn";

    try {
      await fetch(
        `${API_BASE_URL}/api/classroom/courses/${selectedCourse}/courseWork/${viewingAssignment.id}/submissions/${submission.id}/${action}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submission.id
            ? {
                ...s,
                state: action === "turnIn" ? "TURNED_IN" : "CREATED",
              }
            : s
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} submission:`, err.message);
    }
  };

  const handleViewSubmissions = async (assignment) => {
    setViewingAssignment(assignment);
    setModalVisible(true);
    setSubmissions([]);
    setSubmissionsLoading(true);

    try {
      // Fetch submissions
      const res = await fetch(
        `${API_BASE_URL}/api/classroom/courses/${selectedCourse}/courseWork/${assignment.id}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setSubmissions(data.submissions || []);

      // ✅ Fetch students
      const res2 = await fetch(
        `${API_BASE_URL}/api/classroom/courses/${selectedCourse}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data2 = await res2.json();
      const map = {};
      (data2.students || []).forEach((s) => {
        map[s.userId] = s.profile.name.fullName;
      });
      setStudentMap(map);
    } catch (err) {
      console.error("Error fetching submissions/students:", err.message);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // Fetch all courses (live)
  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/classroom/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Fetch assignments for a selected course
  const fetchAssignments = async (courseId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/classroom/courses/${courseId}/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (err) {
      console.error("Error fetching assignments:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssignments(selectedCourse);
    }
  }, [selectedCourse]);

  return (
    <div className="assignment-tab p-4">
      <h2 className="text-xl font-bold mb-4">Assignments</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Course:</label>
        <select
          className="border p-2 rounded"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Choose a course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.section || "No Section"})
            </option>
          ))}
        </select>
      </div>

      {coursesLoading ? (
        <p>Loading courses...</p>
      ) : loading ? (
        <p>Loading assignments...</p>
      ) : selectedCourse && assignments.length === 0 ? (
        <p>No assignments found for this course.</p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((a) => (
            <li key={a.id} className="border p-4 rounded shadow-sm bg-white">
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-gray-600">{a.description}</p>

              {a.dueDate && (
                <p className="text-sm mt-1">
                  📅 Due: {a.dueDate.year}/{a.dueDate.month}/{a.dueDate.day}
                </p>
              )}

              {a.pdfAttachments?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Attachments:</p>
                  <ul className="list-disc pl-5">
                    {a.pdfAttachments.map((file, i) => (
                      <li key={i}>
                        <a
                          href={file.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          📄 {file.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => handleViewSubmissions(a)}
                className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Submissions
              </button>
            </li>
          ))}
        </ul>
      )}

      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl space-y-4 relative shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => {
                setModalVisible(false);
                setViewingAssignment(null);
                setSubmissions([]);
                setStudentMap({});
              }}
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4">
              Submissions for: {viewingAssignment?.title}
            </h3>

            {submissionsLoading ? (
              <p>Loading submissions...</p>
            ) : submissions.length === 0 ? (
              <p>No submissions found for this assignment.</p>
            ) : (
              <table className="w-full table-auto border">
                <input
                  type="text"
                  placeholder="Search student by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Student Name</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Submitted</th>
                    <th className="p-2 text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => {
                    const studentName = studentMap[sub.userId] || sub.userId;
                    const isSubmitted =
                      sub.state === "TURNED_IN" || sub.state === "RETURNED";
                    return (
                      <tr key={i} className="border-t">
                        <td className="p-2">{studentName}</td>
                        <td className="p-2">
                          <span
                            className={`font-semibold ${
                              isSubmitted ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isSubmitted ? "Submitted" : "Unsubmitted"}
                          </span>
                        </td>
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={isSubmitted}
                            disabled={isSubmitted}
                            onChange={() => handleManualMark(sub)}
                          />
                        </td>
                        <td className="p-2 text-sm text-gray-500">
                          {sub.updateTime
                            ? new Date(sub.updateTime).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentTab;
