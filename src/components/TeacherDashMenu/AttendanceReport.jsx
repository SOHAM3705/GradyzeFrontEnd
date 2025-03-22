import React, { useState, useEffect } from "react";

const TeacherAttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([
    {
      id: "S001",
      roll: 1,
      name: "Alex Johnson",
      status: "present",
      attendance: "96%",
      notes: "",
    },
    {
      id: "S002",
      roll: 2,
      name: "Maria Garcia",
      status: "present",
      attendance: "92%",
      notes: "",
    },
    {
      id: "S003",
      roll: 3,
      name: "James Wilson",
      status: "absent",
      attendance: "78%",
      notes: "Medical Leave",
    },
    {
      id: "S004",
      roll: 4,
      name: "Sarah Brown",
      status: "late",
      attendance: "88%",
      notes: "15 min late",
    },
    {
      id: "S005",
      roll: 5,
      name: "Daniel Lee",
      status: "present",
      attendance: "95%",
      notes: "",
    },
    {
      id: "S006",
      roll: 6,
      name: "Emily Clark",
      status: "absent",
      attendance: "73%",
      notes: "3rd absence this month",
    },
    {
      id: "S007",
      roll: 7,
      name: "Michael Rodriguez",
      status: "present",
      attendance: "89%",
      notes: "",
    },
    {
      id: "S008",
      roll: 8,
      name: "Jennifer Martinez",
      status: "present",
      attendance: "91%",
      notes: "",
    },
    {
      id: "S009",
      roll: 9,
      name: "David Anderson",
      status: "absent",
      attendance: "71%",
      notes: "Notice sent to parents",
    },
    {
      id: "S010",
      roll: 10,
      name: "Lisa White",
      status: "present",
      attendance: "94%",
      notes: "",
    },
  ]);

  const [filters, setFilters] = useState({
    division: "csa",
    subject: "db",
    date: "2025-03-21",
  });

  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    updateAttendanceCounter();
  }, [attendanceData, selectAll]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setAttendanceData((prevData) =>
      prevData.map((student) => ({
        ...student,
        status: isChecked ? "present" : student.status,
      }))
    );
  };

  const handleStudentCheckboxChange = (id) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === id
          ? {
              ...student,
              status: student.status === "present" ? "absent" : "present",
            }
          : student
      )
    );
  };

  const handleStatusChange = (id, status) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const handleNotesChange = (id, notes) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === id ? { ...student, notes } : student
      )
    );
  };

  const updateAttendanceCounter = () => {
    const totalStudents = attendanceData.length;
    const presentCount = attendanceData.filter(
      (student) => student.status === "present"
    ).length;
    const absentCount = attendanceData.filter(
      (student) => student.status === "absent"
    ).length;
    const lateCount = attendanceData.filter(
      (student) => student.status === "late"
    ).length;

    console.log(
      `Total: ${totalStudents} | Present: ${presentCount} | Absent: ${absentCount} | Late: ${lateCount}`
    );
  };

  const showStudentDetails = (studentId) => {
    const student = attendanceData.find((student) => student.id === studentId);
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const hideStudentDetails = () => {
    setModalVisible(false);
    setSelectedStudent(null);
  };

  const exportAttendanceData = () => {
    const csvContent = [
      [
        "Roll No",
        "Student Name",
        "Status",
        "Attendance %",
        "Notes",
        "Date",
      ].join(","),
      ...attendanceData.map((student) =>
        [
          student.roll,
          `"${student.name}"`,
          student.status,
          student.attendance,
          `"${student.notes}"`,
          filters.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${filters.date}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold">
          Teacher's Class Attendance Dashboard
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 p-5 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col">
          <div className="text-gray-500 text-sm mb-2">Division</div>
          <select
            name="division"
            className="p-2 border rounded"
            onChange={handleFilterChange}
          >
            <option value="csa">CSE-A</option>
            <option value="csb">CSE-B</option>
            <option value="csc">CSE-C</option>
            <option value="csd">CSE-D</option>
          </select>
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500 text-sm mb-2">Subject</div>
          <select
            name="subject"
            className="p-2 border rounded"
            onChange={handleFilterChange}
          >
            <option value="db">Database Management</option>
            <option value="os">Operating Systems</option>
            <option value="algo">Algorithms</option>
            <option value="net">Computer Networks</option>
          </select>
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500 text-sm mb-2">Date</div>
          <input
            type="date"
            name="date"
            className="p-2 border rounded"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <div className="text-gray-500 text-sm mb-2">Search Student</div>
          <input
            type="text"
            placeholder="Search by name, ID, or email"
            className="p-2 border rounded w-full"
          />
        </div>
        <button className="bg-blue-600 text-white p-2 rounded font-bold self-end">
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 text-sm mb-4">Today's Attendance</div>
          <div className="text-4xl font-bold text-blue-600 mb-4">87%</div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: "87%" }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">
            56 present out of 65 students
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 text-sm mb-4">Weekly Average</div>
          <div className="text-4xl font-bold text-green-500 mb-4">91%</div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: "91%" }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">March 15-21, 2025</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 text-sm mb-4">Monthly Average</div>
          <div className="text-4xl font-bold text-blue-500 mb-4">89%</div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: "89%" }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">March 2025</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 text-sm mb-4">Students Below 75%</div>
          <div className="text-4xl font-bold text-red-500 mb-4">4</div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: "6%" }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">Requiring attention</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">
          Mark Attendance - CSE-A, Database Management (March 21, 2025)
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white p-2 rounded font-bold"
            onClick={() =>
              setAttendanceData((prevData) =>
                prevData.map((student) => ({ ...student, status: "present" }))
              )
            }
          >
            All Present
          </button>
          <button
            className="flex items-center bg-purple-600 text-white p-2 rounded font-bold"
            onClick={exportAttendanceData}
          >
            <span>↓</span> Export
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="selectAll"
              className="w-4 h-4"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <label htmlFor="selectAll" className="ml-2">
              Select All
            </label>
          </div>
          <div>Total: 65 students | Present: 56 | Absent: 7 | Late: 2</div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                #
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                Roll
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                Student Name
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                Status
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                Current %
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((student) => (
              <tr key={student.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={student.status === "present"}
                    onChange={() => handleStudentCheckboxChange(student.id)}
                  />
                </td>
                <td>{student.roll}</td>
                <td
                  className="font-bold text-blue-600 cursor-pointer"
                  onClick={() => showStudentDetails(student.id)}
                >
                  {student.name}
                </td>
                <td>
                  <select
                    className="p-2 border rounded"
                    value={student.status}
                    onChange={(e) =>
                      handleStatusChange(student.id, e.target.value)
                    }
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
                <td>
                  <span
                    className={`p-2 rounded-full font-bold ${
                      student.attendance >= 75
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {student.attendance}
                  </span>
                </td>
                <td>
                  <input
                    type="text"
                    className="p-2 border rounded w-full"
                    value={student.notes}
                    onChange={(e) =>
                      handleNotesChange(student.id, e.target.value)
                    }
                    placeholder="Add note"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-2 mt-4">
          <button className="bg-green-500 text-white p-2 rounded font-bold">
            Save Attendance
          </button>
          <button
            className="bg-gray-200 text-gray-700 p-2 rounded font-bold"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
        </div>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold">
                Student Details: {selectedStudent?.name}
              </div>
              <button
                className="text-gray-500 text-2xl"
                onClick={hideStudentDetails}
              >
                &times;
              </button>
            </div>
            <div>
              <div className="flex gap-2 mb-4">
                <button
                  className={`p-2 rounded-full font-bold ${
                    selectedStudent?.attendance >= 75
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  Overview
                </button>
                <button className="p-2 rounded-full font-bold bg-gray-100 text-gray-500">
                  Attendance History
                </button>
                <button className="p-2 rounded-full font-bold bg-gray-100 text-gray-500">
                  Notes
                </button>
              </div>
              <div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-bold">
                    {selectedStudent?.name} (Roll No: {selectedStudent?.roll})
                  </div>
                  <div className="text-gray-500 text-sm">
                    Student ID: {selectedStudent?.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendanceDashboard;
