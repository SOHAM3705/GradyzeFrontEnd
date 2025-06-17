// Attendance.jsx (Updated)
import React, { useContext, useState, useEffect } from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";

const Attendance = () => {
  const {
    classes,
    students,
    loading,
    loadStudents,
    saveAttendance,
    schedules,
  } = useContext(AttendanceContext);

  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    // Initialize attendance data when students change
    if (students.length > 0) {
      const initialAttendance = {};
      students.forEach((student) => {
        initialAttendance[student._id] = {
          status: "Present",
          student,
        };
      });
      setAttendanceData(initialAttendance);
    }
  }, [students]);

  // Handle class selection and load students for that class
  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    loadStudents(classItem._id);
  };

  // Toggle attendance status
  const toggleAttendance = (studentId) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId]?.status === "Present" ? "Absent" : "Present",
      },
    }));
  };

  // Save attendance to the backend
  const saveAttendanceData = () => {
    if (!selectedClass) {
      alert("Please select a class first");
      return;
    }

    if (Object.keys(attendanceData).length === 0) {
      alert("No students to mark attendance for");
      return;
    }

    const attendancePayload = {
      classId: selectedClass._id,
      date: selectedDate,
      records: Object.values(attendanceData).map((data) => ({
        studentId: data.student._id,
        studentName: data.student.name,
        status: data.status,
      })),
    };

    saveAttendance(attendancePayload);
    alert("Attendance Saved Successfully!");
  };

  // Check if a class is selected
  const showAttendanceForm = selectedClass && students.length > 0;

  return (
    <div className="attendance-system">
      <div className="class-list">
        <h3>Available Classes</h3>
        {loading ? (
          <p>Loading classes...</p>
        ) : classes.length > 0 ? (
          classes.map((classItem) => (
            <div
              key={classItem._id}
              className={`class-item ${
                selectedClass && selectedClass._id === classItem._id
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleClassSelect(classItem)}
            >
              {classItem.className}
            </div>
          ))
        ) : (
          <p>No classes available. Please add a class first.</p>
        )}
      </div>

      {showAttendanceForm ? (
        <div className="attendance-list">
          <h3>{selectedClass.className} - Attendance</h3>

          <div className="form-group">
            <label htmlFor="attendanceDate">Select Date</label>
            <input
              type="date"
              id="attendanceDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td
                    className={
                      attendanceData[student._id]?.status === "Present"
                        ? "present-status"
                        : "absent-status"
                    }
                  >
                    {attendanceData[student._id]?.status || "Absent"}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleAttendance(student._id)}
                      className={
                        attendanceData[student._id]?.status === "Present"
                          ? "btn-absent"
                          : "btn-present"
                      }
                    >
                      {attendanceData[student._id]?.status === "Present"
                        ? "Mark Absent"
                        : "Mark Present"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={saveAttendanceData} className="btn-save">
            Save Attendance
          </button>
        </div>
      ) : selectedClass && students.length === 0 ? (
        <div className="attendance-list">
          <p>No students found in this class. Please add students first.</p>
        </div>
      ) : (
        <div className="attendance-list">
          <p>Please select a class to take attendance.</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
