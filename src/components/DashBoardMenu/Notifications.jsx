import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config"; // Adjust the import path as necessary

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audience, setAudience] = useState("all");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const audienceOptions = [
    { value: "all", label: "All Users", icon: "👥" },
    { value: "teachers", label: "Teachers", icon: "📖" },
    { value: "students", label: "Students", icon: "🎓" },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const adminId = sessionStorage.getItem("adminId");

        if (!adminId) {
          console.error("Admin ID not found in sessionStorage");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/notifications/getnotificationlist/${adminId}`
        );

        console.log("Fetched Notifications:", response.data);

        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const getAudienceLabel = (value) => {
    return (
      audienceOptions.find((option) => option.value === value)?.label || value
    );
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      setIsSending(true);

      let fileId = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const fileResponse = await axios.post(
          `${API_BASE_URL}/api/notifications/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(fileResponse.data);
        fileId = fileResponse.data.fileID;
      }

      const adminId = sessionStorage.getItem("adminId");

      if (!adminId) {
        alert("Admin ID not found. Please log in again.");
        return;
      }

      const payload = {
        message: message.trim(),
        audience,
        fileId,
        adminId,
        teacherId: null,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/notifications/createnotification`,
        payload
      );

      const newNotification = response.data;
      setNotifications((prev) => [newNotification, ...prev]);

      setMessage("");
      setAudience("all");
      setFile(null);
      setIsOpen(false);
      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const getFileUrl = (fileId) => {
    return `${API_BASE_URL}/api/notifications/files/${fileId}`;
  };

  const handleDownload = async (fileId) => {
    if (!fileId) {
      alert("No file available for download.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/notifications/files/${fileId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the syllabus. Please try again.");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const adminId = sessionStorage.getItem("adminId");

      if (!adminId) {
        alert("Admin ID not found. Please log in again.");
        return;
      }

      await axios.delete(
        `${API_BASE_URL}/api/notifications/delete/${notificationId}`,
        {
          data: { adminId },
        }
      );

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      alert("Notification deleted successfully!");
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Failed to delete notification");
    }
  };

  const openModal = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-2 sm:p-5">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-600 mt-4 sm:mt-6 text-sm sm:text-base"
      >
        Create Notification
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold text-center">
              Create Notification
            </h2>

            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Select Audience
              </label>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {audienceOptions.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setAudience(value)}
                    className={`p-2 sm:p-3 rounded border flex flex-col items-center gap-1
                      ${
                        audience === value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    <span className="text-lg sm:text-xl">{icon}</span>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-2 sm:p-3 border rounded-lg h-24 sm:h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Attachment (PDF only)
              </label>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer bg-gray-50 text-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded border hover:bg-gray-100 text-xs sm:text-base"
                >
                  Choose File
                </label>
                <span className="text-xs sm:text-sm text-gray-500">
                  {file ? file.name : "No file selected"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-2 sm:px-4 py-1 sm:py-2 border rounded-lg hover:bg-gray-50 text-xs sm:text-base"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSending}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 min-w-[80px] sm:min-w-[100px] text-xs sm:text-base"
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-4 sm:p-6 mt-4 sm:mt-6">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">
          Notification History
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="border rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                onClick={() => openModal(notification)}
              >
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>

                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                    {getAudienceLabel(notification.audience)}
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {notification.message.substring(0, 80)}
                  {notification.message.length > 80 ? "..." : ""}
                </p>
                {notification.fileId && (
                  <div className="mt-2 sm:mt-4">
                    <p className="font-semibold text-gray-600 text-xs sm:text-base">
                      Attached File:
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(notification.fileId);
                      }}
                      className="text-blue-500 hover:underline font-medium text-xs sm:text-base"
                    >
                      Download File
                    </button>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification._id);
                  }}
                  className="text-red-500 hover:underline font-medium mt-2 sm:mt-4 text-xs sm:text-base"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm sm:text-base">
              No notifications to show.
            </p>
          )}
        </div>
      </div>

      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
              Notification Details
            </h2>

            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Audience:{" "}
                <span className="font-normal">
                  {getAudienceLabel(selectedNotification.audience)}
                </span>
              </p>
              <p className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Date:{" "}
                <span className="font-normal">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </span>
              </p>
              <p className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Message:{" "}
                <span className="font-normal">
                  {selectedNotification.message}
                </span>
              </p>
            </div>

            {selectedNotification.fileId && (
              <div className="mt-4">
                <p className="font-semibold text-gray-600 text-xs sm:text-base">
                  Attached File:
                </p>
                <button
                  onClick={() => handleDownload(selectedNotification.fileId)}
                  className="text-blue-500 hover:underline font-medium text-xs sm:text-base"
                >
                  Download File
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2 sm:gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-2 sm:px-4 py-1 sm:py-2 border rounded-lg hover:bg-gray-50 text-xs sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
