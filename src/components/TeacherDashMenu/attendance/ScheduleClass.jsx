import React, { useState, useEffect } from "react";
import axios from "axios";
import { AttendanceDatePicker } from "./shared/AttendanceDataPicker";

const API_BASE_URL = "https://gradyzebackend.onrender.com";

const ScheduleClass = () => {
  const [formData, setFormData] = useState({
    subjectName: "",
    year: "",
    division: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    title: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchTeacherSubjects = async () => {
      const teacherId = sessionStorage.getItem("teacherId");
      const token = sessionStorage.getItem("token");
      if (!teacherId || !token) {
        setError("Authentication required");
        return;
      }

      setLoading(true);
      try {
        // Using the correct endpoint to get teacher's subjects
        const response = await axios.get(
          `${API_BASE_URL}/api/studentmanagement/subject-details/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Make sure we're accessing the correct data property
        const receivedSubjects =
          response.data.subjects || response.data.data || [];
        setSubjects(receivedSubjects);
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
    if (date instanceof Date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    const selectedSubject = subjects.find((s) => s._id === subjectId);

    if (selectedSubject) {
      setFormData((prev) => ({
        ...prev,
        subjectName: selectedSubject.name,
        year: selectedSubject.year,
        division: selectedSubject.division,
        title: `${selectedSubject.name} Class`,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
      return;
    }

    if (!formData.subjectName || !formData.year || !formData.division) {
      setError("Please select a valid subject");
      return;
    }

    const teacherId = sessionStorage.getItem("teacherId");
    const token = sessionStorage.getItem("token");
    if (!teacherId || !token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        subjectName: formData.subjectName,
        year: formData.year,
        division: formData.division,
        date: formData.date.toISOString().split("T")[0],
        startTime: formData.startTime,
        endTime: formData.endTime,
        description: formData.description,
        title: formData.title || `${formData.subjectName} Class`,
        teacherId: teacherId,
        teacherName: sessionStorage.getItem("teacherName") || "Teacher",
      };

      // Using the correct endpoint for creating schedules
      const response = await axios.post(
        `${API_BASE_URL}/api/schedules`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Class scheduled successfully!");
      setFormData({
        subjectName: "",
        year: "",
        division: "",
        date: new Date(),
        startTime: "09:00",
        endTime: "10:00",
        description: "",
        title: "",
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
                name="subject"
                onChange={handleSubjectChange}
                required
                disabled={loading || subjects.length === 0}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select Subject --</option>
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} ({subject.year}, Div: {subject.division})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {loading ? "Loading subjects..." : "No subjects assigned"}
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="E.g. Mathematics Lecture"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <AttendanceDatePicker
                selected={formData.date}
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
                disabled={loading || !formData.subjectName}
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
