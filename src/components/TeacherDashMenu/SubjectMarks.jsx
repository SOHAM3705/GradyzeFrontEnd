import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [selectedExamType, setSelectedExamType] = useState("unit-test");
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");
  const [marksData, setMarksData] = useState({});
  const [marksEnteredState, setMarksEnteredState] = useState({});
  const [existingMarks, setExistingMarks] = useState({});
  const [isMarksExist, setIsMarksExist] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [selectedDeleteExamType, setSelectedDeleteExamType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalStudents: 0,
  });
  const [subjectSummaryData, setSubjectSummaryData] = useState({
    totalStudents: 0,
  });
  const [studentsData, setStudentsData] = useState({});
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const teacherId = sessionStorage.getItem("teacherId");

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

  const getRetestStatus = (student, examType) => {
    const previousExamType =
      examType === "re-unit-test" ? "unit-test" : "prelim";
    const failedSubjects = [];

    for (const subjectName in student.marks) {
      const subjectMarks = student.marks[subjectName];
      if (
        subjectMarks[previousExamType] &&
        (subjectMarks[previousExamType].status === "Fail" ||
          subjectMarks[previousExamType].status === "Absent")
      ) {
        failedSubjects.push(subjectName);
      }
    }

    return failedSubjects.length > 0
      ? `Retest for: ${failedSubjects.join(", ")}`
      : "No retest needed";
  };

  const handleExamTypeChange = (e) => {
    const newExamType = e.target.value;

    // If there are unsaved changes, show confirmation
    if (selectedExamType && modalContent?.isUpdateMode) {
      setConfirmAction({
        title: "Unsaved Changes",
        message: "Changing exam type will lose your unsaved changes. Continue?",
        onConfirm: () => {
          handleExamTypeSelection(newExamType);
        },
      });
      return;
    }

    // Special handling for retest exams
    if (
      (newExamType === "re-unit-test" || newExamType === "reprelim") &&
      selectedExamType !== "re-unit-test" &&
      selectedExamType !== "reprelim"
    ) {
      setConfirmAction({
        title: "View Retest Students",
        message: `This will only show students who failed or were absent in the ${
          newExamType === "re-unit-test" ? "Unit Test" : "Prelim"
        }. Continue?`,
        onConfirm: () => {
          handleExamTypeSelection(newExamType);
        },
      });
      return;
    }

    // Regular exam type change
    handleExamTypeSelection(newExamType);
  };

  // Helper function to handle the actual exam type selection
  const handleExamTypeSelection = (examType) => {
    setSelectedExamType(examType);

    // Only open modal if we have a subject selected
    if (selectedSubjectId) {
      openStudentsModal(selectedSubjectId, examType);
    }

    // Clear any existing confirmations
    setConfirmAction(null);
  };

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
    setSummaryData({
      totalStudents,
    });
  };

  const handleClassExport = async (exportType) => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/export-class-marks`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            year,
            division,
            exportType,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Class_${year}_${division}_Marks.${exportType}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error exporting class marks:", error);
      toast.error("Failed to export marks. Please try again.");
    }
  };

  const renderStudents = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={subjects.length + 3} className="text-center py-4">
            <ClipLoader size={30} color="#3B82F6" />
          </td>
        </tr>
      );
    }

    if (filteredStudents.length === 0) {
      return (
        <tr>
          <td colSpan={subjects.length + 3} className="text-center py-4">
            No students found
          </td>
        </tr>
      );
    }

    return filteredStudents.map((student) => {
      let totalMarks = 0;
      let hasMarks = false;

      // First create subject cells
      const subjectCells = subjects.map((subject) => {
        const subjectMarks = student.marks?.[subject.name] || {};
        const marksToShow = selectedExamType
          ? subjectMarks[selectedExamType]
          : Object.values(subjectMarks)[0];

        const marksValue = marksToShow?.marksObtained?.total ?? "-";
        const status = marksToShow?.status || "-";

        if (typeof marksValue === "number" && marksValue >= 0) {
          totalMarks += marksValue;
          hasMarks = true;
        }

        return (
          <td key={subject._id} className="p-2 text-center border">
            <div
              className={`
                ${status === "Pass" ? "text-green-600" : ""}
                ${status === "Fail" ? "text-red-600" : ""}
                ${status === "Absent" ? "text-gray-500" : ""}
              `}
            >
              {marksValue === -1 ? "Absent" : marksValue}
            </div>
          </td>
        );
      });

      // Then add retest status column if needed
      if (
        selectedExamType === "re-unit-test" ||
        selectedExamType === "reprelim"
      ) {
        subjectCells.push(
          <td key="retest-status" className="p-2 text-left border text-xs">
            {getRetestStatus(student, selectedExamType)}
          </td>
        );
      }

      return (
        <tr key={student._id} className="border-b hover:bg-gray-100">
          <td className="p-2 border">{student.rollNo}</td>
          <td className="p-2 border">{student.name}</td>
          {subjectCells}
          <td className="p-2 border font-semibold text-center bg-gray-50">
            {hasMarks ? totalMarks : "-"}
          </td>
        </tr>
      );
    });
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
        <>
          <button
            onClick={() => openExamModal(subjectId)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Marks
          </button>
          <button
            onClick={() => openExportModal(subjectId)}
            className="bg-green-500 text-white px-4 py-2 rounded ml-2"
          >
            Export
          </button>
          <button
            onClick={() => setDeleteSubjectId(subject._id)}
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
          >
            Delete Marks
          </button>
        </>
      );

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

    subjectsList.forEach((subject) => {
      const subjectData = studentsData[subject._id];
      if (!subjectData) return;

      totalStudents += subjectData.students.length;
    });

    setSubjectSummaryData({
      totalStudents,
    });
  };

  const openExamModal = async (subjectId) => {
    const subject = subjectsList.find((sub) => sub._id === subjectId);
    if (!subject) {
      toast.error("Subject not found");
      return;
    }

    setSelectedSubjectId(subjectId);

    setModalContent({
      type: "exam-selection",
      subjectId,
      subjectName: subject.name, // Pass subjectName to modal
    });
  };

  const openStudentsModal = async (subjectId, examType) => {
    try {
      setIsLoading(true);
      setModalContent({
        type: "loading",
        message: "Fetching student marks...",
      });

      const subject = subjectsList.find((sub) => sub._id === subjectId);
      if (!subject) throw new Error("Subject not found");

      const token = sessionStorage.getItem("token");

      // For retest exams, we need to check the previous exam marks
      const previousExamType =
        examType === "re-unit-test"
          ? "unit-test"
          : examType === "reprelim"
          ? "prelim"
          : examType;

      // Get marks for the previous exam type to determine who needs retest
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/marks-by-subject`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            subjectName: subject.name,
            examType: previousExamType, // Query previous exam marks
          },
        }
      );

      const existingMarks = response.data || {};
      const allStudents = studentsData[subjectId]?.students || [];

      console.log("Previous exam marks data:", existingMarks);

      let studentsToShow = allStudents;
      if (examType === "re-unit-test" || examType === "reprelim") {
        studentsToShow = allStudents.filter((student) => {
          const studentMarks = existingMarks[student._id]?.[previousExamType];
          return (
            studentMarks &&
            (studentMarks.status === "Fail" || studentMarks.status === "Absent")
          );
        });

        console.log("Students needing retest:", studentsToShow);

        if (studentsToShow.length === 0) {
          toast.info(`No students need retest for ${subject.name} ${examType}`);
          setIsLoading(false);
          setModalContent(null); // Close modal when no students need retest
          return;
        }
      }

      // Now get current exam marks if they exist
      const currentResponse = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/marks-by-subject`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            subjectName: subject.name,
            examType: examType,
          },
        }
      );

      setIsLoading(false);
      setModalContent({
        type: "students-list",
        subjectId,
        subjectName: subject.name,
        examType,
        isUpdateMode: Object.keys(currentResponse.data).length > 0,
        existingMarks: currentResponse.data,
        previousExamMarks: existingMarks, // Store previous exam marks for reference
        lastUpdated: currentResponse.data.lastUpdated,
        studentsToShow,
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error loading marks:", error);
      toast.error("Failed to load marks. Please try again.");
      setModalContent(null);
    }
  };

  const handleExport = async (exportType, subjectId, examType) => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const subject = subjectsList.find((sub) => sub._id === subjectId);

      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/export-marks`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            subjectName: subject.name,
            examType,
            exportType, // 'pdf' or 'excel'
          },
          responseType: "blob", // Important for file downloads
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${subject.name}_${examType}_marks.${exportType}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error exporting marks:", error);
      toast.error("Failed to export marks. Please try again.");
    }
  };

  const openExportModal = (subjectId) => {
    setModalContent({
      type: "export-selection",
      subjectId,
      subjectName: subjectsList.find((sub) => sub._id === subjectId)?.name,
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

  const validateMarks = () => {
    const rows = document.querySelectorAll(".student-row");
    let isValid = true;

    rows.forEach((row) => {
      const isAbsent = row.querySelector(".absent-checkbox").checked;

      // Skip validation for absent students
      if (isAbsent) return;

      const inputs = row.querySelectorAll('input[type="number"]');
      inputs.forEach((input) => {
        if (!input.value && input.value !== "0") {
          input.style.borderColor = "red";
          isValid = false;
        } else {
          input.style.borderColor = "";
        }
      });
    });

    if (!isValid) {
      toast.warning("Please fill all mark fields or mark as absent");
      return false;
    }
    return true;
  };

  const handleSaveMarks = async () => {
    if (!validateMarks()) return;

    const subject = subjectsList.find((sub) => sub._id === selectedSubjectId);
    if (!subject) {
      toast.error("Subject not found");
      return;
    }

    const isUnitTest = selectedExamType.includes("unit");
    const passingMarks = isUnitTest ? 12 : 28;
    const marksToSave = [];
    const rows = document.querySelectorAll(".student-row");

    rows.forEach((row) => {
      const isAbsent = row.querySelector(".absent-checkbox").checked;
      const studentId = row.getAttribute("data-id");

      if (isAbsent) {
        marksToSave.push({
          studentId,
          examType: selectedExamType,
          year: subject.year,
          exams: [
            {
              subjectName: subject.name,
              teacherId,
              marksObtained: {
                q1q2: -1,
                q3q4: -1,
                q5q6: -1,
                q7q8: -1,
                total: -1,
              },
              totalMarks: 0,
              status: "Absent",
              dateAdded: new Date(),
            },
          ],
        });
      } else {
        const q1q2 = parseInt(row.querySelector(".q1q2-input").value) || 0;
        const q3q4 = parseInt(row.querySelector(".q3q4-input").value) || 0;
        const q5q6 = isUnitTest
          ? 0
          : parseInt(row.querySelector(".q5q6-input")?.value) || 0;
        const q7q8 = isUnitTest
          ? 0
          : parseInt(row.querySelector(".q7q8-input")?.value) || 0;
        const total = q1q2 + q3q4 + q5q6 + q7q8;

        let status = total >= passingMarks ? "Pass" : "Fail";

        // Special handling for retests
        if (
          selectedExamType === "re-unit-test" ||
          selectedExamType === "reprelim"
        ) {
          const previousExamType =
            selectedExamType === "re-unit-test" ? "unit-test" : "prelim";
          const previousMarks =
            modalContent.existingMarks[studentId]?.[previousExamType];

          if (previousMarks?.status === "Fail" && status === "Pass") {
            status = "Improved";
          }
        }

        marksToSave.push({
          studentId,
          examType: selectedExamType,
          year: subject.year,
          exams: [
            {
              subjectName: subject.name,
              teacherId,
              marksObtained: { q1q2, q3q4, q5q6, q7q8, total },
              totalMarks: isUnitTest ? 30 : 70,
              status,
              dateAdded: new Date(),
            },
          ],
        });
      }
    });

    try {
      setIsSaving(true);
      const token = sessionStorage.getItem("token");
      await axios.post(
        `https://gradyzebackend.onrender.com/api/teachermarks/add-marks`,
        marksToSave,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Marks saved successfully!");
      closeModal();
      fetchSubjectStudentsData();
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error(error.response?.data?.message || "Failed to save marks");
    } finally {
      setIsSaving(false);
    }
  };

  const needsRetest = (studentId, subjectName, examType) => {
    if (examType !== "re-unit-test" && examType !== "reprelim") return false;

    const previousExamType =
      examType === "re-unit-test" ? "unit-test" : "prelim";
    const studentMarks =
      modalContent?.existingMarks[studentId]?.[previousExamType];

    return (
      studentMarks &&
      studentMarks.subjectName === subjectName &&
      (studentMarks.status === "Fail" || studentMarks.status === "Absent")
    );
  };

  const getRetestInfo = (studentId, subjectName, examType) => {
    if (examType !== "re-unit-test" && examType !== "reprelim") return null;

    const previousExamType =
      examType === "re-unit-test" ? "unit-test" : "prelim";
    const previousMarks =
      modalContent?.existingMarks[studentId]?.[previousExamType];

    if (!previousMarks) return null;

    return (
      <div className="text-xs text-gray-600 mt-1">
        Previous {previousExamType}: {previousMarks.marksObtained?.total || 0}/
        {previousMarks.totalMarks} ({previousMarks.status})
      </div>
    );
  };

  const handleDeleteMarks = async () => {
    if (!deleteSubjectId || !selectedDeleteExamType) return;

    try {
      const token = sessionStorage.getItem("token");
      const teacherId = sessionStorage.getItem("teacherId");
      const subjectName = subjectsList.find(
        (sub) => sub._id === deleteSubjectId
      )?.name;

      await axios.delete(
        `https://gradyzebackend.onrender.com/api/teachermarks/delete-marks`,
        {
          data: {
            subjectName,
            teacherId,
            examType: selectedDeleteExamType,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Marks deleted successfully!");
      setDeleteSubjectId(null);
      setSelectedDeleteExamType("");
      fetchSubjectStudentsData();
    } catch (error) {
      console.error("Error deleting marks:", error);
      alert(
        "Error deleting marks: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");

      // 1. Get class students and teacher's assigned division
      const [studentsResponse, divisionResponse] = await Promise.all([
        axios.get(
          `https://gradyzebackend.onrender.com/api/teachermarks/${teacherId}/class-students`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `https://gradyzebackend.onrender.com/api/teachermarks/${teacherId}/divisions`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      const assignedYear = divisionResponse.data.year;
      const assignedDivision = divisionResponse.data.division;

      // 2. Get all marks for this class (from any teacher)
      const marksResponse = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/class-marks`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            teacherId: sessionStorage.getItem("teacherId"),
            year: assignedYear,
            division: assignedDivision,
          },
        }
      );

      // 3. Process marks data to match student/subject structure
      const processedMarks = {};

      // First, create a map of all unique subjects
      const subjectsMap = {};

      marksResponse.data.forEach((mark) => {
        mark.exams.forEach((exam) => {
          if (!subjectsMap[exam.subjectName]) {
            subjectsMap[exam.subjectName] = {
              name: exam.subjectName,
              _id: exam.subjectName, // Using name as ID if real ID not available
            };
          }
        });
      });

      // Then process student marks
      marksResponse.data.forEach((mark) => {
        if (!processedMarks[mark.studentId._id]) {
          processedMarks[mark.studentId._id] = {};
        }

        mark.exams.forEach((exam) => {
          if (!processedMarks[mark.studentId._id][exam.subjectName]) {
            processedMarks[mark.studentId._id][exam.subjectName] = {};
          }

          processedMarks[mark.studentId._id][exam.subjectName][mark.examType] =
            {
              marksObtained: exam.marksObtained,
              status: exam.status,
            };
        });
      });

      // 4. Get unique subjects as an array
      const relevantSubjects = Object.values(subjectsMap);

      // 5. Combine student data with marks
      const studentsWithMarks = studentsResponse.data.students.map(
        (student) => ({
          ...student,
          marks: processedMarks[student._id] || {},
        })
      );

      setStudents(studentsWithMarks);
      setSubjects(relevantSubjects);
      setYear(assignedYear);
      setDivision(assignedDivision);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch student data");
    } finally {
      setIsLoading(false);
    }
  };

  const getStudentsForRetest = (students, examType, subjectName = null) => {
    const previousExamType =
      examType === "re-unit-test" ? "unit-test" : "prelim";

    return students.filter((student) => {
      // For subject teacher view (filter by specific subject)
      if (subjectName) {
        const subjectMarks = student.marks?.[subjectName] || {};
        const previousMarks = subjectMarks[previousExamType];

        console.log(`Checking ${student.name} for ${subjectName}:`, {
          hasMarks: !!previousMarks,
          status: previousMarks?.status,
          marks: previousMarks?.marksObtained?.total,
        });

        return (
          previousMarks &&
          (previousMarks.status === "Fail" || previousMarks.status === "Absent")
        );
      }

      // For class teacher view (check all subjects)
      for (const subName in student.marks) {
        const subjectMarks = student.marks[subName];
        const previousMarks = subjectMarks[previousExamType];
        if (
          previousMarks &&
          (previousMarks.status === "Fail" || previousMarks.status === "Absent")
        ) {
          return true;
        }
      }
      return false;
    });
  };

  // Updated filterStudents function
  const filterStudents = () => {
    let filtered = students;

    if (
      selectedExamType === "re-unit-test" ||
      selectedExamType === "reprelim"
    ) {
      // For subject teacher view
      if (activeTab === "subject-teacher" && selectedSubjectId) {
        const subject = subjectsList.find((s) => s._id === selectedSubjectId);
        if (subject) {
          filtered = getStudentsForRetest(
            students,
            selectedExamType,
            subject.name
          );
        }
      }
      // For class teacher view
      else {
        filtered = getStudentsForRetest(students, selectedExamType);
      }

      console.log(`Filtered students for ${selectedExamType}:`, filtered);
    }

    filtered = filtered
      .filter((student) => {
        const matchesSearch =
          student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNo?.toString().includes(searchQuery);
        return matchesSearch;
      })
      .sort((a, b) => a.rollNo - b.rollNo);

    setFilteredStudents(filtered);
    setCurrentPage(1);
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

  const renderConfirmationDialog = () => {
    if (!confirmAction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
        <div className="bg-white p-4 md:p-6 rounded shadow-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-3 md:mb-4">
            {confirmAction.title}
          </h3>
          <p className="mb-3 md:mb-4 text-sm md:text-base">
            {confirmAction.message}
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmAction(null)}
              className="bg-gray-300 text-gray-700 px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirmAction.onConfirm();
                setConfirmAction(null);
              }}
              className="bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderModalContent = () => {
    if (modalContent?.type === "loading") {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white p-4 md:p-8 rounded shadow-lg flex flex-col items-center w-full max-w-xs md:max-w-sm">
            <ClipLoader size={40} color="#3B82F6" />
            <p className="mt-3 md:mt-4 text-base md:text-lg">
              {modalContent.message}
            </p>
          </div>
        </div>
      );
    }
    if (!modalContent) return null;

    switch (modalContent.type) {
      case "exam-selection":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
            <div className="bg-white p-4 md:p-6 rounded shadow-lg w-full max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl md:text-2xl"
              >
                &times;
              </button>
              <div className="mb-3 md:mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                  Select Exam Type
                </h3>
              </div>
              <div className="mb-3 md:mb-4">
                <label className="block font-medium text-gray-600 text-sm md:text-base">
                  Exam Type
                </label>
                <select
                  value={selectedExamType}
                  onChange={handleExamTypeChange}
                  className="w-full p-2 border rounded mt-1 text-sm md:text-base"
                >
                  <option value="">Select an exam type</option>
                  <option value="unit-test">Unit Test</option>
                  <option value="re-unit-test">Re-Unit Test</option>
                  <option value="prelim">Prelim</option>
                  <option value="reprelim">Re-Prelim</option>
                </select>
                {(selectedExamType === "re-unit-test" ||
                  selectedExamType === "reprelim") && (
                  <div className="mt-2 p-2 bg-blue-50 text-blue-800 text-xs md:text-sm rounded">
                    <p>
                      Only students who failed or were absent in the previous{" "}
                      {selectedExamType === "re-unit-test"
                        ? "Unit Test"
                        : "Prelim"}{" "}
                      will be shown.
                    </p>
                    {selectedSubjectId && (
                      <p className="mt-1 font-medium">
                        Subject:{" "}
                        {
                          subjectsList.find((s) => s._id === selectedSubjectId)
                            ?.name
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-3 py-1 md:px-4 md:py-2 rounded hover:bg-gray-400 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinueExam}
                  className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-blue-600 text-sm md:text-base"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );
      case "export-selection":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
            <div className="bg-white p-4 md:p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-3 md:mb-4">
                Export Marks for {modalContent.subjectName}
              </h3>
              <div className="mb-3 md:mb-4">
                <label className="block mb-1 md:mb-2 text-sm md:text-base">
                  Exam Type:
                </label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="w-full p-2 border rounded text-sm md:text-base"
                >
                  <option value="">Select Exam Type</option>
                  <option value="unit-test">Unit Test</option>
                  <option value="re-unit-test">Re-Unit Test</option>
                  <option value="prelim">Prelim</option>
                  <option value="re-prelim">Re-Prelim</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-4 mt-4 md:mt-6">
                <button
                  onClick={() =>
                    handleExport(
                      "pdf",
                      modalContent.subjectId,
                      selectedExamType
                    )
                  }
                  disabled={!selectedExamType || isLoading}
                  className="bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded disabled:opacity-50 text-sm md:text-base"
                >
                  {isLoading ? "Exporting..." : "Export PDF"}
                </button>
                <button
                  onClick={() =>
                    handleExport(
                      "excel",
                      modalContent.subjectId,
                      selectedExamType
                    )
                  }
                  disabled={!selectedExamType || isLoading}
                  className="bg-green-500 text-white px-3 py-1 md:px-4 md:py-2 rounded disabled:opacity-50 text-sm md:text-base"
                >
                  {isLoading ? "Exporting..." : "Export Excel"}
                </button>
              </div>
              <div className="flex justify-end mt-4 md:mt-6">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      case "students-list":
        const {
          subjectId,
          examType,
          existingMarks,
          isUpdateMode,
          studentsToShow,
        } = modalContent;
        const isUnitTest = examType.includes("unit");
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-2 md:p-4">
            <div className="bg-white p-3 md:p-6 rounded shadow-lg w-full max-w-5xl relative max-h-[90vh] overflow-hidden flex flex-col">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl md:text-2xl font-bold"
              >
                &times;
              </button>
              <div className="mb-3 md:mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                  {examTypeToText(examType)} - Enter Student Marks
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  {isUnitTest ? "Pass mark: 12" : "Pass mark: 28"}
                </p>
              </div>
              <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full mb-3 md:mb-4">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-1 md:p-2 text-left text-xs md:text-sm">
                        Absent
                      </th>
                      <th className="p-1 md:p-2 text-left text-xs md:text-sm">
                        Roll No.
                      </th>
                      <th className="p-1 md:p-2 text-left text-xs md:text-sm">
                        Name
                      </th>
                      {isUnitTest ? (
                        <>
                          <th className="p-1 md:p-2 text-center text-xs md:text-sm">
                            Q1/Q2 (Max 15)
                          </th>
                          <th className="p-1 md:p-2 text-center text-xs md:text-sm">
                            Q3/Q4 (Max 15)
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="p-1 md:p-2 text-center text-xs md:text-sm">
                            Q1/Q2 (Max 17)
                          </th>
                          <th className="p-1 md:p-2 text-center text-xs md:text-sm">
                            Q3/Q4 (Max 18)
                          </th>
                          <th className="p-1 md:p-2 text-center text-xs md:text-sm">
                            Q5/Q6 (Max 17)
                          </th>
                          <th className="p-1 md:p-2 text-center text-xs md:text-sm">
                            Q7/Q8 (Max 18)
                          </th>
                        </>
                      )}
                      <th className="p-1 md:p-2 text-center text-xs md:text-sm">
                        Total
                      </th>
                      <th className="p-1 md:p-2 text-center text-xs md:text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsToShow.map((student) => {
                      const studentMarks =
                        existingMarks[student._id]?.[examType];
                      const isAbsent = studentMarks?.status === "Absent";
                      const marksData = studentMarks?.marksObtained;
                      return (
                        <tr
                          key={student._id}
                          className="student-row border-b hover:bg-gray-50"
                          data-id={student._id}
                        >
                          <td className="p-1 md:p-2 text-center">
                            <input
                              type="checkbox"
                              className="absent-checkbox"
                              defaultChecked={isAbsent}
                              onChange={(e) => {
                                const row = e.target.closest("tr");
                                const inputs = row.querySelectorAll(
                                  'input[type="number"]'
                                );
                                inputs.forEach((input) => {
                                  input.disabled = e.target.checked;
                                  if (e.target.checked) {
                                    input.value = "";
                                  } else {
                                    const marksData =
                                      existingMarks[student._id]?.[examType]
                                        ?.marksObtained;
                                    if (marksData) {
                                      row.querySelector(".q1q2-input").value =
                                        marksData.q1q2 || 0;
                                      row.querySelector(".q3q4-input").value =
                                        marksData.q3q4 || 0;
                                      if (!isUnitTest) {
                                        row.querySelector(".q5q6-input").value =
                                          marksData.q5q6 || 0;
                                        row.querySelector(".q7q8-input").value =
                                          marksData.q7q8 || 0;
                                      }
                                    }
                                  }
                                });
                                updateStudentRow(student._id);
                              }}
                            />
                          </td>
                          <td className="p-1 md:p-2 text-xs md:text-sm">
                            {student.rollNo}
                          </td>
                          <td className="p-1 md:p-2 text-xs md:text-sm">
                            {student.name}
                            {getRetestInfo(
                              student._id,
                              modalContent.subjectName,
                              examType
                            )}
                          </td>
                          <td className="p-1 md:p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={isUnitTest ? 15 : 17}
                              className="q1q2-input w-12 md:w-16 p-1 border rounded text-center text-xs md:text-sm"
                              defaultValue={
                                isAbsent ? "" : marksData?.q1q2 || 0
                              }
                              disabled={isAbsent}
                              onChange={(e) => {
                                if (
                                  parseInt(e.target.value) >
                                  (isUnitTest ? 15 : 17)
                                ) {
                                  e.target.value = isUnitTest ? 15 : 17;
                                }
                                updateStudentRow(student._id);
                              }}
                              onBlur={(e) => {
                                if (
                                  e.target.value === "" ||
                                  parseInt(e.target.value) < 0
                                ) {
                                  e.target.value = "0";
                                }
                                updateStudentRow(student._id);
                              }}
                            />
                          </td>
                          <td className="p-1 md:p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={isUnitTest ? 15 : 18}
                              className="q3q4-input w-12 md:w-16 p-1 border rounded text-center text-xs md:text-sm"
                              defaultValue={
                                isAbsent ? "" : marksData?.q3q4 || 0
                              }
                              disabled={isAbsent}
                              onChange={(e) => {
                                if (
                                  parseInt(e.target.value) >
                                  (isUnitTest ? 15 : 18)
                                ) {
                                  e.target.value = isUnitTest ? 15 : 18;
                                }
                                updateStudentRow(student._id);
                              }}
                              onBlur={(e) => {
                                if (
                                  e.target.value === "" ||
                                  parseInt(e.target.value) < 0
                                ) {
                                  e.target.value = "0";
                                }
                                updateStudentRow(student._id);
                              }}
                            />
                          </td>
                          {!isUnitTest && (
                            <>
                              <td className="p-1 md:p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={17}
                                  className="q5q6-input w-12 md:w-16 p-1 border rounded text-center text-xs md:text-sm"
                                  defaultValue={
                                    isAbsent ? "" : marksData?.q5q6 || 0
                                  }
                                  disabled={isAbsent}
                                  onChange={(e) => {
                                    if (parseInt(e.target.value) > 17) {
                                      e.target.value = 17;
                                    }
                                    updateStudentRow(student._id);
                                  }}
                                  onBlur={(e) => {
                                    if (
                                      e.target.value === "" ||
                                      parseInt(e.target.value) < 0
                                    ) {
                                      e.target.value = "0";
                                    }
                                    updateStudentRow(student._id);
                                  }}
                                />
                              </td>
                              <td className="p-1 md:p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={18}
                                  className="q7q8-input w-12 md:w-16 p-1 border rounded text-center text-xs md:text-sm"
                                  defaultValue={
                                    isAbsent ? "" : marksData?.q7q8 || 0
                                  }
                                  disabled={isAbsent}
                                  onChange={(e) => {
                                    if (parseInt(e.target.value) > 18) {
                                      e.target.value = 18;
                                    }
                                    updateStudentRow(student._id);
                                  }}
                                  onBlur={(e) => {
                                    if (
                                      e.target.value === "" ||
                                      parseInt(e.target.value) < 0
                                    ) {
                                      e.target.value = "0";
                                    }
                                    updateStudentRow(student._id);
                                  }}
                                />
                              </td>
                            </>
                          )}
                          <td className="p-1 md:p-2 total-cell text-center font-medium text-xs md:text-sm">
                            {isAbsent ? "Absent" : marksData?.total || 0}
                          </td>
                          <td
                            className={`p-1 md:p-2 status-cell text-center text-xs md:text-sm ${
                              studentMarks?.status === "Pass"
                                ? "text-green-600"
                                : studentMarks?.status === "Fail"
                                ? "text-red-600"
                                : ""
                            }`}
                          >
                            {studentMarks?.status || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 mt-3 md:mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-3 py-1 md:px-4 md:py-2 rounded hover:bg-gray-400 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMarks}
                  disabled={isSaving}
                  className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-blue-600 disabled:opacity-50 text-sm md:text-base"
                >
                  {isSaving ? (
                    <>
                      <ClipLoader
                        size={16}
                        color="#ffffff"
                        className="inline mr-1 md:mr-2"
                      />
                      Saving...
                    </>
                  ) : (
                    `${isUpdateMode ? "Update" : "Save"} Marks`
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      case "delete-confirmation":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
            <div className="bg-white p-4 md:p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-3 md:mb-4">
                Delete Marks
              </h3>
              <div className="mb-3 md:mb-4">
                <label className="block mb-1 md:mb-2 text-sm md:text-base">
                  Select Exam Type to Delete:
                </label>
                <select
                  value={selectedDeleteExamType}
                  onChange={(e) => setSelectedDeleteExamType(e.target.value)}
                  className="w-full p-2 border rounded text-sm md:text-base"
                >
                  <option value="">Select Exam Type</option>
                  <option value="unit-test">Unit Test</option>
                  <option value="re-unit-test">Re-Unit Test</option>
                  <option value="prelim">Prelim</option>
                  <option value="reprelim">Re-Prelim</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setDeleteSubjectId(null);
                    setSelectedDeleteExamType("");
                  }}
                  className="bg-gray-300 text-gray-700 px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMarks}
                  disabled={!selectedDeleteExamType}
                  className="bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded disabled:opacity-50 text-sm md:text-base"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-3 md:p-4">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("class-teacher")}
            className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
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
            className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
              activeTab === "subject-teacher"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            disabled={isClassTeacher && !isSubjectTeacher}
          >
            Subject Teacher
          </button>
        </div>
      </div>
      {activeTab === "class-teacher" && (
        <div>
          <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-1 md:gap-2">
              <label className="font-medium text-gray-600 text-sm md:text-base">
                Division
              </label>
              <span className="p-1 md:p-2 border rounded text-sm md:text-base">
                {division}
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <label className="font-medium text-gray-600 text-sm md:text-base">
                Exam Type
              </label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="p-1 md:p-2 border rounded text-sm md:text-base"
              >
                <option value="unit-test">Unit Test</option>
                <option value="re-unit-test">Re-Unit Test</option>
                <option value="prelim">Prelim</option>
                <option value="reprelim">Re-Prelim</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="bg-white p-3 md:p-4 rounded shadow">
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
                Total Students
              </h3>
              <p className="text-xl md:text-2xl font-bold">
                {summaryData.totalStudents}
              </p>
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded shadow mb-3 md:mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-2">
              <h2 className="text-lg md:text-xl font-semibold">
                Student Performance
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <div className="flex gap-1 md:gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleClassExport("pdf")}
                    disabled={isLoading}
                    className="bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 rounded disabled:opacity-50 text-xs md:text-sm"
                  >
                    {isLoading ? "Exporting..." : "Export PDF"}
                  </button>
                  <button
                    onClick={() => handleClassExport("excel")}
                    disabled={isLoading}
                    className="bg-green-500 text-white px-2 py-1 md:px-4 md:py-2 rounded disabled:opacity-50 text-xs md:text-sm"
                  >
                    {isLoading ? "Exporting..." : "Export Excel"}
                  </button>
                </div>
                <div className="flex gap-1 md:gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-1 md:p-2 border rounded flex-1 text-sm md:text-base"
                  />
                  <button
                    onClick={filterStudents}
                    className="bg-blue-500 text-white px-2 py-1 md:px-4 md:py-2 rounded hover:bg-blue-600 text-xs md:text-sm"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-1 md:p-2 text-left border text-xs md:text-sm">
                      Roll No.
                    </th>
                    <th className="p-1 md:p-2 text-left border text-xs md:text-sm">
                      Student Name
                    </th>
                    {subjects.map((subject) => (
                      <th
                        key={subject._id}
                        className="p-1 md:p-2 text-center border text-xs md:text-sm"
                      >
                        {subject.name}
                        {selectedExamType && (
                          <div className="text-xs font-normal">
                            ({examTypeToText(selectedExamType)})
                          </div>
                        )}
                      </th>
                    ))}
                    {(selectedExamType === "re-unit-test" ||
                      selectedExamType === "reprelim") && (
                      <th className="p-1 md:p-2 text-left border text-xs md:text-sm">
                        Retest Reason
                      </th>
                    )}
                    <th className="p-1 md:p-2 text-center border bg-gray-100 text-xs md:text-sm">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>{renderStudents()}</tbody>
              </table>
            </div>
          </div>
          {renderModalContent()}
        </div>
      )}
      {activeTab === "subject-teacher" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="bg-white p-3 md:p-4 rounded shadow">
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
                Total Students
              </h3>
              <p className="text-xl md:text-2xl font-bold">
                {subjectSummaryData.totalStudents}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4">
            {renderSubjects()}
          </div>
          {renderModalContent()}
        </div>
      )}
      {deleteSubjectId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white p-4 md:p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3 md:mb-4">Delete Marks</h3>
            <div className="mb-3 md:mb-4">
              <label className="block mb-1 md:mb-2 text-sm md:text-base">
                Select Exam Type to Delete:
              </label>
              <select
                value={selectedDeleteExamType}
                onChange={(e) => setSelectedDeleteExamType(e.target.value)}
                className="w-full p-2 border rounded text-sm md:text-base"
              >
                <option value="">Select Exam Type</option>
                <option value="unit-test">Unit Test</option>
                <option value="re-unit-test">Re-Unit Test</option>
                <option value="prelim">Prelim</option>
                <option value="reprelim">Re-Prelim</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteSubjectId(null);
                  setSelectedDeleteExamType("");
                }}
                className="bg-gray-300 text-gray-700 px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMarks}
                disabled={!selectedDeleteExamType}
                className="bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded disabled:opacity-50 text-sm md:text-base"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {renderConfirmationDialog()}
    </div>
  );
};

export default TeacherDashboard;
