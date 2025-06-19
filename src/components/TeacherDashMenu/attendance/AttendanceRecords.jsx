import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";
import { AttendanceStatusBadge } from "./shared/AttendanceStatusBadge";

const AttendanceRecords = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    percentage: 0,
  });

  const [filters, setFilters] = useState({
    classId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [editMode, setEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});

  // Get auth token from session storage
  const getAuthToken = () => sessionStorage.getItem("token");

  // Fetch all classes for the teacher
  useEffect(() => {
    const fetchClasses = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      const token = getAuthToken();
      if (!token || !teacherId) {
        setError("Authentication required");
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
        setClasses(response.data.subjects || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!filters.classId) return;

      const token = getAuthToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/students-by-subject/${filters.classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(response.data.studentData[filters.classId] || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [filters.classId]);

  // Fetch attendance records when filters change
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!filters.classId || !filters.date) return;

      const token = getAuthToken();
      if (!token) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/attendance`,
          {
            params: {
              classId: filters.classId,
              startDate: filters.date,
              endDate: filters.date,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.length > 0) {
          const record = response.data[0];
          setCurrentRecord(record);
          const initialData = {};

          // Initialize attendance data from existing record
          record.records.forEach((item) => {
            initialData[item.studentId] = {
              status: item.status,
              studentName: item.studentName,
            };
          });

          setAttendanceData(initialData);
        } else {
          setCurrentRecord(null);
          // Initialize empty attendance data
          const initialData = {};
          students.forEach((student) => {
            initialData[student._id] = {
              status: "Present",
              studentName: student.name,
            };
          });
          setAttendanceData(initialData);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [filters, students]);

  // Calculate statistics
  useEffect(() => {
    if (Object.keys(attendanceData).length === 0) return;

    let present = 0;
    let absent = 0;

    Object.values(attendanceData).forEach((item) => {
      if (item.status === "Present") present++;
      else absent++;
    });

    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    setStats({
      present,
      absent,
      percentage,
    });
  }, [attendanceData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleDateChange = (date) => {
    if (date instanceof Date) {
      setFilters((prev) => ({
        ...prev,
        date: date.toISOString().split("T")[0],
      }));
    }
  };

  const toggleAttendanceStatus = (studentId) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId].status === "Present" ? "Absent" : "Present",
      },
    }));
  };

  const handleSaveAttendance = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication required");
      return;
    }

    if (!filters.classId || !filters.date) {
      setError("Please select a class and date");
      return;
    }

    const records = Object.entries(attendanceData).map(([studentId, data]) => ({
      studentId,
      studentName: data.studentName,
      status: data.status,
    }));

    setLoading(true);
    try {
      const payload = {
        classId: filters.classId,
        date: filters.date,
        records,
      };

      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/attendance",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Attendance saved successfully!");
      setCurrentRecord(response.data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!currentRecord) return;

    const token = getAuthToken();
    if (!token) {
      setError("Authentication required");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        `https://gradyzebackend.onrender.com/api/attendance/${currentRecord._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Attendance record deleted successfully!");
      setCurrentRecord(null);
      // Reset attendance data to default (all present)
      const initialData = {};
      students.forEach((student) => {
        initialData[student._id] = {
          status: "Present",
          studentName: student.name,
        };
      });
      setAttendanceData(initialData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete record");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    if (currentRecord) {
      const initialData = {};
      currentRecord.records.forEach((item) => {
        initialData[item.studentId] = {
          status: item.status,
          studentName: item.studentName,
        };
      });
      setAttendanceData(initialData);
    }
    setEditMode(false);
  };

  const getClassName = (classId) => {
    const classInfo = classes.find((c) => c._id === classId);
    return classInfo
      ? `${classInfo.name} (${classInfo.year}, Div: ${classInfo.division})`
      : "Unknown Class";
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Attendance Recording
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              name="classId"
              value={filters.classId}
              onChange={handleFilterChange}
              disabled={loading || classes.length === 0}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.year}, Div: {cls.division})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <AttendanceDatePicker
              selected={filters.date ? new Date(filters.date) : null}
              onChange={handleDateChange}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setError(null);
                setSuccessMessage(null);
              }}
              disabled={loading || !filters.classId}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        {filters.classId && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Present</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.present}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Absent</h3>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">
                Attendance %
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.percentage}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Recording Area */}
      {filters.classId && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {getClassName(filters.classId)} -{" "}
              {new Date(filters.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </h2>

            <div className="flex space-x-2">
              {currentRecord && !editMode && (
                <>
                  <button
                    onClick={handleEditRecord}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteRecord}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </>
              )}

              {editMode && (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAttendance}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}

              {!currentRecord && !editMode && (
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Attendance"}
                </button>
              )}
            </div>
          </div>

          {loading && students.length === 0 ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AttendanceStatusBadge
                          status={
                            attendanceData[student._id]?.status || "Present"
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(editMode || !currentRecord) && (
                          <button
                            onClick={() => toggleAttendanceStatus(student._id)}
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
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No students found for this class
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
