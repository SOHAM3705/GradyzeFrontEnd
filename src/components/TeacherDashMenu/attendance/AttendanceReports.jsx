import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendanceReport = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [summaryData, setSummaryData] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    totalWorkingDays: 0,
  });

  const teacherId = sessionStorage.getItem("teacherId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const divisionInfo = await fetchAssignedDivision();
        await fetchStudentsAndSubjects(divisionInfo);

        // Set default date range to current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setDateRange({
          startDate: firstDay.toISOString().split("T")[0],
          endDate: lastDay.toISOString().split("T")[0],
        });
      } catch (error) {
        console.error("Error initializing data:", error);
        toast.error("Failed to initialize data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    updateSummary();
    filterStudents();
  }, [students, attendanceData, searchQuery]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate && division && year) {
      fetchAttendanceData();
    }
  }, [dateRange, division, year]);

  const fetchAssignedDivision = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teachermarks/${teacherId}/divisions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDivision(response.data.division);
      setYear(response.data.year);
      return response.data;
    } catch (error) {
      console.error("Error fetching assigned division:", error);
      toast.error("Failed to fetch division information");
      throw error;
    }
  };

  const fetchStudentsAndSubjects = async (divisionInfo) => {
    try {
      const token = sessionStorage.getItem("token");
      const assignedYear = divisionInfo?.year || year;
      const assignedDivision = divisionInfo?.division || division;

      const [studentsResponse, subjectsResponse] = await Promise.all([
        axios.get(
          `https://gradyzebackend.onrender.com/api/teachermarks/${teacherId}/class-students`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { year: assignedYear, division: assignedDivision },
          }
        ),
        axios.get(
          `https://gradyzebackend.onrender.com/api/subjects/class-subjects`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { year: assignedYear, division: assignedDivision },
          }
        ),
      ]);

      setStudents(studentsResponse.data.students || []);
      setSubjects(subjectsResponse.data || []);
    } catch (error) {
      console.error("Error fetching students and subjects:", error);
      toast.error("Failed to fetch student data");
      throw error;
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/attendance/class-attendance`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            year,
            division,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        }
      );

      // Process attendance data based on the schema
      const processedAttendance = {};
      const subjectDays = {};

      response.data.forEach((attendance) => {
        const date = new Date(attendance.date).toISOString().split("T")[0];
        const subject = attendance.subjectName || "General";

        if (!subjectDays[subject]) {
          subjectDays[subject] = new Set();
        }
        subjectDays[subject].add(date);

        attendance.records.forEach((record) => {
          if (!processedAttendance[record.studentId]) {
            processedAttendance[record.studentId] = {};
          }

          if (!processedAttendance[record.studentId][subject]) {
            processedAttendance[record.studentId][subject] = {
              present: 0,
              total: 0,
            };
          }

          processedAttendance[record.studentId][subject].total += 1;
          if (record.status === "Present") {
            processedAttendance[record.studentId][subject].present += 1;
          }
        });
      });

      setAttendanceData({
        studentAttendance: processedAttendance,
        subjectDays,
      });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Failed to fetch attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSummary = () => {
    const totalStudents = students.length;
    let totalAttendancePercentage = 0;
    let studentsWithData = 0;
    let totalWorkingDays = 0;

    if (attendanceData.subjectDays) {
      const allDays = new Set();
      Object.values(attendanceData.subjectDays).forEach((daySet) => {
        daySet.forEach((day) => allDays.add(day));
      });
      totalWorkingDays = allDays.size;
    }

    students.forEach((student) => {
      const studentAttendance = attendanceData.studentAttendance?.[student._id];
      if (studentAttendance) {
        let studentTotal = 0;
        let studentPresent = 0;

        Object.values(studentAttendance).forEach((subjectData) => {
          studentTotal += subjectData.total;
          studentPresent += subjectData.present;
        });

        if (studentTotal > 0) {
          totalAttendancePercentage += (studentPresent / studentTotal) * 100;
          studentsWithData++;
        }
      }
    });

    setSummaryData({
      totalStudents,
      averageAttendance:
        studentsWithData > 0 ? totalAttendancePercentage / studentsWithData : 0,
      totalWorkingDays,
    });
  };

  const filterStudents = () => {
    let filtered = students
      .filter((student) => {
        const matchesSearch =
          student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNo?.toString().includes(searchQuery);
        return matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setFilteredStudents(filtered);
  };

  const calculateAttendancePercentage = (present, total) => {
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const handleExportAttendance = async (exportType) => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/attendance/export-attendance`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            year,
            division,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            exportType,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Attendance_${year}_${division}_${dateRange.startDate}_to_${dateRange.endDate}.${exportType}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Attendance report exported successfully!");
    } catch (error) {
      console.error("Error exporting attendance:", error);
      toast.error("Failed to export attendance report");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStudents = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={subjects.length + 4} className="text-center py-4">
            <ClipLoader size={30} color="#3B82F6" />
          </td>
        </tr>
      );
    }

    if (filteredStudents.length === 0) {
      return (
        <tr>
          <td colSpan={subjects.length + 4} className="text-center py-4">
            No students found
          </td>
        </tr>
      );
    }

    return filteredStudents.map((student) => {
      const studentAttendance =
        attendanceData.studentAttendance?.[student._id] || {};
      let overallPresent = 0;
      let overallTotal = 0;

      const subjectCells = subjects.map((subject) => {
        const subjectAttendance = studentAttendance[subject.name] || {
          present: 0,
          total: 0,
        };
        const percentage = calculateAttendancePercentage(
          subjectAttendance.present,
          subjectAttendance.total
        );

        overallPresent += subjectAttendance.present;
        overallTotal += subjectAttendance.total;

        return (
          <td key={subject._id} className="p-2 text-center border">
            <div className={getAttendanceColor(percentage)}>
              <div className="font-semibold">{percentage}%</div>
              <div className="text-xs text-gray-500">
                {subjectAttendance.present}/{subjectAttendance.total}
              </div>
            </div>
          </td>
        );
      });

      const overallPercentage = calculateAttendancePercentage(
        overallPresent,
        overallTotal
      );

      return (
        <tr key={student._id} className="border-b hover:bg-gray-100">
          <td className="p-2 border">{student.rollNo}</td>
          <td className="p-2 border">{student.name}</td>
          {subjectCells}
          <td
            className={`p-2 border font-semibold text-center bg-gray-50 ${getAttendanceColor(
              overallPercentage
            )}`}
          >
            <div className="font-bold">{overallPercentage}%</div>
            <div className="text-xs text-gray-500">
              {overallPresent}/{overallTotal}
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-600">Class</label>
          <span className="p-2 border rounded bg-white">
            {year} - {division}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-600">Start Date</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="p-2 border rounded"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-600">End Date</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total Students</h3>
          <p className="text-2xl font-bold">{summaryData.totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Average Attendance</h3>
          <p
            className={`text-2xl font-bold ${getAttendanceColor(
              summaryData.averageAttendance
            )}`}
          >
            {summaryData.averageAttendance.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Working Days</h3>
          <p className="text-2xl font-bold">{summaryData.totalWorkingDays}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Date Range</h3>
          <p className="text-sm text-gray-600">
            {dateRange.startDate} to {dateRange.endDate}
          </p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Student Attendance Report</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => handleExportAttendance("pdf")}
                disabled={isLoading}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-red-600"
              >
                {isLoading ? "Exporting..." : "Export PDF"}
              </button>
              <button
                onClick={() => handleExportAttendance("excel")}
                disabled={isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-600"
              >
                {isLoading ? "Exporting..." : "Export Excel"}
              </button>
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>≥90% (Excellent)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>75-89% (Good)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>&lt;75% (Needs Improvement)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left border">Roll No.</th>
                <th className="p-2 text-left border">Student Name</th>
                {subjects.map((subject) => (
                  <th
                    key={subject._id || subject.name}
                    className="p-2 text-center border"
                  >
                    <div>{subject.name}</div>
                    <div className="text-xs font-normal">Attendance %</div>
                  </th>
                ))}
                <th className="p-2 text-center border bg-gray-100">
                  <div>Overall</div>
                  <div className="text-xs font-normal">Attendance %</div>
                </th>
              </tr>
            </thead>
            <tbody>{renderStudents()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
