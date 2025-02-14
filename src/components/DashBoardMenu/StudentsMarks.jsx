import React, { useState, useEffect } from "react";

const MarksEntrySystem = () => {
  const [students] = useState([
    { roll: "1", name: "John Doe", email: "john@example.com" },
    { roll: "2", name: "Jane Smith", email: "jane@example.com" },
    { roll: "3", name: "Bob Wilson", email: "bob@example.com" },
    { roll: "4", name: "Alice Brown", email: "alice@example.com" },
    { roll: "5", name: "Charlie Davis", email: "charlie@example.com" },
  ]);

  const [departmentData] = useState([
    {
      department: "Computer Engineering",
      divisions: ["A", "B"],
      year: "Third Year",
      semester: "Sixth",
      totalStudents: 60,
      marksStatus: "pending",
    },
    {
      department: "Information Technology",
      divisions: ["A", "B", "C"],
      year: "Second Year",
      semester: "Fourth",
      totalStudents: 60,
      marksStatus: "complete",
    },
    {
      department: "Electronics & Telecommunication",
      divisions: ["A", "B"],
      year: "First Year",
      semester: "Second",
      totalStudents: 60,
      marksStatus: "pending",
    },
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState("");
  const [maxMarks, setMaxMarks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [marksTable, setMarksTable] = useState(null);

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const updateMaxMarks = () => {
    setMaxMarks(
      examType === "unit_test" || examType === "reunit_test" ? 30 : 70
    );
  };

  const showMarksTable = () => {
    if (!examType || !subject || !selectedDepartment) {
      alert("Please fill all the fields");
      return;
    }

    if (maxMarks === 0) {
      updateMaxMarks();
    }

    closeModal();

    const tableHtml = (
      <div>
        <div className="table-header">
          <h3 className="text-purple-700">
            Enter Marks - {subject.toUpperCase()} (Max Marks: {maxMarks})
          </h3>
          <p>
            Department: {selectedDepartment.department} | Year:{" "}
            {selectedDepartment.year} | Semester: {selectedDepartment.semester}{" "}
            | Exam: {examType.replace("_", " ").toUpperCase()}
          </p>
        </div>
        <table className="marks-table min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-purple-700 text-white">
              <th className="py-2 px-4">Roll No.</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Marks (Max: {maxMarks})</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.roll} className="border-b">
                <td className="py-2 px-4">{student.roll}</td>
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.email}</td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    className="marks-input w-16 border border-gray-300 rounded px-2"
                    min="0"
                    max={maxMarks}
                    onChange={(e) => updateStatus(e, student.roll)}
                  />
                </td>
                <td className="py-2 px-4">
                  <span id={`status-${student.roll}`}></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    setMarksTable(tableHtml);
    updateStats();
  };

  const updateStatus = (event, roll) => {
    const marks = parseInt(event.target.value) || 0;
    if (marks > maxMarks) {
      alert(`Marks cannot exceed ${maxMarks}`);
      event.target.value = maxMarks;
      return;
    }

    const statusCell = document.getElementById(`status-${roll}`);
    const status = marks >= 35 ? "Pass" : "Fail";
    statusCell.textContent = status;
    statusCell.className =
      status === "Pass" ? "text-purple-700" : "text-red-500";

    updateStats();
  };

  const updateStats = () => {
    const inputs = document.querySelectorAll(".marks-input");
    let total = 0;
    let passed = 0;
    let highest = 0;
    let validInputs = 0;

    inputs.forEach((input) => {
      const value = parseInt(input.value) || 0;
      if (value > 0) {
        total += value;
        validInputs++;
        if (value >= 35) passed++;
        highest = Math.max(highest, value);
      }
    });

    const average = validInputs ? (total / validInputs).toFixed(1) : 0;
    const passRate = validInputs
      ? ((passed / validInputs) * 100).toFixed(1)
      : 0;

    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("passRate").textContent = `${passRate}%`;
    document.getElementById("avgScore").textContent = average;
    document.getElementById("highestScore").textContent = highest;
  };

  useEffect(() => {
    updateMaxMarks();
  }, [examType]);

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="header bg-purple-700 text-white p-4 rounded mb-5">
        <h2 className="text-2xl">Subject Marks</h2>
      </div>

      <div className="stats-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <div className="stat-card bg-white p-4 rounded shadow">
          <h3 className="text-purple-700 mb-2">Total Students</h3>
          <p id="totalStudents">0</p>
        </div>
        <div className="stat-card bg-white p-4 rounded shadow">
          <h3 className="text-purple-700 mb-2">Pass Rate</h3>
          <p id="passRate">0%</p>
        </div>
        <div className="stat-card bg-white p-4 rounded shadow">
          <h3 className="text-purple-700 mb-2">Average Score</h3>
          <p id="avgScore">0</p>
        </div>
        <div className="stat-card bg-white p-4 rounded shadow">
          <h3 className="text-purple-700 mb-2">Highest Score</h3>
          <p id="highestScore">0</p>
        </div>
      </div>

      <div className="department-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {departmentData.map((dept) => (
          <div
            key={dept.department}
            className="department-card bg-white p-5 rounded shadow cursor-pointer transition transform hover:-translate-y-1"
            onClick={() => handleDepartmentClick(dept)}
          >
            <h3 className="text-purple-700 text-lg mb-3">{dept.department}</h3>
            <div className="card-detail text-gray-600 mb-2">
              <span>Year:</span> <strong>{dept.year}</strong>
            </div>
            <div className="card-detail text-gray-600 mb-2">
              <span>Semester:</span> <strong>{dept.semester}</strong>
            </div>
            <div className="card-detail text-gray-600 mb-2">
              <span>Divisions:</span>{" "}
              <strong>{dept.divisions.join(", ")}</strong>
            </div>
            <div className="card-detail text-gray-600 mb-2">
              <span>Total Students:</span> <strong>{dept.totalStudents}</strong>
            </div>
            <div
              className={`status-tag inline-block px-2 py-1 rounded text-sm ${
                dept.marksStatus === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {dept.marksStatus.charAt(0).toUpperCase() +
                dept.marksStatus.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded shadow relative w-full max-w-md">
            <span
              className="close absolute top-2 right-2 text-2xl cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </span>
            <h3 className="text-purple-700 text-xl mb-4">
              Enter Marks - {selectedDepartment?.department} (
              {selectedDepartment?.year}, {selectedDepartment?.semester})
            </h3>
            <div className="form-group mb-4">
              <label className="block text-gray-700 mb-2">Exam Type:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              >
                <option value="">Select Exam Type</option>
                <option value="unit_test">Unit Test</option>
                <option value="reunit_test">Re-Unit Test</option>
                <option value="prelim">Prelim</option>
                <option value="reprelim">Re-Prelim</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700 mb-2">Subject:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                <option value="mathematics">Engineering Mathematics</option>
                <option value="physics">Engineering Physics</option>
                <option value="chemistry">Engineering Chemistry</option>
              </select>
            </div>
            <button
              className="submit-btn bg-purple-700 text-white p-2 rounded hover:bg-purple-800 transition"
              onClick={showMarksTable}
            >
              Proceed
            </button>
          </div>
        </div>
      )}

      <div id="marksTableContainer">{marksTable}</div>

      <div className="action-buttons flex gap-4 mt-5">
        <button
          className="btn bg-purple-700 text-white p-2 rounded hover:bg-purple-800 transition"
          onClick={() => setShowModal(true)}
        >
          Add Marks
        </button>
        <button
          className="btn bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          onClick={() => alert("PDF generation would be implemented here")}
        >
          Generate PDF
        </button>
        <input
          type="file"
          id="fileUpload"
          className="file-upload hidden"
          accept=".csv,.xlsx"
          onChange={(e) =>
            alert("File upload processing would be implemented here")
          }
        />
        <button
          className="btn bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
          onClick={() => document.getElementById("fileUpload").click()}
        >
          Upload Marks File
        </button>
      </div>
    </div>
  );
};

export default MarksEntrySystem;
