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
  const [selectedExamType, setSelectedExamType] = useState("unit-test");
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [selectedDeleteExamType, setSelectedDeleteExamType] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const teacherId = sessionStorage.getItem("teacherId");

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

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");

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

      const processedMarks = {};
      const subjectsMap = {};

      marksResponse.data.forEach((mark) => {
        mark.exams.forEach((exam) => {
          if (!subjectsMap[exam.subjectName]) {
            subjectsMap[exam.subjectName] = {
              name: exam.subjectName,
              _id: exam.subjectName,
            };
          }
        });
      });

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

      const relevantSubjects = Object.values(subjectsMap);

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

  const handleExamTypeChange = (e) => {
    const newExamType = e.target.value;
    setSelectedExamType(newExamType);
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
      const subjectId = subject._id || subject.id;
      const subjectName = subject.name;
      const subjectYear = subject.year;
      const subjectSemester = subject.semester;
      const subjectDivisions = subject.divisions || [subject.division];

      return (
        <div key={subjectId} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">{subjectName}</h3>
          <p>Year: {subjectYear}</p>
          <p>Semester: {subjectSemester}</p>
          <p>Divisions: {subjectDivisions.join(", ")}</p>
          <div className="flex mt-4">
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
          </div>
        </div>
      );
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
      subjectName: subject.name,
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

      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/marks-by-subject`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            subjectName: subject.name,
            examType,
          },
        }
      );

      const existingMarks = response.data || {};
      const allStudents = studentsData[subjectId]?.students || [];

      setIsLoading(false);
      setModalContent({
        type: "students-list",
        subjectId,
        subjectName: subject.name,
        examType,
        isUpdateMode: Object.keys(existingMarks).length > 0,
        existingMarks,
        studentsToShow: allStudents,
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

  const handleSaveMarks = async () => {
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

      toast.success("Marks deleted successfully!");
      setDeleteSubjectId(null);
      setSelectedDeleteExamType("");
      fetchSubjectStudentsData();
    } catch (error) {
      console.error("Error deleting marks:", error);
      toast.error(
        "Error deleting marks: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const renderConfirmationDialog = () => {
    if (!confirmAction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">{confirmAction.title}</h3>
          <p className="mb-4">{confirmAction.message}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmAction(null)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirmAction.onConfirm();
                setConfirmAction(null);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded shadow-lg flex flex-col items-center">
            <ClipLoader size={50} color="#3B82F6" />
            <p className="mt-4 text-lg">{modalContent.message}</p>
          </div>
        </div>
      );
    }
    if (!modalContent) return null;

    switch (modalContent.type) {
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
                  onChange={handleExamTypeChange}
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

      case "export-selection":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Export Marks for {modalContent.subjectName}
              </h3>

              <div className="mb-4">
                <label className="block mb-2">Exam Type:</label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Exam Type</option>
                  <option value="unit-test">Unit Test</option>
                  <option value="re-unit-test">Re-Unit Test</option>
                  <option value="prelim">Prelim</option>
                  <option value="reprelim">Re-Prelim</option>
                </select>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() =>
                    handleExport(
                      "pdf",
                      modalContent.subjectId,
                      selectedExamType
                    )
                  }
                  disabled={!selectedExamType || isLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
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
                  className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isLoading ? "Exporting..." : "Export Excel"}
                </button>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl relative pl-4">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                &times;
              </button>
              <div className="mb-4 border-b pb-2">
                <h3 className="font-semibold text-gray-800">
                  {examType} - Enter Student Marks
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isUnitTest ? "Pass mark: 12" : "Pass mark: 28"}
                </p>
              </div>
              <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full mb-4">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Absent</th>
                      <th className="p-2 text-left">Roll No.</th>
                      <th className="p-2 text-left">Name</th>
                      {isUnitTest ? (
                        <>
                          <th className="p-2 text-center">Q1/Q2 (Max 15)</th>
                          <th className="p-2 text-center">Q3/Q4 (Max 15)</th>
                        </>
                      ) : (
                        <>
                          <th className="p-2 text-center">Q1/Q2 (Max 17)</th>
                          <th className="p-2 text-center">Q3/Q4 (Max 18)</th>
                          <th className="p-2 text-center">Q5/Q6 (Max 17)</th>
                          <th className="p-2 text-center">Q7/Q8 (Max 18)</th>
                        </>
                      )}
                      <th className="p-2 text-center">Total</th>
                      <th className="p-2 text-center">Status</th>
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
                          <td className="p-2 text-center">
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
                                  }
                                });
                              }}
                            />
                          </td>

                          <td className="p-2">{student.rollNo}</td>
                          <td className="p-2">{student.name}</td>

                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={isUnitTest ? 15 : 17}
                              className="q1q2-input w-16 p-1 border rounded text-center"
                              defaultValue={
                                isAbsent ? "" : marksData?.q1q2 || 0
                              }
                              disabled={isAbsent}
                            />
                          </td>

                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={isUnitTest ? 15 : 18}
                              className="q3q4-input w-16 p-1 border rounded text-center"
                              defaultValue={
                                isAbsent ? "" : marksData?.q3q4 || 0
                              }
                              disabled={isAbsent}
                            />
                          </td>

                          {!isUnitTest && (
                            <>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={17}
                                  className="q5q6-input w-16 p-1 border rounded text-center"
                                  defaultValue={
                                    isAbsent ? "" : marksData?.q5q6 || 0
                                  }
                                  disabled={isAbsent}
                                />
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={18}
                                  className="q7q8-input w-16 p-1 border rounded text-center"
                                  defaultValue={
                                    isAbsent ? "" : marksData?.q7q8 || 0
                                  }
                                  disabled={isAbsent}
                                />
                              </td>
                            </>
                          )}

                          <td className="p-2 total-cell text-center font-medium">
                            {isAbsent ? "Absent" : marksData?.total || 0}
                          </td>
                          <td
                            className={`p-2 status-cell text-center ${
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
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMarks}
                  disabled={isSaving}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <ClipLoader
                        size={20}
                        color="#ffffff"
                        className="inline mr-2"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Delete Marks</h3>

              <div className="mb-4">
                <label className="block mb-2">
                  Select Exam Type to Delete:
                </label>
                <select
                  value={selectedDeleteExamType}
                  onChange={(e) => setSelectedDeleteExamType(e.target.value)}
                  className="w-full p-2 border rounded"
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
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMarks}
                  disabled={!selectedDeleteExamType}
                  className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
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
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
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
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Student Performance</h2>
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleClassExport("pdf")}
                    disabled={isLoading}
                    className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {isLoading ? "Exporting..." : "Export PDF"}
                  </button>
                  <button
                    onClick={() => handleClassExport("excel")}
                    disabled={isLoading}
                    className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {isLoading ? "Exporting..." : "Export Excel"}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded"
                />
                <button
                  onClick={() =>
                    setFilteredStudents(
                      students.filter(
                        (student) =>
                          student.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          student.rollNo.toString().includes(searchQuery)
                      )
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left border">Roll No.</th>
                    <th className="p-2 text-left border">Student Name</th>
                    {subjects.map((subject) => (
                      <th key={subject._id} className="p-2 text-center border">
                        {subject.name}
                        {selectedExamType && (
                          <div className="text-xs font-normal">
                            {selectedExamType}
                          </div>
                        )}
                      </th>
                    ))}
                    {(selectedExamType === "re-unit-test" ||
                      selectedExamType === "reprelim") && (
                      <th className="p-2 text-left border">Retest Reason</th>
                    )}
                    <th className="p-2 text-center border bg-gray-100">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Total Students</h3>
              <p className="text-2xl font-bold">
                {subjectsList.reduce(
                  (acc, subject) => acc + (subject.students?.length || 0),
                  0
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {renderSubjects()}
          </div>

          {renderModalContent()}
        </div>
      )}

      {deleteSubjectId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Delete Marks</h3>

            <div className="mb-4">
              <label className="block mb-2">Select Exam Type to Delete:</label>
              <select
                value={selectedDeleteExamType}
                onChange={(e) => setSelectedDeleteExamType(e.target.value)}
                className="w-full p-2 border rounded"
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
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMarks}
                disabled={!selectedDeleteExamType}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
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
