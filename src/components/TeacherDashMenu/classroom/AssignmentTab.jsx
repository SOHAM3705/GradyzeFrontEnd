// AssignmentTab.jsx
import React, { useEffect, useState } from "react";

const AssignmentTab = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  // Load courses (from localStorage for now)
  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    setCourses(storedCourses);
  }, []);

  // Fetch assignments when a course is selected
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/classroom/courses/${selectedCourse}/assignments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setAssignments(data.assignments || []);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
      setLoading(false);
    };

    fetchAssignments();
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
              {course.name} ({course.section})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
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
              <button className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Submissions
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentTab;
