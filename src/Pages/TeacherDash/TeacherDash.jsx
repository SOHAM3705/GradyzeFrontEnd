import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Hand, Menu } from "lucide-react";
import axios from "axios";

function TeacherDash() {
  const [teacherName, setTeacherName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherName = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          navigate("/teacherlogin");
          return;
        }

        const response = await axios.get(
          "https://gradyzebackend.onrender.com/api/teachersetting/teacher-name",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTeacherName(response.data.teacherName || "Teacher");
      } catch (error) {
        console.error(
          "Error fetching teacher name:",
          error.response?.data || error
        );
      }
    };

    fetchTeacherName();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/teacherlogin");
  };

  const menuItems = [
    { icon: "🏠", label: "Overview", path: "/teacherdash" },
    {
      icon: "👨‍🏫",
      label: "Student Management",
      path: "/teacherdash/TeacherStudentManage",
    },
    { icon: "📝", label: "Subject Marks", path: "/teacherdash/subject-marks" },
    {
      icon: "📝",
      label: "Prerequisite Test",
      path: "/teacherdash/prerequisite-test",
    },
    { icon: "📄", label: "Assignment", path: "/teacherdash/assignment-manage" },
    {
      icon: "📅",
      label: "Attendance Report",
      path: "/teacherdash/attendance-report",
    },
    { icon: "🔔", label: "Notifications", path: "/teacherdash/notifications" },
    { icon: "📚", label: "Syllabus", path: "/teacherdash/syllabus" },
    { icon: "📝", label: "Feedback", path: "/teacherdash/feedback" },
    { icon: "⚙️", label: "Settings", path: "/teacherdash/settings" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-white z-40 md:relative fixed md:flex flex-col w-64 h-full shadow-lg transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="bg-[#2563eb] h-16 flex items-center justify-center">
          <h2 className="text-xl font-bold text-white">Teacher Portal</h2>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#2563eb] hover:text-white rounded-lg transition duration-200"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
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
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
          <div className="text-lg md:text-2xl font-semibold text-gray-800">
            Welcome, {teacherName || "Loading..."}
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-[#2563eb] text-white p-2 rounded-lg hover:bg-[#1d4ed8]"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
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

export default TeacherDash;
