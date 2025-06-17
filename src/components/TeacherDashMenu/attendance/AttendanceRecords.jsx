// AttendanceRecords.jsx
import React, { useContext, useState, useEffect } from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";

const AttendanceRecords = () => {
  const { classes, attendanceRecords, fetchAttendanceRecords, loading } =
    useContext(AttendanceContext);

  const [filters, setFilters] = useState({
    classId: "",
    startDate: "",
    endDate: new Date().toISOString().split("T")[0], // Today's date as default end date
  });

  // Stats for the attendance
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    // Calculate stats whenever attendance records change
    if (attendanceRecords.length > 0) {
      let present = 0;
      let absent = 0;

      attendanceRecords.forEach((record) => {
        record.records.forEach((student) => {
          if (student.status === "Present") {
            present++;
          } else {
            absent++;
          }
        });
      });

      const total = present + absent;
      const rate = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

      setStats({
        totalPresent: present,
        totalAbsent: absent,
        attendanceRate: rate,
      });
    }
  }, [attendanceRecords]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilter = () => {
    fetchAttendanceRecords(filters.classId, filters.startDate, filters.endDate);
  };

  return (
    <div className="records-container">
      <h3>Attendance Records</h3>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="classId">Class</label>
          <select
            id="classId"
            name="classId"
            value={filters.classId}
            onChange={handleFilterChange}
          >
            <option value="">All Classes</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="startDate">From Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="endDate">To Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <button
          className="btn-filter"
          onClick={handleFilter}
          disabled={loading}
        >
          {loading ? "Loading..." : "Filter Records"}
        </button>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : attendanceRecords.length > 0 ? (
        <>
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Student Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) =>
                record.records.map((student, index) => (
                  <tr key={`${record._id}-${index}`}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      {classes.find((c) => c._id === record.classId)
                        ?.className || "Unknown"}
                    </td>
                    <td>{student.studentName}</td>
                    <td
                      className={
                        student.status === "Present"
                          ? "present-status"
                          : "absent-status"
                      }
                    >
                      {student.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="stats-container">
            <div className="stat-card present-stat">
              <h4>Total Present</h4>
              <div className="stat-value">{stats.totalPresent}</div>
            </div>

            <div className="stat-card absent-stat">
              <h4>Total Absent</h4>
              <div className="stat-value">{stats.totalAbsent}</div>
            </div>

            <div className="stat-card">
              <h4>Attendance Rate</h4>
              <div className="stat-value">{stats.attendanceRate}%</div>
            </div>
          </div>
        </>
      ) : (
        <p>No attendance records found. Try adjusting your filters.</p>
      )}
    </div>
  );
};

export default AttendanceRecords;
