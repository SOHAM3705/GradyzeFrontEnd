import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Hand, Menu } from "lucide-react";
import axios from "axios";
import "./StudentDash.css";

function StudentDash() {
  const [studentName, setStudentName] = useState("Student");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
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
          "Error fetching student name:",
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="student-menu-button md:hidden p-4 focus:outline-none"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`student-sidebar bg-white w-full md:w-64 shadow-lg ${
          isMenuOpen ? "open" : ""
        }`}
      >
        <div className="student-header h-16 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-white">Student Portal</h2>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors duration-200"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 absolute bottom-0 w-full md:w-64">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-lg"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 relative">
          <div className="text-2xl font-semibold text-gray-800">
            Welcome, {studentName || "Loading..."}
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="student-menu-button md:hidden bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-lg"
          >
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-lg mx-4 text-center">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <Hand
                size={40}
                strokeWidth={1.5}
                className="animate-waving-hand"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
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
