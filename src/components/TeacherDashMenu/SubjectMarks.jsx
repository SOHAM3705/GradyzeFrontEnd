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

  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");
  const [marksData, setMarksData] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [modalContent, setModalContent] = useState(null);
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

  const teacherId = sessionStorage.getItem("teacherId");

  const fetchMarksForSubject = async (subjectId) => {
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/get-marks/${subjectId}`
      );
      setMarksData(response.data);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const fetchSubjectStudentsData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!teacherId) {
        console.error("No teacherId found in sessionStorage");
        return;
      }

      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/studentmanagement/students-by-subject/${teacherId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const studentsBySubject = response.data.studentData || {};
      const subjects = response.data.subjects || [];

      const classToSubjectMap = subjects.reduce((acc, subject) => {
        const className = `${subject.year}-${subject.division}`;
        acc[className] = subject._id;
        return acc;
      }, {});

      const processedData = subjects.reduce((acc, subject) => {
        const className = `${subject.year}-${subject.division}`;
        const subjectId = subject._id;

        acc[subjectId] = {
          students: studentsBySubject[className] || [],
          examData: {},
        };
        return acc;
      }, {});

      setStudentsData(processedData);
    } catch (error) {
      console.error(
        "Error fetching subject students data:",
        error.response?.data || error
      );
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
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/teacher-role/${teacherId}`
      );
      setIsClassTeacher(response.data.isClassTeacher);
      setIsSubjectTeacher(response.data.isSubjectTeacher);

      setActiveTab(
        response.data.isSubjectTeacher && !response.data.isClassTeacher
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
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/${teacherId}/divisions`
      );
      setDivision(response.data.division);
      setYear(response.data.year);
    } catch (error) {
      console.error("Error fetching assigned division:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        window.location.href = "/teacherlogin";
        return;
      }

      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/${teacherId}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (Array.isArray(response.data.students)) {
        setStudents(response.data.students);
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error.response?.data || error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/${teacherId}/subjects`
      );
      if (Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        console.error("Expected an array for subjects data");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchSubjectsList = async () => {
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/subject-list/${teacherId}`
      );

      if (response.data && Array.isArray(response.data.subjects)) {
        setSubjectsList(response.data.subjects);
      } else {
        console.error(
          "Expected an array for subjects list data, got:",
          response.data
        );
        setSubjectsList([]);
      }
    } catch (error) {
      console.error("Error fetching subjects list:", error);
    }
  };

  const updateSummary = () => {
    const totalStudents = students.length;
    const passedStudents = students.filter(
      (student) => student.status === "pass"
    ).length;
    const passRate = Math.round((passedStudents / totalStudents) * 100);

    let totalPercentage = 0;
    let studentsWithScores = 0;

    students.forEach((student) => {
      const score = calculateOverallScore(student, "unit-test");
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
      const score = calculateOverallScore(student, "unit-test");
      if (score !== "N/A" && parseInt(score) > highestScore) {
        highestScore = parseInt(score);
        highestPerformer = student;
      }
    });

    const atRiskCount = students.filter((student) => {
      const score = calculateOverallScore(student, "unit-test");
      return score !== "N/A" && parseInt(score) < 40;
    }).length;

    const atRiskPercentage = Math.round((atRiskCount / totalStudents) * 100);

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
    let totalMarks = 0;
    let totalFullMarks = 0;
    let subjectsWithMarks = 0;

    for (const subjectId in student.marks) {
      const subjectMarks = student.marks[subjectId][examType];
      if (subjectMarks && subjectMarks > 0) {
        const subject = subjects.find((s) => s._id == subjectId);
        totalMarks += subjectMarks;
        totalFullMarks += subject.fullMarks[examType];
        subjectsWithMarks++;
      }
    }

    if (subjectsWithMarks === 0) return "N/A";

    const percentage = Math.round((totalMarks / totalFullMarks) * 100);
    return percentage;
  };

  const renderStudents = () => {
    return filteredStudents.map((student) => (
      <tr key={student._id} className="border-b hover:bg-gray-100">
        <td className="p-2">{student.rollNo}</td>
        <td className="p-2">{student.name}</td>
        <td className="p-2">{division}</td>
        {subjects.map((subject) => (
          <td key={subject._id} className="p-2">
            {student.marks?.[subject._id]?.["unit-test"] || 0}
          </td>
        ))}
        <td className="p-2">{calculateOverallScore(student, "unit-test")}%</td>
        <td className={`p-2 ${student.status}`}>
          {student.status?.charAt(0).toUpperCase() + student.status?.slice(1)}
        </td>
        <td className="p-2">
          <button
            onClick={() => openStudentModal(student._id)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            View
          </button>
        </td>
      </tr>
    ));
  };

  const renderSubjects = () => {
    if (!subjectsList || subjectsList.length === 0) {
      return <p>No subjects available.</p>;
    }

    return subjectsList.map((subject) => {
      const hasAnyMarksEntered = Object.values(subject.marksEntered || {}).some(
        (value) => value
      );

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
              onClick={() =>
                openStudentsModal(subjectId, selectedExamType, true)
              }
              className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
            >
              Update Marks
            </button>
            <button
              onClick={() => handleDeleteMarks(subjectId)}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Delete Marks
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
          <p>Total Students: {studentsData[subjectId]?.students.length || 0}</p>
          <div
            className={`status-badge ${getOverallStatus(
              subject
            ).toLowerCase()} text-sm font-semibold px-3 py-1 rounded mt-2`}
          >
            {getOverallStatus(subject)}
          </div>
          <div className="flex mt-4">{buttonsHtml}</div>
        </div>
      );
    });
  };

  const getOverallStatus = (subject) => {
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

  const updateSubjectSummary = () => {
    let totalStudents = 0;
    let totalPassed = 0;
    let totalMarks = 0;
    let totalWithMarks = 0;
    let highestMark = 0;

    subjectsList.forEach((subject) => {
      const subjectData = studentsData[subject._id];
      if (!subjectData) return;

      totalStudents += subjectData.students.length;

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

  const openExamModal = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setModalContent({
      type: "exam-selection",
      subjectId,
    });
  };

  const openStudentsModal = (subjectId, examType, isUpdateMode = false) => {
    setSelectedSubjectId(subjectId);
    setSelectedExamType(examType);
    setModalContent({
      type: "students-list",
      subjectId,
      examType,
      isUpdateMode,
    });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const handleContinueExam = () => {
    if (!selectedExamType) {
      alert("Please select an exam type.");
      return;
    }

    closeModal();
    openStudentsModal(selectedSubjectId, selectedExamType);
  };

  const handleSaveMarks = async () => {
    const subjectData = studentsData[selectedSubjectId];
    if (!subjectData) return;

    const students = subjectData.students;
    const selectedSubject = subjectsList.find(
      (subject) => subject._id === selectedSubjectId
    );
    const selectedYear = selectedSubject ? selectedSubject.year : null; // Fetch year from subjectsList

    if (!selectedYear) {
      alert("Year is not available for the selected subject.");
      return;
    }

    const isUnitTest =
      selectedExamType === "unit-test" || selectedExamType === "re-unit-test";
    const isPrelim = selectedExamType === "prelim";

    const totalMarks = isUnitTest ? 30 : isPrelim ? 70 : 0;
    const passingMark = isUnitTest ? 12 : isPrelim ? 28 : 0;

    if (totalMarks === 0) {
      alert("Invalid exam type selected.");
      return;
    }

    const rows = document.querySelectorAll(".student-row");
    const teacherId = sessionStorage.getItem("teacherId");

    const marksToSave = Array.from(rows).map((row, index) => {
      const q1q2Input = row.querySelector(".q1q2-input");
      const q3q4Input = row.querySelector(".q3q4-input");
      const q5q6Input = isUnitTest ? null : row.querySelector(".q5q6-input");
      const q7q8Input = isUnitTest ? null : row.querySelector(".q7q8-input");

      const q1q2 = parseInt(q1q2Input?.value) || 0;
      const q3q4 = parseInt(q3q4Input?.value) || 0;
      const q5q6 = isUnitTest ? 0 : parseInt(q5q6Input?.value) || 0;
      const q7q8 = isUnitTest ? 0 : parseInt(q7q8Input?.value) || 0;

      const total = q1q2 + q3q4 + q5q6 + q7q8;

      let status = "";
      if (total === -1) status = "Absent";
      else if (total >= passingMark) status = "Pass";
      else status = "Fail";

      return {
        teacherId,
        studentId: students[index]._id,
        year: selectedYear, // Include year in the payload
        examType: selectedExamType,
        subjectId: selectedSubjectId,
        marksObtained: total,
        totalMarks,
        status,
      };
    });

    const filteredMarks = marksToSave.filter((m) => m.marksObtained !== 0);

    if (filteredMarks.length === 0) {
      alert("Please enter marks for at least one student.");
      return;
    }

    // Log the payload to verify its structure
    console.log("Marks to Save:", filteredMarks);

    try {
      const token = sessionStorage.getItem("token");

      // Send the request with the filteredMarks array
      await axios.post(
        `https://gradyzebackend.onrender.com/api/teachermarks/add`,
        filteredMarks,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Marks saved successfully!");
      closeModal();
      fetchSubjectStudentsData();
    } catch (error) {
      console.error("Error saving marks:", error.response?.data || error);
      alert(
        "Error saving marks: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUpdateMarks = async (marksId) => {
    const updatedMarks = {
      // Include the updated marks data here
    };

    try {
      await axios.put(
        `https://gradyzebackend.onrender.com/api/teachermarks/update`,
        updatedMarks,
        { params: { teacherId } }
      );
      alert("Marks updated successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error updating marks:", error);
    }
  };

  const handleDeleteMarks = async (subjectId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `https://gradyzebackend.onrender.com/api/teachermarks/delete`,
        {
          params: { teacherId, subjectId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Marks deleted successfully!");
      fetchSubjectStudentsData();
    } catch (error) {
      console.error("Error deleting marks:", error);
    }
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

  const renderModalContent = () => {
    if (!modalContent) return null;

    switch (modalContent.type) {
      case "student-details":
        const { student } = modalContent;
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
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
                <p>Chart would be rendered here.</p>
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
                          <th className="text-left">Marks Obtained</th>
                          <th className="text-left">Full Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(subject.fullMarks).map((examType) => (
                          <tr key={examType}>
                            <td>
                              {examType
                                .replace(/-/g, " ")
                                .charAt(0)
                                .toUpperCase() +
                                examType.replace(/-/g, " ").slice(1)}
                            </td>
                            <td>
                              {student.marks[subject._id]?.[examType] || 0}
                            </td>
                            <td>{subject.fullMarks[examType]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() =>
                    alert("Send report functionality would be implemented here")
                  }
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Send Report to Parents
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

      case "exam-selection":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
              <div className="mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800">
                  Select Exam Type
                </h3>
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-600">
                  Exam Type
                </label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option value="">Select an exam type</option>
                  <option value="unit-test">Unit Test</option>
                  <option value="re-unit-test">Re-Unit Test</option>
                  <option value="prelim">Prelim</option>
                  <option value="reprelim">Re-Prelim</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinueExam}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );
      case "students-list":
        const { subjectId, examType, isUpdateMode } = modalContent;
        const subjectData = studentsData[subjectId] || {
          students: [],
          examData: {},
        };
        const examData = subjectData.examData[examType] || [];
        const isUnitTest =
          examType === "unit-test" || examType === "re-unit-test";

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                &times;
              </button>
              <div className="mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800">
                  {examTypeToText(examType)} - Enter Student Marks
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isUnitTest ? "Pass mark: 12" : "Pass mark: 28"}
                </p>
              </div>
              <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full mb-4">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Roll No.</th>
                      <th className="p-2 text-left">Name</th>
                      {isUnitTest ? (
                        <>
                          <th className="p-2 text-center">Q1/Q2 (15)</th>
                          <th className="p-2 text-center">Q3/Q4 (15)</th>
                        </>
                      ) : (
                        <>
                          <th className="p-2 text-center">Q1/Q2 (17)</th>
                          <th className="p-2 text-center">Q3/Q4 (18)</th>
                          <th className="p-2 text-center">Q5/Q6 (17)</th>
                          <th className="p-2 text-center">Q7/Q8 (18)</th>
                        </>
                      )}
                      <th className="p-2 text-center">Total</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectData.students.map((student, index) => {
                      const studentExamData = examData[index] || {
                        q1q2: 0,
                        q3q4: 0,
                        q5q6: 0,
                        q7q8: 0,
                        total: 0,
                        status: "",
                      };

                      return (
                        <tr
                          key={student.rollNo}
                          className="student-row border-b hover:bg-gray-50"
                        >
                          <td className="p-2">{student.rollNo}</td>
                          <td className="p-2">{student.name}</td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={isUnitTest ? "15" : "17"}
                              defaultValue={studentExamData.q1q2}
                              className="q1q2-input w-16 p-1 border rounded text-center"
                              data-index={index}
                              onChange={() => updateStudentRow(index)}
                              disabled={student.status === "Absent"}
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={isUnitTest ? "15" : "18"}
                              defaultValue={studentExamData.q3q4}
                              className="q3q4-input w-16 p-1 border rounded text-center"
                              data-index={index}
                              onChange={() => updateStudentRow(index)}
                              disabled={student.status === "Absent"}
                            />
                          </td>
                          {!isUnitTest && (
                            <>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="17"
                                  defaultValue={studentExamData.q5q6}
                                  className="q5q6-input w-16 p-1 border rounded text-center"
                                  data-index={index}
                                  onChange={() => updateStudentRow(index)}
                                  disabled={student.status === "Absent"}
                                />
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="18"
                                  defaultValue={studentExamData.q7q8}
                                  className="q7q8-input w-16 p-1 border rounded text-center"
                                  data-index={index}
                                  onChange={() => updateStudentRow(index)}
                                  disabled={student.status === "Absent"}
                                />
                              </td>
                            </>
                          )}
                          <td className="p-2 total-cell text-center font-medium">
                            {studentExamData.total}
                          </td>
                          <td
                            className={`p-2 status-cell text-center ${
                              studentExamData.status.toLowerCase() === "pass"
                                ? "text-green-600"
                                : studentExamData.status.toLowerCase() ===
                                  "fail"
                                ? "text-red-600"
                                : ""
                            }`}
                          >
                            {studentExamData.status}
                          </td>
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
                  onClick={handleSaveMarks}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isUpdateMode ? "Update Marks" : "Save Marks"}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const updateStudentRow = (index) => {
    if (!modalContent || !modalContent.subjectId || !modalContent.examType)
      return;

    const row = document.querySelector(`.student-row:nth-child(${index + 1})`);
    if (!row) return;

    const isUnitTest =
      modalContent.examType === "unit-test" ||
      modalContent.examType === "re-unit-test";

    const q1q2Input = row.querySelector(".q1q2-input");
    const q3q4Input = row.querySelector(".q3q4-input");
    const q5q6Input = isUnitTest ? null : row.querySelector(".q5q6-input");
    const q7q8Input = isUnitTest ? null : row.querySelector(".q7q8-input");

    const q1q2 = parseInt(q1q2Input?.value) || 0;
    const q3q4 = parseInt(q3q4Input?.value) || 0;
    const q5q6 = isUnitTest ? 0 : parseInt(q5q6Input?.value) || 0;
    const q7q8 = isUnitTest ? 0 : parseInt(q7q8Input?.value) || 0;

    const total = q1q2 + q3q4 + q5q6 + q7q8;

    const totalCell = row.querySelector(".total-cell");
    if (totalCell) totalCell.textContent = total;

    const statusCell = row.querySelector(".status-cell");
    if (!statusCell) return;

    const passingMark = isUnitTest ? 12 : 28;
    let status = "";

    if (total > 0) {
      status = total >= passingMark ? "Pass" : "Fail";
    }

    statusCell.textContent = status;
    statusCell.className = `p-2 status-cell text-center ${
      status.toLowerCase() === "pass"
        ? "text-green-600"
        : status.toLowerCase() === "fail"
        ? "text-red-600"
        : ""
    }`;
  };

  const openStudentModal = async (studentId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/${teacherId}/student/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModalContent({
        student: response.data,
        type: "student-details",
      });
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert("Could not fetch student details");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <div className="bg-green-600 text-white p-5 rounded shadow-md mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() =>
              alert("PDF export functionality would be implemented here")
            }
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Export PDF
          </button>
          <button
            onClick={() =>
              alert("Email reports functionality would be implemented here")
            }
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Email Reports
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setActiveTab("class-teacher")}
          className={`px-4 py-2 rounded ${
            activeTab === "class-teacher"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          disabled={isSubjectTeacher && !isClassTeacher}
        >
          Class Teacher
        </button>
        <button
          onClick={() => setActiveTab("subject-teacher")}
          className={`px-4 py-2 rounded ${
            activeTab === "subject-teacher"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          disabled={isClassTeacher && !isSubjectTeacher}
        >
          Subject Teacher
        </button>
      </div>

      {activeTab === "class-teacher" && (
        <div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-600">Division</label>
              <span className="p-2 border rounded">{division}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-600">Exam Type</label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All Exams</option>
                <option value="unit-test">Unit Test</option>
                <option value="re-unit-test">Re-Unit Test</option>
                <option value="prelim">Prelim</option>
                <option value="reprelim">Re-Prelim</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Total Students</h3>
              <p className="text-2xl font-bold">{summaryData.totalStudents}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Overall Pass Rate</h3>
              <p className="text-2xl font-bold">{summaryData.passRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${summaryData.passRate}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Class Average</h3>
              <p className="text-2xl font-bold">{summaryData.classAverage}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${summaryData.classAverage}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Highest Performer</h3>
              <p className="text-xl font-bold">
                {summaryData.highestPerformer}
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">At-Risk Students</h3>
              <p className="text-xl font-bold">{summaryData.atRiskCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Student Performance</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded"
                />
                <button
                  onClick={filterStudents}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left">Roll No.</th>
                    <th className="p-2 text-left">Student Name</th>
                    <th className="p-2 text-left">Division</th>
                    {subjects.map((subject) => (
                      <th key={subject._id} className="p-2 text-left">
                        {subject.name}
                      </th>
                    ))}
                    <th className="p-2 text-left">Overall Score</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>{renderStudents()}</tbody>
              </table>
            </div>
            <div className="flex justify-center gap-2 mt-4"></div>
          </div>

          {renderModalContent()}
        </div>
      )}

      {activeTab === "subject-teacher" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Total Students</h3>
              <p className="text-2xl font-bold">
                {subjectSummaryData.totalStudents}
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Pass Rate</h3>
              <p className="text-2xl font-bold">
                {subjectSummaryData.passRate}%
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Average Score</h3>
              <p className="text-2xl font-bold">
                {subjectSummaryData.averageScore}
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Highest Score</h3>
              <p className="text-2xl font-bold">
                {subjectSummaryData.highestScore}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {renderSubjects()}
          </div>

          {renderModalContent()}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
