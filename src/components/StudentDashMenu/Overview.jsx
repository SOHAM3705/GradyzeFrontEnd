import React, { useState } from "react";
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

const StudentDashboard = () => {
  const [activePeriod, setActivePeriod] = useState("Month");

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 relative inline-block">
          Overview
          <span className="block absolute w-[70%] h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded mt-2"></span>
        </h1>
        <div className="flex items-center gap-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for courses, assignments..."
              className="pl-10 pr-4 py-3 border rounded-lg shadow-sm w-72 focus:outline-none focus:border-blue-300 focus:ring-blue-200 transition"
            />
          </div>
          <div className="flex items-center gap-4 p-2 bg-white rounded-lg shadow-md cursor-pointer transition hover:shadow-lg">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg font-bold text-lg">
              JS
            </div>
            <div>
              <div className="font-semibold text-gray-800">Jamie Smith</div>
              <div className="text-gray-500 text-sm">Student</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Current GPA</h3>
              <p className="text-4xl font-bold text-gray-800 mt-2">3.8</p>
              <div className="flex items-center gap-2 text-sm mt-2">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
                <span className="text-green-500">0.2 from last semester</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: "95%" }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Assignments Due
              </h3>
              <p className="text-4xl font-bold text-gray-800 mt-2">5</p>
              <div className="flex items-center gap-2 text-sm mt-2">
                <FontAwesomeIcon icon={faArrowDown} className="text-red-500" />
                <span className="text-red-500">2 fewer than last week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faTasks} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: "42%" }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Attendance Rate
              </h3>
              <p className="text-4xl font-bold text-gray-800 mt-2">96%</p>
              <div className="flex items-center gap-2 text-sm mt-2">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-500" />
                <span className="text-green-500">1.5% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: "96%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Grade Performance
            </h2>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg transition ${
                  activePeriod === "Week"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handlePeriodChange("Week")}
              >
                Week
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition ${
                  activePeriod === "Month"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handlePeriodChange("Month")}
              >
                Month
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition ${
                  activePeriod === "Semester"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handlePeriodChange("Semester")}
              >
                Semester
              </button>
            </div>
          </div>
          <div className="flex justify-between items-end h-64 px-4">
            <div className="flex flex-col items-center w-14">
              <div
                className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                style={{ height: "92%" }}
              ></div>
              <p className="text-gray-600 text-sm mt-2">Math</p>
            </div>
            <div className="flex flex-col items-center w-14">
              <div
                className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                style={{ height: "87%" }}
              ></div>
              <p className="text-gray-600 text-sm mt-2">Science</p>
            </div>
            <div className="flex flex-col items-center w-14">
              <div
                className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                style={{ height: "78%" }}
              ></div>
              <p className="text-gray-600 text-sm mt-2">History</p>
            </div>
            <div className="flex flex-col items-center w-14">
              <div
                className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                style={{ height: "85%" }}
              ></div>
              <p className="text-gray-600 text-sm mt-2">English</p>
            </div>
            <div className="flex flex-col items-center w-14">
              <div
                className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                style={{ height: "94%" }}
              ></div>
              <p className="text-gray-600 text-sm mt-2">Art</p>
            </div>
          </div>
          <div className="flex justify-between px-4 mt-4 text-gray-500 text-sm">
            <span>0</span>
            <span>Course Grades (%)</span>
            <span>100</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Upcoming Deadlines
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white border rounded-lg shadow-sm transition hover:shadow-md">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-lg mr-4">
                <FontAwesomeIcon icon={faCalculator} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Math Homework</h4>
                <p className="text-gray-500 text-sm">Calculus II - Chapter 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
