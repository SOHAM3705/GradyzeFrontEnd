import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  // State variables
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all classes - converted to useCallback to avoid recreating on each render
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching classes...');
      const response = await axios.get('/api/classes');
      console.log('Classes fetched:', response.data);
      setClasses(response.data);
      return response.data; // Return data for components that need immediate access
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to fetch classes: ' + (err.response?.data?.error || err.message));
      return []; // Return empty array to prevent further errors
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStudents = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/students/class/${classId}`);
      setStudents(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students: ' + (err.response?.data?.error || err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAttendance = async (attendanceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/attendance', attendanceData);
      // Optionally fetch the latest attendance records
      fetchAttendanceRecords(attendanceData.classId);
      return response.data;
    } catch (err) {
      console.error('Error saving attendance:', err);
      setError('Failed to save attendance: ' + (err.response?.data?.error || err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const scheduleClass = async (scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Scheduling class with data:', scheduleData);
      const response = await axios.post('/api/schedules', scheduleData);
      console.log('Schedule response:', response.data);
      // Refresh schedules after adding a new one
      await fetchSchedules();
      return response.data;
    } catch (err) {
      console.error('Error scheduling class:', err);
      setError('Failed to schedule class: ' + (err.response?.data?.error || err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to fetch schedules: ' + (err.response?.data?.error || err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttendanceRecords = useCallback(async (classId, startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/attendance';
      
      // Add query parameters if provided
      if (classId || startDate || endDate) {
        url += '?';
        if (classId) url += `classId=${classId}&`;
        if (startDate) url += `startDate=${startDate}&`;
        if (endDate) url += `endDate=${endDate}&`;
        // Remove trailing '&' or '?'
        url = url.replace(/[&?]$/, '');
      }
      
      const response = await axios.get(url);
      setAttendanceRecords(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching attendance records:', err);
      setError('Failed to fetch attendance records: ' + (err.response?.data?.error || err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // FIXED: Improved class creation function with better state management
  const addClass = async (classData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Adding class with data:', classData);
      const response = await axios.post('/api/classes', classData);
      console.log('Class added response:', response.data);
      
      // FIXED: Properly update the classes state with the new class
      // Using function form to ensure we're working with the latest state
      setClasses(currentClasses => {
        // Check if class already exists to prevent duplicates
        const exists = currentClasses.some(c => c._id === response.data._id);
        if (exists) {
          return currentClasses;
        }
        return [...currentClasses, response.data];
      });
      
      return response.data;
    } catch (err) {
      console.error('Error adding class:', err);
      const errorMessage = err.response?.data?.error || err.message;
      setError('Failed to add class: ' + errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // For adding new student
  const addStudent = async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/students', studentData);
      // If a class is selected, refresh students for that class
      if (studentData.classId) {
        await loadStudents(studentData.classId);
      }
      return response.data;
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to add student: ' + (err.response?.data?.error || err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
        addStudent
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};