import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Hand } from "lucide-react";
import axios from "axios";

function AdminDash() {
  const [adminName, setAdminName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("🚨 No token found, redirecting to login.");
          navigate("/adminlogin");
          return;
        }

        const response = await axios.get(
          "https://gradyzebackend.onrender.com/api/adminsetting/admin-name",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAdminName(response.data.adminName || "Admin");
      } catch (error) {
        console.error(
          "❌ Error fetching admin name:",
          error.response?.data || error
        );
      }
    };

    fetchAdminName();
  }, []);

  const handleLogout = () => {
    console.log("🔴 Logging out...");
    sessionStorage.removeItem("adminId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adminName");
    sessionStorage.clear();

    setTimeout(() => {
      window.location.reload();
    }, 500);

    navigate("/adminlogin");
  };

  const menuItems = [
    { icon: "🏠", label: "Overview", path: "/admindash" },
    {
      icon: "👨‍🏫",
      label: "Faculty Management",
      path: "/admindash/FacultyManage",
    },
    {
      icon: "👥",
      label: "Student Management",
      path: "/admindash/StudentManage",
    },
    { icon: "📝", label: "Students' Marks", path: "/admindash/students-marks" },
    {
      icon: "📅",
      label: "Attendance Reports",
      path: "/admindash/AttendanceReport",
    },
    { icon: "🔔", label: "Notifications", path: "/admindash/notifications" },
    { icon: "📚", label: "Syllabus", path: "/admindash/Syllbus" },
    {
      icon: "💰",
      label: "Subscription Plan",
      path: "/admindash/subscription-plan",
    },
    { icon: "📝", label: "Feedback", path: "/admindash/feedback" },
    { icon: "⚙️", label: "Settings", path: "/admindash/settings" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white w-full md:w-64 shadow-lg transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-16 bg-[#7c3aed] flex items-center justify-center">
          <h2 className="text-xl font-bold text-white">Admin Portal</h2>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#7c3aed] hover:text-white rounded-lg transition-colors duration-200"
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 flex justify-end md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-[#7c3aed] text-white py-2 px-4 rounded-lg hover:bg-[#6d28d9]"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
        <div className="p-4 absolute bottom-0 w-full md:w-64">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-[#7c3aed] text-white py-2 px-4 rounded-lg hover:bg-[#6d28d9]"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 relative">
          <div className="text-lg font-semibold text-gray-800">
            Welcome, {adminName || "Loading...."}
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-[#7c3aed] text-white py-2 px-4 rounded-lg hover:bg-[#6d28d9]"
          >
            {isMenuOpen ? "Close" : "Menu"}
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

export default AdminDash;
