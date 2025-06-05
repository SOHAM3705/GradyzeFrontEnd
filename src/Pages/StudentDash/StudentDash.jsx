import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Hand, Menu } from "lucide-react";
import axios from "axios";

function StudentDash() {
  const [studentName, setStudentName] = useState("Student");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    sessionStorage.clear();
    setTimeout(() => window.location.reload(), 500);
    navigate("/studentlogin");
  };

  const menuItems = [
    { icon: "🏠", label: "Overview", path: "/studentdash" },
    { icon: "📝", label: "Results", path: "/studentdash/results" },
    {
      icon: "📝",
      label: "Test And Surveys",
      path: "/studentdash/Forms",
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="h-16 bg-[#2563eb] flex items-center justify-center md:justify-start px-4">
          <h2 className="text-xl font-bold text-white">Student Portal</h2>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#2563eb] hover:text-white rounded-lg transition-colors duration-200"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 absolute bottom-0 w-64">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-[#2563eb] text-white py-2 px-4 rounded-lg hover:bg-[#1d4ed8] text-lg"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          {/* Sidebar toggle button on small screens */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={28} />
          </button>

          <div className="text-lg font-semibold text-gray-800 ml-2">
            Welcome, {studentName || "Loading..."}
          </div>

          {/* Placeholder for alignment */}
          <div className="w-8 md:hidden" />
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
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to logout? 👋
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 text-white rounded-lg flex items-center space-x-2 hover:bg-red-700 transition"
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
