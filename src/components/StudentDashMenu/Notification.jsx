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
            `${API_BASE_URL}/api/studentnotification/${studentId}`
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
    if (notification.sourceType === "admin") return "Admin";
    if (notification.sourceType === "teacher") {
      return notification.teacherName
        ? `Teacher: ${notification.teacherName}`
        : "Teacher";
    }
    return "System";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 sm:p-5 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="font-semibold text-lg sm:text-xl">
            Notification Center
          </h2>
        </div>
      </div>

      <div className="container mx-auto p-3 sm:p-5">
        {loading ? (
          <div className="text-center p-5 sm:p-10 text-gray-500">
            <h3 className="text-sm sm:text-base">Loading notifications...</h3>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-5 sm:p-10 text-gray-500">
            <h3 className="text-sm sm:text-base">No notifications found</h3>
            <p className="text-xs sm:text-sm">Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-5">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => openModal(notification)}
                className={`relative bg-white p-3 sm:p-5 rounded-lg shadow-md cursor-pointer transition transform hover:-translate-y-1 border-l-4 ${
                  notification.unread ? "border-blue-600" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {notification.title ||
                      notification.message.substring(0, 50)}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      notification.sourceType === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {getNotificationSource(notification)}
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {notification.message.substring(0, 80)}
                  {notification.message.length > 80 ? "..." : ""}
                </p>
                <div className="flex justify-between items-center mt-2 sm:mt-3">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-2 sm:p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
            <div className="mb-2 sm:mb-4 border-b pb-1 sm:pb-2">
              {modalNotification.sourceType === "teacher" &&
                modalNotification.teacherName && (
                  <p className="text-xs text-gray-500 mt-1">
                    {modalNotification.teacherName}
                  </p>
                )}
              <p className="text-xs sm:text-sm text-gray-600">
                {new Date(modalNotification.createdAt).toLocaleString()} |{" "}
              </p>
            </div>
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-2">
              {modalNotification.title}
            </h4>
            <p className="text-gray-600 mb-2 sm:mb-4 whitespace-pre-wrap text-xs sm:text-sm">
              {modalNotification.message}
            </p>

            {modalNotification.fileId && (
              <div className="mb-2 sm:mb-4 border-t pt-2 sm:pt-4">
                <p className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                  Attachment:
                </p>
                <div className="flex gap-1 sm:gap-2">
                  <a
                    href={getFileUrl(modalNotification.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 sm:px-4 py-1 sm:py-2 rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50 transition text-xs sm:text-sm"
                  >
                    View File
                  </a>
                  <button
                    onClick={() => openFileInNewTab(modalNotification.fileId)}
                    className="px-2 sm:px-4 py-1 sm:py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-xs sm:text-sm"
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-1 sm:gap-2">
              <button
                onClick={closeModal}
                className="px-2 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-xs sm:text-sm"
              >
                Dismiss
              </button>
              <button
                onClick={() =>
                  modalNotification.unread
                    ? markAsRead(modalNotification._id)
                    : markAsUnread(modalNotification._id)
                }
                className="px-2 sm:px-4 py-1 sm:py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-xs sm:text-sm"
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
