// Fixed ScheduleClass.jsx with improved context usage
import React, { useContext, useState, useEffect } from "react";
import { AttendanceContext } from "../../../utils/AttendanceContext";

const ScheduleClass = () => {
  const { classes, scheduleClass, loading, fetchClasses } =
    useContext(AttendanceContext);

  const [scheduleData, setScheduleData] = useState({
    classId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    title: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch classes when component mounts
  useEffect(() => {
    const loadClasses = async () => {
      try {
        await fetchClasses();
      } catch (err) {
        console.error("Error loading classes in ScheduleClass component:", err);
        setError("Failed to load classes. Please refresh the page.");
      }
    };

    loadClasses();
  }, [fetchClasses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear messages when user makes changes
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate end time is after start time
    if (scheduleData.startTime >= scheduleData.endTime) {
      setError("End time must be after start time");
      return;
    }

    try {
      await scheduleClass(scheduleData);
      setSuccessMessage("Class scheduled successfully!");

      // Reset form
      setScheduleData({
        classId: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
        title: "",
        description: "",
      });
    } catch (err) {
      console.error("Error scheduling class:", err);
      setError(
        err.response?.data?.error ||
          "Failed to schedule class. Please try again."
      );
    }
  };

  return (
    <div className="schedule-form">
      <h3>Schedule a Class</h3>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          {error}
        </div>
      )}
      {successMessage && (
        <div
          className="success-message"
          style={{ color: "green", marginBottom: "10px" }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="classId">Select Class</label>
          <select
            id="classId"
            name="classId"
            value={scheduleData.classId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Class --</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Class Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={scheduleData.title}
            onChange={handleChange}
            required
            placeholder="E.g. Mathematics Lecture"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={scheduleData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={scheduleData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={scheduleData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={scheduleData.description}
            onChange={handleChange}
            placeholder="Additional information about the class"
          />
        </div>

        <button type="submit" className="btn-schedule" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Class"}
        </button>
      </form>
    </div>
  );
};

export default ScheduleClass;
