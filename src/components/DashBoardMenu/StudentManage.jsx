import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StudentManagement = () => {
  const [classes, setClasses] = useState([]);
  const [currentClassId, setCurrentClassId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openClassModal = () => setIsModalOpen(true);
  const closeClassModal = () => setIsModalOpen(false);

  const createClass = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const newClass = {
      iid: currentClassId + 1,
      department: formData.get("department"),
      year: formData.get("year"),
      studentCount: parseInt(formData.get("studentCount")),
      classTeacher: formData.get("classTeacher"),
      division: formData.get("division"),
      students: [],
    };

    setClasses([...classes, newClass]);
    closeClassModal();
    form.reset();
  };

  const addStudent = (event, classId) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const classIndex = classes.findIndex((c) => c.id === classId);
    if (classIndex === -1) return;

    const newStudent = {
      rollNo: parseInt(formData.get("rollNo")),
      name: formData.get("name"),
      email: formData.get("email"),
    };

    if (
      classes[classIndex].students.some(
        (student) => student.rollNo === newStudent.rollNo
      )
    ) {
      alert("A student with this Roll No already exists in this class!");
      return;
    }

    const updatedClasses = [...classes];
    updatedClasses[classIndex].students.push(newStudent);
    setClasses(updatedClasses);
    form.reset();
  };

  const generatePDF = (classId) => {
    const classData = classes.find((c) => c.id === classId);
    if (!classData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Class Details - ${classData.department}`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Year: ${classData.year}`, 20, 30);
    doc.text(`Division: ${classData.division}`, 20, 40);
    doc.text(`Class Teacher: ${classData.classTeacher}`, 20, 50);

    const headers = [["Roll No", "Name", "Email"]];
    const data = classData.students.map((student) => [
      student.rollNo,
      student.name,
      student.email,
    ]);

    doc.autoTable({
      startY: 60,
      head: headers,
      body: data,
    });

    doc.save(`class_${classData.department}_${classData.division}.pdf`);
  };

  const uploadPDF = (event, classId) => {
    const file = event.target.files[0];

    if (!file) {
      alert("No file selected!");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file!");
      return;
    }

    alert(`PDF uploaded successfully for Class ID: ${classId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="header flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Student Management
            </h1>
            <p className="text-gray-600">Manage classes and students</p>
          </div>
          <button
            onClick={openClassModal}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            Add New Class
          </button>
        </div>

        {/* Stats */}
        <div className="stats-container grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Classes</h3>
            <div className="stat-value flex items-center gap-2">
              <i className="fas fa-chalkboard"></i>
              <span>{classes.length}</span>
            </div>
          </div>
          <div className="stat-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Students</h3>
            <div className="stat-value flex items-center gap-2">
              <i className="fas fa-users"></i>
              <span>
                {classes.reduce((total, cls) => total + cls.students.length, 0)}
              </span>
            </div>
          </div>
          <div className="stat-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Departments</h3>
            <div className="stat-value flex items-center gap-2">
              <i className="fas fa-building"></i>
              <span>{new Set(classes.map((cls) => cls.department)).size}</span>
            </div>
          </div>
        </div>

        {/* Class List */}
        <div id="classList" className="space-y-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="class-card bg-white p-6 rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold">
                {cls.department} - {cls.year} (Division {cls.division})
              </h3>
              <p>Class Teacher: {cls.classTeacher}</p>
              <p>
                Students: {cls.students.length}/{cls.studentCount}
              </p>

              {cls.students.length < cls.studentCount && (
                <form
                  onSubmit={(e) => addStudent(e, cls.id)}
                  className="space-y-2 mt-4"
                >
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="rollNo"
                      required
                      placeholder="Roll No"
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Name"
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                </form>
              )}

              {cls.students.length > 0 && (
                <table className="student-table w-full mt-4 bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Roll No</th>
                      <th className="p-2 border-b">Name</th>
                      <th className="p-2 border-b">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students.map((student, index) => (
                      <tr key={index}>
                        <td className="p-2 border-b">{student.rollNo}</td>
                        <td className="p-2 border-b">{student.name}</td>
                        <td className="p-2 border-b">{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="class-actions flex gap-2 mt-4">
                <label className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer">
                  <i className="fas fa-upload"></i>
                  Upload PDF
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => uploadPDF(e, cls.id)}
                  />
                </label>
                <button
                  onClick={() => generatePDF(cls.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <i className="fas fa-file-pdf"></i>
                  Generate PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-content bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
            <form onSubmit={createClass} className="space-y-4">
              <div className="form-group">
                <label className="block text-gray-700">Department</label>
                <select
                  name="department"
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Electronic & Telecommunication">
                    Electronic & Telecommunication
                  </option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Year</label>
                <select
                  name="year"
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Year</option>
                  <option value="First">First Year</option>
                  <option value="Second">Second Year</option>
                  <option value="Third">Third Year</option>
                  <option value="Fourth">Fourth Year</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">
                  Number of Students
                </label>
                <input
                  type="number"
                  name="studentCount"
                  min="1"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Class Teacher</label>
                <input
                  type="text"
                  name="classTeacher"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Division</label>
                <input
                  type="text"
                  name="division"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Create Class
                </button>
                <button
                  type="button"
                  onClick={closeClassModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
