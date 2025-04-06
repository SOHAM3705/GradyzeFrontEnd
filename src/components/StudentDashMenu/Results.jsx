import React, { useState, useEffect } from "react";
import axios from "axios";

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
        `https://gradyzebackend.onrender.com/api/studentResult/marks/${studentId}`
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
    <div className="container mx-auto p-4">
      {loading && (
        <div className="flex justify-center items-center my-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
        </div>
      )}

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {!loading && !error && marksData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marksData.map((data, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold">
                  {data.studentId?.name || "Unknown"}
                </h3>
                <p className="text-sm text-gray-600">
                  {data.studentId?.email || "N/A"}
                </p>
              </div>
              <p className="text-sm text-gray-800 font-medium">
                Exam Type: <span className="font-normal">{data.examType}</span>
              </p>
              <p className="text-sm text-gray-800 font-medium mb-2">
                Year: <span className="font-normal">{data.year}</span>
              </p>

              <div className="mt-3 space-y-3">
                {data.exams.map((exam, examIndex) => (
                  <div
                    key={examIndex}
                    className="bg-gray-50 p-3 rounded-md shadow-inner border border-gray-100"
                  >
                    <p className="text-sm text-gray-700 font-medium">
                      Subject:{" "}
                      <span className="font-normal">
                        {exam.subjectId?.name || "N/A"} (
                        {exam.subjectId?.code || "N/A"})
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Marks: {exam.marksObtained} / {exam.totalMarks}
                    </p>
                    <p className="text-sm text-gray-700">
                      Status: {exam.status}
                    </p>
                    <p className="text-sm text-gray-700">
                      Teacher: {exam.teacherId?.name || "N/A"}
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
          <p className="text-center text-gray-600 mt-6">
            No marks data available.
          </p>
        )
      )}
    </div>
  );
};

export default StudentMarks;
