import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";
import AttendanceDatePicker from "./shared/AttendanceDataPicker";

const ClassSchedules = () => {
  const {
    classes,
    schedules,
    fetchSchedules,
    fetchClasses,
    loading,
    error: contextError,
    clearError,
  } = useContext(AttendanceContext);

  const [filter, setFilter] = useState({
    classId: "",
    date: "",
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);

  const isLoading = loading || localLoading;
  const errorMessage = error || contextError;

  const loadData = useCallback(async () => {
    setLocalLoading(true);
    setError(null);
    try {
      await fetchClasses();
      await fetchSchedules();
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  }, [fetchClasses, fetchSchedules]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesClass =
        !filter.classId || schedule.classId === filter.classId;
      const scheduleDate = new Date(schedule.date).toISOString().split("T")[0];
      const matchesDate = !filter.date || scheduleDate === filter.date;
      return matchesClass && matchesDate;
    });
  }, [schedules, filter]);

  const getClassName = useCallback(
    (classId) => {
      const foundClass = classes.find((c) => c._id === classId);
      return foundClass ? foundClass.className : "Unknown Class";
    },
    [classes]
  );

  const formatTime = useCallback((time24h) => {
    if (!time24h) return "N/A";
    const [hours, minutes] = time24h.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  }, []);

  const isToday = useCallback((dateString) => {
    const today = new Date().toISOString().split("T")[0];
    const scheduleDate = new Date(dateString).toISOString().split("T")[0];
    return today === scheduleDate;
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Class Schedules</h1>

      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                name="classId"
                value={filter.classId}
                onChange={handleFilterChange}
                disabled={isLoading}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Classes</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <AttendanceDatePicker
                label="Filter by Date"
                name="date"
                value={filter.date}
                onChange={(e) => handleFilterChange({ target: e.target })}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
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
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
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
                      {new Date(schedule.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getClassName(schedule.classId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {schedule.title || "N/A"}
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
