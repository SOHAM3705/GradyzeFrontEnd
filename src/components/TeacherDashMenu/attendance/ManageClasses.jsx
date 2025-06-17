import React, { useContext, useState, useEffect, useCallback } from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";

const ManageClasses = () => {
  const {
    classes,
    loading,
    addClass,
    fetchClasses,
    error: contextError,
    clearError,
  } = useContext(AttendanceContext);

  const [newClass, setNewClass] = useState({
    className: "",
    description: "",
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const loadClasses = useCallback(async () => {
    setLocalLoading(true);
    try {
      await fetchClasses();
    } catch (err) {
      console.error("Error loading classes:", err);
      setError("Failed to load classes. Please refresh the page.");
    } finally {
      setLocalLoading(false);
    }
  }, [fetchClasses]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (contextError) setError(contextError);
  }, [contextError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setError(null);
    setSuccessMessage(null);

    if (!newClass.className.trim()) {
      setError("Class name cannot be empty");
      return;
    }

    const isDuplicate = classes.some(
      (c) => c.className.toLowerCase() === newClass.className.toLowerCase()
    );

    if (isDuplicate) {
      setError("A class with this name already exists");
      return;
    }

    setLocalLoading(true);

    try {
      await addClass(newClass);
      setNewClass({ className: "", description: "" });
      setSuccessMessage("Class added successfully!");
      await fetchClasses();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add class");
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Classes</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Class Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Class</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <input
                type="text"
                name="className"
                value={newClass.className}
                onChange={handleChange}
                required
                placeholder="E.g. Mathematics 101"
                disabled={isLoading}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={newClass.description}
                onChange={handleChange}
                placeholder="Brief description about the class"
                disabled={isLoading}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Class"}
            </button>
          </form>
        </div>

        {/* Class List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Existing Classes</h2>
            <button
              onClick={loadClasses}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 text-sm"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : classes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.map((classItem) => (
                    <tr key={classItem._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {classItem.className}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {classItem.description || "No description"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No classes available. Add your first class.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageClasses;
