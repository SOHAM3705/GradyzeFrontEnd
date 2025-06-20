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
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectAttendanceDetails, setSubjectAttendanceDetails] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student info and subjects
  const fetchStudentInfoAndSubjects = async () => {
    try {
      setLoading(true);

      // 1. Fetch student details
      const studentResponse = await fetch(
        `${API_BASE_URL}/api/students/${studentId}`
      );
      if (!studentResponse.ok) throw new Error("Failed to fetch student data");
      const studentData = await studentResponse.json();
      setStudentInfo(studentData);

      // 2. Fetch subjects for student (based on adminId, year, division)
      const subjectsResponse = await fetch(
        `${API_BASE_URL}/api/studentattendance/${studentId}/subjects`
      );
      if (!subjectsResponse.ok) throw new Error("Failed to fetch subjects");
      const subjectsData = await subjectsResponse.json();
      setSubjects(subjectsData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch overall attendance data
  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/studentattendance/attendance/${studentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch attendance data");
      const result = await response.json();
      setAttendanceData(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch detailed attendance for specific subject
  const fetchSubjectAttendanceDetails = async (subjectName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/studentattendance/attendance/${studentId}/subject/${encodeURIComponent(
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
    const loadData = async () => {
      await fetchStudentInfoAndSubjects();
      await fetchAttendanceData();
    };
    loadData();
  }, [studentId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-600 bg-green-50";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
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
              {studentInfo.year} - Division {studentInfo.division}
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
                    className={`text-3xl font-bold ${
                      getAttendanceColor(
                        attendanceData.attendancePercentage
                      ).split(" ")[0]
                    }`}
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

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subjects List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Subjects</h2>
              <p className="text-gray-600">
                Click on any subject to view detailed attendance
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div
                    key={subject}
                    onClick={() => fetchSubjectAttendanceDetails(subject)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedSubject === subject
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {subject}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Year {studentInfo?.year} - Division{" "}
                          {studentInfo?.division}
                        </p>
                      </div>
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Attendance */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Attendance Details
              </h2>
              {subjectAttendanceDetails && (
                <p className="text-gray-600">{selectedSubject}</p>
              )}
            </div>
            <div className="p-6">
              {!subjectAttendanceDetails ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select a subject to view detailed attendance
                  </p>
                </div>
              ) : loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading details...</p>
                </div>
              ) : (
                <div>
                  {/* Subject Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {subjectAttendanceDetails.presentClasses}
                        </p>
                        <p className="text-sm text-gray-600">Present</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {subjectAttendanceDetails.absentClasses}
                        </p>
                        <p className="text-sm text-gray-600">Absent</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p
                        className={`text-lg font-semibold ${
                          getAttendanceColor(
                            subjectAttendanceDetails.attendancePercentage
                          ).split(" ")[0]
                        }`}
                      >
                        {subjectAttendanceDetails.attendancePercentage}%
                        Attendance
                      </p>
                    </div>
                  </div>

                  {/* Attendance Records */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-3">
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
                                <p className="text-sm text-gray-600">
                                  {record.status}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                record.status === "Present"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {record.status}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceDashboard;
