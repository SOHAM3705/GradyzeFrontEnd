import React, { useContext, useState, useEffect } from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";
import axios from "axios";

const ManageClasses = () => {
  const {
    loading,
    error: contextError,
    clearError,
  } = useContext(AttendanceContext);
  const [classes, setClasses] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        setError("Teacher ID not found in session");
        return;
      }

      setLocalLoading(true);
      clearError();
      try {
        // Fetch the classes assigned to this subject teacher
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/subject-details/${teacherId}`
        );

        // Transform the subject data into class format if needed
        const assignedClasses = response.data.subjects.map((subject) => ({
          _id: subject._id, // or generate a unique ID if needed
          className: `${subject.name} - ${subject.division}`,
          description: `Year ${subject.year}, Semester ${subject.semester}`,
        }));

        setClasses(assignedClasses);
      } catch (err) {
        console.error("Error fetching assigned classes:", err);
        setError(
          err.response?.data?.error || "Failed to load assigned classes"
        );
      } finally {
        setLocalLoading(false);
      }
    };

    fetchAssignedClasses();
  }, [clearError]);

  useEffect(() => {
    if (contextError) setError(contextError);
  }, [contextError]);

  const isLoading = loading || localLoading;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        My Assigned Classes
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Classes Assigned to You</h2>
          <button
            onClick={() => window.location.reload()}
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
                    Class/Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
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
                      {classItem.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No classes assigned to you yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;
