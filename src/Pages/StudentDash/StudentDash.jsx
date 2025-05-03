import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Hand } from "lucide-react";
import axios from "axios";

function StudentDash() {
  const [studentName, setStudentName] = useState("Student");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("🚨 No token found, redirecting to login.");
          navigate("/studentlogin");
          return;
        }

        const response = await axios.get(
          "https://gradyzebackend.onrender.com/api/studentsetting/student-name",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStudentName(response.data.studentName || "Student");
      } catch (error) {
        console.error(
          "❌ Error fetching student name:",
          error.response?.data || error
        );
      }
    };

    fetchStudentName();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("studentId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("studentName");
    sessionStorage.clear();
    navigate("/studentlogin");
  };

  const menuItems = [
    { icon: "🏠", label: "Overview", path: "/studentdash" },
    { icon: "📝", label: "Results", path: "/studentdash/results" },
    {
      icon: "📝",
      label: "Prerequisite Test",
      path: "/studentdash/prerequisite-test",
    },
    { icon: "📄", label: "Assignment", path: "/studentdash/assignment" },
    {
      icon: "📅",
      label: "Attendance Reports",
      path: "/studentdash/attendance-reports",
    },
    { icon: "📚", label: "Syllabus", path: "/studentdash/syllabus" },
    { icon: "🔔", label: "Notifications", path: "/studentdash/notifications" },
    { icon: "📝", label: "Feedback", path: "/studentdash/feedback" },
    { icon: "⚙️", label: "Settings", path: "/studentdash/settings" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-white md:w-64 w-full md:shadow-lg flex flex-col justify-between">
        {/* Logo/Header */}
        <div className="h-16 bg-[#2563eb] flex items-center justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Student Portal
          </h2>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#2563eb] hover:text-white rounded-lg transition-colors duration-200"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-[#2563eb] text-white py-2 px-4 rounded-lg hover:bg-[#1d4ed8] text-lg"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <div className="text-lg md:text-2xl font-semibold text-gray-800">
            Welcome, {studentName}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-lg mx-4 text-center">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <Hand
                size={40}
                strokeWidth={1.5}
                className="animate-waving-hand"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Are you sure you want to logout? 👋
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 text-white rounded-lg flex items-center space-x-2 hover:bg-red-700 transition text-lg"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDash;
