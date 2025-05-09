import React, { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const StudentMarks = () => {
  const [studentId, setStudentId] = useState("");
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch marks data for a specific student
  const fetchMarksData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/studentResult/marks/${studentId}`
      );
      setMarksData(response.data.data);
    } catch (error) {
      console.error("Error fetching marks data:", error);
      setError("Something went wrong while fetching marks.");
    } finally {
      setLoading(false);
    }
  };

  // Get studentId from sessionStorage
  useEffect(() => {
    const storedStudentId = sessionStorage.getItem("studentId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
    }
  }, []);

  // Fetch marks when studentId is available
  useEffect(() => {
    if (studentId) {
      fetchMarksData();
    }
  }, [studentId]);

  return (
    <div className="container mx-auto p-2 sm:p-4">
      {loading && (
        <div className="flex justify-center items-center my-4 sm:my-6">
          <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-t-4 border-blue-500"></div>
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 mb-2 sm:mb-4 text-sm sm:text-base">
          {error}
        </p>
      )}

      {!loading && !error && marksData.length > 0 ? (
        <div className="flex flex-col gap-4 sm:gap-6">
          {marksData.map((examEntry, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200"
            >
              {/* Exam Header */}
              <div className="mb-2 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-600">
                  {examEntry.examType} - {examEntry.year}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Student: {examEntry.studentId?.name || "Unknown"} (
                  {examEntry.studentId?.email || "N/A"})
                </p>
              </div>

              {/* Subjects List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {examEntry.exams.map((subject, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-2 sm:p-4 rounded-lg border border-gray-100"
                  >
                    <p className="text-xs sm:text-sm font-medium">
                      Subject:{" "}
                      <span className="font-normal">{subject.subjectName}</span>
                    </p>
                    <p className="text-xs sm:text-sm font-medium">
                      Marks Obtained:{" "}
                      <span className="font-normal">
                        {subject.marksObtained?.total} / {subject.totalMarks}
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm font-medium">
                      Status:{" "}
                      <span
                        className={`font-bold ${
                          subject.status === "Fail"
                            ? "text-red-500"
                            : subject.status === "Pass"
                            ? "text-green-600"
                            : "text-yellow-500"
                        }`}
                      >
                        {subject.status}
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm font-medium">
                      Teacher:{" "}
                      <span className="font-normal">
                        {subject.teacherId?.name || "N/A"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-center text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base">
            No marks data available.
          </p>
        )
      )}
    </div>
  );
};

export default StudentMarks;
