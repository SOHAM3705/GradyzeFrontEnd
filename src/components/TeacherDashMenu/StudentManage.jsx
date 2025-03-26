import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StudentManagementSystem = () => {
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [isSubjectTeacher, setIsSubjectTeacher] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [view, setView] = useState("class-teacher");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudentModalOpen, setEditStudentModalOpen] = useState(false);
  const [deleteStudentModalOpen, setDeleteStudentModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        console.error("No teacherId found in sessionStorage");
        return;
      }

      try {
        const roleResponse = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/teacher-role/${teacherId}`
        );
        setIsClassTeacher(roleResponse.data.isClassTeacher);
        setIsSubjectTeacher(roleResponse.data.isSubjectTeacher);

        if (roleResponse.data.isClassTeacher) {
          const classResponse = await axios.get(
            `https://gradyzebackend.onrender.com/api/studentmanagement/class-details/${teacherId}`
          );
          setTeacherDetails(classResponse.data);
        }

        if (roleResponse.data.isSubjectTeacher) {
          const subjectResponse = await axios.get(
            `https://gradyzebackend.onrender.com/api/studentmanagement/subject-details/${teacherId}`
          );
          setSubjects(subjectResponse.data.subjects);
        }

        setView(
          roleResponse.data.isSubjectTeacher &&
            !roleResponse.data.isClassTeacher
            ? "students"
            : "class-teacher"
        );
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherData();
  }, []);

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

  const handleAddStudent = async () => {
    const teacherId = sessionStorage.getItem("teacherId");
    const adminId = sessionStorage.getItem("adminId");

    if (!teacherId || !adminId) {
      alert("Session expired. Please log in again.");
      return;
    }

    const { year, division } = teacherDetails || {};

    if (!year || !division) {
      alert("Class details are missing. Please contact the administrator.");
      return;
    }

    // Validate input
    if (!rollNo || !name || !email) {
      alert("Please fill in all student details!");
      return;
    }

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/studentmanagement/add-student",
        {
          rollNo: parseInt(rollNo),
          name,
          email,
          year, // ✅ Added year
          division, // ✅ Added division
        },
        {
          headers: {
            teacherid: teacherId,
            adminid: adminId,
          },
        }
      );

      // Reset form after successful addition
      setRollNo("");
      setName("");
      setEmail("");

      // Optionally, refresh the students list
      setStudents([...students, response.data.student]);

      alert("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error.response?.data);
      alert(error.response?.data?.message || "Failed to add student");
    }
  };

  const handleFileUpload = async (event) => {
    const teacherId = sessionStorage.getItem("teacherId");
    const adminId = sessionStorage.getItem("adminId");

    if (!teacherId || !adminId) {
      console.error("Missing teacherId or adminId in sessionStorage");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Invalid file format. Please upload an Excel file (.xlsx, .xls)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post(
        `https://gradyzebackend.onrender.com/api/studentmanagement/import-students`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            teacherid: teacherId, // Ensure lowercase headers
            adminid: adminId, // Ensure lowercase headers
          },
        }
      );

      alert("Students imported successfully!");
      setStudents([...students, ...response.data.students]);
    } catch (error) {
      console.error("Error importing students:", error);
      alert(error.response?.data?.message || "Failed to import students");
    } finally {
      setUploading(false);
    }
  };

  const downloadStudentReport = async () => {
    const teacherId = sessionStorage.getItem("teacherId");
    if (!teacherId) {
      console.error("No teacherId found in sessionStorage");
      return;
    }

    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/studentmanagement/generate-report/${teacherId}`,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/pdf",
            Accept: "application/pdf",
          },
          withCredentials: true,
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Student_Report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading student report:", error);
      alert("Failed to download student report.");
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditStudentModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setDeleteStudentModalOpen(true);
  };

  const closeModals = () => {
    setEditStudentModalOpen(false);
    setDeleteStudentModalOpen(false);
    setSelectedStudent(null);
  };

  const confirmDelete = async () => {
    if (selectedStudent) {
      await removeStudent(selectedStudent._id);
      closeModals();
    }
  };

  const [subjectStudents, setSubjectStudents] = useState({});

  useEffect(() => {
    const fetchSubjectStudents = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        console.error("No teacherId found in sessionStorage");
        return;
      }

      try {
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/students-by-subject/${teacherId}`
        );

        console.log("Fetched Subject Students:", response.data); // Debugging line

        setSubjects(response.data.subjects); // Set subject details
        setSubjectStudents(response.data.studentData); // Store students grouped by subject
      } catch (error) {
        console.error("Error fetching subject students:", error);
      }
    };

    fetchSubjectStudents();
  }, []);

  const removeStudent = async (studentId) => {
    const teacherId = sessionStorage.getItem("teacherId");
    if (!teacherId) {
      console.error("No teacherId found in sessionStorage");
      return;
    }

    try {
      await axios.delete(
        `https://gradyzebackend.onrender.com/api/studentmanagement/delete-student/${teacherId}/${studentId}`
      );
      setStudents(students.filter((s) => s._id !== studentId));
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  const updateStudent = async () => {
    const teacherId = sessionStorage.getItem("teacherId");
    if (!teacherId) {
      console.error("No teacherId found in sessionStorage");
      return;
    }

    try {
      const response = await axios.put(
        `https://gradyzebackend.onrender.com/api/studentmanagement/update-student/${teacherId}/${selectedStudent._id}`,
        {
          rollNo: selectedStudent.rollNo,
          name: selectedStudent.name,
          email: selectedStudent.email,
        }
      );

      setStudents(
        students.map((s) =>
          s._id === selectedStudent._id ? response.data.student : s
        )
      );
      closeModals();
    } catch (error) {
      console.error("Error updating student:", error);
    }
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
          onClick={() => setView("class-teacher")}
          disabled={isSubjectTeacher && !isClassTeacher}
        >
          Class Teacher
        </button>

        <button
          className={`flex-1 p-3 rounded-md text-gray-700 ${
            view === "students" ? "bg-white shadow-md text-gray-800" : ""
          }`}
          onClick={() => setView("students")}
          disabled={isClassTeacher && !isSubjectTeacher}
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
            <label className="file-label flex items-center justify-center gap-2 bg-[#059669] text-white p-3 rounded-lg font-medium transition-transform transform hover:-translate-y-1 flex-1 cursor-pointer">
              {uploading ? "Uploading..." : "Import from Excel"}
              <input
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            {students.length > 0 && (
              <button
                className="bg-[#059669] text-white p-3 rounded-lg font-medium transition-transform transform hover:-translate-y-1 flex-1"
                onClick={downloadStudentReport}
              >
                Generate Class PDF
              </button>
            )}
          </div>

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
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search students..."
                className="p-2 border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

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
                    {students
                      .filter(
                        (student) =>
                          student.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          student.email
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                      .map((student) => (
                        <tr
                          key={student.rollNo}
                          className="hover:bg-gray-100 transition"
                        >
                          <td className="py-2 px-4">{student.rollNo}</td>
                          <td className="py-2 px-4">{student.name}</td>
                          <td className="py-2 px-4">{student.email}</td>
                          <td className="py-2 px-4 flex gap-2">
                            <button
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                              onClick={() => openEditModal(student)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                              onClick={() => openDeleteModal(student)}
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

            {editStudentModalOpen && selectedStudent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-lg font-semibold">Edit Student</h3>
                  <div className="mt-4">
                    <label className="block font-medium">Roll No</label>
                    <input
                      type="number"
                      value={selectedStudent.rollNo}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          rollNo: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block font-medium">Name</label>
                    <input
                      type="text"
                      value={selectedStudent.name}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block font-medium">Email</label>
                    <input
                      type="email"
                      value={selectedStudent.email}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={closeModals}
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateStudent}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}

            {deleteStudentModalOpen && selectedStudent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-lg font-semibold">Confirm Delete</h3>
                  <p>
                    Are you sure you want to remove{" "}
                    <strong>{selectedStudent.name}</strong>?
                  </p>
                  <div className="flex justify-end mt-4 gap-3">
                    <button
                      onClick={closeModals}
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
          </div>
        </div>
      )}

      {view === "students" && (
        <div className="card bg-white rounded-xl shadow-md p-6 mb-6">
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

          {/* ✅ Loop through each subject & display students */}
          {subjects.map((subject, index) => (
            <div key={index} className="mt-8">
              <h3 className="text-gray-800 font-semibold mb-4">
                Students for {subject.name} ({subject.year} - {subject.division}
                )
              </h3>

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
                    </tr>
                  </thead>
                  <tbody>
                    {subjectStudents[subject.name]?.map((student) => (
                      <tr key={student.rollNo}>
                        <td className="py-2 px-4">{student.rollNo}</td>
                        <td className="py-2 px-4">{student.name}</td>
                        <td className="py-2 px-4">{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
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
