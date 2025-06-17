// App.js (Improved & Fixed)
import React, { useState } from "react";
import { AttendanceProvider } from "../../utils/AttendanceContext";
import Attendance from "./attendance/Attendance";
import ScheduleClass from "./attendance/ScheduleClass";
import AttendanceRecords from "./attendance/AttendanceRecords";
import ClassSchedules from "./attendance/ClassSchedules";
import ManageClasses from "./attendance/ManageClasses";
import ManageStudents from "./attendance/ManageStudents";
import "./attendance/Attendance.css";

const TABS = [
  { key: "takeAttendance", label: "Take Attendance" },
  { key: "scheduleClass", label: "Schedule Class" },
  { key: "viewRecords", label: "Attendance Records" },
  { key: "viewSchedules", label: "Class Schedules" },
  { key: "manageClasses", label: "Manage Classes" },
  { key: "manageStudents", label: "Manage Students" },
];

const TeacherAttendanceDashboard = () => {
  const [activeTab, setActiveTab] = useState("takeAttendance");

  const renderContent = () => {
    switch (activeTab) {
      case "takeAttendance":
        return <Attendance />;
      case "scheduleClass":
        return <ScheduleClass />;
      case "viewRecords":
        return <AttendanceRecords />;
      case "viewSchedules":
        return <ClassSchedules />;
      case "manageClasses":
        return <ManageClasses />;
      case "manageStudents":
        return <ManageStudents />;
      default:
        return <Attendance />;
    }
  };

  return (
    <AttendanceProvider>
      <div className="app-container">
        <h1>Attendance Management System</h1>
        <nav className="tab-navigation" aria-label="Main Navigation">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab-item${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              aria-current={activeTab === tab.key ? "page" : undefined}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <main>{renderContent()}</main>
      </div>
    </AttendanceProvider>
  );
};

export default TeacherAttendanceDashboard;
