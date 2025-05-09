import React, { useState } from "react";

const StudentAttendanceDashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeTab, setActiveTab] = useState("lecturewise");

  const subjects = [
    {
      code: "cs101",
      name: "Computer Science",
      icon: "CS",
      attendance: 95,
      color: "bg-blue-500",
    },
    {
      code: "math202",
      name: "Mathematics",
      icon: "MA",
      attendance: 82,
      color: "bg-indigo-700",
    },
    {
      code: "phy101",
      name: "Physics",
      icon: "PH",
      attendance: 88,
      color: "bg-blue-600",
    },
    {
      code: "eng104",
      name: "English Literature",
      icon: "EN",
      attendance: 78,
      color: "bg-pink-500",
    },
  ];

  const showSubjectDetails = (subject) => {
    setSelectedSubject(subject);
  };

  const hideSubjectDetails = () => {
    setSelectedSubject(null);
  };

  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container mx-auto p-2 sm:p-5">
      {!selectedSubject ? (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
            <div className="text-lg sm:text-2xl font-bold">
              Attendance Dashboard
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-2">
                JS
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">John Smith</div>
                <div className="text-gray-500 text-xs sm:text-sm">
                  ID: STU2023045
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
            <div className="bg-white rounded-lg p-3 sm:p-5 shadow-sm text-center">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
                Overall Attendance
              </div>
              <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                87%
              </div>
              <div className="h-1 sm:h-2 bg-gray-200 rounded-full mb-1 sm:mb-2">
                <div
                  className="h-1 sm:h-2 bg-blue-600 rounded-full"
                  style={{ width: "87%" }}
                ></div>
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">
                Academic Year 2024-2025
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-5 shadow-sm text-center">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
                This Month
              </div>
              <div className="text-xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">
                92%
              </div>
              <div className="h-1 sm:h-2 bg-gray-200 rounded-full mb-1 sm:mb-2">
                <div
                  className="h-1 sm:h-2 bg-blue-400 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">March 2025</div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-5 shadow-sm text-center">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
                Classes Attended
              </div>
              <div className="text-xl sm:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2">
                187
              </div>
              <div className="h-1 sm:h-2 bg-gray-200 rounded-full mb-1 sm:mb-2">
                <div
                  className="h-1 sm:h-2 bg-indigo-700 rounded-full"
                  style={{ width: "87%" }}
                ></div>
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">
                Out of 215 sessions
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4">
              <div className="text-lg sm:text-xl font-bold">
                Subject-wise Attendance
              </div>
              <select className="p-1 sm:p-2 border border-gray-300 rounded-md bg-white text-xs sm:text-sm">
                <option>All Semester</option>
                <option>Sem 1</option>
                <option>Sem 2</option>
                <option>Sem 3</option>
                <option>Sem 4</option>
                <option>Sem 5</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
              {subjects.map((subject) => (
                <div
                  key={subject.code}
                  className="bg-white rounded-lg p-3 sm:p-5 shadow-sm cursor-pointer hover:shadow-lg transition-transform transform hover:-translate-y-1"
                  onClick={() => showSubjectDetails(subject)}
                >
                  <div className="flex items-center mb-2 sm:mb-4">
                    <div
                      className={`w-6 sm:w-10 h-6 sm:h-10 rounded-full flex items-center justify-center font-bold mr-2 sm:mr-4 ${subject.color} text-white`}
                    >
                      {subject.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base">
                        {subject.name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm">
                        {subject.code}
                      </div>
                    </div>
                  </div>
                  <div className="h-1 sm:h-2 bg-gray-200 rounded-full mb-2 sm:mb-4">
                    <div
                      className={`h-1 sm:h-2 rounded-full ${subject.color}`}
                      style={{ width: `${subject.attendance}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-center">
                    <div>
                      <div className="font-bold text-sm sm:text-lg">
                        {subject.attendance}%
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm">
                        Attendance
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-lg">38</div>
                      <div className="text-gray-500 text-xs sm:text-sm">
                        Present
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-lg">2</div>
                      <div className="text-gray-500 text-xs sm:text-sm">
                        Absent
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                Recent Attendance History
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-5 shadow-sm overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-2 px-2 sm:px-4 text-left font-semibold text-gray-500 bg-gray-100 text-xs sm:text-sm">
                        Date
                      </th>
                      <th className="py-2 px-2 sm:px-4 text-left font-semibold text-gray-500 bg-gray-100 text-xs sm:text-sm">
                        Subject
                      </th>
                      <th className="py-2 px-2 sm:px-4 text-left font-semibold text-gray-500 bg-gray-100 text-xs sm:text-sm">
                        Time
                      </th>
                      <th className="py-2 px-2 sm:px-4 text-left font-semibold text-gray-500 bg-gray-100 text-xs sm:text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="transition-all cursor-pointer hover:bg-gray-50">
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        March 21, 2025
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        Computer Science
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        10:00 - 11:30 AM
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b">
                        <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                          Present
                        </span>
                      </td>
                    </tr>
                    <tr className="transition-all cursor-pointer hover:bg-gray-50">
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        March 21, 2025
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        Mathematics
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        12:00 - 1:30 PM
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b">
                        <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                          Present
                        </span>
                      </td>
                    </tr>
                    <tr className="transition-all cursor-pointer hover:bg-gray-50">
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        March 20, 2025
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        Physics
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        9:00 - 10:30 AM
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b">
                        <span className="bg-yellow-100 text-yellow-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                          Late
                        </span>
                      </td>
                    </tr>
                    <tr className="transition-all cursor-pointer hover:bg-gray-50">
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        March 20, 2025
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        English Literature
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        2:00 - 3:30 PM
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b">
                        <span className="bg-pink-100 text-pink-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                          Absent
                        </span>
                      </td>
                    </tr>
                    <tr className="transition-all cursor-pointer hover:bg-gray-50">
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        March 19, 2025
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        Computer Science
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-sm">
                        10:00 - 11:30 AM
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b">
                        <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                          Present
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="flex items-center mb-2 sm:mb-4 cursor-pointer"
            onClick={hideSubjectDetails}
          >
            <span className="text-blue-600 font-bold mr-2">&larr;</span> Back to
            Dashboard
          </div>

          <div className="flex items-center mb-4 sm:mb-6">
            <div
              className={`w-8 sm:w-15 h-8 sm:h-15 rounded-lg flex items-center justify-center font-bold mr-2 sm:mr-4 ${selectedSubject.color} text-white`}
            >
              {selectedSubject.icon}
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold">
                {selectedSubject.name}
              </div>
              <div className="text-gray-500 text-sm sm:text-base">
                {selectedSubject.code}
              </div>
              <div className="h-1 sm:h-2 bg-gray-200 rounded-full mt-1 sm:mt-2 w-32 sm:w-48">
                <div
                  className={`h-1 sm:h-2 rounded-full ${selectedSubject.color}`}
                  style={{ width: `${selectedSubject.attendance}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex border-b mb-2 sm:mb-4">
            <div
              className={`py-1 sm:py-2 px-2 sm:px-4 cursor-pointer ${
                activeTab === "lecturewise"
                  ? "border-b-2 border-blue-600 text-blue-600 font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => showTab("lecturewise")}
            >
              Lecture-wise
            </div>
            <div
              className={`py-1 sm:py-2 px-2 sm:px-4 cursor-pointer ${
                activeTab === "daywise"
                  ? "border-b-2 border-blue-600 text-blue-600 font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => showTab("daywise")}
            >
              Day-wise
            </div>
            <div
              className={`py-1 sm:py-2 px-2 sm:px-4 cursor-pointer ${
                activeTab === "summary"
                  ? "border-b-2 border-blue-600 text-blue-600 font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => showTab("summary")}
            >
              Summary
            </div>
          </div>

          {activeTab === "lecturewise" && (
            <div className="bg-white rounded-lg p-3 sm:p-5 shadow-sm">
              <ul>
                <li className="flex items-center py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <div className="w-20 sm:w-32">March 21, 2025</div>
                  <div className="w-24 sm:w-40">10:00 - 11:30 AM</div>
                  <div className="flex-grow">Introduction to Algorithms</div>
                  <div>
                    <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                      Present
                    </span>
                  </div>
                </li>
                <li className="flex items-center py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <div className="w-20 sm:w-32">March 19, 2025</div>
                  <div className="w-24 sm:w-40">10:00 - 11:30 AM</div>
                  <div className="flex-grow">Data Structures</div>
                  <div>
                    <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                      Present
                    </span>
                  </div>
                </li>
                <li className="flex items-center py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <div className="w-20 sm:w-32">March 17, 2025</div>
                  <div className="w-24 sm:w-40">10:00 - 11:30 AM</div>
                  <div className="flex-grow">Object-Oriented Programming</div>
                  <div>
                    <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                      Present
                    </span>
                  </div>
                </li>
                <li className="flex items-center py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <div className="w-20 sm:w-32">March 14, 2025</div>
                  <div className="w-24 sm:w-40">10:00 - 11:30 AM</div>
                  <div className="flex-grow">Software Design Patterns</div>
                  <div>
                    <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                      Present
                    </span>
                  </div>
                </li>
                <li className="flex items-center py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <div className="w-20 sm:w-32">March 12, 2025</div>
                  <div className="w-24 sm:w-40">10:00 - 11:30 AM</div>
                  <div className="flex-grow">Web Development Basics</div>
                  <div>
                    <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                      Present
                    </span>
                  </div>
                </li>
                <li className="flex items-center py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <div className="w-20 sm:w-32">March 10, 2025</div>
                  <div className="w-24 sm:w-40">10:00 - 11:30 AM</div>
                  <div className="flex-grow">Database Management</div>
                  <div>
                    <span className="bg-yellow-100 text-yellow-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                      Late
                    </span>
                  </div>
                </li>
                <li className="flex items-center py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <div className="w-20 sm:w-32">March 7, 2025</div>
                  <div className="w-24 sm:w-40">10:00 - 11:30 AM</div>
                  <div className="flex-grow">Computer Networks</div>
                  <div>
                    <span className="bg-blue-100 text-blue-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                      Present
                    </span>
                  </div>
                </li>
                <li className="flex items-center py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <div className="w-20 sm:w-32">March 5, 2025</div>
                  <div className="w-24 sm:w-40">10:00 - 11:30 AM</div>
                  <div className="flex-grow">Operating Systems</div>
                  <div>
                    <span className="bg-pink-100 text-pink-500 font-bold py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm">
                      Absent
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "daywise" && (
            <div className="bg-white rounded-lg p-3 sm:p-5 shadow-sm">
              <h3 className="mb-2 sm:mb-4 text-sm sm:text-base">March 2025</h3>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                <div className="text-center font-bold py-1 sm:py-2 border-b text-xs sm:text-sm">
                  Sun
                </div>
                <div className="text-center font-bold py-1 sm:py-2 border-b text-xs sm:text-sm">
                  Mon
                </div>
                <div className="text-center font-bold py-1 sm:py-2 border-b text-xs sm:text-sm">
                  Tue
                </div>
                <div className="text-center font-bold py-1 sm:py-2 border-b text-xs sm:text-sm">
                  Wed
                </div>
                <div className="text-center font-bold py-1 sm:py-2 border-b text-xs sm:text-sm">
                  Thu
                </div>
                <div className="text-center font-bold py-1 sm:py-2 border-b text-xs sm:text-sm">
                  Fri
                </div>
                <div className="text-center font-bold py-1 sm:py-2 border-b text-xs sm:text-sm">
                  Sat
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  26
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  27
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  28
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  29
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  30
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  31
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  1
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  2
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-blue-100 text-blue-500 text-xs sm:text-sm">
                  3
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  4
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-blue-100 text-blue-500 text-xs sm:text-sm">
                  5
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  6
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-blue-100 text-blue-500 text-xs sm:text-sm">
                  7
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  8
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  9
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-yellow-100 text-yellow-500 text-xs sm:text-sm">
                  10
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  11
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-blue-100 text-blue-500 text-xs sm:text-sm">
                  12
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  13
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-blue-100 text-blue-500 text-xs sm:text-sm">
                  14
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  15
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  16
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-blue-100 text-blue-500 text-xs sm:text-sm">
                  17
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  18
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-blue-100 text-blue-500 text-xs sm:text-sm">
                  19
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  20
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-blue-100 text-blue-500 text-xs sm:text-sm">
                  21
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  22
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  23
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-pink-100 text-pink-500 text-xs sm:text-sm">
                  24
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  25
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  26
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  27
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  28
                </div>
                <div className="flex items-center justify-center h-6 sm:h-10 bg-gray-100 text-gray-400 text-xs sm:text-sm">
                  29
                </div>
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div className="bg-white rounded-lg p-3 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between mb-2 sm:mb-4">
                <div className="text-center bg-gray-100 p-2 sm:p-4 rounded-lg w-full sm:w-1/3 mb-2 sm:mb-0">
                  <div className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                    95%
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Attendance Rate
                  </div>
                </div>
                <div className="text-center bg-gray-100 p-2 sm:p-4 rounded-lg w-full sm:w-1/3 mb-2 sm:mb-0">
                  <div className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                    38
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Total Present
                  </div>
                </div>
                <div className="text-center bg-gray-100 p-2 sm:p-4 rounded-lg w-full sm:w-1/3">
                  <div className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                    2
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Total Absent
                  </div>
                </div>
              </div>
              <div className="relative h-20 sm:h-40 bg-gray-100 rounded-lg p-2 sm:p-5 mt-2 sm:mt-4">
                <div className="absolute inset-x-0 bottom-2 sm:bottom-5 h-1 border-b border-gray-300"></div>
                <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 w-1 sm:w-2 h-1 sm:h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 sm:w-2 h-1 sm:h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute bottom-0 left-3/4 transform -translate-x-1/2 w-1 sm:w-2 h-1 sm:h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 translate-y-full text-xs text-gray-500">
                  March 1
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-xs text-gray-500">
                  March 15
                </div>
                <div className="absolute bottom-0 left-3/4 transform -translate-x-1/2 translate-y-full text-xs text-gray-500">
                  March 30
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceDashboard;
