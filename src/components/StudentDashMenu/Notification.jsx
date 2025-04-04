import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [modalNotification, setModalNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student-specific notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://gradyzebackend.onrender.com/api/studentnotification/notifications"
        );

        console.log("📩 Fetched Notifications:", response.data);

        // ✅ Check if response is an array before sorting
        if (Array.isArray(response.data)) {
          const sortedNotifications = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotifications(sortedNotifications);
        } else {
          console.error("🚨 API returned invalid data format:", response.data);
          setNotifications([]); // ✅ Ensure state is always an array
        }
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        setNotifications([]); // Ensure empty state in case of failure
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Construct file URL
  const getFileUrl = (fileId) => {
    return `https://gradyzebackend.onrender.com/api/studentnotification/files/${fileId}`;
  };

  // Open file in new tab instead of downloading
  const openFileInNewTab = (fileId) => {
    try {
      const fileUrl = getFileUrl(fileId);
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Failed to open file");
    }
  };

  const openModal = (notification) => {
    setModalNotification(notification);
  };

  const closeModal = () => {
    setModalNotification(null);
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification._id === id
        ? { ...notification, unread: false }
        : notification
    );
    setNotifications(updatedNotifications);
    closeModal();
  };

  const markAsUnread = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification._id === id ? { ...notification, unread: true } : notification
    );
    setNotifications(updatedNotifications);
    closeModal();
  };

  // Get notification type badge class
  const getTypeColor = (type) => {
    switch (type) {
      case "exam":
        return "bg-red-500";
      case "assignment":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-blue-600 text-white p-5 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="font-semibold text-xl">Notification</h2>
        </div>
      </div>

      <div className="container mx-auto p-5">
        {loading && (
          <div className="text-center p-10 text-gray-500">
            <h3>Loading notifications...</h3>
          </div>
        )}

        {!loading && notifications.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <h3>No notifications found</h3>
            <p>Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {notifications.map((notification, index) => (
              <div
                key={notification._id || notification.id}
                onClick={() => openModal(notification)}
                className={`bg-white p-5 rounded-lg shadow-md cursor-pointer transition transform hover:-translate-y-1 border-l-4 relative ${
                  notification.unread ? "border-blue-600" : "border-gray-200"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`text-xs font-semibold text-white px-2 py-1 rounded-full mb-2 ${getTypeColor(
                    notification.type
                  )}`}
                >
                  {notification.type || "General"}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {notification.title || notification.message.substring(0, 50)}
                </h4>
                <p className="text-gray-600 text-sm">
                  {notification.message.substring(0, 80)}
                  {notification.message.length > 80 ? "..." : ""}
                </p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {notification.time ||
                    new Date(notification.createdAt).toLocaleString()}
                </span>
                {notification.unread && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modalNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
            <div className="mb-4 border-b pb-2">
              <div
                className={`text-xs font-semibold text-white px-2 py-1 rounded-full mb-2 ${getTypeColor(
                  modalNotification.type
                )}`}
              >
                {modalNotification.type || "General"}
              </div>
              <h3 className="font-semibold text-gray-800">
                {modalNotification.title ||
                  modalNotification.message.substring(0, 50)}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">{modalNotification.message}</p>

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
                    ? markAsRead(modalNotification._id || modalNotification.id)
                    : markAsUnread(
                        modalNotification._id || modalNotification.id
                      )
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
