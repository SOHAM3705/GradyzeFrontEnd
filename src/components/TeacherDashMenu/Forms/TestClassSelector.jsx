import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const TestClassSelector = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/teacher/teacher/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeacherData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch teacher data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const handleContinue = () => {
    if (selectedType === "class" && selectedClass) {
      navigate(
        `create-test-form?type=class&year=${selectedClass.year}&division=${selectedClass.division}`
      );
    } else if (selectedType === "subject" && selectedSubject) {
      navigate(
        `create-test-form?type=subject` +
          `&subjectName=${encodeURIComponent(selectedSubject.name)}` +
          `&year=${selectedSubject.year}` +
          `&semester=${selectedSubject.semester}` +
          `&division=${selectedSubject.division}`
      );
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Test</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Test Type</h3>
        <div className="flex gap-4 mb-4">
          {teacherData.isClassTeacher && (
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedType === "class"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedType("class")}
            >
              Class Test
            </button>
          )}
          {teacherData.isSubjectTeacher && (
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedType === "subject"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedType("subject")}
            >
              Subject Test
            </button>
          )}
        </div>
      </div>

      {selectedType === "class" && teacherData.isClassTeacher && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Class</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-medium">
              {teacherData.assignedClass.year} -{" "}
              {teacherData.assignedClass.division}
              {teacherData.assignedClass.section &&
                ` (${teacherData.assignedClass.section})`}
            </p>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setSelectedClass(teacherData.assignedClass)}
            >
              Select This Class
            </button>
          </div>
        </div>
      )}

      {selectedType === "subject" && teacherData.isSubjectTeacher && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Subject</h3>
          <div className="space-y-2">
            {teacherData.subjects.map((subject) => (
              <div
                key={`${subject.name}-${subject.year}-${subject.division}`}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedSubject?.name === subject.name
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedSubject(subject)}
              >
                <h4 className="font-medium">{subject.name}</h4>
                <p className="text-sm text-gray-600">
                  {subject.year} - Semester {subject.semester} -{" "}
                  {subject.division}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
        onClick={handleContinue}
        disabled={
          !selectedType ||
          (selectedType === "class" && !selectedClass) ||
          (selectedType === "subject" && !selectedSubject)
        }
      >
        Continue to Test Creation
      </button>
    </div>
  );
};

export default TestClassSelector;
