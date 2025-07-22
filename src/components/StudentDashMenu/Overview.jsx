import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faTasks,
  faCalendarCheck,
  faCalculator,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const StudentDashboard = () => {
  const [activePeriod, setActivePeriod] = useState("Month");
  const [studentData, setStudentData] = useState(null);
  const [gradePerformance, setGradePerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with actual student ID from your auth system
  const studentId = "your-student-id";

  useEffect(() => {
    const fetchStudentOverview = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/student/overview/${studentId}`);
        setStudentData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentOverview();
  }, [studentId]);

  useEffect(() => {
    const fetchGradePerformance = async () => {
      try {
        if (!studentId) return;
        const response = await axios.get(
          `/api/student/grades/${studentId}/${activePeriod}`
        );
        setGradePerformance(response.data.gradePerformance || []);
      } catch (err) {
        console.error("Error fetching grade performance:", err);
        setGradePerformance([]);
      }
    };

    fetchGradePerformance();
  }, [activePeriod, studentId]);

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-8 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        No student data available
      </div>
    );
  }

  // Safely calculate trend indicators with fallbacks
  const getTrendIndicator = (current, previous) => {
    current = current || 0;
    previous = previous || 0;
    const difference = current - previous;
    if (difference > 0) {
      return {
        icon: faArrowUp,
        color: "text-green-500",
        text: `${Math.abs(difference).toFixed(1)}% from last period`,
      };
    } else if (difference < 0) {
      return {
        icon: faArrowDown,
        color: "text-red-500",
        text: `${Math.abs(difference).toFixed(1)}% from last period`,
      };
    }
    return {
      icon: null,
      color: "text-gray-500",
      text: "No change from last period",
    };
  };

  // Safely access nested properties with fallbacks
  const stats = studentData.stats || {};
  const trends = studentData.trends || {};
  const studentInfo = studentData.student || {};
  const upcomingDeadlines = studentData.upcomingDeadlines || [];

  const gpa = stats.gpa || 0;
  const attendanceRate = stats.attendanceRate || 0;
  const assignmentsDue = stats.assignmentsDue || 0;
  const gpaChange = trends.gpaChange || 0;
  const attendanceChange = trends.attendanceChange || 0;

  const gpaTrend = getTrendIndicator(gpa, gpa - gpaChange);
  const attendanceTrend = getTrendIndicator(
    attendanceRate,
    attendanceRate + attendanceChange
  );

  // For assignments due, we'll assume some previous value since backend doesn't provide it
  const assignmentsTrend =
    assignmentsDue > 3
      ? {
          icon: faArrowUp,
          color: "text-red-500",
          text: `${assignmentsDue - 3} more than last week`,
        }
      : {
          icon: faArrowDown,
          color: "text-green-500",
          text: `${3 - assignmentsDue} fewer than last week`,
        };

  // Normalize grade performance data for the chart
  const normalizedGrades = (gradePerformance || []).map((subject) => ({
    ...subject,
    normalizedHeight: `${subject.percentage || 0}%`,
    subject: subject.subject || "Unknown",
  }));

  // Fill with empty data if less than 5 subjects for the chart
  while (normalizedGrades.length < 5) {
    normalizedGrades.push({
      subject: `Subject ${normalizedGrades.length + 1}`,
      percentage: 0,
      normalizedHeight: "0%",
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-blue-700 relative inline-block mb-4 sm:mb-0">
          Overview
          <span className="block absolute w-[70%] h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded mt-2"></span>
        </h1>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for courses, assignments..."
              className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border rounded-lg shadow-sm w-60 sm:w-72 focus:outline-none focus:border-blue-300 focus:ring-blue-200 transition text-sm sm:text-base"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 p-1 sm:p-2 bg-white rounded-lg shadow-md cursor-pointer transition hover:shadow-lg">
            <div className="w-7 sm:w-9 h-7 sm:h-9 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg font-bold text-sm sm:text-lg">
              {studentInfo.name
                ? studentInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "S"}
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-sm sm:text-base">
                {studentInfo.name || "Student"}
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">
                {studentInfo.year ? `${studentInfo.year} Year` : ""}{" "}
                {studentInfo.division || ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md transition hover:shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div>
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
                Current GPA
              </h3>
              <p className="text-2xl sm:text-4xl font-bold text-gray-800 mt-1 sm:mt-2">
                {gpa.toFixed(1)}
              </p>
              {gpaTrend.icon && (
                <div className="flex items-center gap-2 text-xs sm:text-sm mt-1 sm:mt-2">
                  <FontAwesomeIcon
                    icon={gpaTrend.icon}
                    className={gpaTrend.color}
                  />
                  <span className={gpaTrend.color}>{gpaTrend.text}</span>
                </div>
              )}
            </div>
            <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1 sm:h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${(gpa / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md transition hover:shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div>
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
                Assignments Due
              </h3>
              <p className="text-2xl sm:text-4xl font-bold text-gray-800 mt-1 sm:mt-2">
                {assignmentsDue}
              </p>
              {assignmentsTrend.icon && (
                <div className="flex items-center gap-2 text-xs sm:text-sm mt-1 sm:mt-2">
                  <FontAwesomeIcon
                    icon={assignmentsTrend.icon}
                    className={assignmentsTrend.color}
                  />
                  <span className={assignmentsTrend.color}>
                    {assignmentsTrend.text}
                  </span>
                </div>
              )}
            </div>
            <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faTasks} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1 sm:h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${Math.min((assignmentsDue / 10) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md transition hover:shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div>
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
                Attendance Rate
              </h3>
              <p className="text-2xl sm:text-4xl font-bold text-gray-800 mt-1 sm:mt-2">
                {attendanceRate}%
              </p>
              {attendanceTrend.icon && (
                <div className="flex items-center gap-2 text-xs sm:text-sm mt-1 sm:mt-2">
                  <FontAwesomeIcon
                    icon={attendanceTrend.icon}
                    className={attendanceTrend.color}
                  />
                  <span className={attendanceTrend.color}>
                    {attendanceTrend.text}
                  </span>
                </div>
              )}
            </div>
            <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1 sm:h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${attendanceRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md transition hover:shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">
              Grade Performance
            </h2>
            <div className="flex gap-1 sm:gap-2">
              {["Week", "Month", "Semester"].map((period) => (
                <button
                  key={period}
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition text-xs sm:text-sm ${
                    activePeriod === period
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePeriodChange(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-end h-40 sm:h-64 px-2 sm:px-4">
            {normalizedGrades.slice(0, 5).map((subject, index) => (
              <div
                key={index}
                className="flex flex-col items-center w-10 sm:w-14"
              >
                <div
                  className="w-2 sm:w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                  style={{ height: subject.normalizedHeight }}
                ></div>
                <p className="text-gray-600 text-xs mt-1 sm:mt-2">
                  {subject.subject.length > 8
                    ? `${subject.subject.substring(0, 5)}...`
                    : subject.subject}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-2 sm:px-4 mt-2 sm:mt-4 text-gray-500 text-xs">
            <span>0</span>
            <span>Course Grades (%)</span>
            <span>100</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md transition hover:shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">
            Upcoming Deadlines
          </h2>
          <div className="space-y-2 sm:space-y-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 sm:p-4 bg-white border rounded-lg shadow-sm transition hover:shadow-md"
                >
                  <div className="w-7 sm:w-10 h-7 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg mr-2 sm:mr-4">
                    <FontAwesomeIcon icon={faCalculator} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {deadline.title || "Assignment"}
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {deadline.subject || "General"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
