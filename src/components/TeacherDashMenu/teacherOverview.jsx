import React, { useState } from "react";
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

const TeacherOverview = () => {
  const [activeTab, setActiveTab] = useState("All Classes");
  const [activePeriod, setActivePeriod] = useState("Month");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handlePeriodClick = (period) => {
    setActivePeriod(period);
  };

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
                1234
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
                <span className="text-green-500">3.6% from last month</span>
              </div>
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
                Assignments Graded
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                45
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <FontAwesomeIcon icon={faArrowDown} className="text-red-500" />
                <span className="text-red-500">1.8% from last month</span>
              </div>
            </div>
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg shadow-md">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-700 to-teal-700 h-full"
              style={{ width: "35%" }}
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
                82.7%
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
                <span className="text-green-500">2.4% from last month</span>
              </div>
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
              {["Math", "Science", "History", "English", "Art"].map(
                (subject, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-12 sm:w-16"
                  >
                    <div
                      className="w-5 bg-gradient-to-t from-teal-700 to-teal-700 rounded-md transition-all duration-500 relative"
                      style={{ height: `${[78, 82, 75, 79, 85][index]}%` }}
                    >
                      <span className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-teal-700 text-white px-2 py-1 rounded-md text-xs opacity-0 transition-opacity duration-300">
                        {[78, 82, 75, 79, 85][index]}%
                      </span>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium text-xs sm:text-sm">
                      {subject}
                    </p>
                  </div>
                )
              )}
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
            <Link to="/teacherdash/subject-marks">
              <button className="flex items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={faFileExport} />
                </div>
                <span className="text-gray-600 font-medium">Export Grades</span>
              </button>
            </Link>
            <Link to="/teacherdash/manage-students">
              <button className="flex items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <span className="text-gray-600 font-medium">
                  Export Student List
                </span>
              </button>
            </Link>
            <Link to="/teacherdash/attendance">
              <button className="flex items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={faFileAlt} />
                </div>
                <span className="text-gray-600 font-medium">
                  Take Attendance
                </span>
              </button>
            </Link>
            <Link to="/teacherdash/notifications">
              <button className="flex items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-teal-700 to-teal-700 text-white flex items-center justify-center rounded-lg mr-4">
                  <FontAwesomeIcon icon={faBell} />
                </div>
                <span className="text-gray-600 font-medium">
                  Send Notification
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Recent Assignments
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
        <div className="flex mb-4 sm:mb-6 overflow-x-auto">
          <div
            className={`px-4 sm:px-6 py-2 sm:py-3 cursor-pointer ${
              activeTab === "All Classes"
                ? "border-b-2 border-teal-700 text-teal-700 font-medium"
                : "text-gray-600"
            }`}
            onClick={() => handleTabClick("All Classes")}
          >
            All Classes
          </div>
          <div
            className={`px-4 sm:px-6 py-2 sm:py-3 cursor-pointer ${
              activeTab === "Pending"
                ? "border-b-2 border-teal-700 text-teal-700 font-medium"
                : "text-gray-600"
            }`}
            onClick={() => handleTabClick("Pending")}
          >
            Pending
          </div>
          <div
            className={`px-4 sm:px-6 py-2 sm:py-3 cursor-pointer ${
              activeTab === "Graded"
                ? "border-b-2 border-teal-700 text-teal-700 font-medium"
                : "text-gray-600"
            }`}
            onClick={() => handleTabClick("Graded")}
          >
            Graded
          </div>
          <div
            className={`px-4 sm:px-6 py-2 sm:py-3 cursor-pointer ${
              activeTab === "Overdue"
                ? "border-b-2 border-teal-700 text-teal-700 font-medium"
                : "text-gray-600"
            }`}
            onClick={() => handleTabClick("Overdue")}
          >
            Overdue
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm">
                Assignment
              </th>
              <th className="text-left p-3 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm">
                Class
              </th>
              <th className="text-left p-3 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm">
                Due Date
              </th>
              <th className="text-left p-3 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm">
                Students
              </th>
              <th className="text-left p-3 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm">
                Status
              </th>
              <th className="text-left p-3 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm">
                Average
              </th>
              <th className="text-left p-3 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Math Homework",
                class: "Math 101",
                dueDate: "Mar 15, 2025",
                students: "42/45",
                status: "Graded",
                average: "76.4%",
              },
              {
                name: "Science Project",
                class: "Science 101",
                dueDate: "Mar 22, 2025",
                students: "38/40",
                status: "Pending",
                average: "—",
              },
              {
                name: "History Essay",
                class: "History 101",
                dueDate: "Mar 10, 2025",
                students: "32/35",
                status: "Graded",
                average: "82.7%",
              },
              {
                name: "English Paper",
                class: "English 101",
                dueDate: "Mar 30, 2025",
                students: "18/25",
                status: "Draft",
                average: "—",
              },
              {
                name: "Art Project",
                class: "Art 101",
                dueDate: "Mar 5, 2025",
                students: "22/30",
                status: "Overdue",
                average: "—",
              },
            ].map((assignment, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition-all duration-300 cursor-pointer"
              >
                <td className="p-3 sm:p-4 text-gray-800 font-medium">
                  {assignment.name}
                </td>
                <td className="p-3 sm:p-4 text-gray-600">{assignment.class}</td>
                <td className="p-3 sm:p-4 text-gray-600">
                  {assignment.dueDate}
                </td>
                <td className="p-3 sm:p-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>{assignment.students}</span>
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-700 to-teal-700 rounded-full"
                        style={{
                          width: `${
                            (assignment.students.split("/")[0] /
                              assignment.students.split("/")[1]) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-3 sm:p-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      assignment.status === "Graded"
                        ? "bg-green-100 text-green-500"
                        : assignment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-500"
                        : assignment.status === "Draft"
                        ? "bg-blue-100 text-blue-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="p-3 sm:p-4 text-gray-600">
                  {assignment.average}
                </td>
                <td className="p-3 sm:p-4">
                  <div className="relative">
                    <button className="w-6 sm:w-7 h-6 sm:h-7 bg-transparent border-none cursor-pointer flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-300">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherOverview;
