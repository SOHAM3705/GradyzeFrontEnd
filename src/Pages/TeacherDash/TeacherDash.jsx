import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Hand } from "lucide-react";

function TeacherDash() {
  const [teacherName, setTeacherName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("teacherName");
    if (storedName) {
      setTeacherName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("teacherId");
    localStorage.removeItem("token");
    localStorage.removeItem("teacherName");
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
    { icon: "📊", label: "Analytics", path: "/teacherdash/analytics" },
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
    <div className="flex h-screen bg-gray-50">
      <div className="bg-white w-64 shadow-lg">
        <div className="h-16 bg-[#059669] flex items-center justify-center">
          <h2 className="text-2xl font-bold text-white">Teacher Portal</h2>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#059669] hover:text-white rounded-lg transition-colors duration-200"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 absolute bottom-0 w-64">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-[#059669] text-white py-2 px-4 rounded-lg hover:bg-[#047857] text-lg"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 relative">
          <div className="text-2xl font-semibold text-gray-800">
            Welcome, {teacherName || "Teacher"}
          </div>
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

export default TeacherDash;
