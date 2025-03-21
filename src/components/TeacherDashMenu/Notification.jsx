import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const adminId = localStorage.getItem("adminId"); // Get logged-in admin ID
        const teacherId = localStorage.getItem("teacherId"); // Get logged-in teacher ID

        if (!adminId || !teacherId) {
          console.error("Admin ID or Teacher ID not found in localStorage");
          return;
        }

        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/teachernotification/teacher/${teacherId}/${adminId}`
        );

        console.log("Fetched Notifications:", response.data);

        // Ensure sorted by newest first in case backend sorting fails
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
          "https://gradyzebackend.onrender.com/api/teachernotification/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(fileResponse.data);
        fileId = fileResponse.data.fileID; // Store the file's ID
      }

      const teacherId = localStorage.getItem("teacherId"); // Get logged-in teacher ID

      if (!teacherId) {
        alert("Teacher ID not found. Please log in again.");
        return;
      }

      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teachernotification/teacher",
        {
          message: message.trim(),
          audience: "students",
          fileId, // Include fileId if a file was uploaded
          teacherId, // Include teacher ID
        }
      );

      const newNotification = response.data;
      setNotifications((prev) => [newNotification, ...prev]);

      setMessage("");
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

  // Function to get the file URL if fileId is provided
  const getFileUrl = (fileId) => {
    return `https://gradyzebackend.onrender.com/api/notifications/files/${fileId}`;
  };

  // Function to trigger file download
  const handleDownload = (fileId) => {
    const fileUrl = getFileUrl(fileId);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = true; // This will prompt the file to download
    link.click();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-5">
      {/* Button to create a new notification */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-6"
      >
        Create Notification
      </button>

      {/* Modal and notification form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-center">
              Create Notification
            </h2>

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

      {/* Notification History */}
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
                    {notification.timestamp}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {notification.audience === "all"
                      ? "All Users"
                      : notification.audience === "teachers"
                      ? "Teachers"
                      : "Students"}
                  </span>
                </div>
                <p className="text-gray-800 mb-4">{notification.message}</p>

                {/* If the notification contains a file, show the download button */}
                {notification.fileId && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-600">
                      Attached File:
                    </p>
                    <button
                      onClick={() => handleDownload(notification.fileId)} // Trigger the file download
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Download File
                    </button>
                  </div>
                )}
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

export default TeacherNotification;
