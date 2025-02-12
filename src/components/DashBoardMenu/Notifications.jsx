import React, { useState } from "react";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audience, setAudience] = useState("all");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notifications, setNotifications] = useState([
    // Sample notification history
    {
      id: 1,
      message: "Welcome to the new semester!",
      audience: "all",
      timestamp: "2024-02-10 09:00 AM",
      attachment: null,
    },
    {
      id: 2,
      message: "Reminder: Submit your assignments by Friday",
      audience: "students",
      timestamp: "2024-02-09 02:30 PM",
      attachment: "assignment-guidelines.pdf",
    },
  ]);

  const audienceOptions = [
    { value: "all", label: "All Users", icon: "👥" },
    { value: "teachers", label: "Teachers", icon: "📖" },
    { value: "students", label: "Students", icon: "🎓" },
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a PDF file");
      event.target.value = null;
    }
  };

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add new notification to history
      const newNotification = {
        id: Date.now(),
        message: message.trim(),
        audience,
        timestamp: new Date().toLocaleString(),
        attachment: selectedFile ? selectedFile.name : null,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setMessage("");
      setAudience("all");
      setSelectedFile(null);
      setIsOpen(false);
      alert("Notification sent successfully!");
    } catch (error) {
      alert("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-5">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-4xl text-center mb-6">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
        >
          Create Notification
        </button>
      </div>

      {/* Notification History */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Notification History</h2>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">
                  {notification.timestamp}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {getAudienceLabel(notification.audience)}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{notification.message}</p>
              {notification.attachment && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  {notification.attachment}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            {/* Modal Header */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold">Create Notification</h2>
              <p className="text-gray-600">Send a message to your audience</p>
            </div>

            {/* Audience Selection */}
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
                        ? "bg-purple-700 text-white border-purple-700"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* File Upload */}
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
                  {selectedFile ? selectedFile.name : "No file selected"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
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
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50 min-w-[100px]"
              >
                {isSending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
