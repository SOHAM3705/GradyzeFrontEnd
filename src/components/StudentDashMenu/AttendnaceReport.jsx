import React, { useState, useEffect } from "react";
import {
  Calendar,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const StudentAttendanceDashboard = () => {
  const [studentId] = useState(sessionStorage.getItem("studentId"));
  const [studentInfo, setStudentInfo] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [subjectsAttendance, setSubjectsAttendance] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectAttendanceDetails, setSubjectAttendanceDetails] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student info and subjects with attendance
  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // 1. Fetch student details
      const studentResponse = await fetch(
        `${API_BASE_URL}/api/students/${studentId}`
      );
      if (!studentResponse.ok) throw new Error("Failed to fetch student data");
      const studentData = await studentResponse.json();
      setStudentInfo(studentData);

      // 2. Fetch overall attendance summary
      const attendanceResponse = await fetch(
        `${API_BASE_URL}/api/student/attendance/${studentId}`
      );
      if (!attendanceResponse.ok) throw new Error("Failed to fetch attendance");
      const attendanceResult = await attendanceResponse.json();
      setAttendanceData(attendanceResult.data);

      // 3. Fetch subjects with attendance stats
      const subjectsResponse = await fetch(
        `${API_BASE_URL}/api/student/${studentId}/subjects-attendance`
      );
      if (!subjectsResponse.ok) throw new Error("Failed to fetch subjects");
      const subjectsResult = await subjectsResponse.json();
      setSubjectsAttendance(subjectsResult.data || []);

      // Set first subject as selected by default if available
      if (subjectsResult.data?.length > 0) {
        setSelectedSubject(subjectsResult.data[0].subject);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed attendance for specific subject
  const fetchSubjectAttendanceDetails = async (subjectName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/student/attendance/${studentId}/subject/${encodeURIComponent(
          subjectName
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch subject attendance");
      const result = await response.json();
      setSubjectAttendanceDetails(result.data);
      setSelectedSubject(subjectName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  // Auto-fetch details when selected subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchSubjectAttendanceDetails(selectedSubject);
    }
  }, [selectedSubject]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status) => {
    return status === "Present" ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  if (loading && !studentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Attendance Dashboard
          </h1>
          {studentInfo && (
            <p className="text-gray-600">
              {studentInfo.studentName} - {studentInfo.year}{" "}
              {studentInfo.division}
            </p>
          )}
        </div>

        {/* Overall Statistics */}
        {attendanceData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Overall Attendance
                  </p>
                  <p
                    className={`text-3xl font-bold ${getAttendanceColor(
                      attendanceData.attendancePercentage
                    )}`}
                  >
                    {attendanceData.attendancePercentage}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Classes
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {attendanceData.totalClasses}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-gray-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-3xl font-bold text-green-600">
                    {attendanceData.presentClasses}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-3xl font-bold text-red-600">
                    {attendanceData.absentClasses}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Subjects Section */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">My Subjects</h2>
            <p className="text-gray-600">
              {subjectsAttendance.length} subjects enrolled
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              {subjectsAttendance.map((subject) => (
                <div
                  key={subject.subject}
                  onClick={() => setSelectedSubject(subject.subject)}
                  className={`px-4 py-2 rounded-full border cursor-pointer transition-all ${
                    selectedSubject === subject.subject
                      ? "bg-blue-100 border-blue-500 text-blue-800"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{subject.subject}</span>
                    <span
                      className={`text-xs font-medium ${getAttendanceColor(
                        subject.attendancePercentage
                      )}`}
                    >
                      {subject.attendancePercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Attendance Details */}
        {selectedSubject && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedSubject} Attendance Details
              </h2>
              {subjectsAttendance.find(
                (s) => s.subject === selectedSubject
              ) && (
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`text-sm font-medium ${getAttendanceColor(
                      subjectsAttendance.find(
                        (s) => s.subject === selectedSubject
                      ).attendancePercentage
                    )}`}
                  >
                    Overall:{" "}
                    {
                      subjectsAttendance.find(
                        (s) => s.subject === selectedSubject
                      ).attendancePercentage
                    }
                    %
                  </span>
                  <span className="text-sm text-gray-500">
                    Present:{" "}
                    {
                      subjectsAttendance.find(
                        (s) => s.subject === selectedSubject
                      ).presentClasses
                    }
                  </span>
                  <span className="text-sm text-gray-500">
                    Absent:{" "}
                    {
                      subjectsAttendance.find(
                        (s) => s.subject === selectedSubject
                      ).absentClasses
                    }
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading attendance details...</p>
                </div>
              ) : subjectAttendanceDetails ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {subjectAttendanceDetails.attendanceDetails.map(
                    (record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(record.status)}
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatDate(record.date)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            record.status === "Present"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No attendance records found for {selectedSubject}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceDashboard;
