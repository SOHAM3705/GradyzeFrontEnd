import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";
import { AttendanceStatusBadge } from "./shared/AttendanceStatusBadge";

const Attendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const getAuthToken = () => sessionStorage.getItem("token");

  useEffect(() => {
    const fetchSubjects = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        setError("Teacher ID not found in session");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/subject-details/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubjects(response.data.subjects || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const fetchStudentsForClass = useCallback(async (subjectId) => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    const teacherId = sessionStorage.getItem("teacherId");
    if (!teacherId) {
      setError("Teacher ID not found in session");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/studentmanagement/students-by-subject/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSchedules = useCallback(async (subjectId) => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/schedules/class/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedules(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleSubjectSelect = useCallback(
    (subject) => {
      setSelectedSubject(subject);
      setSelectedSchedule(null);
      setError(null);
      loadSchedules(subject._id);
      fetchStudentsForClass(subject._id);
    },
    [loadSchedules, fetchStudentsForClass]
  );

  const handleScheduleSelect = useCallback((schedule) => {
    setSelectedSchedule(schedule);
    const scheduleDate = new Date(schedule.date).toISOString().split("T")[0];
    setSelectedDate(scheduleDate);
  }, []);

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
    const token = getAuthToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    if (!selectedSubject) {
      setError("Please select a subject first");
      return;
    }

    if (!selectedSchedule) {
      setError("Please select a schedule first");
      return;
    }

    if (Object.keys(attendanceData).length === 0) {
      setError("No students to mark attendance for");
      return;
    }

    const payload = {
      classId: selectedSubject._id,
      date: selectedDate,
      records: Object.values(attendanceData).map(({ student, status }) => ({
        studentId: student._id,
        studentName: student.name,
        status,
      })),
    };

    setLoading(true);
    try {
      await axios.post(
        "https://gradyzebackend.onrender.com/api/attendance",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.delete(
        `https://gradyzebackend.onrender.com/api/schedules/class/${selectedSubject._id}/${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError(null);
      alert("Attendance saved and schedule completed successfully!");
      loadSchedules(selectedSubject._id);
      setSelectedSchedule(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setLoading(false);
    }
  }, [
    selectedSubject,
    selectedSchedule,
    attendanceData,
    selectedDate,
    loadSchedules,
  ]);

  const filteredSchedules = schedules.filter((schedule) => {
    if (!selectedDate) return true;
    const scheduleDate = new Date(schedule.date).toISOString().split("T")[0];
    return scheduleDate === selectedDate;
  });

  const formatSubjectName = (subject) => {
    return `${subject.name} (${subject.year}, Sem ${subject.semester}, Div ${subject.division})`;
  };

  const formatTime = (time24h) => {
    if (!time24h) return "N/A";
    const [hours, minutes] = time24h.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const showAttendanceForm =
    selectedSubject && selectedSchedule && students.length > 0;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Schedule-Based Attendance Management
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Subjects</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : subjects.length > 0 ? (
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSubject?._id === subject._id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSubjectSelect(subject)}
                >
                  <h3 className="font-medium text-sm">
                    {formatSubjectName(subject)}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No subjects available</p>
          )}
        </div>

        <div className="lg:col-span-3">
          {selectedSubject ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Scheduled Classes - {formatSubjectName(selectedSubject)}
                  </h2>
                  <AttendanceDatePicker
                    selected={selectedDate ? new Date(selectedDate) : null}
                    onChange={(date) =>
                      setSelectedDate(date.toISOString().split("T")[0])
                    }
                    className="w-48"
                  />
                </div>

                {filteredSchedules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSchedules.map((schedule) => (
                      <div
                        key={schedule._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSchedule?._id === schedule._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => handleScheduleSelect(schedule)}
                      >
                        <h3 className="font-medium text-gray-900">
                          {schedule.title || "Class Session"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatTime(schedule.startTime)} -{" "}
                          {formatTime(schedule.endTime)}
                        </p>
                        {schedule.description && (
                          <p className="text-sm text-gray-500 mt-2">
                            {schedule.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No scheduled classes for the selected date
                  </div>
                )}
              </div>

              {showAttendanceForm && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                      Take Attendance -{" "}
                      {selectedSchedule.title || "Class Session"}
                    </h2>
                    <div className="text-sm text-gray-600">
                      {formatTime(selectedSchedule.startTime)} -{" "}
                      {formatTime(selectedSchedule.endTime)}
                    </div>
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
                              <div className="text-sm text-gray-500">
                                Roll: {student.rollNo}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <AttendanceStatusBadge
                                status={
                                  attendanceData[student._id]?.status ||
                                  "Present"
                                }
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleAttendance(student._id)}
                                className={`px-3 py-1 rounded-md text-sm ${
                                  attendanceData[student._id]?.status ===
                                  "Present"
                                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                                }`}
                              >
                                {attendanceData[student._id]?.status ===
                                "Present"
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
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Attendance"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                Please select a subject to view scheduled classes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
