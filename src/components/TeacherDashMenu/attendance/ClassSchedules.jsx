import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";

const ClassSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]); // Will store unique year/division combinations
  const [filter, setFilter] = useState({
    year: "",
    division: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get authorization token from session storage
  const getAuthToken = () => {
    return sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchSchedulesData = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      setLoading(true);
      try {
        // Fetch teacher's schedules
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/schedules`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSchedules(response.data.data || []);

        // Extract unique year/division combinations
        const uniqueClasses = Array.from(
          new Set(
            response.data.data.map(
              (schedule) => `${schedule.year}_${schedule.division}`
            )
          )
        ).map((classStr) => {
          const [year, division] = classStr.split("_");
          return { year, division };
        });

        setClasses(uniqueClasses);

        if (uniqueClasses.length > 0) {
          // Set initial filter to first class
          setFilter((prev) => ({
            ...prev,
            year: uniqueClasses[0].year,
            division: uniqueClasses[0].division,
          }));
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulesData();
  }, []);

  const fetchSchedulesByClass = async (year, division) => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/schedules/class/${year}/${division}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedules(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!filter.year || !filter.division) return;
    await fetchSchedulesByClass(filter.year, filter.division);
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    if (
      (name === "year" || name === "division") &&
      filter.year &&
      filter.division
    ) {
      await fetchSchedulesByClass(
        name === "year" ? value : filter.year,
        name === "division" ? value : filter.division
      );
    }
  };

  const safeDateParse = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      if (!filter.date) return true;

      const scheduleDate = safeDateParse(schedule.date);
      const filterDate = safeDateParse(filter.date);

      if (!scheduleDate || !filterDate) return false;

      return (
        scheduleDate.getFullYear() === filterDate.getFullYear() &&
        scheduleDate.getMonth() === filterDate.getMonth() &&
        scheduleDate.getDate() === filterDate.getDate()
      );
    });
  }, [schedules, filter.date]);

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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                name="year"
                value={filter.year}
                onChange={handleFilterChange}
                disabled={loading || classes.length === 0}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {classes.length === 0 ? (
                  <option value="">No classes available</option>
                ) : (
                  <>
                    <option value="">All Years</option>
                    {Array.from(new Set(classes.map((c) => c.year))).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division
              </label>
              <select
                name="division"
                value={filter.division}
                onChange={handleFilterChange}
                disabled={loading || classes.length === 0 || !filter.year}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {classes.length === 0 ? (
                  <option value="">No divisions available</option>
                ) : (
                  <>
                    <option value="">All Divisions</option>
                    {classes
                      .filter((c) => !filter.year || c.year === filter.year)
                      .map((cls) => (
                        <option key={cls.division} value={cls.division}>
                          {cls.division}
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
                  setFilter((prev) => ({
                    ...prev,
                    date: date.toISOString().split("T")[0],
                  }))
                }
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
                    Class & Subject
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
                        {schedule.year} - {schedule.division} |{" "}
                        {schedule.subjectName}
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
            No schedules found. Please add schedules or adjust your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassSchedules;
