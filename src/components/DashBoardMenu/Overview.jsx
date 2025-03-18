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
    <div className="max-w-7xl mx-auto p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-700 relative">
          Overview
          <span className="absolute bottom-[-8px] left-0 w-[70%] h-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded"></span>
        </h1>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Total Teachers
              </h3>
              <p className="text-4xl font-bold text-gray-800 mt-1">87</p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
                <span>2.4% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[75%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Total Students
              </h3>
              <p className="text-4xl font-bold text-gray-800 mt-1">1234</p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
                <span>3.6% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faUserGraduate} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[85%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Pending Grades
              </h3>
              <p className="text-4xl font-bold text-gray-800 mt-1">45</p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <FontAwesomeIcon icon={faArrowDown} className="text-red-500" />
                <span>1.8% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[35%] rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Faculty Analysis */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Faculty Analysis
            </h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 overflow-hidden">
              <div className="px-4 py-2 rounded-md cursor-pointer text-sm transition-all">
                Week
              </div>
              <div className="px-4 py-2 rounded-md cursor-pointer text-sm transition-all bg-purple-600 text-white font-medium">
                Month
              </div>
              <div className="px-4 py-2 rounded-md cursor-pointer text-sm transition-all">
                Year
              </div>
            </div>
          </div>
          <div className="bg-transparent rounded-lg p-4 h-[300px]">
            <div className="flex h-[220px] items-end justify-between px-4">
              <div className="flex flex-col items-center w-16">
                <div
                  className="w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "78%" }}
                  data-value="78"
                ></div>
                <p className="mt-4 text-gray-600 text-sm font-medium">
                  Dr. Smith
                </p>
              </div>
              <div className="flex flex-col items-center w-16">
                <div
                  className="w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "82%" }}
                  data-value="82"
                ></div>
                <p className="mt-4 text-gray-600 text-sm font-medium">
                  Prof. Johnson
                </p>
              </div>
              <div className="flex flex-col items-center w-16">
                <div
                  className="w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "75%" }}
                  data-value="75"
                ></div>
                <p className="mt-4 text-gray-600 text-sm font-medium">
                  Dr. Williams
                </p>
              </div>
              <div className="flex flex-col items-center w-16">
                <div
                  className="w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "79%" }}
                  data-value="79"
                ></div>
                <p className="mt-4 text-gray-600 text-sm font-medium">
                  Prof. Brown
                </p>
              </div>
              <div className="flex flex-col items-center w-16">
                <div
                  className="w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all relative bar"
                  style={{ height: "85%" }}
                  data-value="85"
                ></div>
                <p className="mt-4 text-gray-600 text-sm font-medium">
                  Dr. Miller
                </p>
              </div>
            </div>
            <div className="flex justify-between px-4 mt-4 text-xs text-gray-500">
              <span>0</span>
              <span>Faculty Performance Score (%)</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          </div>
          <div className="flex flex-col gap-3">
            <button className="w-full p-4 bg-white border border-gray-200 rounded-lg flex items-center cursor-pointer transition-all relative overflow-hidden hover:border-purple-400 hover:shadow-md transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-4">
                <FontAwesomeIcon icon={faFileExport} />
              </div>
              <span className="text-gray-600 font-medium">Export Marks</span>
            </button>
            <button className="w-full p-4 bg-white border border-gray-200 rounded-lg flex items-center cursor-pointer transition-all relative overflow-hidden hover:border-purple-400 hover:shadow-md transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-4">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <span className="text-gray-600 font-medium">
                Export Student List
              </span>
            </button>
            <button className="w-full p-4 bg-white border border-gray-200 rounded-lg flex items-center cursor-pointer transition-all relative overflow-hidden hover:border-purple-400 hover:shadow-md transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-4">
                <FontAwesomeIcon icon={faFileAlt} />
              </div>
              <span className="text-gray-600 font-medium">Export Reports</span>
            </button>
            <button className="w-full p-4 bg-white border border-gray-200 rounded-lg flex items-center cursor-pointer transition-all relative overflow-hidden hover:border-purple-400 hover:shadow-md transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-4">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <span className="text-gray-600 font-medium">
                Send Notification
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Assessments
          </h2>
          <div className="flex items-center bg-gray-100 rounded-lg p-1 overflow-hidden">
            <div className="px-4 py-2 rounded-md cursor-pointer text-sm transition-all bg-purple-600 text-white font-medium">
              Month
            </div>
            <div className="px-4 py-2 rounded-md cursor-pointer text-sm transition-all">
              Week
            </div>
            <div className="px-4 py-2 rounded-md cursor-pointer text-sm transition-all">
              Year
            </div>
          </div>
        </div>
        <div className="flex mb-6 border-b-2 border-gray-100">
          <div className="px-6 py-3 cursor-pointer text-gray-600 font-medium transition-all active tab">
            All Courses
          </div>
          <div className="px-6 py-3 cursor-pointer text-gray-600 font-medium transition-all tab">
            Pending
          </div>
          <div className="px-6 py-3 cursor-pointer text-gray-600 font-medium transition-all tab">
            Graded
          </div>
          <div className="px-6 py-3 cursor-pointer text-gray-600 font-medium transition-all tab">
            Overdue
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 text-gray-600 font-medium text-sm border-b border-gray-100">
                Assessment
              </th>
              <th className="text-left p-4 text-gray-600 font-medium text-sm border-b border-gray-100">
                Course
              </th>
              <th className="text-left p-4 text-gray-600 font-medium text-sm border-b border-gray-100">
                Due Date
              </th>
              <th className="text-left p-4 text-gray-600 font-medium text-sm border-b border-gray-100">
                Students
              </th>
              <th className="text-left p-4 text-gray-600 font-medium text-sm border-b border-gray-100">
                Status
              </th>
              <th className="text-left p-4 text-gray-600 font-medium text-sm border-b border-gray-100">
                Average
              </th>
              <th className="text-left p-4 text-gray-600 font-medium text-sm border-b border-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="transition-all cursor-pointer hover:bg-gray-50">
              <td>
                <span className="font-semibold text-gray-800">
                  Midterm Exam
                </span>
              </td>
              <td>Advanced Mathematics</td>
              <td>Mar 15, 2025</td>
              <td>
                <div className="flex items-center gap-2">
                  <span>42/45</span>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                      style={{ width: "93%" }}
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                  Graded
                </span>
              </td>
              <td>76.4%</td>
              <td>
                <div className="relative">
                  <button className="w-7 h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                </div>
              </td>
            </tr>
            <tr className="transition-all cursor-pointer hover:bg-gray-50">
              <td>
                <span className="font-semibold text-gray-800">
                  Research Paper
                </span>
              </td>
              <td>Environmental Science</td>
              <td>Mar 22, 2025</td>
              <td>
                <div className="flex items-center gap-2">
                  <span>38/40</span>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                  Pending
                </span>
              </td>
              <td>
                <span className="text-gray-400 italic">—</span>
              </td>
              <td>
                <div className="relative">
                  <button className="w-7 h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                </div>
              </td>
            </tr>
            <tr className="transition-all cursor-pointer hover:bg-gray-50">
              <td>
                <span className="font-semibold text-gray-800">Lab Report</span>
              </td>
              <td>Chemistry 101</td>
              <td>Mar 10, 2025</td>
              <td>
                <div className="flex items-center gap-2">
                  <span>32/35</span>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                      style={{ width: "91%" }}
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                  Graded
                </span>
              </td>
              <td>82.7%</td>
              <td>
                <div className="relative">
                  <button className="w-7 h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                </div>
              </td>
            </tr>
            <tr className="transition-all cursor-pointer hover:bg-gray-50">
              <td>
                <span className="font-semibold text-gray-800">
                  Final Project
                </span>
              </td>
              <td>Computer Science</td>
              <td>Mar 30, 2025</td>
              <td>
                <div className="flex items-center gap-2">
                  <span>18/25</span>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                  Draft
                </span>
              </td>
              <td>
                <span className="text-gray-400 italic">—</span>
              </td>
              <td>
                <div className="relative">
                  <button className="w-7 h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                </div>
              </td>
            </tr>
            <tr className="transition-all cursor-pointer hover:bg-gray-50">
              <td>
                <span className="font-semibold text-gray-800">Term Paper</span>
              </td>
              <td>Literature Studies</td>
              <td>Mar 5, 2025</td>
              <td>
                <div className="flex items-center gap-2">
                  <span>22/30</span>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                      style={{ width: "73%" }}
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                  Overdue
                </span>
              </td>
              <td>
                <span className="text-gray-400 italic">—</span>
              </td>
              <td>
                <div className="relative">
                  <button className="w-7 h-7 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOverview;
