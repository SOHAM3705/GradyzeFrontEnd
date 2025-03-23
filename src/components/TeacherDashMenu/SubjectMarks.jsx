import React, { useState, useEffect } from "react";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: "101",
      name: "John Doe",
      division: "A",
      status: "pass",
      marks: {
        1: { "unit-test": 26, "re-unit-test": 0, prelim: 58, reprelim: 0 },
        2: { "unit-test": 24, "re-unit-test": 0, prelim: 56, reprelim: 0 },
        3: { "unit-test": 22, "re-unit-test": 0, prelim: 52, reprelim: 0 },
        4: { "unit-test": 25, "re-unit-test": 0, prelim: 55, reprelim: 0 },
        5: { "unit-test": 28, "re-unit-test": 0, prelim: 62, reprelim: 0 },
      },
    },
    {
      id: 2,
      rollNo: "102",
      name: "Jane Smith",
      division: "A",
      status: "pass",
      marks: {
        1: { "unit-test": 28, "re-unit-test": 0, prelim: 65, reprelim: 0 },
        2: { "unit-test": 27, "re-unit-test": 0, prelim: 68, reprelim: 0 },
        3: { "unit-test": 29, "re-unit-test": 0, prelim: 67, reprelim: 0 },
        4: { "unit-test": 28, "re-unit-test": 0, prelim: 66, reprelim: 0 },
        5: { "unit-test": 29, "re-unit-test": 0, prelim: 67, reprelim: 0 },
      },
    },
    {
      id: 3,
      rollNo: "103",
      name: "Michael Johnson",
      division: "A",
      status: "fail",
      marks: {
        1: { "unit-test": 10, "re-unit-test": 15, prelim: 26, reprelim: 30 },
        2: { "unit-test": 11, "re-unit-test": 14, prelim: 25, reprelim: 32 },
        3: { "unit-test": 13, "re-unit-test": 0, prelim: 28, reprelim: 0 },
        4: { "unit-test": 12, "re-unit-test": 15, prelim: 27, reprelim: 35 },
        5: { "unit-test": 10, "re-unit-test": 13, prelim: 26, reprelim: 31 },
      },
    },
    {
      id: 4,
      rollNo: "104",
      name: "Emily Davis",
      division: "A",
      status: "pass",
      marks: {
        1: { "unit-test": 25, "re-unit-test": 0, prelim: 55, reprelim: 0 },
        2: { "unit-test": 24, "re-unit-test": 0, prelim: 54, reprelim: 0 },
        3: { "unit-test": 26, "re-unit-test": 0, prelim: 58, reprelim: 0 },
        4: { "unit-test": 25, "re-unit-test": 0, prelim: 56, reprelim: 0 },
        5: { "unit-test": 27, "re-unit-test": 0, prelim: 59, reprelim: 0 },
      },
    },
    {
      id: 5,
      rollNo: "105",
      name: "Robert Wilson",
      division: "A",
      status: "pending",
      marks: {
        1: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
        2: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
        3: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
        4: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
        5: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
      },
    },
    {
      id: 6,
      rollNo: "106",
      name: "Sarah Brown",
      division: "B",
      status: "pass",
      marks: {
        1: { "unit-test": 26, "re-unit-test": 0, prelim: 57, reprelim: 0 },
        2: { "unit-test": 25, "re-unit-test": 0, prelim: 56, reprelim: 0 },
        3: { "unit-test": 27, "re-unit-test": 0, prelim: 59, reprelim: 0 },
        4: { "unit-test": 26, "re-unit-test": 0, prelim: 58, reprelim: 0 },
        5: { "unit-test": 28, "re-unit-test": 0, prelim: 61, reprelim: 0 },
      },
    },
    {
      id: 7,
      rollNo: "107",
      name: "David Miller",
      division: "B",
      status: "fail",
      marks: {
        1: { "unit-test": 11, "re-unit-test": 13, prelim: 25, reprelim: 30 },
        2: { "unit-test": 10, "re-unit-test": 14, prelim: 27, reprelim: 32 },
        3: { "unit-test": 12, "re-unit-test": 15, prelim: 26, reprelim: 31 },
        4: { "unit-test": 11, "re-unit-test": 14, prelim: 25, reprelim: 30 },
        5: { "unit-test": 10, "re-unit-test": 13, prelim: 24, reprelim: 29 },
      },
    },
    {
      id: 8,
      rollNo: "108",
      name: "Jessica Taylor",
      division: "B",
      status: "pass",
      marks: {
        1: { "unit-test": 24, "re-unit-test": 0, prelim: 54, reprelim: 0 },
        2: { "unit-test": 23, "re-unit-test": 0, prelim: 53, reprelim: 0 },
        3: { "unit-test": 25, "re-unit-test": 0, prelim: 56, reprelim: 0 },
        4: { "unit-test": 24, "re-unit-test": 0, prelim: 55, reprelim: 0 },
        5: { "unit-test": 26, "re-unit-test": 0, prelim: 58, reprelim: 0 },
      },
    },
    {
      id: 9,
      rollNo: "109",
      name: "James Anderson",
      division: "B",
      status: "pending",
      marks: {
        1: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
        2: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
        3: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
        4: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
        5: { "unit-test": 0, "re-unit-test": 0, prelim: 0, reprelim: 0 },
      },
    },
    {
      id: 10,
      rollNo: "110",
      name: "Jennifer Thomas",
      division: "B",
      status: "pass",
      marks: {
        1: { "unit-test": 27, "re-unit-test": 0, prelim: 60, reprelim: 0 },
        2: { "unit-test": 26, "re-unit-test": 0, prelim: 59, reprelim: 0 },
        3: { "unit-test": 28, "re-unit-test": 0, prelim: 62, reprelim: 0 },
        4: { "unit-test": 27, "re-unit-test": 0, prelim: 61, reprelim: 0 },
        5: { "unit-test": 29, "re-unit-test": 0, prelim: 64, reprelim: 0 },
      },
    },
  ]);

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Computer Engineering",
      fullMarks: { "unit-test": 30, prelim: 70 },
    },
    {
      id: 2,
      name: "Data Structures",
      fullMarks: { "unit-test": 30, prelim: 70 },
    },
    {
      id: 3,
      name: "Database Management",
      fullMarks: { "unit-test": 30, prelim: 70 },
    },
    {
      id: 4,
      name: "Software Engineering",
      fullMarks: { "unit-test": 30, prelim: 70 },
    },
    {
      id: 5,
      name: "Computer Networks",
      fullMarks: { "unit-test": 30, prelim: 70 },
    },
  ]);

  const [subjectsList, setSubjectsList] = useState([
    {
      id: 1,
      name: "Computer Engineering",
      year: "Third Year",
      semester: "Sixth",
      divisions: ["A", "B"],
      totalStudents: 60,
      status: "Pending",
      marksEntered: {
        "unit-test": false,
        "re-unit-test": false,
        prelim: false,
        reprelim: false,
      },
    },
  ]);

  const [filteredStudents, setFilteredStudents] = useState([...students]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("class-teacher");
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    updateSummary();
    filterStudents();
  }, [
    students,
    divisonFilter,
    examFilter,
    subjectFilter,
    statusFilter,
    searchQuery,
  ]);

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
    let filtered = students.filter((student) => {
      const matchesDivision =
        divisonFilter === "all" || student.division === divisonFilter;
      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.includes(searchQuery);

      if (examFilter !== "all" && subjectFilter !== "all") {
        const subjectMarks = student.marks[subjectFilter][examFilter];
        return (
          matchesDivision &&
          matchesStatus &&
          matchesSearch &&
          subjectMarks &&
          subjectMarks > 0
        );
      } else if (examFilter !== "all") {
        return (
          matchesDivision &&
          matchesStatus &&
          matchesSearch &&
          Object.values(student.marks).some(
            (marks) => marks[examFilter] && marks[examFilter] > 0
          )
        );
      } else if (subjectFilter !== "all") {
        return (
          matchesDivision &&
          matchesStatus &&
          matchesSearch &&
          student.marks[subjectFilter]
        );
      }

      return matchesDivision && matchesStatus && matchesSearch;
    });

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
        const subject = subjects.find((s) => s.id == subjectId);
        totalMarks += subjectMarks;
        totalFullMarks += subject.fullMarks[examType];
        subjectsWithMarks++;
      }
    }

    if (subjectsWithMarks === 0) return "N/A";

    const percentage = Math.round((totalMarks / totalFullMarks) * 100);
    return percentage;
  };

  const openStudentModal = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setModalContent({
      student,
      type: "student-details",
    });
  };

  const openExamModal = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setModalContent({
      type: "exam-selection",
      subjectId,
    });
  };

  const openStudentsModal = (subjectId, examType) => {
    setSelectedSubjectId(subjectId);
    setSelectedExamType(examType);
    setModalContent({
      type: "students-list",
      subjectId,
      examType,
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

  const handleSaveMarks = () => {
    const subjectData = studentsData[selectedSubjectId];
    if (!subjectData) return;

    const examData = subjectData.examData[selectedExamType];
    const students = subjectData.students;
    const isUnitTest =
      selectedExamType === "unit-test" || selectedExamType === "re-unit-test";
    const passingMark = isUnitTest ? 12 : 28;

    const rows = document.querySelectorAll(".student-row");

    rows.forEach((row, index) => {
      const q1q2Input = row.querySelector(".q1q2-input");
      const q3q4Input = row.querySelector(".q3q4-input");
      const q5q6Input = row.querySelector(".q5q6-input");
      const q7q8Input = row.querySelector(".q7q8-input");

      const q1q2 = parseInt(q1q2Input?.value) || 0;
      const q3q4 = parseInt(q3q4Input?.value) || 0;
      const q5q6 = parseInt(q5q6Input?.value) || 0;
      const q7q8 = parseInt(q7q8Input?.value) || 0;

      const total = q1q2 + q3q4 + (isUnitTest ? 0 : q5q6 + q7q8);

      let status = "";
      if (total > 0) {
        status = total >= passingMark ? "Pass" : "Fail";
      }

      if (!examData[index]) {
        examData[index] = {};
      }

      examData[index].q1q2 = q1q2;
      examData[index].q3q4 = q3q4;

      if (!isUnitTest) {
        examData[index].q5q6 = q5q6;
        examData[index].q7q8 = q7q8;
      }

      examData[index].total = total;
      examData[index].status = status;
    });

    const allMarksEntered = examData.every((data, index) =>
      index < students.length ? data.total > 0 : true
    );
    const subject = subjectsList.find((s) => s.id == selectedSubjectId);

    subject.marksEntered[selectedExamType] = allMarksEntered;

    closeModal();
    alert("Marks saved successfully!");
  };

  const renderStudents = () => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedStudents = filteredStudents.slice(start, end);

    return paginatedStudents.map((student) => (
      <tr key={student.id} className="border-b hover:bg-gray-100">
        <td className="p-2">{student.rollNo}</td>
        <td className="p-2">{student.name}</td>
        <td className="p-2">{student.division}</td>
        {subjects.map((subject) => (
          <td key={subject.id} className="p-2">
            {student.marks[subject.id]["unit-test"] || 0}
          </td>
        ))}
        <td className="p-2">{calculateOverallScore(student, "unit-test")}%</td>
        <td className={`p-2 ${student.status}`}>
          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
        </td>
        <td className="p-2">
          <button
            onClick={() => openStudentModal(student.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            View
          </button>
        </td>
      </tr>
    ));
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

    return Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`mx-1 px-3 py-2 rounded ${
          currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {i + 1}
      </button>
    ));
  };

  const renderSubjects = () => {
    return subjectsList.map((subject) => {
      const hasAnyMarksEntered = Object.values(subject.marksEntered).some(
        (value) => value
      );

      let buttonsHtml = (
        <button
          onClick={() => openExamModal(subject.id)}
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
              onClick={() => generatePDF(subject.id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
            >
              Generate PDF
            </button>
          </>
        );
      }

      return (
        <div key={subject.id} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">{subject.name}</h3>
          <p>Year: {subject.year}</p>
          <p>Semester: {subject.semester}</p>
          <p>Divisions: {subject.divisions.join(", ")}</p>
          <p>Total Students: {subject.totalStudents}</p>
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
    const hasAnyMarksEntered = Object.values(subject.marksEntered).some(
      (value) => value
    );
    const allMarksEntered = Object.values(subject.marksEntered).every(
      (value) => value
    );

    if (allMarksEntered) return "Complete";
    if (hasAnyMarksEntered) return "In Progress";
    return "Pending";
  };

  const updateSubjectSummary = () => {
    let totalStudents = 0;
    let totalPassed = 0;
    let totalMarks = 0;
    let totalWithMarks = 0;
    let highestMark = 0;

    subjectsList.forEach((subject) => {
      totalStudents += subject.totalStudents;

      const subjectData = studentsData[subject.id];
      if (subjectData) {
        for (const examType in subjectData.examData) {
          if (subject.marksEntered[examType]) {
            const examData = subjectData.examData[examType];
            const studentCount = subjectData.students.length;

            for (let i = 0; i < studentCount; i++) {
              const studentExamData = examData[i];
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
            }
          }
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
      highestScore,
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
    const subject = subjectsList.find((s) => s.id == selectedSubjectId);
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
                  <span className="block mt-1">{student.division}</span>
                </div>
                <div>
                  <label className="block font-medium text-gray-600">
                    Status
                  </label>
                  <span className={`block mt-1 ${student.status}`}>
                    {student.status.charAt(0).toUpperCase() +
                      student.status.slice(1)}
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
                  <div key={subject.id} className="bg-white p-4 rounded shadow">
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
                            <td>{student.marks[subject.id][examType] || 0}</td>
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
        const { subjectId, examType } = modalContent;
        const subjectData = studentsData[subjectId];
        const isUnitTest =
          examType === "unit-test" || examType === "re-unit-test";

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
              <div className="mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800">
                  {subjectsList.find((s) => s.id == subjectId).name} -{" "}
                  {examTypeToText(examType)}
                </h3>
              </div>
              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-left">Roll No.</th>
                    <th className="text-left">Name</th>
                    {isUnitTest ? (
                      <>
                        <th className="text-left">Q1/Q2 (15)</th>
                        <th className="text-left">Q3/Q4 (15)</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left">Q1/Q2 (17)</th>
                        <th className="text-left">Q3/Q4 (18)</th>
                        <th className="text-left">Q5/Q6 (17)</th>
                        <th className="text-left">Q7/Q8 (18)</th>
                      </>
                    )}
                    <th className="text-left">Total</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectData.students.map((student, index) => {
                    const studentExamData = subjectData.examData[examType][
                      index
                    ] || {
                      q1q2: 0,
                      q3q4: 0,
                      q5q6: 0,
                      q7q8: 0,
                      total: 0,
                      status: "",
                    };

                    return (
                      <tr key={student.rollNo} className="student-row border-b">
                        <td className="p-2">{student.rollNo}</td>
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max={isUnitTest ? "15" : "17"}
                            value={studentExamData.q1q2}
                            className="q1q2-input w-16 p-1 border rounded"
                            data-index={index}
                            onChange={() => updateStudentRow(index)}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max={isUnitTest ? "15" : "18"}
                            value={studentExamData.q3q4}
                            className="q3q4-input w-16 p-1 border rounded"
                            data-index={index}
                            onChange={() => updateStudentRow(index)}
                          />
                        </td>
                        {!isUnitTest && (
                          <>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                max="17"
                                value={studentExamData.q5q6}
                                className="q5q6-input w-16 p-1 border rounded"
                                data-index={index}
                                onChange={() => updateStudentRow(index)}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                max="18"
                                value={studentExamData.q7q8}
                                className="q7q8-input w-16 p-1 border rounded"
                                data-index={index}
                                onChange={() => updateStudentRow(index)}
                              />
                            </td>
                          </>
                        )}
                        <td className="p-2 total-cell">
                          {studentExamData.total}
                        </td>
                        <td
                          className={`p-2 status-cell ${studentExamData.status.toLowerCase()}`}
                        >
                          {studentExamData.status}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-end gap-2">
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
                  Save Marks
                </button>
              </div>
            </div>
          </div>
        );
      case "pdf-exam-selection":
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
                  Select Exam Type for PDF
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
                  onClick={handleSavePDF}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Generate PDF
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
    const row = document.querySelector(`.student-row:nth-child(${index + 1})`);
    const isUnitTest =
      selectedExamType === "unit-test" || selectedExamType === "re-unit-test";

    const q1q2Input = row.querySelector(".q1q2-input");
    const q3q4Input = row.querySelector(".q3q4-input");
    const q5q6Input = row.querySelector(".q5q6-input");
    const q7q8Input = row.querySelector(".q7q8-input");

    const q1q2 = parseInt(q1q2Input?.value) || 0;
    const q3q4 = parseInt(q3q4Input?.value) || 0;
    const q5q6 = parseInt(q5q6Input?.value) || 0;
    const q7q8 = parseInt(q7q8Input?.value) || 0;

    const total = q1q2 + q3q4 + (isUnitTest ? 0 : q5q6 + q7q8);

    const totalCell = row.querySelector(".total-cell");
    totalCell.textContent = total;

    const statusCell = row.querySelector(".status-cell");
    const passingMark = isUnitTest ? 12 : 28;
    let status = "";

    if (total > 0) {
      status = total >= passingMark ? "Pass" : "Fail";
    }

    statusCell.textContent = status;
    statusCell.className = "status-cell " + status.toLowerCase();
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
        >
          Subject Teacher
        </button>
      </div>

      {activeTab === "class-teacher" && (
        <div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-600">Division</label>
              <select
                value={divisonFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Divisions</option>
                <option value="A">Division A</option>
                <option value="B">Division B</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-600">Exam Type</label>
              <select
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Exams</option>
                <option value="unit-test">Unit Test</option>
                <option value="re-unit-test">Re-Unit Test</option>
                <option value="prelim">Prelim</option>
                <option value="reprelim">Re-Prelim</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-600">Subject</label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Subjects</option>
                <option value="1">Computer Engineering</option>
                <option value="2">Data Structures</option>
                <option value="3">Database Management</option>
                <option value="4">Software Engineering</option>
                <option value="5">Computer Networks</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-600">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Status</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="pending">Pending</option>
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
                      <th key={subject.id} className="p-2 text-left">
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
            <div className="flex justify-center gap-2 mt-4">
              {renderPagination()}
            </div>
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
