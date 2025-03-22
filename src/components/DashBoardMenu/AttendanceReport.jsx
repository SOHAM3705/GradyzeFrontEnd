import React, { useState } from "react";

const AdminAttendanceDashboard = () => {
  const [view, setView] = useState("table");

  const toggleView = (viewType) => {
    setView(viewType);
  };

  const showDivisionDetails = (divisionCode) => {
    console.log("Show details for:", divisionCode);
    // Implement the logic to show division details
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold">
          Department Attendance Dashboard
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 p-5 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col">
          <div className="text-gray-500 text-sm mb-2">Department</div>
          <select className="p-2 border rounded">
            <option value="cs">Computer Science</option>
            <option value="it">Information Technology</option>
            <option value="ec">Electronics & Communication</option>
            <option value="me">Mechanical Engineering</option>
          </select>
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500 text-sm mb-2">Year</div>
          <select className="p-2 border rounded">
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3" selected>
              Third Year
            </option>
            <option value="4">Fourth Year</option>
          </select>
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500 text-sm mb-2">Semester</div>
          <select className="p-2 border rounded">
            <option value="1">Sem 1</option>
            <option value="2">Sem 2</option>
            <option value="3">Sem 3</option>
            <option value="4">Sem 4</option>
            <option value="5" selected>
              Sem 5
            </option>
            <option value="6">Sem 6</option>
            <option value="7">Sem 7</option>
            <option value="8">Sem 8</option>
          </select>
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500 text-sm mb-2">Month</div>
          <select className="p-2 border rounded">
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03" selected>
              March
            </option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className="flex flex-col flex-grow">
          <div className="text-gray-500 text-sm mb-2">Search</div>
          <input
            type="text"
            placeholder="Search by division, subject, or faculty"
            className="p-2 border rounded w-full"
          />
        </div>
        <button className="bg-blue-600 text-white p-2 rounded font-bold self-end">
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 text-sm mb-4">Overall Attendance</div>
          <div className="text-4xl font-bold text-blue-600 mb-4">83%</div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: "83%" }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">
            Computer Science Department
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 text-sm mb-4">Highest Division</div>
          <div className="text-4xl font-bold text-green-500 mb-4">91%</div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: "91%" }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">CSE-A Division</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 text-sm mb-4">Lowest Division</div>
          <div className="text-4xl font-bold text-red-500 mb-4">76%</div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: "76%" }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">CSE-D Division</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 text-sm mb-4">Students Below 75%</div>
          <div className="text-4xl font-bold text-pink-500 mb-4">42</div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-pink-500 rounded-full"
              style={{ width: "14%" }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">Out of 310 total students</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">Division-wise Attendance</div>
        <div className="flex gap-2">
          <button
            className={`p-2 border rounded ${
              view === "table"
                ? "bg-blue-100 text-blue-600 border-blue-600 font-bold"
                : ""
            }`}
            onClick={() => toggleView("table")}
          >
            Table View
          </button>
          <button
            className={`p-2 border rounded ${
              view === "card"
                ? "bg-blue-100 text-blue-600 border-blue-600 font-bold"
                : ""
            }`}
            onClick={() => toggleView("card")}
          >
            Card View
          </button>
          <button className="flex items-center bg-purple-600 text-white p-2 rounded font-bold">
            <span>↓</span> Export Report
          </button>
        </div>
      </div>

      {view === "table" && (
        <div className="bg-white p-5 rounded-lg shadow-sm mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                  Division
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                  Students
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                  Average
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                  This Month
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                  Trend
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                  Below 75%
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-500 bg-gray-100">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-3">
                  <span
                    className="font-bold text-blue-600 cursor-pointer"
                    onClick={() => showDivisionDetails("CSE-A")}
                  >
                    CSE-A
                  </span>
                </td>
                <td className="py-2 px-3">65</td>
                <td className="py-2 px-3">91%</td>
                <td className="py-2 px-3">93%</td>
                <td className="py-2 px-3">↑ 2%</td>
                <td className="py-2 px-3">1</td>
                <td className="py-2 px-3">
                  <span className="inline-block py-1 px-2 rounded-full text-xs font-bold bg-green-100 text-green-500">
                    High
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3">
                  <span
                    className="font-bold text-blue-600 cursor-pointer"
                    onClick={() => showDivisionDetails("CSE-B")}
                  >
                    CSE-B
                  </span>
                </td>
                <td className="py-2 px-3">63</td>
                <td className="py-2 px-3">87%</td>
                <td className="py-2 px-3">86%</td>
                <td className="py-2 px-3">↓ 1%</td>
                <td className="py-2 px-3">4</td>
                <td className="py-2 px-3">
                  <span className="inline-block py-1 px-2 rounded-full text-xs font-bold bg-green-100 text-green-500">
                    High
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3">
                  <span
                    className="font-bold text-blue-600 cursor-pointer"
                    onClick={() => showDivisionDetails("CSE-C")}
                  >
                    CSE-C
                  </span>
                </td>
                <td className="py-2 px-3">68</td>
                <td className="py-2 px-3">81%</td>
                <td className="py-2 px-3">85%</td>
                <td className="py-2 px-3">↑ 4%</td>
                <td className="py-2 px-3">9</td>
                <td className="py-2 px-3">
                  <span className="inline-block py-1 px-2 rounded-full text-xs font-bold bg-yellow-100 text-yellow-500">
                    Medium
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3">
                  <span
                    className="font-bold text-blue-600 cursor-pointer"
                    onClick={() => showDivisionDetails("CSE-D")}
                  >
                    CSE-D
                  </span>
                </td>
                <td className="py-2 px-3">62</td>
                <td className="py-2 px-3">76%</td>
                <td className="py-2 px-3">79%</td>
                <td className="py-2 px-3">↑ 3%</td>
                <td className="py-2 px-3">15</td>
                <td className="py-2 px-3">
                  <span className="inline-block py-1 px-2 rounded-full text-xs font-bold bg-yellow-100 text-yellow-500">
                    Medium
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3">
                  <span
                    className="font-bold text-blue-600 cursor-pointer"
                    onClick={() => showDivisionDetails("CSE-E")}
                  >
                    CSE-E
                  </span>
                </td>
                <td className="py-2 px-3">52</td>
                <td className="py-2 px-3">78%</td>
                <td className="py-2 px-3">73%</td>
                <td className="py-2 px-3">↓ 5%</td>
                <td className="py-2 px-3">13</td>
                <td className="py-2 px-3">
                  <span className="inline-block py-1 px-2 rounded-full text-xs font-bold bg-red-100 text-red-500">
                    Low
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-white p-5 rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => showDivisionDetails("CSE-A")}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-bold">CSE-A Division</div>
                <div className="text-gray-500 text-sm">65 Students</div>
              </div>
              <span className="inline-block py-1 px-2 rounded-full text-xs font-bold bg-green-100 text-green-500">
                High
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: "91%" }}
              ></div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <div className="font-bold text-lg">91%</div>
                <div className="text-gray-500 text-sm">Average</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">93%</div>
                <div className="text-gray-500 text-sm">This Month</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">↑ 2%</div>
                <div className="text-gray-500 text-sm">Trend</div>
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-2">
                Students Below 75%: 1
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-200 py-1 px-2 rounded-full text-xs">
                  Smith John
                </div>
              </div>
            </div>
          </div>
          <div
            className="bg-white p-5 rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => showDivisionDetails("CSE-B")}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-bold">CSE-B Division</div>
                <div className="text-gray-500 text-sm">63 Students</div>
              </div>
              <span className="inline-block py-1 px-2 rounded-full text-xs font-bold bg-green-100 text-green-500">
                High
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: "87%" }}
              ></div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <div className="font-bold text-lg">87%</div>
                <div className="text-gray-500 text-sm">Average</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">86%</div>
                <div className="text-gray-500 text-sm">This Month</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">↓ 1%</div>
                <div className="text-gray-500 text-sm">Trend</div>
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-2">
                Students Below 75%: 4
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-200 py-1 px-2 rounded-full text-xs">
                  Steve Rogers
                </div>
                <div className="bg-gray-200 py-1 px-2 rounded-full text-xs">
                  Tony Stark
                </div>
                <div className="bg-gray-200 py-1 px-2 rounded-full text-xs">
                  +2 more
                </div>
              </div>
            </div>
          </div>
          <div
            className="bg-white p-5 rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => showDivisionDetails("CSE-C")}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-bold">CSE-C Division</div>
                <div className="text-gray-500 text-sm">68 Students</div>
              </div>
              <span className="inline-block py-1 px-2 rounded-full text-xs font-bold bg-yellow-100 text-yellow-500">
                Medium
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: "81%" }}
              ></div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <div className="font-bold text-lg">81%</div>
                <div className="text-gray-500 text-sm">Average</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">85%</div>
                <div className="text-gray-500 text-sm">This Month</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">↑ 4%</div>
                <div className="text-gray-500 text-sm">Trend</div>
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-2">
                Students Below 75%: 9
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-200 py-1 px-2 rounded-full text-xs">
                  Student 1
                </div>
                <div className="bg-gray-200 py-1 px-2 rounded-full text-xs">
                  Student 2
                </div>
                <div className="bg-gray-200 py-1 px-2 rounded-full text-xs">
                  +7 more
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendanceDashboard;
