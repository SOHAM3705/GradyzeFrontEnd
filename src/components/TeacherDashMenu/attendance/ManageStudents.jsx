import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageStudents = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        setError("Teacher ID not found in session");
        return;
      }

      setLoading(true);
      try {
        // Fetch the classes/subjects assigned to this teacher
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/subject-details/${teacherId}`
        );

        // Transform the subject data into class format
        const assignedClasses = response.data.subjects.map((subject) => ({
          _id: subject._id,
          className: `${subject.name} - ${subject.division}`,
          year: subject.year,
          division: subject.division,
        }));

        setClasses(assignedClasses);
      } catch (err) {
        console.error("Error fetching assigned classes:", err);
        setError(
          err.response?.data?.error || "Failed to load assigned classes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, []);

  useEffect(() => {
    const fetchStudentsForClass = async () => {
      if (!selectedClass) return;

      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        setError("Teacher ID not found in session");
        return;
      }

      setLoading(true);
      try {
        // Find the selected class details
        const selectedClassObj = classes.find((c) => c._id === selectedClass);
        if (!selectedClassObj) return;

        // Fetch students for this class/division/year
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/students-by-class`,
          {
            params: {
              year: selectedClassObj.year,
              division: selectedClassObj.division,
            },
          }
        );

        setStudents(response.data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.response?.data?.error || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsForClass();
  }, [selectedClass, classes]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setError(null);
  };

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
              Select Class/Subject
            </label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">-- Select Class --</option>
              {classes.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.className}
                </option>
              ))}
            </select>
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

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
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
