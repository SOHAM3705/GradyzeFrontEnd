import React, { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audience, setAudience] = useState("all");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-5">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-6"
      >
        Create Notification
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-center">
              Create Notification
            </h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Select Audience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {audienceOptions.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setAudience(value)}
                    className={`p-3 rounded border flex flex-col items-center gap-1
                      ${
                        audience === value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Attachment (PDF only)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer bg-gray-50 text-gray-700 px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-500">
                  {file ? file.name : "No file selected"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSending}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 min-w-[100px]"
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6">Notification History</h2>
        <div className="space-y-6">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="border rounded-lg p-6 hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>

                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {getAudienceLabel(notification.audience)}
                  </span>
                </div>
                <p className="text-gray-800 mb-4">{notification.message}</p>

                {notification.fileId && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-600">
                      Attached File:
                    </p>
                    <button
                      onClick={() => handleDownload(notification.fileId)}
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Download File
                    </button>
                  </div>
                )}

                {/* Delete Button for All Notifications */}
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="text-red-500 hover:underline font-medium mt-4"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No notifications to show.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
