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
  const [activePeriod, setActivePeriod] = useState("Month");
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
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-teal-700 relative">
          Overview
          <span className="absolute bottom-[-8px] left-0 w-[70%] h-1 bg-gradient-to-r from-teal-700 to-teal-700 rounded-sm"></span>
        </h1>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md relative overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Total Students
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                {overviewStats.totalStudents}
              </p>
            </div>
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg shadow-md">
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

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md relative overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Average Class Score
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                {overviewStats.averageScore}%
              </p>
            </div>
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg shadow-md">
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
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md relative overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Lectures Held</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
              {lectureStats}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
              <span className="text-green-500">This academic term</span>
            </div>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg shadow-md">
            <FontAwesomeIcon icon={faChartBar} />
          </div>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-700 to-teal-700 h-full"
            style={{ width: "60%" }} // Optional, or remove this bar
          ></div>
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
              <div
                className={`px-3 sm:px-4 py-2 rounded-md cursor-pointer ${
                  activePeriod === "Week"
                    ? "bg-teal-700 text-white font-medium"
                    : "text-gray-600"
                }`}
                onClick={() => handlePeriodClick("Week")}
              >
                Week
              </div>
              <div
                className={`px-3 sm:px-4 py-2 rounded-md cursor-pointer ${
                  activePeriod === "Month"
                    ? "bg-teal-700 text-white font-medium"
                    : "text-gray-600"
                }`}
                onClick={() => handlePeriodClick("Month")}
              >
                Month
              </div>
              <div
                className={`px-3 sm:px-4 py-2 rounded-md cursor-pointer ${
                  activePeriod === "Year"
                    ? "bg-teal-700 text-white font-medium"
                    : "text-gray-600"
                }`}
                onClick={() => handlePeriodClick("Year")}
              >
                Year
              </div>
            </div>
          </div>
          <div className="bg-transparent rounded-lg p-4 h-72">
            <div className="flex justify-between items-end h-48">
              {overviewStats.subjectAverages.map((subjectData, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center w-12 sm:w-16"
                >
                  <div
                    className="w-5 bg-gradient-to-t from-teal-700 to-teal-700 rounded-md transition-all duration-500 relative"
                    style={{ height: `${subjectData.average}%` }}
                  >
                    <span className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-teal-700 text-white px-2 py-1 rounded-md text-xs opacity-0 transition-opacity duration-300">
                      {subjectData.average}%
                    </span>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium text-xs sm:text-sm">
                    {subjectData.subject}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-4 mt-4 text-xs text-gray-500">
              <span>0</span>
              <span>Class Performance Score (%)</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Quick Actions
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <button className="flex items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
              <Link to="/teacherdash/subject-marks">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={faFileExport} />
                </div>
                <span className="text-gray-600 font-medium">Export Grades</span>
              </Link>
            </button>

            <button className="flex items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
              <Link to="/teacherdash/TeacherStudentManage">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <span className="text-gray-600 font-medium">
                  Export Student List
                </span>
              </Link>
            </button>

            <button className="flex items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
              <Link to="/teacherdash/attendance">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={faFileAlt} />
                </div>
                <span className="text-gray-600 font-medium">
                  Take Attendance
                </span>
              </Link>
            </button>

            <button className="flex items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
              <Link to="/teacherdash/notifications">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={faBell} />
                </div>
                <span className="text-gray-600 font-medium">
                  Send Notification
                </span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;
