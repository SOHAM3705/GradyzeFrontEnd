import React, { useEffect, useState } from "react";

const AssignmentTab = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const token = sessionStorage.getItem("token");

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
