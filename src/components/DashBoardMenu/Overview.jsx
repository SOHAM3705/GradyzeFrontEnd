import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faUserGraduate,
  faChartBar,
  faArrowUp,
  faArrowDown,
  faFileExport,
  faUsers,
  faFileAlt,
  faBell,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../config"; // Adjust the import path as necessary

const AdminOverview = () => {
  useEffect(() => {
    // Animate the bars in the chart
    const bars = document.querySelectorAll(".bar");
    bars.forEach((bar) => {
      const height = bar.style.height;
      bar.style.height = "0";
      setTimeout(() => {
        bar.style.height = height;
      }, 300);
    });

    // Handle tab switching
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        this.classList.add("active");
      });
    });

    // Handle period selection
    const periodOptions = document.querySelectorAll(".period-option");
    periodOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Find the parent selector
        const selector = this.closest(".period-selector");
        const options = selector.querySelectorAll(".period-option");
        // Remove active class from all options
        options.forEach((o) => o.classList.remove("active"));
        // Add active class to clicked option
        this.classList.add("active");
      });
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-700 relative">
          Overview
          <span className="absolute bottom-[-6px] left-0 w-[70%] h-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded"></span>
        </h1>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all relative">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
                Total Teachers
              </h3>
              <p className="text-2xl sm:text-4xl font-bold text-gray-800 mt-1">
                87
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
                <span>2.4% from last month</span>
              </div>
            </div>
            <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[75%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all relative">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
                Total Students
              </h3>
              <p className="text-2xl sm:text-4xl font-bold text-gray-800 mt-1">
                1234
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
                <span>3.6% from last month</span>
              </div>
            </div>
            <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faUserGraduate} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[85%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all relative">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
                Pending Grades
              </h3>
              <p className="text-2xl sm:text-4xl font-bold text-gray-800 mt-1">
                45
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <FontAwesomeIcon icon={faArrowDown} className="text-red-500" />
                <span>1.8% from last month</span>
              </div>
            </div>
            <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[35%] rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Faculty Analysis */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Faculty Analysis
            </h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 overflow-hidden">
              <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-md cursor-pointer text-xs sm:text-sm transition-all">
                Week
              </div>
              <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-md cursor-pointer text-xs sm:text-sm transition-all bg-purple-600 text-white font-medium">
                Month
              </div>
              <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-md cursor-pointer text-xs sm:text-sm transition-all">
                Year
              </div>
            </div>
          </div>
          <div className="bg-transparent rounded-lg p-2 sm:p-4 h-[250px] sm:h-[300px]">
            <div className="flex h-[180px] sm:h-[220px] items-end justify-between px-2 sm:px-4">
              <div className="flex flex-col items-center w-10 sm:w-16">
                <div
                  className="w-3 sm:w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "78%" }}
                  data-value="78"
                ></div>
                <p className="mt-2 sm:mt-4 text-gray-600 text-xs sm:text-sm font-medium">
                  Dr. Smith
                </p>
              </div>
              <div className="flex flex-col items-center w-10 sm:w-16">
                <div
                  className="w-3 sm:w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "82%" }}
                  data-value="82"
                ></div>
                <p className="mt-2 sm:mt-4 text-gray-600 text-xs sm:text-sm font-medium">
                  Prof. Johnson
                </p>
              </div>
              <div className="flex flex-col items-center w-10 sm:w-16">
                <div
                  className="w-3 sm:w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "75%" }}
                  data-value="75"
                ></div>
                <p className="mt-2 sm:mt-4 text-gray-600 text-xs sm:text-sm font-medium">
                  Dr. Williams
                </p>
              </div>
              <div className="flex flex-col items-center w-10 sm:w-16">
                <div
                  className="w-3 sm:w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "79%" }}
                  data-value="79"
                ></div>
                <p className="mt-2 sm:mt-4 text-gray-600 text-xs sm:text-sm font-medium">
                  Prof. Brown
                </p>
              </div>
              <div className="flex flex-col items-center w-10 sm:w-16">
                <div
                  className="w-3 sm:w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "85%" }}
                  data-value="85"
                ></div>
                <p className="mt-2 sm:mt-4 text-gray-600 text-xs sm:text-sm font-medium">
                  Dr. Miller
                </p>
              </div>
            </div>
            <div className="flex justify-between px-2 sm:px-4 mt-2 sm:mt-4 text-xs text-gray-500">
              <span>0</span>
              <span>Faculty Performance Score (%)</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Quick Actions
            </h2>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            <button className="w-full p-2 sm:p-4 bg-white border border-gray-200 rounded-lg flex items-center cursor-pointer transition-all relative overflow-hidden hover:border-purple-400 hover:shadow-md transform hover:-translate-y-1">
              <div className="w-6 sm:w-10 h-6 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-2 sm:mr-4">
                <FontAwesomeIcon icon={faFileExport} />
              </div>
              <span className="text-gray-600 font-medium text-xs sm:text-base">
                Export Marks
              </span>
            </button>
            <button className="w-full p-2 sm:p-4 bg-white border border-gray-200 rounded-lg flex items-center cursor-pointer transition-all relative overflow-hidden hover:border-purple-400 hover:shadow-md transform hover:-translate-y-1">
              <div className="w-6 sm:w-10 h-6 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-2 sm:mr-4">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <span className="text-gray-600 font-medium text-xs sm:text-base">
                Export Student List
              </span>
            </button>
            <button className="w-full p-2 sm:p-4 bg-white border border-gray-200 rounded-lg flex items-center cursor-pointer transition-all relative overflow-hidden hover:border-purple-400 hover:shadow-md transform hover:-translate-y-1">
              <div className="w-6 sm:w-10 h-6 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-2 sm:mr-4">
                <FontAwesomeIcon icon={faFileAlt} />
              </div>
              <span className="text-gray-600 font-medium text-xs sm:text-base">
                Export Reports
              </span>
            </button>
            <button className="w-full p-2 sm:p-4 bg-white border border-gray-200 rounded-lg flex items-center cursor-pointer transition-all relative overflow-hidden hover:border-purple-400 hover:shadow-md transform hover:-translate-y-1">
              <div className="w-6 sm:w-10 h-6 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-2 sm:mr-4">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <span className="text-gray-600 font-medium text-xs sm:text-base">
                Send Notification
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Recent Assessments
          </h2>
          <div className="flex items-center bg-gray-100 rounded-lg p-1 overflow-hidden">
            <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-md cursor-pointer text-xs sm:text-sm transition-all bg-purple-600 text-white font-medium">
              Month
            </div>
            <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-md cursor-pointer text-xs sm:text-sm transition-all">
              Week
            </div>
            <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-md cursor-pointer text-xs sm:text-sm transition-all">
              Year
            </div>
          </div>
        </div>
        <div className="flex mb-4 sm:mb-6 border-b-2 border-gray-100 overflow-x-auto">
          <div className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-gray-600 font-medium transition-all active tab whitespace-nowrap">
            All Courses
          </div>
          <div className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-gray-600 font-medium transition-all tab whitespace-nowrap">
            Pending
          </div>
          <div className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-gray-600 font-medium transition-all tab whitespace-nowrap">
            Graded
          </div>
          <div className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-gray-600 font-medium transition-all tab whitespace-nowrap">
            Overdue
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm border-b border-gray-100">
                  Assessment
                </th>
                <th className="text-left p-2 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm border-b border-gray-100">
                  Course
                </th>
                <th className="text-left p-2 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm border-b border-gray-100">
                  Due Date
                </th>
                <th className="text-left p-2 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm border-b border-gray-100">
                  Students
                </th>
                <th className="text-left p-2 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm border-b border-gray-100">
                  Status
                </th>
                <th className="text-left p-2 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm border-b border-gray-100">
                  Average
                </th>
                <th className="text-left p-2 sm:p-4 text-gray-600 font-medium text-xs sm:text-sm border-b border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="transition-all cursor-pointer hover:bg-gray-50">
                <td className="p-2 sm:p-4">
                  <span className="font-semibold text-gray-800">
                    Midterm Exam
                  </span>
                </td>
                <td className="p-2 sm:p-4">Advanced Mathematics</td>
                <td className="p-2 sm:p-4">Mar 15, 2025</td>
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-base">42/45</span>
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                        style={{ width: "93%" }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-2 sm:p-4">
                  <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    Graded
                  </span>
                </td>
                <td className="p-2 sm:p-4">76.4%</td>
                <td className="p-2 sm:p-4">
                  <div className="relative">
                    <button className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="transition-all cursor-pointer hover:bg-gray-50">
                <td className="p-2 sm:p-4">
                  <span className="font-semibold text-gray-800">
                    Research Paper
                  </span>
                </td>
                <td className="p-2 sm:p-4">Environmental Science</td>
                <td className="p-2 sm:p-4">Mar 22, 2025</td>
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-base">38/40</span>
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-2 sm:p-4">
                  <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                    Pending
                  </span>
                </td>
                <td className="p-2 sm:p-4">
                  <span className="text-gray-400 italic">—</span>
                </td>
                <td className="p-2 sm:p-4">
                  <div className="relative">
                    <button className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="transition-all cursor-pointer hover:bg-gray-50">
                <td className="p-2 sm:p-4">
                  <span className="font-semibold text-gray-800">
                    Lab Report
                  </span>
                </td>
                <td className="p-2 sm:p-4">Chemistry 101</td>
                <td className="p-2 sm:p-4">Mar 10, 2025</td>
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-base">32/35</span>
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                        style={{ width: "91%" }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-2 sm:p-4">
                  <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    Graded
                  </span>
                </td>
                <td className="p-2 sm:p-4">82.7%</td>
                <td className="p-2 sm:p-4">
                  <div className="relative">
                    <button className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="transition-all cursor-pointer hover:bg-gray-50">
                <td className="p-2 sm:p-4">
                  <span className="font-semibold text-gray-800">
                    Final Project
                  </span>
                </td>
                <td className="p-2 sm:p-4">Computer Science</td>
                <td className="p-2 sm:p-4">Mar 30, 2025</td>
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-base">18/25</span>
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-2 sm:p-4">
                  <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                    Draft
                  </span>
                </td>
                <td className="p-2 sm:p-4">
                  <span className="text-gray-400 italic">—</span>
                </td>
                <td className="p-2 sm:p-4">
                  <div className="relative">
                    <button className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="transition-all cursor-pointer hover:bg-gray-50">
                <td className="p-2 sm:p-4">
                  <span className="font-semibold text-gray-800">
                    Term Paper
                  </span>
                </td>
                <td className="p-2 sm:p-4">Literature Studies</td>
                <td className="p-2 sm:p-4">Mar 5, 2025</td>
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-base">22/30</span>
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                        style={{ width: "73%" }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-2 sm:p-4">
                  <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    Overdue
                  </span>
                </td>
                <td className="p-2 sm:p-4">
                  <span className="text-gray-400 italic">—</span>
                </td>
                <td className="p-2 sm:p-4">
                  <div className="relative">
                    <button className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
