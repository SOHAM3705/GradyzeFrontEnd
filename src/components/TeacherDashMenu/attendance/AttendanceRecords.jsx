import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";
import { AttendanceStatusBadge } from "./shared/AttendanceStatusBadge";

const AttendanceRecords = () => {
  const [classes, setClasses] = useState([]);
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
    startDate: "",
    endDate: new Date().toISOString().split("T")[0],
  });

  const [editMode, setEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [timeData, setTimeData] = useState({
    startTime: "09:00",
    endTime: "10:00",
  });

  const getAuthToken = () => sessionStorage.getItem("token");

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

  const fetchAttendanceRecords = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const params = {
        year: filters.year,
        division: filters.division,
        subjectName: filters.subjectName,
        teacherId: sessionStorage.getItem("teacherId"), // Ensure filtering by correct teacher
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      const response = await axios.get(
        "https://gradyzebackend.onrender.com/api/attendance",
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttendanceRecords(response.data);
      setError(null);

      // Calculate statistics
      let present = 0;
      let absent = 0;

      response.data.forEach((record) => {
        record.records.forEach((item) => {
          item.status === "Present" ? present++ : absent++;
        });
      });

      const total = present + absent;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      setStats({
        present,
        absent,
        percentage,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load attendance records"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const initializeEditMode = useCallback((record) => {
    if (!record) return;

    const initialData = {};
    record.records.forEach((item) => {
      initialData[item.studentId] = {
        status: item.status,
        studentName: item.studentName,
      };
    });

    setAttendanceData(initialData);
    setCurrentRecord(record);
    setTimeData({
      startTime: record.startTime || "09:00",
      endTime: record.endTime || "10:00",
    });
    setEditMode(true);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleDateChange = (date, field) => {
    if (date instanceof Date) {
      setFilters((prev) => ({
        ...prev,
        [field]: date.toISOString().split("T")[0],
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

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTimeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAttendance = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication required");
      return;
    }

    if (!filters.classId) {
      setError("Please select a class");
      return;
    }

    // Find the class details from the classes array
    const classInfo = classes.find(
      (c) => c._id === (currentRecord?.classId || filters.classId)
    );
    if (!classInfo) {
      setError("Class information not found");
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
        year: classInfo.year,
        division: classInfo.division,
        subjectName: classInfo.name,
        teacherId: sessionStorage.getItem("teacherId"),
        teacherName: sessionStorage.getItem("teacherName"),
        date: currentRecord?.date || new Date().toISOString().split("T")[0],
        startTime: timeData.startTime,
        endTime: timeData.endTime,
        records,
      };

      const response = await axios.put(
        `https://gradyzebackend.onrender.com/api/attendance/${currentRecord._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage(`Attendance updated successfully!`);
      setEditMode(false);
      await fetchAttendanceRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
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
        `https://gradyzebackend.onrender.com/api/attendance/${recordId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Attendance record deleted successfully!");
      await fetchAttendanceRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete record");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentRecord(null);
  };

  const getClassName = (record) => {
    if (!record) return "No Class Assigned";

    // Use the subjectName directly from the record
    return `${record.subjectName} (${record.year}, Div: ${record.division})`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Attendance Records
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              From Date
            </label>
            <AttendanceDatePicker
              selected={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(date) => handleDateChange(date, "startDate")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <AttendanceDatePicker
              selected={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(date) => handleDateChange(date, "endDate")}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchAttendanceRecords}
              disabled={loading || !filters.classId}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Filter Records"}
            </button>
          </div>
        </div>

        {attendanceRecords.length > 0 && (
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

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Attendance Records</h2>
        </div>

        {loading && attendanceRecords.length === 0 ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : attendanceRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present/Absent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => {
                  const presentCount = record.records.filter(
                    (r) => r.status === "Present"
                  ).length;
                  const absentCount = record.records.filter(
                    (r) => r.status === "Absent"
                  ).length;

                  return (
                    <tr key={record._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(record.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getClassName(record)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {record.startTime} - {record.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <span className="text-green-600">
                            {presentCount} Present
                          </span>
                          <span className="text-red-600">
                            {absentCount} Absent
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => initializeEditMode(record)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          disabled={loading}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {filters.classId
              ? "No attendance records found"
              : "Please select a class and date range"}
          </div>
        )}
      </div>

      {editMode && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Update Attendance
              </h2>
              <p className="text-sm text-gray-600">
                {getClassName(currentRecord?.classId || filters.classId)}
              </p>
              <p className="text-sm text-gray-600">
                Date:{" "}
                {currentRecord
                  ? formatDate(currentRecord.date)
                  : formatDate(new Date())}
              </p>
            </div>

            <div className="flex space-x-2">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={timeData.startTime}
                onChange={handleTimeChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={timeData.endTime}
                onChange={handleTimeChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : currentRecord?.records?.length > 0 ? (
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
                  {currentRecord.records.map((student) => (
                    <tr key={student.studentId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.studentName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AttendanceStatusBadge
                          status={
                            attendanceData[student.studentId]?.status ||
                            "Present"
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            toggleAttendanceStatus(student.studentId)
                          }
                          className={`px-3 py-1 rounded-md text-sm ${
                            attendanceData[student.studentId]?.status ===
                            "Present"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {attendanceData[student.studentId]?.status ===
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              No attendance data found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
