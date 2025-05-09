import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [modalNotification, setModalNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const userRole = sessionStorage.getItem("role");
        const adminId = sessionStorage.getItem("adminId");
        const studentId = sessionStorage.getItem("studentId");

        let year, division;
        if (userRole === "student") {
          const studentRes = await axios.get(
            `${API_BASE_URL}/api/students/${studentId}`
          );
          year = studentRes.data.year;
          division = studentRes.data.division;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/studentnotification/notifications`,
          {
            params: {
              userRole,
              adminId,
              ...(userRole === "student" && { year, division }),
            },
          }
        );

        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getFileUrl = (fileId) => {
    return `${API_BASE_URL}/api/studentnotification/files/${fileId}`;
  };

  const openFileInNewTab = (fileId) => {
    try {
      const fileUrl = getFileUrl(fileId);
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Failed to open file");
    }
  };

  const openModal = (notification) => setModalNotification(notification);
  const closeModal = () => setModalNotification(null);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, unread: false } : n))
    );
    closeModal();
  };

  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, unread: true } : n))
    );
    closeModal();
  };

  const getNotificationSource = (notification) => {
    if (notification.adminId) return "Admin";
    if (notification.teacherId)
      return `Teacher: ${notification.teacherData?.name || "Unknown"}`;
    return "System";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="font-semibold text-xl">Notification Center</h2>
        </div>
      </div>

      <div className="container mx-auto p-5">
        {loading ? (
          <div className="text-center p-10 text-gray-500">
            <h3>Loading notifications...</h3>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <h3>No notifications found</h3>
            <p>Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => openModal(notification)}
                className={`relative bg-white p-5 rounded-lg shadow-md cursor-pointer transition transform hover:-translate-y-1 border-l-4 ${
                  notification.unread ? "border-blue-600" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {notification.message.substring(0, 50)}
                  </h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {getNotificationSource(notification)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {notification.message.substring(0, 80)}
                  {notification.message.length > 80 ? "..." : ""}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {notification.audience}
                  </span>
                </div>
                {notification.unread && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modalNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
            <div className="mb-4 border-b pb-2">
              <h3 className="font-semibold text-gray-800">
                {getNotificationSource(modalNotification)}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(modalNotification.createdAt).toLocaleString()} |{" "}
                {modalNotification.audience}
              </p>
            </div>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">
              {modalNotification.message}
            </p>

            {modalNotification.fileId && (
              <div className="mb-4 border-t pt-4">
                <p className="text-sm font-semibold mb-2">Attachment:</p>
                <div className="flex gap-2">
                  <a
                    href={getFileUrl(modalNotification.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50 transition"
                  >
                    View File
                  </a>
                  <button
                    onClick={() => openFileInNewTab(modalNotification.fileId)}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Dismiss
              </button>
              <button
                onClick={() =>
                  modalNotification.unread
                    ? markAsRead(modalNotification._id)
                    : markAsUnread(modalNotification._id)
                }
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {modalNotification.unread ? "Mark as Read" : "Mark as Unread"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
