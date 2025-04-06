import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Filter,
  Download,
  Edit,
  Trash2,
  X,
  Eye,
} from "lucide-react";

// Sample data
const initialClasses = [
  { id: 1, name: "Physics 101", students: 28, code: "PHY101" },
  { id: 2, name: "Chemistry 201", students: 24, code: "CHEM201" },
  { id: 3, name: "Biology 301", students: 32, code: "BIO301" },
];

const initialAnnouncements = [
  {
    id: 1,
    title: "End of Term Exam Schedule",
    content:
      "The final exams will be held from June 12-16. Please review the attached schedule and prepare accordingly.",
    date: "2025-04-03",
    class: "Physics 101",
  },
  {
    id: 2,
    title: "Lab Report Deadline Extended",
    content:
      "Due to technical issues in the lab last week, the deadline for the titration lab report has been extended to April 12th.",
    date: "2025-04-01",
    class: "Chemistry 201",
  },
  {
    id: 3,
    title: "Field Trip Permission Forms",
    content:
      "Please remind students to submit their signed permission forms for the upcoming field trip to the botanical gardens by this Friday.",
    date: "2025-03-28",
    class: "Biology 301",
  },
];

const initialAssignments = [
  {
    id: 1,
    title: "Problem Set 5",
    description: "Complete problems 1-10 on circular motion.",
    dueDate: "2025-04-15",
    class: "Physics 101",
    status: "active",
    submissions: 18,
  },
  {
    id: 2,
    title: "Periodic Table Quiz",
    description: "Online quiz covering elements and their properties.",
    dueDate: "2025-04-10",
    class: "Chemistry 201",
    status: "active",
    submissions: 20,
  },
  {
    id: 3,
    title: "Ecosystem Research Paper",
    description: "Write a 5-page paper on a specific ecosystem of your choice.",
    dueDate: "2025-04-20",
    class: "Biology 301",
    status: "active",
    submissions: 15,
  },
  {
    id: 4,
    title: "Midterm Exam",
    description:
      "Comprehensive exam covering all topics from first half of semester.",
    dueDate: "2025-03-20",
    class: "Physics 101",
    status: "graded",
    submissions: 28,
  },
];

const initialStudents = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j@example.edu",
    class: "Physics 101",
    grade: "A-",
  },
  {
    id: 2,
    name: "Jamie Smith",
    email: "jamie.s@example.edu",
    class: "Chemistry 201",
    grade: "B+",
  },
  {
    id: 3,
    name: "Taylor Williams",
    email: "taylor.w@example.edu",
    class: "Biology 301",
    grade: "A",
  },
  {
    id: 4,
    name: "Morgan Lee",
    email: "morgan.l@example.edu",
    class: "Physics 101",
    grade: "B",
  },
  {
    id: 5,
    name: "Casey Brown",
    email: "casey.b@example.edu",
    class: "Chemistry 201",
    grade: "A",
  },
  {
    id: 6,
    name: "Riley Garcia",
    email: "riley.g@example.edu",
    class: "Biology 301",
    grade: "B-",
  },
];

const AssignmentManage = () => {
  const [activeTab, setActiveTab] = useState("announcements");
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [classes] = useState(initialClasses);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [students] = useState(initialStudents);
  const [showNotifications, setShowNotifications] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filtered data based on search term and class filter
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      classFilter === "all" || announcement.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      classFilter === "all" || assignment.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const openModal = (type, data = null) => {
    setModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateAnnouncement = (formData) => {
    const newAnnouncement = {
      id: announcements.length + 1,
      title: formData.title,
      content: formData.content,
      class: formData.class,
      date: new Date().toISOString().split("T")[0],
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    closeModal();
    showNotification("Announcement created successfully!");
  };

  const handleUpdateAnnouncement = (formData) => {
    const updatedAnnouncements = announcements.map((announcement) =>
      announcement.id === formData.id
        ? { ...announcement, ...formData }
        : announcement
    );
    setAnnouncements(updatedAnnouncements);
    closeModal();
    showNotification("Announcement updated successfully!");
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(
      announcements.filter((announcement) => announcement.id !== id)
    );
    closeModal();
    showNotification("Announcement deleted successfully!");
  };

  const handleCreateAssignment = (formData) => {
    const newAssignment = {
      id: assignments.length + 1,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      class: formData.class,
      status: "active",
      submissions: 0,
    };
    setAssignments([newAssignment, ...assignments]);
    closeModal();
    showNotification("Assignment created successfully!");
  };

  const handleUpdateAssignment = (formData) => {
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === formData.id
        ? { ...assignment, ...formData }
        : assignment
    );
    setAssignments(updatedAssignments);
    closeModal();
    showNotification("Assignment updated successfully!");
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
    closeModal();
    showNotification("Assignment deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Teacher Dashboard
            </h1>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Notifications</h3>
                    </div>
                    <div className="p-2">
                      <div className="p-2 hover:bg-gray-100 rounded">
                        <p className="text-sm">
                          5 new submissions for Problem Set 5
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="p-2 hover:bg-gray-100 rounded">
                        <p className="text-sm">
                          Student question on Chemistry assignment
                        </p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-4 flex items-center">
                <img
                  src="/api/placeholder/40/40"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Prof. Emma Davis
                </span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter row */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === "announcements"
                  ? "bg-green-100 text-green-800"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("announcements")}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Announcements
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === "assignments"
                  ? "bg-green-100 text-green-800"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("assignments")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Assignments
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === "students"
                  ? "bg-green-100 text-green-800"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("students")}
            >
              <Users className="mr-2 h-5 w-5" />
              Students
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === "calendar"
                  ? "bg-green-100 text-green-800"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Calendar
            </button>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <button className="px-4 py-2 bg-white rounded-lg border flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>
                  Class: {classFilter === "all" ? "All Classes" : classFilter}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 hidden">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => setClassFilter("all")}
                  >
                    All Classes
                  </button>
                  {classes.map((cls) => (
                    <button
                      key={cls.id}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => setClassFilter(cls.name)}
                    >
                      {cls.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {activeTab === "announcements" && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700"
                onClick={() => openModal("createAnnouncement")}
              >
                <Plus className="mr-2 h-5 w-5" />
                New Announcement
              </button>
            )}
            {activeTab === "assignments" && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700"
                onClick={() => openModal("createAssignment")}
              >
                <Plus className="mr-2 h-5 w-5" />
                New Assignment
              </button>
            )}
          </div>
        </div>

        {/* Notification toast */}
        {notification && (
          <div
            className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-lg font-medium cursor-pointer hover:text-green-600"
                        onClick={() =>
                          openModal("viewAnnouncement", announcement)
                        }
                      >
                        {announcement.title}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="mr-2">
                          {formatDate(announcement.date)}
                        </span>
                        <span>{announcement.class}</span>
                      </div>
                      {announcement.content && (
                        <div className="mt-2 text-sm text-gray-700">
                          {announcement.content.length > 100
                            ? announcement.content.substring(0, 100) + "..."
                            : announcement.content}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-gray-400 hover:text-green-600"
                        onClick={() =>
                          openModal("editAnnouncement", announcement)
                        }
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-600"
                        onClick={() =>
                          openModal("deleteAnnouncement", announcement)
                        }
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No announcements found. Create a new announcement to get
                  started.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div className="space-y-4">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-lg font-medium cursor-pointer hover:text-green-600"
                        onClick={() => openModal("viewAssignment", assignment)}
                      >
                        {assignment.title}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="mr-2">
                          Due: {formatDate(assignment.dueDate)}
                        </span>
                        <span className="mr-2">{assignment.class}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            assignment.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : assignment.status === "graded"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {assignment.status.charAt(0).toUpperCase() +
                            assignment.status.slice(1)}
                        </span>
                      </div>
                      {assignment.description && (
                        <div className="mt-2 text-sm text-gray-700">
                          {assignment.description.length > 100
                            ? assignment.description.substring(0, 100) + "..."
                            : assignment.description}
                        </div>
                      )}
                      <div className="mt-2 text-sm text-gray-500">
                        {assignment.submissions} submissions
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-gray-400 hover:text-blue-600"
                        onClick={() => openModal("viewSubmissions", assignment)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-green-600"
                        onClick={() => openModal("editAssignment", assignment)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-600"
                        onClick={() =>
                          openModal("deleteAssignment", assignment)
                        }
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No assignments found. Create a new assignment to get started.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Class
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Grade
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full overflow-hidden">
                          <img src={`/api/placeholder/32/32`} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.class}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.grade.startsWith("A")
                            ? "bg-green-100 text-green-800"
                            : student.grade.startsWith("B")
                            ? "bg-blue-100 text-blue-800"
                            : student.grade.startsWith("C")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => openModal("viewStudent", student)}
                      >
                        View
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => openModal("editStudent", student)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No students found.</p>
              </div>
            )}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">April 2025</h2>
              <div className="flex space-x-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4">
              <div className="text-center text-sm font-medium text-gray-500">
                Sun
              </div>
              <div className="text-center text-sm font-medium text-gray-500">
                Mon
              </div>
              <div className="text-center text-sm font-medium text-gray-500">
                Tue
              </div>
              <div className="text-center text-sm font-medium text-gray-500">
                Wed
              </div>
              <div className="text-center text-sm font-medium text-gray-500">
                Thu
              </div>
              <div className="text-center text-sm font-medium text-gray-500">
                Fri
              </div>
              <div className="text-center text-sm font-medium text-gray-500">
                Sat
              </div>

              <div className="text-center p-2 text-gray-400">30</div>
              <div className="text-center p-2 text-gray-400">31</div>
              <div className="text-center p-2">1</div>
              <div className="text-center p-2">2</div>
              <div className="text-center p-2">3</div>
              <div className="text-center p-2">4</div>
              <div className="text-center p-2">5</div>

              <div className="text-center p-2 bg-green-100 rounded-lg border border-green-300">
                6
              </div>
              <div className="text-center p-2">7</div>
              <div className="text-center p-2">8</div>
              <div className="text-center p-2">9</div>
              <div className="text-center p-2 relative">
                10
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
              </div>
              <div className="text-center p-2">11</div>
              <div className="text-center p-2">12</div>

              <div className="text-center p-2">13</div>
              <div className="text-center p-2">14</div>
              <div className="text-center p-2 relative">
                15
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
              </div>
              <div className="text-center p-2">16</div>
              <div className="text-center p-2">17</div>
              <div className="text-center p-2">18</div>
              <div className="text-center p-2">19</div>

              <div className="text-center p-2">20</div>
              <div className="text-center p-2 relative">
                21
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-center p-2">22</div>
              <div className="text-center p-2">23</div>
              <div className="text-center p-2">24</div>
              <div className="text-center p-2">25</div>
              <div className="text-center p-2">26</div>

              <div className="text-center p-2">27</div>
              <div className="text-center p-2">28</div>
              <div className="text-center p-2">29</div>
              <div className="text-center p-2">30</div>
              <div className="text-center p-2 text-gray-400">1</div>
              <div className="text-center p-2 text-gray-400">2</div>
              <div className="text-center p-2 text-gray-400">3</div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Upcoming Events</h3>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Chemistry Quiz Due</h4>
                    <span className="text-sm text-gray-500">Apr 10</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Chemistry 201 - Periodic Table Quiz
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Physics Problem Set Due</h4>
                    <span className="text-sm text-gray-500">Apr 15</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Physics 101 - Problem Set 5
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Department Meeting</h4>
                    <span className="text-sm text-gray-500">Apr 21</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Science Building, Room 302 - 3:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modals */}
        {modalType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              {/* View Announcement Modal */}
              {modalType === "viewAnnouncement" && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{modalData.title}</h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mb-4 text-sm text-gray-500">
                    <span className="mr-3">{formatDate(modalData.date)}</span>
                    <span>{modalData.class}</span>
                  </div>
                  <div className="prose max-w-none">
                    <p>{modalData.content}</p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => openModal("editAnnouncement", modalData)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Create/Edit Announcement Modal */}
              {(modalType === "createAnnouncement" ||
                modalType === "editAnnouncement") && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">
                      {modalType === "createAnnouncement"
                        ? "Create Announcement"
                        : "Edit Announcement"}
                    </h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = {
                        id: modalData?.id,
                        title: e.target.title.value,
                        content: e.target.content.value,
                        class: e.target.class.value,
                        date:
                          modalData?.date ||
                          new Date().toISOString().split("T")[0],
                      };

                      if (modalType === "createAnnouncement") {
                        handleCreateAnnouncement(formData);
                      } else {
                        handleUpdateAnnouncement(formData);
                      }
                    }}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.title || ""}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Content
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.content || ""}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="class"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Class
                      </label>
                      <select
                        id="class"
                        name="class"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.class || ""}
                        required
                      >
                        <option value="" disabled>
                          Select a class
                        </option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.name}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        {modalType === "createAnnouncement"
                          ? "Create"
                          : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Delete Announcement Modal */}
              {modalType === "deleteAnnouncement" && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">
                      Delete Announcement
                    </h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mb-4">
                    Are you sure you want to delete the announcement "
                    {modalData.title}"? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      onClick={() => handleDeleteAnnouncement(modalData.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* View Assignment Modal */}
              {modalType === "viewAssignment" && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{modalData.title}</h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mb-4 text-sm text-gray-500">
                    <span className="mr-3">
                      Due: {formatDate(modalData.dueDate)}
                    </span>
                    <span className="mr-3">{modalData.class}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        modalData.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : modalData.status === "graded"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {modalData.status.charAt(0).toUpperCase() +
                        modalData.status.slice(1)}
                    </span>
                  </div>
                  <div className="prose max-w-none">
                    <p>{modalData.description}</p>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Submissions</span>
                      <span className="text-sm">
                        {modalData.submissions} /{" "}
                        {
                          students.filter((s) => s.class === modalData.class)
                            .length
                        }
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => openModal("editAssignment", modalData)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Create/Edit Assignment Modal */}
              {(modalType === "createAssignment" ||
                modalType === "editAssignment") && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">
                      {modalType === "createAssignment"
                        ? "Create Assignment"
                        : "Edit Assignment"}
                    </h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = {
                        id: modalData?.id,
                        title: e.target.title.value,
                        description: e.target.description.value,
                        class: e.target.class.value,
                        dueDate: e.target.dueDate.value,
                        status: modalData?.status || "active",
                        submissions: modalData?.submissions || 0,
                      };

                      if (modalType === "createAssignment") {
                        handleCreateAssignment(formData);
                      } else {
                        handleUpdateAssignment(formData);
                      }
                    }}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.title || ""}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.description || ""}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="class"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Class
                      </label>
                      <select
                        id="class"
                        name="class"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.class || ""}
                        required
                      >
                        <option value="" disabled>
                          Select a class
                        </option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.name}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={
                          modalData?.dueDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        {modalType === "createAssignment"
                          ? "Create"
                          : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Delete Assignment Modal */}
              {modalType === "deleteAssignment" && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">Delete Assignment</h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mb-4">
                    Are you sure you want to delete the assignment "
                    {modalData.title}"? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      onClick={() => handleDeleteAssignment(modalData.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* View Submissions Modal */}
              {modalType === "viewSubmissions" && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">
                      Submissions: {modalData.title}
                    </h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mb-4 text-sm text-gray-500">
                    <span>
                      {modalData.class} • Due: {formatDate(modalData.dueDate)}
                    </span>
                  </div>
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">
                        {modalData.submissions} submissions
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                        <Download className="h-4 w-4 mr-1" />
                        Download All
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Student
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Submitted
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students
                          .filter((s) => s.class === modalData.class)
                          .slice(0, modalData.submissions)
                          .map((student, index) => (
                            <tr key={student.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.name}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Submitted
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(
                                  new Date(
                                    new Date(modalData.dueDate).getTime() -
                                      Math.floor(Math.random() * 172800000)
                                  )
                                    .toISOString()
                                    .split("T")[0]
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {modalData.status === "graded" ? (
                                  <span>
                                    {
                                      ["A", "A-", "B+", "B", "B-"][
                                        Math.floor(Math.random() * 5)
                                      ]
                                    }
                                  </span>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* View Student Modal */}
              {modalType === "viewStudent" && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{modalData.name}</h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-start mb-6">
                    <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`/api/placeholder/64/64`} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">
                        {modalData.email}
                      </div>
                      <div className="text-sm mt-1">
                        Class: {modalData.class}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            modalData.grade.startsWith("A")
                              ? "bg-green-100 text-green-800"
                              : modalData.grade.startsWith("B")
                              ? "bg-blue-100 text-blue-800"
                              : modalData.grade.startsWith("C")
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          Grade: {modalData.grade}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">
                      Recent Activity
                    </h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">
                              Submitted: Problem Set 5
                            </span>
                            <p className="text-sm text-gray-600">Physics 101</p>
                          </div>
                          <span className="text-sm text-gray-500">Apr 5</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">
                              Commented on: Lab Report Guidelines
                            </span>
                            <p className="text-sm text-gray-600">
                              "Are we supposed to include error analysis in this
                              report?"
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">Apr 2</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">
                              Received: B+ on Midterm Exam
                            </span>
                            <p className="text-sm text-gray-600">Physics 101</p>
                          </div>
                          <span className="text-sm text-gray-500">Mar 22</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => openModal("editStudent", modalData)}
                    >
                      Edit Student
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Student Modal */}
              {modalType === "editStudent" && (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">Edit Student</h2>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.name || ""}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.email || ""}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="student-class"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Class
                      </label>
                      <select
                        id="student-class"
                        name="class"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.class || ""}
                      >
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.name}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="grade"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Grade
                      </label>
                      <select
                        id="grade"
                        name="grade"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
                        defaultValue={modalData?.grade || ""}
                      >
                        {[
                          "A+",
                          "A",
                          "A-",
                          "B+",
                          "B",
                          "B-",
                          "C+",
                          "C",
                          "C-",
                          "D+",
                          "D",
                          "F",
                        ].map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        onClick={closeModal}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssignmentManage;
