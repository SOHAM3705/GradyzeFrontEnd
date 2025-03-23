import React, { useState, useEffect } from "react";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Exam Schedule Updated",
      message:
        "The final examination schedule for Spring 2025 has been updated. Please check the academic portal for your specific exam times and locations. If you have any scheduling conflicts, please contact your academic advisor immediately to arrange alternatives.",
      type: "exam",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "New Assignment Added",
      message:
        "Professor Johnson has added a new assignment for Introduction to Computer Science (CS101). The assignment focuses on algorithm complexity and is due on March 25, 2025. Please review the assignment details and submission requirements on the course page.",
      type: "assignment",
      time: "Yesterday",
      unread: true,
    },
    {
      id: 3,
      title: "Library Hours Extended",
      message:
        "The university library will extend its hours during the final exam period. Starting March 30, the library will remain open until midnight on weekdays and until 10 PM on weekends. Additional study rooms can be reserved online through the library portal.",
      type: "general",
      time: "3 days ago",
      unread: false,
    },
    {
      id: 4,
      title: "Campus Wi-Fi Maintenance",
      message:
        "IT Services will be performing maintenance on the campus Wi-Fi network this weekend. Expect intermittent connectivity in residential halls between 2 AM and 6 AM on Saturday. The maintenance aims to improve overall network stability and speed.",
      type: "general",
      time: "1 week ago",
      unread: false,
    },
    {
      id: 5,
      title: "Midterm Exam Results",
      message:
        "The results for the Biology 202 midterm examination have been posted. You can view your score and feedback through the student portal. The class average was 78%. Review sessions will be held next week for those who wish to discuss their results.",
      type: "exam",
      time: "1 week ago",
      unread: false,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalNotification, setModalNotification] = useState(null);

  const filterTabs = ["all", "exam", "assignment", "general"];

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter !== "all" && notification.type !== activeFilter) {
      return false;
    }
    if (
      searchTerm &&
      !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const openModal = (notification) => {
    setModalNotification(notification);
  };

  const closeModal = () => {
    setModalNotification(null);
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, unread: false } : notification
    );
    setNotifications(updatedNotifications);
    closeModal();
  };

  const markAsUnread = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, unread: true } : notification
    );
    setNotifications(updatedNotifications);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-blue-600 text-white p-5 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="font-semibold text-xl">Notification Center</h2>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-5">
        <div className="flex justify-center gap-2 overflow-x-auto py-4">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full shadow-sm cursor-pointer transition ${
                activeFilter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <h3>No notifications found</h3>
            <p>Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => openModal(notification)}
                className={`bg-white p-5 rounded-lg shadow-md cursor-pointer transition transform hover:-translate-y-1 border-l-4 ${
                  notification.unread ? "border-blue-600" : "border-gray-200"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`text-xs font-semibold text-white px-2 py-1 rounded-full mb-2 ${
                    notification.type === "exam"
                      ? "bg-red-500"
                      : notification.type === "assignment"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                >
                  {notification.type}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {notification.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {notification.message.substring(0, 80)}
                  {notification.message.length > 80 ? "..." : ""}
                </p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {notification.time}
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
                className={`text-xs font-semibold text-white px-2 py-1 rounded-full mb-2 ${
                  modalNotification.type === "exam"
                    ? "bg-red-500"
                    : modalNotification.type === "assignment"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
              >
                {modalNotification.type}
              </div>
              <h3 className="font-semibold text-gray-800">
                {modalNotification.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">{modalNotification.message}</p>
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
                    ? markAsRead(modalNotification.id)
                    : markAsUnread(modalNotification.id)
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
