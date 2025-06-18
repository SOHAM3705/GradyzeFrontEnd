import React, { useState, useEffect } from "react";
import axios from "axios";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";

const ScheduleClass = () => {
  const [formData, setFormData] = useState({
    classId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    description: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchTeacherSubjects = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      if (!teacherId) {
        setError("Teacher ID not found in session");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/studentmanagement/subject-details/${teacherId}`
        );

        setSubjects(response.data.subjects);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load assigned subjects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date.toISOString().split("T")[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
      return;
    }

    const selectedSubject = subjects.find((s) => s._id === formData.classId);
    if (!selectedSubject) {
      setError("Selected subject not found");
      return;
    }

    const teacherId = sessionStorage.getItem("teacherId");
    if (!teacherId) {
      setError("Teacher ID not found in session");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/schedules",
        {
          ...formData,
          title: selectedSubject.name,
          year: selectedSubject.year,
          division: selectedSubject.division,
          teacherId: teacherId,
          subjectId: selectedSubject._id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      setSuccessMessage("Class scheduled successfully!");
      setFormData({
        classId: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
        description: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Schedule a Class
      </h1>

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

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                disabled={loading || subjects.length === 0}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} ({subject.year}, Div: {subject.division})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <AttendanceDatePicker
                selectedDate={new Date(formData.date)}
                onChange={handleDateChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional information about the class"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !formData.classId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Scheduling..." : "Schedule Class"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleClass;
