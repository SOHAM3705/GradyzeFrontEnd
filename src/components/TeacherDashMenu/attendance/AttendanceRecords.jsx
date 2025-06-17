import React, { useContext, useState, useEffect, useMemo } from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";
import { AttendanceDatePicker, AttendanceStatusBadge } from "./shared";

const AttendanceRecords = () => {
  const {
    classes,
    attendanceRecords,
    fetchAttendanceRecords,
    loading,
    error: contextError,
    clearError,
  } = useContext(AttendanceContext);

  const [filters, setFilters] = useState({
    classId: "",
    startDate: "",
    endDate: new Date().toISOString().split("T")[0],
  });

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;

    attendanceRecords.forEach((record) => {
      record.records.forEach((student) => {
        student.status === "Present" ? present++ : absent++;
      });
    });

    const total = present + absent;
    return {
      totalPresent: present,
      totalAbsent: absent,
      attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0,
    };
  }, [attendanceRecords]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = useCallback(() => {
    clearError();
    fetchAttendanceRecords(filters.classId, filters.startDate, filters.endDate);
  }, [filters, fetchAttendanceRecords, clearError]);

  useEffect(() => {
    // Load initial data
    handleFilter();
  }, []); // Empty dependency array to run only once on mount

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

  const getClassName = useCallback(
    (classId) => {
      const foundClass = classes.find((c) => c._id === classId);
      return foundClass ? foundClass.className : "Unknown Class";
    },
    [classes]
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Attendance Records
      </h1>

      {contextError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {contextError}
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
            <AttendanceDatePicker
              label="From Date"
              name="startDate"
              value={filters.startDate}
              onChange={(e) => handleFilterChange({ target: e.target })}
            />
          </div>

          <div>
            <AttendanceDatePicker
              label="To Date"
              name="endDate"
              value={filters.endDate}
              onChange={(e) => handleFilterChange({ target: e.target })}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleFilter}
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
