import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect } from "react";
import axios from "axios";

const StudentManagementSystem = () => {
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [isSubjectTeacher, setIsSubjectTeacher] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [view, setView] = useState("class-teacher"); // Default view
  const [excelData, setExcelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const toggleView = (viewId) => {
    setView(viewId);
  };

  const addStudent = () => {
    const rollNo = document.getElementById("roll-no").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (!rollNo || !name || !email) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (students.some((student) => student.rollNo == rollNo)) {
      showToast("Roll number already exists", "error");
      return;
    }

    const newStudent = { rollNo: parseInt(rollNo), name, email };
    setStudents([...students, newStudent]);

    document.getElementById("roll-no").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";

    showToast("Student added successfully", "success");
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        console.error("No teacherId found in sessionStorage");
        return;
      }

      try {
        // ✅ Fetch teacher role
        const roleResponse = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/teacher-role/${teacherId}`
        );
        console.log("Teacher Role Data:", roleResponse.data);

        // ✅ Set boolean states directly
        setIsClassTeacher(roleResponse.data.isClassTeacher);
        setIsSubjectTeacher(roleResponse.data.isSubjectTeacher);

        // ✅ Fetch Class Teacher Details
        if (roleResponse.data.isClassTeacher) {
          const classResponse = await axios.get(
            `https://gradyzebackend.onrender.com/api/studentmanagement/class-details/${teacherId}`
          );
          console.log("Class Teacher Details:", classResponse.data);
          setTeacherDetails(classResponse.data);
        }

        // ✅ Fetch Subject Teacher Details
        if (roleResponse.data.isSubjectTeacher) {
          const subjectResponse = await axios.get(
            `https://gradyzebackend.onrender.com/api/studentmanagement/subject-details/${teacherId}`
          );
          console.log("Subject Teacher Details:", subjectResponse.data);
          setSubjects(subjectResponse.data.subjects);
        }

        // ✅ Set Default View Based on Role
        if (
          roleResponse.data.isSubjectTeacher &&
          !roleResponse.data.isClassTeacher
        ) {
          setView("students"); // Open with Subject Teacher view
        } else {
          setView("class-teacher"); // Default to Class Teacher view
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherData();
  }, []);

  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState([]); // Store students

  const handleAddStudent = async () => {
    const teacherId = sessionStorage.getItem("teacherId");
    if (!teacherId) {
      console.error("No teacherId found in sessionStorage");
      return;
    }

    if (!rollNo || !name || !email) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/studentmanagement/add-student",
        {
          teacherId,
          rollNo: parseInt(rollNo),
          name,
          email,
        }
      );

      alert("Student added successfully!");
      setStudents([...students, response.data.student]); // Update UI with new student
      setRollNo("");
      setName("");
      setEmail(""); // Reset form
    } catch (error) {
      console.error("Error adding student:", error);
      alert(error.response?.data?.message || "Failed to add student");
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        console.error("No teacherId found in sessionStorage");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/students/${teacherId}`
        );
        setStudents(response.data.students);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const openModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      removeStudent(selectedStudent._id);
      closeModal();
    }
  };
  const removeStudent = async (studentId) => {
    const teacherId = sessionStorage.getItem("teacherId");
    if (!teacherId) {
      console.error("No teacherId found in sessionStorage");
      return;
    }

    try {
      const response = await axios.delete(
        `https://gradyzebackend.onrender.com/api/studentmanagement/delete-student/${teacherId}/${studentId}`
      );
      setStudents(students.filter((s) => s._id !== studentId)); // ✅ Update UI
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  const importExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const importStudents = () => {
    if (!excelData || excelData.length === 0) {
      showToast("No data to import", "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newStudents = excelData.map((row) => {
        const rollNoKey =
          Object.keys(row).find((key) => key.toLowerCase().includes("roll")) ||
          "Roll No";
        const nameKey =
          Object.keys(row).find((key) => key.toLowerCase().includes("name")) ||
          "Name";
        const emailKey =
          Object.keys(row).find((key) => key.toLowerCase().includes("email")) ||
          "Email";

        return {
          rollNo: parseInt(row[rollNoKey]),
          name: row[nameKey],
          email: row[emailKey],
        };
      });

      setStudents(newStudents);
      setExcelData(null);
      setLoading(false);
      showToast("Students imported successfully", "success");
    }, 1000);
  };

  const generateClassPDF = () => {
    setLoading(true);
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Class Report - Computer Science Second Year (A)", 14, 22);
      doc.setFontSize(12);
      doc.text(`Class Teacher: Prof. Jane Doe`, 14, 32);
      doc.text(`Total Students: ${students.length}`, 14, 38);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 44);

      const tableColumn = ["Roll No", "Name", "Email"];
      const tableRows = students
        .sort((a, b) => a.rollNo - b.rollNo)
        .map((student) => [student.rollNo, student.name, student.email]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [5, 150, 105] },
      });

      doc.save("class-report.pdf");
      setLoading(false);
      showToast("Class PDF generated successfully", "success");
    }, 1000);
  };

  const downloadStudentReport = () => {
    setLoading(true);
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Student Report - Computer Science Second Year (A)", 14, 22);
      doc.setFontSize(12);
      doc.text(`Class Teacher: Prof. Jane Doe`, 14, 32);
      doc.text(`Total Students: ${students.length}`, 14, 38);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 44);

      const tableColumn = ["Roll No", "Name", "Email"];
      const tableRows = students
        .sort((a, b) => a.rollNo - b.rollNo)
        .map((student) => [student.rollNo, student.name, student.email]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [5, 150, 105] },
      });

      doc.save("student-report.pdf");
      setLoading(false);
      showToast("Student report downloaded successfully", "success");
    }, 1000);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-6">
        <span className="w-2 h-8 bg-[#059669] rounded"></span>
        Student Management System
      </h1>

      <div className="flex bg-gray-200 rounded-lg p-1 mb-6 max-w-xl">
        <button
          className={`flex-1 p-3 rounded-md text-gray-700 ${
            view === "class-teacher" ? "bg-white shadow-md text-gray-800" : ""
          }`}
          onClick={() => toggleView("class-teacher")}
          disabled={isSubjectTeacher && !isClassTeacher} // Disable if ONLY subject teacher
        >
          Class Teacher
        </button>

        <button
          className={`flex-1 p-3 rounded-md text-gray-700 ${
            view === "students" ? "bg-white shadow-md text-gray-800" : ""
          }`}
          onClick={() => toggleView("students")}
          disabled={isClassTeacher && !isSubjectTeacher} // Disable if ONLY class teacher
        >
          Subject Teacher
        </button>
      </div>

      {view === "class-teacher" && (
        <div className="card bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="class-info flex flex-wrap gap-6 mb-6">
            <div className="info-item flex-1 min-w-xs bg-gray-200 p-5 rounded-lg shadow-sm transition-transform transform hover:-translate-y-1">
              <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#059669] rounded-full"></span>
                Department
              </h3>
              <p className="text-lg font-medium">
                {teacherDetails.department || "N/A"}
              </p>
            </div>
            <div className="info-item flex-1 min-w-xs bg-gray-200 p-5 rounded-lg shadow-sm transition-transform transform hover:-translate-y-1">
              <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#059669] rounded-full"></span>
                Year
              </h3>
              <p className="text-lg font-medium">
                {teacherDetails.year || "N/A"}
              </p>
            </div>
            <div className="info-item flex-1 min-w-xs bg-gray-200 p-5 rounded-lg shadow-sm transition-transform transform hover:-translate-y-1">
              <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#059669] rounded-full"></span>
                Division
              </h3>
              <p className="text-lg font-medium">
                {teacherDetails.division || "N/A"}
              </p>
            </div>
            <div className="info-item flex-1 min-w-xs bg-gray-200 p-5 rounded-lg shadow-sm transition-transform transform hover:-translate-y-1">
              <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#059669] rounded-full"></span>
                Class Teacher
              </h3>
              <p className="text-lg font-medium">
                {teacherDetails.classTeacher || "N/A"}
              </p>
            </div>
          </div>

          <div className="button-group flex flex-wrap gap-4 mb-6">
            <div className="button-group flex gap-4 mb-6">
              <label className="file-label flex items-center justify-center gap-2 bg-[#059669] text-white p-3 rounded-lg font-medium transition-transform transform hover:-translate-y-1 flex-1">
                Import from Excel
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={importExcel}
                />
              </label>
              {students.length > 0 && (
                <button
                  className="bg-[#059669] text-white p-3 rounded-lg font-medium transition-transform transform hover:-translate-y-1 flex-1"
                  onClick={generateClassPDF}
                >
                  Generate Class PDF
                </button>
              )}
            </div>
          </div>

          {excelData && (
            <div className="bg-gray-200 p-5 rounded-lg border border-dashed border-[#059669] mb-6">
              <h3 className="text-gray-800 font-semibold mb-4">
                Imported Students
              </h3>
              <div>
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      {Object.keys(excelData[0]).map((header) => (
                        <th
                          key={header}
                          className="py-2 px-4 text-left font-semibold text-gray-800"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.slice(0, 5).map((row, index) => (
                      <tr
                        key={index}
                        className="transition-transform transform hover:bg-[#059669] hover:text-white"
                      >
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="py-2 px-4">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {excelData.length > 5 && (
                  <p className="mt-2">Showing 5 of {excelData.length} rows</p>
                )}
              </div>
              <button
                className="bg-[#059669] text-white p-3 rounded-lg mt-4 font-medium transition-transform transform hover:-translate-y-1"
                onClick={importStudents}
              >
                Import Students
              </button>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-gray-800 font-semibold mb-4">
              Add New Student
            </h3>
            <div className="student-form flex flex-wrap gap-5 bg-gray-200 p-6 rounded-lg">
              <div className="form-group flex-1 min-w-xs">
                <label className="block mb-2 font-medium text-dark">
                  Roll No
                </label>
                <input
                  type="number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter roll number"
                />
              </div>
              <div className="form-group flex-1 min-w-xs">
                <label className="block mb-2 font-medium text-dark">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter student name"
                />
              </div>
              <div className="form-group flex-1 min-w-xs">
                <label className="block mb-2 font-medium text-dark">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter student email"
                />
              </div>
              <div className="form-group flex-1 min-w-xs flex items-end">
                <button
                  className="bg-[#059669] text-white p-3 rounded-lg w-full font-medium transition-transform transform hover:-translate-y-1"
                  onClick={handleAddStudent}
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-gray-800 font-semibold mb-4">Student List</h3>

            {loading ? (
              <p className="text-gray-600">Loading students...</p>
            ) : students.length > 0 ? (
              <div className="table-container overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left font-semibold text-gray-800">
                        Roll No
                      </th>
                      <th className="py-2 px-4 text-left font-semibold text-gray-800">
                        Name
                      </th>
                      <th className="py-2 px-4 text-left font-semibold text-gray-800">
                        Email
                      </th>
                      <th className="py-2 px-4 text-left font-semibold text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.rollNo}
                        className="hover:bg-gray-100 transition"
                      >
                        <td className="py-2 px-4">{student.rollNo}</td>
                        <td className="py-2 px-4">{student.name}</td>
                        <td className="py-2 px-4">{student.email}</td>
                        <td className="py-2 px-4 flex gap-2">
                          {/* Edit Button */}
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                            onClick={() => editStudent(student)}
                          >
                            Edit
                          </button>

                          {/* Remove Button */}
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                            onClick={() => openModal(student)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No students found.</p>
            )}
          </div>
        </div>
      )}

      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p>
              Are you sure you want to remove{" "}
              <strong>{selectedStudent.name}</strong>?
            </p>

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "students" && (
        <div className="card bg-white rounded-xl shadow-md p-6 mb-6">
          {/* ✅ Subject Teacher Section - Shows Assigned Subjects */}
          {subjects.length > 0 && (
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">
                Assigned Subjects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 p-5 rounded-lg shadow-sm"
                  >
                    <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#059669] rounded-full"></span>
                      {subject.name}
                    </h3>
                    <p className="text-lg font-medium">Year: {subject.year}</p>
                    <p className="text-lg font-medium">
                      Semester: {subject.semester}
                    </p>
                    <p className="text-lg font-medium">
                      Division: {subject.division}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Student List Table */}
          <div className="table-container overflow-x-auto rounded-lg shadow-md mt-6">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold text-gray-800">
                    Roll No
                  </th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-800">
                    Name
                  </th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-800">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.rollNo}>
                    <td className="py-2 px-4">{student.rollNo}</td>
                    <td className="py-2 px-4">{student.name}</td>
                    <td className="py-2 px-4">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Download Student Report Button */}
          <button
            className="bg-[#059669] text-white p-3 rounded-lg mt-4 font-medium transition-transform transform hover:-translate-y-1"
            onClick={downloadStudentReport}
          >
            Download Student Report
          </button>
        </div>
      )}

      {toast.message && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white font-medium flex items-center gap-3 ${
            toast.type === "success" ? "bg-[#059669]" : "bg-red-500"
          } transition-transform transform ${
            toast.message ? "translate-y-0" : "-translate-y-5"
          } opacity-${toast.message ? "100" : "0"}`}
        >
          {toast.message}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-50">
          <div className="w-12 h-12 border-4 border-t-4 border-[#059669] border-t-[#059669] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default StudentManagementSystem;
