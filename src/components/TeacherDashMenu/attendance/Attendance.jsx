import React, { useContext, useState, useEffect, useCallback } from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";
import { AttendanceStatusBadge } from "./shared/AttendanceStatusBadge";

const Attendance = () => {
  const {
    classes,
    students,
    loading,
    loadStudents,
    saveAttendance,
    error: contextError,
    clearError,
  } = useContext(AttendanceContext);

  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [localError, setLocalError] = useState(null);

  // Initialize attendance data
  useEffect(() => {
    if (students.length > 0) {
      const initialAttendance = students.reduce(
        (acc, student) => ({
          ...acc,
          [student._id]: { status: "Present", student },
        }),
        {}
      );
      setAttendanceData(initialAttendance);
    }
  }, [students]);

  const handleClassSelect = useCallback(
    (classItem) => {
      setSelectedClass(classItem);
      clearError();
      loadStudents(classItem._id);
    },
    [loadStudents, clearError]
  );

  const toggleAttendance = useCallback((studentId) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId]?.status === "Present" ? "Absent" : "Present",
      },
    }));
  }, []);

  const handleSaveAttendance = useCallback(async () => {
    if (!selectedClass) {
      setLocalError("Please select a class first");
      return;
    }

    if (Object.keys(attendanceData).length === 0) {
      setLocalError("No students to mark attendance for");
      return;
    }

    const payload = {
      classId: selectedClass._id,
      date: selectedDate,
      records: Object.values(attendanceData).map(({ student, status }) => ({
        studentId: student._id,
        studentName: student.name,
        status,
      })),
    };

    try {
      await saveAttendance(payload);
      setLocalError(null);
    } catch (err) {
      setLocalError(err.message || "Failed to save attendance");
    }
  }, [selectedClass, attendanceData, selectedDate, saveAttendance]);

  const error = localError || contextError;
  const showAttendanceForm = selectedClass && students.length > 0;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Attendance Management
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Class Selection */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Classes</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : classes.length > 0 ? (
            <div className="space-y-2">
              {classes.map((classItem) => (
                <div
                  key={classItem._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedClass?._id === classItem._id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleClassSelect(classItem)}
                >
                  <h3 className="font-medium">{classItem.className}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No classes available</p>
          )}
        </div>

        {/* Attendance Form */}
        <div className="lg:col-span-3">
          {showAttendanceForm ? (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedClass.className} - Attendance
                </h2>
                <AttendanceDatePicker
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <AttendanceStatusBadge
                            status={
                              attendanceData[student._id]?.status || "Absent"
                            }
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleAttendance(student._id)}
                            className={`px-3 py-1 rounded-md text-sm ${
                              attendanceData[student._id]?.status === "Present"
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                            }`}
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
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                {selectedClass
                  ? "No students found in this class"
                  : "Please select a class to take attendance"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
