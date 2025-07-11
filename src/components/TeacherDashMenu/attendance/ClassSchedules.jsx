import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";

const ClassSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState({
    subjectKey: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthToken = () => sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTeacherSubjects = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/schedules`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSchedules(response.data.data); // all schedules fetched

        // Extract unique subjects from schedules
        const uniqueSubjects = {};
        response.data.data?.forEach((schedule) => {
          const key = `${schedule.subjectName}_${schedule.year}_${schedule.division}`;
          if (!uniqueSubjects[key]) {
            uniqueSubjects[key] = {
              key,
              subjectName: schedule.subjectName,
              year: schedule.year,
              division: schedule.division,
              teacherId: schedule.teacherId,
              teacherName: schedule.teacherName,
            };
          }
        });

        const subjectsArray = Object.values(uniqueSubjects);
        setSubjects(subjectsArray);

        if (subjectsArray.length > 0) {
          setFilter((prev) => ({ ...prev, subjectKey: subjectsArray[0].key }));
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherSubjects();
  }, []);

  const handleRefresh = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/schedules`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSchedules(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to refresh schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const safeDateParse = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const subjectKey = `${schedule.subjectName}_${schedule.year}_${schedule.division}`;

      const matchesSubject =
        !filter.subjectKey || subjectKey === filter.subjectKey;

      const scheduleDate = safeDateParse(schedule.date);
      const filterDate = safeDateParse(filter.date);

      const matchesDate =
        !filter.date ||
        (scheduleDate &&
          filterDate &&
          scheduleDate.getFullYear() === filterDate.getFullYear() &&
          scheduleDate.getMonth() === filterDate.getMonth() &&
          scheduleDate.getDate() === filterDate.getDate());

      return matchesSubject && matchesDate;
    });
  }, [schedules, filter]);

  const formatTime = (time24h) => {
    if (!time24h) return "N/A";
    const [hours, minutes] = time24h.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const isToday = (dateString) => {
    const date = safeDateParse(dateString);
    if (!date) return false;

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Class Schedules</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>

          <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                name="subjectKey"
                value={filter.subjectKey}
                onChange={handleFilterChange}
                disabled={loading || subjects.length === 0}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {subjects.length === 0 ? (
                  <option value="">No subjects available</option>
                ) : (
                  <>
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.key} value={subject.key}>
                        {subject.subjectName} ({subject.year}, Div:{" "}
                        {subject.division})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <AttendanceDatePicker
                selected={filter.date ? new Date(filter.date) : null}
                onChange={(date) =>
                  handleFilterChange({
                    target: {
                      name: "date",
                      value: date.toISOString().split("T")[0],
                    },
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredSchedules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => (
                  <tr
                    key={schedule._id}
                    className={isToday(schedule.date) ? "bg-yellow-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        const date = safeDateParse(schedule.date);
                        return date
                          ? date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              weekday: "short",
                            })
                          : "Invalid date";
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">
                        {schedule.title || "N/A"}
                      </div>
                      <div className="text-gray-400">
                        {schedule.subjectName} ({schedule.year}, Div:{" "}
                        {schedule.division})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(schedule.startTime)} -{" "}
                      {formatTime(schedule.endTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {schedule.description || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No schedules found. Please adjust your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassSchedules;
