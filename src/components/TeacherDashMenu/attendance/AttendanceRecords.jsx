import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";
import { AttendanceStatusBadge } from "./shared/AttendanceStatusBadge";

const AttendanceRecords = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    attendanceRate: 0,
  });

  const [filters, setFilters] = useState({
    classId: "",
    startDate: "",
    endDate: new Date().toISOString().split("T")[0],
  });

  // Get authorization token from session storage
  const getAuthToken = () => {
    return sessionStorage.getItem("token");
  };

  const fetchClasses = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "https://gradyzebackend.onrender.com/api/studentmanagement/classes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClasses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const params = {};
      if (filters.classId) params.classId = filters.classId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

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
      calculateStats(response.data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load attendance records"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const calculateStats = (records) => {
    let present = 0;
    let absent = 0;

    records.forEach((record) => {
      record.records.forEach((student) => {
        student.status === "Present" ? present++ : absent++;
      });
    });

    const total = present + absent;
    setStats({
      totalPresent: present,
      totalAbsent: absent,
      attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteSchedule = async (classId, date) => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      await axios.delete(
        `https://gradyzebackend.onrender.com/api/schedules/class/${classId}/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchAttendanceRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      fetchAttendanceRecords();
    }
  }, [fetchAttendanceRecords, classes]);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const matchesClass =
        !filters.classId || record.classId === filters.classId;
      const recordDate = new Date(record.date).toISOString().split("T")[0];
      const matchesDate =
        (!filters.startDate || recordDate >= filters.startDate) &&
        (!filters.endDate || recordDate <= filters.endDate);
      return matchesClass && matchesDate;
    });
  }, [attendanceRecords, filters]);

  const getClassName = (classId) => {
    const foundClass = classes.find((c) => c._id === classId);
    return foundClass ? foundClass.className : "Unknown Class";
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

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              name="classId"
              value={filters.classId}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={loading}
            >
              <option value="">All Classes</option>
              {classes.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.className}
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
              onChange={(date) =>
                handleFilterChange({
                  target: {
                    name: "startDate",
                    value: date.toISOString().split("T")[0],
                  },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <AttendanceDatePicker
              selected={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(date) =>
                handleFilterChange({
                  target: {
                    name: "endDate",
                    value: date.toISOString().split("T")[0],
                  },
                })
              }
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchAttendanceRecords}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Filtering..." : "Filter Records"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">
              Total Present
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalPresent}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800">Total Absent</h3>
            <p className="text-2xl font-bold text-red-600">
              {stats.totalAbsent}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">
              Attendance Rate
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {stats.attendanceRate}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRecords.length > 0 ? (
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
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.flatMap((record) =>
                  record.records.map((student, idx) => (
                    <tr key={`${record._id}-${idx}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getClassName(record.classId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AttendanceStatusBadge status={student.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() =>
                            handleDeleteSchedule(record.classId, record.date)
                          }
                          disabled={loading}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No attendance records found
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;
