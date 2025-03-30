import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("class-teacher");
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [isSubjectTeacher, setIsSubjectTeacher] = useState(false);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalStudents: 0,
    passRate: 0,
    classAverage: 0,
    highestPerformer: "N/A",
    atRiskCount: "0%",
  });
  const [subjectSummaryData, setSubjectSummaryData] = useState({
    totalStudents: 0,
    passRate: 0,
    averageScore: 0,
    highestScore: 0,
  });
  const [studentsData, setStudentsData] = useState({});
  const [examTypeMarks, setExamTypeMarks] = useState({
    "unit-test": { q1q2Max: 15, q3q4Max: 15, passingMark: 12, totalMarks: 30 },
    "re-unit-test": {
      q1q2Max: 15,
      q3q4Max: 15,
      passingMark: 12,
      totalMarks: 30,
    },
    prelim: {
      q1q2Max: 17,
      q3q4Max: 18,
      q5q6Max: 17,
      q7q8Max: 18,
      passingMark: 28,
      totalMarks: 70,
    },
    reprelim: {
      q1q2Max: 17,
      q3q4Max: 18,
      q5q6Max: 17,
      q7q8Max: 18,
      passingMark: 28,
      totalMarks: 70,
    },
  });

  // Initialize selectedBatch
  const [selectedBatch, setSelectedBatch] = useState("");

  const teacherId = sessionStorage.getItem("teacherId");
  const apiBaseUrl = "https://gradyzebackend.onrender.com/api";

  // API request with error handling and loading state
  const makeRequest = async (method, endpoint, data = null, params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      if (!token && endpoint !== "/teachermarks/teacher-role/") {
        throw new Error("No authentication token found. Please log in again.");
      }

      const config = {
        method,
        url: `${apiBaseUrl}${endpoint}`,
        headers: { Authorization: `Bearer ${token}` },
        params,
      };

      if (data && (method === "post" || method === "put")) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      setError(errorMessage);
      console.error(
        `Error during ${method.toUpperCase()} request to ${endpoint}:`,
        error
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Improved fetch subject students data
  const fetchSubjectStudentsData = async () => {
    if (!subjectsList.length) return;

    try {
      const subjectDataPromises = subjectsList.map(async (subject) => {
        console.log("Fetching data for subject:", subject.name, subject._id);

        const data = await makeRequest(
          "get",
          `/teachermarks/${teacherId}/subject/${subject._id}/students`,
          null,
          { subjectId: subject._id, teacherId }
        );

        return {
          [subject._id]: {
            students: data.students || [],
            examData: data.examData || {},
          },
        };
      });

      const subjectDataResults = await Promise.all(subjectDataPromises);
      const combinedStudentsData = subjectDataResults.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );

      console.log("Combined Students Data:", combinedStudentsData);
      setStudentsData(combinedStudentsData);
    } catch (error) {
      console.error("Failed to fetch subject students:", error);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  useEffect(() => {
    if (activeTab === "class-teacher") {
      fetchStudents();
      fetchAssignedDivision();
    } else if (activeTab === "subject-teacher") {
      fetchSubjects();
      fetchSubjectsList();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "class-teacher") {
      updateSummary();
      filterStudents();
    }
  }, [students, division, selectedExamType, searchQuery]);

  const fetchTeacherData = async () => {
    try {
      const data = await makeRequest(
        "get",
        `/teachermarks/teacher-role/${teacherId}`
      );

      setIsClassTeacher(data.isClassTeacher);
      setIsSubjectTeacher(data.isSubjectTeacher);

      setActiveTab(
        data.isSubjectTeacher && !data.isClassTeacher
          ? "subject-teacher"
          : "class-teacher"
      );
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "subject-teacher" && subjectsList.length > 0) {
      fetchSubjectStudentsData();
    }
  }, [activeTab, subjectsList]);

  const fetchAssignedDivision = async () => {
    try {
      const data = await makeRequest(
        "get",
        `/teachermarks/${teacherId}/divisions`
      );

      setDivision(data.division);
      setYear(data.year);
    } catch (error) {
      console.error("Error fetching assigned division:", error);
    }
  };

  // Improved students fetching with proper error handling
  const fetchStudents = async () => {
    try {
      const data = await makeRequest(
        "get",
        `/teachermarks/${teacherId}/students`
      );

      if (Array.isArray(data.students)) {
        setStudents(data.students);
        console.log("Successfully fetched students:", data.students.length);
      } else {
        throw new Error("API returned unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await makeRequest(
        "get",
        `/teachermarks/${teacherId}/subjects`
      );

      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        console.error("Expected an array for subjects data");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchSubjectsList = async () => {
    try {
      const data = await makeRequest(
        "get",
        `/teachermarks/subject-list/${teacherId}`
      );

      console.log("Fetched Subject List:", data);

      if (data && Array.isArray(data.subjects)) {
        setSubjectsList(data.subjects);
      } else {
        console.error("Expected an array for subjects list data, got:", data);
        setSubjectsList([]);
      }
    } catch (error) {
      console.error("Error fetching subjects list:", error);
    }
  };

  const updateSummary = () => {
    const totalStudents = students.length;
    if (totalStudents === 0) return;

    const passedStudents = students.filter(
      (student) => student.status === "pass"
    ).length;
    const passRate = Math.round((passedStudents / totalStudents) * 100) || 0;

    let totalPercentage = 0;
    let studentsWithScores = 0;

    students.forEach((student) => {
      const score = calculateOverallScore(
        student,
        selectedExamType || "unit-test"
      );
      if (score !== "N/A") {
        totalPercentage += parseInt(score);
        studentsWithScores++;
      }
    });

    const classAverage =
      studentsWithScores > 0
        ? Math.round(totalPercentage / studentsWithScores)
        : 0;

    let highestScore = 0;
    let highestPerformer = null;

    students.forEach((student) => {
      const score = calculateOverallScore(
        student,
        selectedExamType || "unit-test"
      );
      if (score !== "N/A" && parseInt(score) > highestScore) {
        highestScore = parseInt(score);
        highestPerformer = student;
      }
    });

    const atRiskCount = students.filter((student) => {
      const score = calculateOverallScore(
        student,
        selectedExamType || "unit-test"
      );
      return score !== "N/A" && parseInt(score) < 40;
    }).length;

    const atRiskPercentage =
      Math.round((atRiskCount / totalStudents) * 100) || 0;

    setSummaryData({
      totalStudents,
      passRate,
      classAverage,
      highestPerformer: highestPerformer
        ? `${highestPerformer.name} (${highestScore}%)`
        : "N/A",
      atRiskCount: `${atRiskCount} (${atRiskPercentage}%)`,
    });
  };

  const filterStudents = () => {
    if (!students.length) return;

    let filtered = students
      .filter((student) => {
        const matchesSearch =
          student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNo?.toString().includes(searchQuery);
        return matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const calculateOverallScore = (student, examType = "unit-test") => {
    if (!student || !student.marks) return "N/A";

    let totalMarks = 0;
    let totalFullMarks = 0;
    let subjectsWithMarks = 0;

    for (const subjectId in student.marks) {
      const subjectMarks = student.marks[subjectId][examType];
      if (subjectMarks && subjectMarks > 0) {
        const subject = subjects.find((s) => s._id === subjectId);
        if (subject && subject.fullMarks && subject.fullMarks[examType]) {
          totalMarks += subjectMarks;
          totalFullMarks += subject.fullMarks[examType];
          subjectsWithMarks++;
        }
      }
    }

    if (subjectsWithMarks === 0) return "N/A";

    const percentage = Math.round((totalMarks / totalFullMarks) * 100);
    return percentage.toString();
  };

  // Improved rendering of students with pagination
  const renderStudents = () => {
    if (filteredStudents.length === 0) {
      return (
        <tr>
          <td colSpan="100%" className="p-4 text-center">
            No students found. {error ? `Error: ${error}` : ""}
          </td>
        </tr>
      );
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedStudents = filteredStudents.slice(
      startIndex,
      startIndex + rowsPerPage
    );

    return paginatedStudents.map((student) => (
      <tr key={student._id} className="border-b hover:bg-gray-100">
        <td className="p-2">{student.rollNo}</td>
        <td className="p-2">{student.name}</td>
        <td className="p-2">{division}</td>
        {subjects.map((subject) => (
          <td key={subject._id} className="p-2">
            {student.marks?.[subject._id]?.[selectedExamType || "unit-test"] ||
              0}
          </td>
        ))}
        <td className="p-2">
          {calculateOverallScore(student, selectedExamType || "unit-test")}%
        </td>
        <td
          className={`p-2 ${
            student.status === "pass" ? "text-green-600" : "text-red-600"
          }`}
        >
          {student.status?.charAt(0).toUpperCase() + student.status?.slice(1) ||
            "N/A"}
        </td>
        <td className="p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => openStudentModal(student._id)}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              View
            </button>
            <button
              onClick={() => openEditMarksModal(student._id)}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            >
              Edit
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  // New function to open edit marks modal
  const openEditMarksModal = async (studentId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${apiBaseUrl}/teachermarks/${teacherId}/student/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModalContent({
        student: response.data,
        type: "edit-marks",
      });
      setEditMode(true);
    } catch (error) {
      console.error("Error fetching student details for editing:", error);
      alert("Could not fetch student details for editing");
    }
  };

  const renderSubjects = () => {
    if (!subjectsList || subjectsList.length === 0) {
      return <p>No subjects available.</p>;
    }

    return subjectsList.map((subject) => {
      const hasAnyMarksEntered = Object.values(subject.marksEntered || {}).some(
        (value) => value
      );

      // Use fallback to handle different subject object structures
      const subjectId = subject._id || subject.id;
      const subjectName = subject.name;
      const subjectYear = subject.year;
      const subjectSemester = subject.semester;
      const subjectDivisions = subject.divisions || [subject.division];

      let buttonsHtml = (
        <button
          onClick={() => openExamModal(subjectId)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Marks
        </button>
      );

      if (hasAnyMarksEntered) {
        buttonsHtml = (
          <>
            {buttonsHtml}
            <button
              onClick={() => generatePDF(subjectId)}
              className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
            >
              Generate PDF
            </button>
            <button
              onClick={() => viewEditSubjectMarks(subjectId)}
              className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            >
              Edit Marks
            </button>
          </>
        );
      }

      return (
        <div key={subjectId} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">{subjectName}</h3>
          <p>Year: {subjectYear}</p>
          <p>Semester: {subjectSemester}</p>
          <p>Divisions: {subjectDivisions.join(", ")}</p>
          <p>Total Students: {subject.totalStudents || 0}</p>
          <div
            className={`status-badge ${getOverallStatus(
              subject
            ).toLowerCase()} text-sm font-semibold px-3 py-1 rounded mt-2 ${
              getOverallStatus(subject) === "Complete"
                ? "bg-green-100 text-green-800"
                : getOverallStatus(subject) === "In Progress"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {getOverallStatus(subject)}
          </div>
          <div className="flex mt-4 space-x-2">{buttonsHtml}</div>
        </div>
      );
    });
  };

  // New function to view/edit subject marks
  const viewEditSubjectMarks = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setModalContent({
      type: "edit-subject-exam-selection",
      subjectId,
    });
  };

  const getOverallStatus = (subject) => {
    // Add default value for marksEntered
    const marksEntered = subject.marksEntered || {};

    const hasAnyMarksEntered = Object.values(marksEntered).some(
      (value) => value
    );
    const allMarksEntered = Object.values(marksEntered).every((value) => value);

    if (allMarksEntered) return "Complete";
    if (hasAnyMarksEntered) return "In Progress";
    return "Pending";
  };

  useEffect(() => {
    if (activeTab === "subject-teacher") {
      updateSubjectSummary();
    }
  }, [activeTab, studentsData]);

  // Modified updateSubjectSummary to handle undefined data safely
  const updateSubjectSummary = () => {
    let totalStudents = 0;
    let totalPassed = 0;
    let totalMarks = 0;
    let totalWithMarks = 0;
    let highestMark = 0;

    if (!subjectsList.length) return;

    subjectsList.forEach((subject) => {
      const subjectData = studentsData[subject._id];
      if (!subjectData) return; // Skip if no data for this subject

      totalStudents += subject.totalStudents || 0;

      for (const examType in subject.marksEntered || {}) {
        if (subject.marksEntered[examType]) {
          const examData = subjectData.examData[examType] || [];

          examData.forEach((studentExamData) => {
            if (studentExamData && studentExamData.total > 0) {
              totalWithMarks++;
              totalMarks += studentExamData.total;

              const isUnitTest =
                examType === "unit-test" || examType === "re-unit-test";
              const passingMark = isUnitTest ? 12 : 28;

              if (studentExamData.total >= passingMark) {
                totalPassed++;
              }

              if (studentExamData.total > highestMark) {
                highestMark = studentExamData.total;
              }
            }
          });
        }
      }
    });

    const passRate =
      totalWithMarks > 0 ? Math.round((totalPassed / totalWithMarks) * 100) : 0;
    const averageScore =
      totalWithMarks > 0 ? Math.round(totalMarks / totalWithMarks) : 0;

    setSubjectSummaryData({
      totalStudents,
      passRate,
      averageScore,
      highestScore: highestMark,
    });
  };

  const generatePDF = (subjectId) => {
    openPdfExamTypeModal(subjectId);
  };

  const openPdfExamTypeModal = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setModalContent({
      type: "pdf-exam-selection",
      subjectId,
    });
  };

  const handleSavePDF = () => {
    const subject = subjectsList.find((s) => s._id === selectedSubjectId);
    const examType = selectedExamType;

    if (!examType) {
      alert("Please select an exam type.");
      return;
    }

    closeModal();
    alert(
      `PDF generation for ${subject.name} - ${examTypeToText(
        examType
      )} initiated!`
    );
  };

  const examTypeToText = (type) => {
    const types = {
      "unit-test": "Unit Test",
      "re-unit-test": "Re-Unit Test",
      prelim: "Prelim",
      reprelim: "Re-Prelim",
    };

    return types[type] || type;
  };

  // Improved modal content rendering with edit functionality
  const renderModalContent = () => {
    if (!modalContent) return null;

    switch (modalContent.type) {
      case "student-details":
        const { student } = modalContent;
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
              <div className="mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800">
                  {student.name} - Performance Details
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block font-medium text-gray-600">
                    Roll No.
                  </label>
                  <span className="block mt-1">{student.rollNo}</span>
                </div>
                <div>
                  <label className="block font-medium text-gray-600">
                    Division
                  </label>
                  <span className="block mt-1">{division}</span>
                </div>
                <div>
                  <label className="block font-medium text-gray-600">
                    Status
                  </label>
                  <span className={`block mt-1 ${student.status}`}>
                    {student.status?.charAt(0).toUpperCase() +
                      student.status?.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block font-medium text-gray-600">
                    Overall Score
                  </label>
                  <span className="block mt-1">
                    {calculateOverallScore(student, "unit-test")}%
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Academic Performance
              </h3>
              <div className="chart-container h-64 mb-4 bg-gray-100">
                <p className="text-center pt-20">
                  Performance charts would be rendered here.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="bg-white p-4 rounded shadow"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {subject.name}
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left">Exam Type</th>
                          <th className="text-left">Marks</th>
                          <th className="text-left">Full Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(subject.fullMarks || {}).map(
                          (examType) => (
                            <tr key={examType}>
                              <td>
                                {examType
                                  .replace(/-/g, " ")
                                  .charAt(0)
                                  .toUpperCase() +
                                  examType.replace(/-/g, " ").slice(1)}
                              </td>
                              <td>
                                {student.marks?.[subject._id]?.[examType] || 0}
                              </td>
                              <td>{subject.fullMarks[examType]}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => openEditMarksModal(student._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Edit Marks
                </button>
                <button
                  onClick={() =>
                    alert("Send report functionality would be implemented here")
                  }
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Send Report
                </button>
                <button
                  onClick={() =>
                    alert(
                      "Download report functionality would be implemented here"
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download Report
                </button>
              </div>
            </div>
          </div>
        );

      case "edit-marks":
        const studentForEdit = modalContent.student;
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
              <div className="mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800">
                  Edit Marks for {studentForEdit.name}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block font-medium text-gray-600">
                    Roll No.
                  </label>
                  <span className="block mt-1">{studentForEdit.rollNo}</span>
                </div>
                <div>
                  <label className="block font-medium text-gray-600">
                    Division
                  </label>
                  <span className="block mt-1">{division}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-600 mb-2">
                  Select Exam Type
                </label>
                <select
                  value={selectedExamType || "unit-test"}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="unit-test">Unit Test</option>
                  <option value="re-unit-test">Re-Unit Test</option>
                  <option value="prelim">Prelim</option>
                  <option value="reprelim">Re-Prelim</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full mb-4">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Subject</th>
                      <th className="p-2 text-right">Current Marks</th>
                      <th className="p-2 text-right">New Marks</th>
                      <th className="p-2 text-center">Full Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => {
                      const currentMarks =
                        studentForEdit.marks?.[subject._id]?.[
                          selectedExamType || "unit-test"
                        ] || 0;
                      const fullMarks =
                        subject.fullMarks?.[selectedExamType || "unit-test"] ||
                        0;
                      return (
                        <tr key={subject._id} className="border-b">
                          <td className="p-2">{subject.name}</td>
                          <td className="p-2 text-right">{currentMarks}</td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              min="0"
                              max={fullMarks}
                              defaultValue={currentMarks}
                              className="w-20 p-1 border rounded text-right"
                              id={`marks-${subject._id}`}
                            />
                          </td>
                          <td className="p-2 text-center">{fullMarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveEditedMarks(studentForEdit._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        );

      case "add-marks":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
              <div className="mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800">
                  Add Marks for{" "}
                  {selectedExamType.replace("-", " ").toUpperCase()}
                </h3>
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-600 mb-2">
                  Select Exam Type
                </label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="unit-test">Unit Test</option>
                  <option value="re-unit-test">Re-Unit Test</option>
                  <option value="prelim">Prelim</option>
                  <option value="reprelim">Re-Prelim</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-600 mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedSubject || ""}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSubject && (
                <div className="mb-4">
                  <label className="block font-medium text-gray-600 mb-2">
                    Full Marks
                  </label>
                  <input
                    type="number"
                    value={fullMarks}
                    onChange={(e) =>
                      setFullMarks(parseInt(e.target.value, 10) || 0)
                    }
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              )}

              {selectedSubject && (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 text-left">Roll No.</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-right">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id} className="border-b">
                          <td className="p-2">{student.rollNo}</td>
                          <td className="p-2">{student.name}</td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              min="0"
                              max={fullMarks}
                              defaultValue={
                                student.marks?.[selectedSubject]?.[
                                  selectedExamType
                                ] || 0
                              }
                              className="w-20 p-1 border rounded text-right"
                              id={`marks-${student._id}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMarks}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={!selectedSubject || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Marks"}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Function to handle saving edited marks
  const handleSaveEditedMarks = async (studentId) => {
    try {
      setIsSubmitting(true);

      const updatedMarks = {};
      subjects.forEach((subject) => {
        const inputElement = document.getElementById(`marks-${subject._id}`);
        if (inputElement) {
          const markValue = parseInt(inputElement.value, 10) || 0;
          updatedMarks[subject._id] = {
            ...updatedMarks[subject._id],
            [selectedExamType]: markValue,
          };
        }
      });

      const response = await axios.put(
        `${apiBaseUrl}/students/${studentId}/marks`,
        {
          marks: updatedMarks,
          examType: selectedExamType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the students state with the new marks
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId
              ? {
                  ...student,
                  marks: {
                    ...student.marks,
                    ...Object.keys(updatedMarks).reduce((acc, subjectId) => {
                      acc[subjectId] = {
                        ...(student.marks?.[subjectId] || {}),
                        [selectedExamType]:
                          updatedMarks[subjectId][selectedExamType],
                      };
                      return acc;
                    }, {}),
                  },
                }
              : student
          )
        );

        toast.success("Marks updated successfully");
        closeModal();
      }
    } catch (error) {
      console.error("Error updating marks:", error);
      toast.error(error.response?.data?.message || "Failed to update marks");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle saving marks for all students
  const handleSaveMarks = async () => {
    if (!selectedSubject) return;

    try {
      setIsSubmitting(true);

      const updatedStudents = students.map((student) => {
        const inputElement = document.getElementById(`marks-${student._id}`);
        const markValue = inputElement
          ? parseInt(inputElement.value, 10) || 0
          : 0;

        return {
          studentId: student._id,
          mark: markValue,
        };
      });

      const response = await axios.post(
        `${apiBaseUrl}/marks/batch`,
        {
          subjectId: selectedSubject,
          examType: selectedExamType,
          fullMarks: fullMarks,
          students: updatedStudents,
          division: division,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the students state with the new marks
        setStudents((prevStudents) =>
          prevStudents.map((student) => {
            const studentUpdate = updatedStudents.find(
              (update) => update.studentId === student._id
            );

            if (studentUpdate) {
              return {
                ...student,
                marks: {
                  ...student.marks,
                  [selectedSubject]: {
                    ...(student.marks?.[selectedSubject] || {}),
                    [selectedExamType]: studentUpdate.mark,
                  },
                },
              };
            }
            return student;
          })
        );

        // Update the subject with the new full marks
        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) =>
            subject._id === selectedSubject
              ? {
                  ...subject,
                  fullMarks: {
                    ...(subject.fullMarks || {}),
                    [selectedExamType]: fullMarks,
                  },
                }
              : subject
          )
        );

        toast.success("Marks saved successfully");
        closeModal();
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error(error.response?.data?.message || "Failed to save marks");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-medium text-gray-600 mb-2">
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setDivision("");
                setStudents([]);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Batch --</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-600 mb-2">
              Select Division
            </label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              disabled={!selectedBatch}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Division --</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-600 mb-2">
              Exam Type
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="unit-test">Unit Test</option>
              <option value="re-unit-test">Re-Unit Test</option>
              <option value="prelim">Prelim</option>
              <option value="reprelim">Re-Prelim</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="w-full md:w-auto mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 p-2 border rounded"
            />
          </div>

          <div className="w-full md:w-auto flex gap-2">
            <button
              onClick={() => fetchStudents()}
              disabled={!division || isLoading}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 flex items-center"
            >
              <span className="mr-1">⟳</span> Refresh
            </button>

            <button
              onClick={() => {
                setModalContent({ type: "add-marks" });
                setModalOpen(true);
                setSelectedSubject("");
                setFullMarks(0);
              }}
              disabled={!students.length}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Marks
            </button>
          </div>
        </div>
      </div>

      {/* Student List */}
      {isLoading ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading students...</p>
        </div>
      ) : students.length > 0 ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort("rollNo")}
                  >
                    Roll No.
                    {sortConfig.key === "rollNo" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {sortConfig.key === "name" && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  {subjects.map((subject) => (
                    <th key={subject._id} className="p-3 text-center">
                      {subject.name}
                      <div className="text-xs text-gray-500">
                        FM: {subject.fullMarks?.[selectedExamType] || "-"}
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Percentage</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const totalMarks = calculateTotalMarks(student);
                  const totalFullMarks = calculateTotalFullMarks();
                  const percentage =
                    totalFullMarks > 0
                      ? ((totalMarks / totalFullMarks) * 100).toFixed(2)
                      : "-";

                  return (
                    <tr key={student._id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{student.rollNo}</td>
                      <td className="p-3">{student.name}</td>
                      {subjects.map((subject) => (
                        <td
                          key={`${student._id}-${subject._id}`}
                          className="p-3 text-center"
                        >
                          {student.marks?.[subject._id]?.[selectedExamType] ??
                            "-"}
                        </td>
                      ))}
                      <td className="p-3 text-center font-medium">
                        {totalMarks}
                      </td>
                      <td className="p-3 text-center">{percentage}%</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setModalContent({ type: "edit-marks", student });
                            setModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit Marks"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : division ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-500">No students found in this division.</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-500">
            Select a batch and division to view students.
          </p>
        </div>
      )}

      {/* Modal */}
      {modalContent && renderModalContent()}
    </div>
  );
};

export default TeacherDashboard;
