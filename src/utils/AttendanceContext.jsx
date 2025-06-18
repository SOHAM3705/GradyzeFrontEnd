import React, { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

export const AttendanceContext = createContext({
  // Default values
  classes: [],
  students: [],
  schedules: [],
  attendanceRecords: [],
  loading: false,
  error: null,
  fetchClasses: async () => {},
  loadStudents: async () => {},
  saveAttendance: async () => {},
  scheduleClass: async () => {},
  fetchSchedules: async () => {},
  fetchAttendanceRecords: async () => {},
  addClass: async () => {},
  addStudent: async () => {},
  clearError: () => {},
});

export const AttendanceProvider = ({ children }) => {
  // State variables
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error function
  const clearError = useCallback(() => setError(null), []);

  // Fetch all classes
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const response = await axios.get("/api/classes");
      setClasses(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Load students for a class
  const loadStudents = useCallback(
    async (classId) => {
      setLoading(true);
      clearError();
      try {
        const response = await axios.get(`/api/students/class/${classId}`);
        setStudents(response.data);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError]
  );

  // Save attendance
  const saveAttendance = useCallback(
    async (attendanceData) => {
      setLoading(true);
      clearError();
      try {
        const response = await axios.post("/api/attendance", attendanceData);
        await fetchAttendanceRecords(attendanceData.classId);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError, fetchAttendanceRecords]
  );

  // Schedule a class
  const scheduleClass = useCallback(
    async (scheduleData) => {
      setLoading(true);
      clearError();
      try {
        const response = await axios.post("/api/schedules", scheduleData);
        await fetchSchedules();
        return response.data;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError, fetchSchedules]
  );

  // Fetch schedules
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const response = await axios.get("/api/schedules");
      setSchedules(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Fetch attendance records
  const fetchAttendanceRecords = useCallback(
    async (classId, startDate, endDate) => {
      setLoading(true);
      clearError();
      try {
        const params = new URLSearchParams();
        if (classId) params.append("classId", classId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await axios.get(
          `/api/attendance?${params.toString()}`
        );
        setAttendanceRecords(response.data);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError]
  );

  // Add class
  const addClass = useCallback(
    async (classData) => {
      setLoading(true);
      clearError();
      try {
        const response = await axios.post("/api/classes", classData);
        setClasses((prev) => [...prev, response.data]);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError]
  );

  // Add student
  const addStudent = useCallback(
    async (studentData) => {
      setLoading(true);
      clearError();
      try {
        const response = await axios.post("/api/students", studentData);
        if (studentData.classId) {
          await loadStudents(studentData.classId);
        }
        return response.data;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError, loadStudents]
  );

  // Initial data loading
  useEffect(() => {
    fetchClasses();
    fetchSchedules();
  }, [fetchClasses, fetchSchedules]);

  return (
    <AttendanceContext.Provider
      value={{
        classes,
        students,
        schedules,
        attendanceRecords,
        loading,
        error,
        fetchClasses,
        loadStudents,
        saveAttendance,
        scheduleClass,
        fetchSchedules,
        fetchAttendanceRecords,
        addClass,
        addStudent,
        clearError,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
   n          