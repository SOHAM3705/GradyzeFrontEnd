import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faChartBar,
  faPercentage,
  faArrowUp,
  faArrowDown,
  faFileExport,
  faUsers,
  faFileAlt,
  faBell,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import axios from "axios";

const TeacherOverview = () => {
  const [activeTab, setActiveTab] = useState("All Classes");
  const [activeExamType, setActiveExamType] = useState("unit-test"); // default
  const [performanceData, setPerformanceData] = useState({
    examType: "unit-test",
    totalStudents: 0,
    overallPercent: 0,
    subjectAverages: [],
  });
  const [lectureStats, setLectureStats] = useState(0);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handlePeriodClick = (period) => {
    setActivePeriod(period);
  };
  const [overviewStats, setOverviewStats] = useState({
    totalStudents: 0,
    averageScore: 0,
    subjectAverages: [],
  });

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const teacherId = sessionStorage.getItem("teacherId");
        if (!teacherId) return;

        const res = await axios.get(
          `${API_BASE_URL}/api/teacher/performance/${teacherId}?examType=${activeExamType}`
        );
        setPerformanceData(res.data);
      } catch (err) {
        console.error("Error fetching class performance", err);
      }
    };

    fetchPerformance();
  }, [activeExamType]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const teacherId = sessionStorage.getItem("teacherId"); // Or get from context
        const res = await axios.get(
          `${API_BASE_URL}/api/teacher/overview-stats/${teacherId}`
        );
        setOverviewStats(res.data);
      } catch (err) {
        console.error("Error fetching teacher stats", err);
      }
    };

    fetchStats();
  }, []);

  const fetchLectureStats = async () => {
    try {
      const teacherId = sessionStorage.getItem("teacherId");
      const res = await axios.get(
        `${API_BASE_URL}/api/teacher/lectures-held/${teacherId}`
      );
      setLectureStats(res.data.totalLectures);
    } catch (err) {
      console.error("Error fetching lectures held", err);
    }
  };

  fetchLectureStats();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-100">
        {/* Page Heading */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-teal-700 relative">
            Overview
            <span className="absolute bottom-[-8px] left-0 w-[70%] h-1 bg-gradient-to-r from-teal-700 to-teal-700 rounded-sm"></span>
          </h1>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Students */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Students
                </h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {overviewStats.totalStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg shadow-md">
                <FontAwesomeIcon icon={faUserGraduate} />
              </div>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-700 to-teal-700 h-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>

          {/* Average Class Score */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Average Class Score
                </h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {overviewStats.averageScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg shadow-md">
                <FontAwesomeIcon icon={faPercentage} />
              </div>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-700 to-teal-700 h-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>

          {/* Lectures Held */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Lectures Held
                </h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {lectureStats}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <FontAwesomeIcon
                    icon={faArrowUp}
                    className="text-green-500"
                  />
                  <span className="text-green-500">This academic term</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg shadow-md">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-700 to-teal-700 h-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Class Performance */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Class Performance
            </h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 overflow-hidden">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                <button
                  type="button"
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-md text-center ${
                    activeExamType === "unit-test"
                      ? "bg-teal-700 text-white font-medium"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveExamType("unit-test")}
                >
                  Unit Test
                </button>
                <button
                  type="button"
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-md text-center ${
                    activeExamType === "prelim"
                      ? "bg-teal-700 text-white font-medium"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveExamType("prelim")}
                >
                  Prelim
                </button>
              </div>
            </div>
          </div>
          <div className="bg-transparent rounded-lg p-4 h-72">
            {performanceData.subjectAverages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No {activeExamType.replace("-", " ")} data available.
              </div>
            ) : (
              <>
                <div className="flex justify-between items-end h-48">
                  {performanceData.subjectAverages.map((s, i) => {
                    // Use computed percentage
                    const pct =
                      typeof s.averagePercent === "number"
                        ? s.averagePercent
                        : parseFloat(s.averagePercent) || 0;
                    const barHeight = Math.min(Math.max(pct, 5), 100); // keep visible
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center w-12 sm:w-16 group"
                      >
                        <div
                          className="w-5 sm:w-6 bg-gradient-to-t from-teal-700 to-teal-600 rounded-md transition-all duration-500 relative group-hover:scale-105"
                          style={{ height: `${barHeight}%`, minHeight: "1rem" }}
                        >
                          <span className="absolute -top-6 bg-teal-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            {pct.toFixed ? pct.toFixed(1) : pct}%
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 text-xs sm:text-sm text-center truncate w-full">
                          {s.subject}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between px-4 mt-4 text-xs text-gray-500">
                  <span>0%</span>
                  <span>
                    {activeExamType === "unit-test" ? "Unit Test" : "Prelim"}{" "}
                    Performance
                  </span>
                  <span>100%</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Quick Actions
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              {
                to: "/teacherdash/subject-marks",
                icon: faFileExport,
                label: "Export Grades",
              },
              {
                to: "/teacherdash/TeacherStudentManage",
                icon: faUsers,
                label: "Export Student List",
              },
              {
                to: "/teacherdash/attendance",
                icon: faFileAlt,
                label: "Take Attendance",
              },
              {
                to: "/teacherdash/notifications",
                icon: faBell,
                label: "Send Notification",
              },
            ].map((action, index) => (
              <Link
                key={index}
                to={action.to}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={action.icon} />
                </div>
                <span className="text-gray-700 font-medium">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;
