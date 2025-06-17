import React from "react";
import { Routes, Route } from "react-router-dom";
import { AttendanceProvider } from "../../utils/AttendanceContext";
import Attendance from "./attendance/Attendance";
import ScheduleClass from "./attendance/ScheduleClass";
import AttendanceRecords from "./attendance/AttendanceRecords";
import ClassSchedules from "./attendance/ClassSchedules";
import ManageClasses from "./attendance/ManageClasses";
import ManageStudents from "./attendance/ManageStudents";
import "./attendance/attendance.css";

const TeacherAttendanceDashboard = () => {
  return (
    <AttendanceProvider>
      <div className="app-container">
        <h1>Attendance Management System</h1>
        <main>
          <Routes>
            <Route path="/teacherdash/attendance" element={<Attendance />} />
            <Route
              path="/teacherdash/schedule-class"
              element={<ScheduleClass />}
            />
            <Route
              path="/teacherdash/attendance-records"
              element={<AttendanceRecords />}
            />
            <Route
              path="/teacherdash/class-schedules"
              element={<ClassSchedules />}
            />
            <Route
              path="/teacherdash/manage-classes"
              element={<ManageClasses />}
            />
            <Route
              path="/teacherdash/manage-students"
              element={<ManageStudents />}
            />
          </Routes>
        </main>
      </div>
    </AttendanceProvider>
  );
};

export default TeacherAttendanceDashboard;
