import React, { useContext, useState, useEffect, useCallback } from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";

const ManageStudents = () => {
  const {
    classes,
    students,
    loading,
    loadStudents,
    error: contextError,
    clearError,
  } = useContext(AttendanceContext);

  const [selectedClass, setSelectedClass] = useState("");
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (contextError) setError(contextError);
  }, [contextError]);

  const handleLoadStudents = useCallback(async () => {
    if (!selectedClass) return;

    setLocalLoading(true);
    clearError();
    try {
      await loadStudents(selectedClass);
    } catch (err) {
      setError("Failed to load students. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  }, [selectedClass, loadStudents, clearError]);

  useEffect(() => {
    handleLoadStudents();
  }, [handleLoadStudents]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setError(null);
  };

  const isLoading = loading || localLoading;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Students</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">-- Select Class --</option>
              {classes.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.className}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleLoadStudents}
              disabled={!selectedClass || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 w-full md:w-auto"
            >
              {isLoading ? "Loading..." : "Refresh Students"}
            </button>
          </div>
        </div>
      </div>

      {selectedClass && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Students in Selected Class
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No students available in this class.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
