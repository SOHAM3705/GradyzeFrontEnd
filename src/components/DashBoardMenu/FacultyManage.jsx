import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const subjectsData = {
  "Computer Science": {
    First: {
      1: ["Programming Fundamentals", "Mathematics I", "Physics"],
      2: ["Object Oriented Programming", "Mathematics II", "Digital Logic"],
    },
    Second: {
      3: ["Data Structures", "Computer Architecture", "Statistics"],
      4: ["Operating Systems", "Database Systems", "Theory of Computation"],
    },
    Third: {
      5: ["Software Engineering", "Computer Networks", "AI"],
      6: ["Web Development", "Distributed Systems", "Information Security"],
    },
    Fourth: {
      7: ["Cloud Computing", "Machine Learning", "Project Management"],
      8: ["Big Data Analytics", "Blockchain", "Natural Language Processing"],
    },
  },
  "Mechanical Engineering": {
    First: {
      1: ["Engineering Graphics", "Mathematics I", "Physics"],
      2: ["Engineering Mechanics", "Mathematics II", "Chemistry"],
    },
    Second: {
      3: ["Thermodynamics", "Material Science", "Manufacturing Processes"],
      4: ["Fluid Mechanics", "Kinematics", "Heat Transfer"],
    },
    Third: {
      5: ["Machine Design", "Industrial Engineering", "Robotics"],
      6: ["Automation", "CAD/CAM", "Quality Engineering"],
    },
    Fourth: {
      7: ["Advanced Manufacturing", "Mechatronics", "Project Management"],
      8: ["Automotive Engineering", "Power Plants", "Industrial Management"],
    },
  },
  "Electronics & Telecommunication": {
    First: {
      1: ["Basic Electronics", "Mathematics I", "Physics"],
      2: ["Circuit Theory", "Mathematics II", "Digital Systems"],
    },
    Second: {
      3: ["Analog Electronics", "Signals and Systems", "Control Systems"],
      4: ["Digital Communication", "Microprocessors", "Electromagnetic Theory"],
    },
    Third: {
      5: ["Communication Systems", "VLSI Design", "Digital Signal Processing"],
      6: ["Wireless Communication", "Antenna Theory", "Embedded Systems"],
    },
    Fourth: {
      7: [
        "Mobile Communication",
        "Optical Communication",
        "Project Management",
      ],
      8: ["Satellite Communication", "IoT", "Advanced Communication"],
    },
  },
  "Civil Engineering": {
    First: {
      1: ["Engineering Drawing", "Mathematics I", "Physics"],
      2: ["Surveying", "Mathematics II", "Chemistry"],
    },
    Second: {
      3: ["Structural Mechanics", "Building Materials", "Soil Mechanics"],
      4: ["Construction Technology", "Hydraulics", "Environmental Engineering"],
    },
    Third: {
      5: [
        "Structural Analysis",
        "Transportation Engineering",
        "Geotechnical Engineering",
      ],
      6: ["Design of Structures", "Water Resources", "Construction Management"],
    },
    Fourth: {
      7: ["Advanced Structures", "Urban Planning", "Project Management"],
      8: [
        "Bridge Engineering",
        "Earthquake Engineering",
        "Construction Economics",
      ],
    },
  },
};

const FacultyManagementSystem = () => {
  const [faculties, setFaculties] = useState([]);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const fetchFaculty = async () => {
    try {
      const adminId = sessionStorage.getItem("adminId");
      const response = await axios.get(
        `${API_BASE_URL}/api/teacher/teacherslist`,
        {
          params: { adminId },
        }
      );
      setFaculties(response.data.teachers);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };
  const toggleCardExpansion = (facultyId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [facultyId]: !prev[facultyId],
    }));
  };
  const createFaculty = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const department = formData.get("department")?.trim();
    const isClassTeacher = formData.get("isClassTeacher") === "on";
    const isSubjectTeacher = formData.get("isSubjectTeacher") === "on";
    const adminId = sessionStorage.getItem("adminId");

    if (!name || !email || !department) {
      alert("Please fill in all required fields: Name, Email, and Department.");
      return;
    }

    if (!isClassTeacher && !isSubjectTeacher) {
      alert(
        "Please select at least one role: Class Teacher or Subject Teacher."
      );
      return;
    }

    let facultyData = {
      name,
      email,
      department,
      adminId,
      isClassTeacher,
      isSubjectTeacher,
    };

    if (isClassTeacher) {
      const year = formData.get("year")?.trim();
      const division = formData.get("division")?.trim();

      if (!year || !division) {
        alert("Class Teachers must have a Year and Division.");
        return;
      }

      facultyData.assignedClass = { year, division };
    }

    if (isSubjectTeacher) {
      const subjectName = formData.get("subject")?.trim();
      const subjectYear = formData.get("subjectYear")?.trim();
      const semester = parseInt(formData.get("semester"), 10);
      const subjectDivision = formData.get("subjectDivision")?.trim();

      if (!subjectName || !subjectYear || isNaN(semester) || !subjectDivision) {
        alert(
          "Subject Teachers must have a Subject, Year, Semester, and Division."
        );
        return;
      }

      facultyData.subjects = [
        {
          name: subjectName,
          year: subjectYear,
          semester,
          division: subjectDivision,
        },
      ];
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/teacher/add-teacher`,
        facultyData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.message);
      setFaculties([...faculties, response.data.teacher]);
      setIsFacultyModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add faculty.");
      console.error("Error adding faculty:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const subjectName = formData.get("subjectName")?.trim();
    const year = formData.get("year")?.trim();
    const semester = parseInt(formData.get("semester"), 10);
    const division = formData.get("division")?.trim();
    const adminId = sessionStorage.getItem("adminId");

    if (!subjectName || !year || isNaN(semester) || !division) {
      alert(
        "All fields (Subject Name, Year, Semester, Division) are required."
      );
      return;
    }

    const subjectData = {
      teacherId: selectedFacultyId,
      subjects: [{ name: subjectName, year, semester, division }],
      adminId,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/teacher/add-subject`,
        subjectData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert(response.data.message || "Subject added successfully!");
        setFaculties((prev) =>
          prev.map((teacher) =>
            teacher._id === selectedFacultyId
              ? {
                  ...teacher,
                  subjects: [
                    ...(teacher.subjects || []),
                    subjectData.subjects[0],
                  ],
                  isSubjectTeacher: true,
                }
              : teacher
          )
        );
        setIsSubjectModalOpen(false);
      } else {
        alert(response.data?.message || "Failed to add subject.");
      }
    } catch (error) {
      console.error("Error adding subject:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to add subject.");
    } finally {
      setLoading(false);
    }
  };

  const removeSubject = async (subjectName, year, semester, division) => {
    try {
      const token = sessionStorage.getItem("token");
      const adminId = sessionStorage.getItem("adminId");

      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      if (!adminId) {
        alert("Admin ID is missing. Please refresh and try again.");
        return;
      }

      const payload = {
        teacherId: selectedFacultyId,
        subjectName,
        year,
        semester: parseInt(semester, 10),
        division,
        adminId,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/teacher/remove-subject`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Subject removed successfully!");
        setFaculties((prev) =>
          prev.map((teacher) => {
            if (teacher._id === selectedFacultyId) {
              const updatedSubjects = teacher.subjects.filter(
                (subject) =>
                  subject.name !== subjectName ||
                  subject.year !== year ||
                  subject.semester !== semester ||
                  subject.division !== division
              );

              return {
                ...teacher,
                subjects: updatedSubjects,
                isSubjectTeacher: updatedSubjects.length > 0,
              };
            }
            return teacher;
          })
        );
      } else {
        alert(response.data?.message || "Failed to remove subject.");
      }
    } catch (error) {
      console.error("Error removing subject:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to remove subject.");
    }
  };

  const deleteTeacher = async () => {
    if (!teacherToDelete) return;

    try {
      const token = sessionStorage.getItem("token");
      const adminId = sessionStorage.getItem("adminId");

      if (!token || !adminId) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const response = await axios.delete(
        `${API_BASE_URL}/api/teacher/delete/${teacherToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { adminId },
        }
      );

      if (response.status === 200) {
        alert("Teacher deleted successfully!");
        setFaculties((prev) =>
          prev.filter((faculty) => faculty._id !== teacherToDelete)
        );
      } else {
        alert(response.data?.message || "Failed to delete teacher.");
      }
    } catch (error) {
      console.error("Error deleting teacher:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to delete teacher.");
    } finally {
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFaculty = useMemo(() => {
    return faculties.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.subjects.some((subject) =>
          subject.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [faculties, searchQuery]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const removeClass = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const adminId = sessionStorage.getItem("adminId");

      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      if (!adminId) {
        alert("Admin ID is missing. Please refresh and try again.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/teacher/remove-class`,
        {
          teacherId: selectedFacultyId,
          adminId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Class removed successfully!");
        setFaculties((prev) =>
          prev.map((teacher) =>
            teacher._id === selectedFacultyId
              ? { ...teacher, assignedClass: null, isClassTeacher: false }
              : teacher
          )
        );
      } else {
        alert(response.data?.message || "Failed to remove class.");
      }
    } catch (error) {
      console.error("Error removing class:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to remove class.");
    }
  };

  const renderFaculties = () => {
    if (faculties.length === 0) {
      return (
        <div className="text-center p-4 sm:p-8 text-gray-500">
          <div>No faculty data available</div>
          <p>Click on "Add Faculty" to get started</p>
        </div>
      );
    }

    return filteredFaculty.map((faculty) => (
      <div
        key={faculty._id}
        className="border rounded-lg shadow-sm mb-3 overflow-hidden"
      >
        {/* Header row with name and buttons */}
        <div className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100">
          <h3 className="font-medium text-gray-800">{faculty.name}</h3>
          <div className="flex items-center space-x-2">
            {/* Toggle button */}
            <button
              onClick={() => toggleCardExpansion(faculty._id)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              {expandedCards[faculty._id] ? (
                <>
                  <i className="fas fa-chevron-up mr-1 text-xs"></i>
                  Hide
                </>
              ) : (
                <>
                  <i className="fas fa-chevron-down mr-1 text-xs"></i>
                  Show
                </>
              )}
            </button>

            {/* Edit button */}
            <button
              onClick={() => {
                setSelectedFacultyId(faculty._id);
                setIsModifyModalOpen(true);
              }}
              className="text-yellow-600 hover:text-yellow-800"
              title="Edit"
            >
              <i className="fas fa-edit text-sm"></i>
            </button>

            {/* Delete button */}
            <button
              onClick={() => {
                setTeacherToDelete(faculty._id);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <i className="fas fa-trash-alt text-sm"></i>
            </button>
          </div>
        </div>

        {/* Details section (conditionally rendered) */}
        {expandedCards[faculty._id] && (
          <div className="p-3 border-t">
            {/* Subjects list */}
            {faculty.isSubjectTeacher && faculty.subjects?.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 mb-1">
                  Assigned Subjects:
                </h4>
                <ul className="space-y-1">
                  {faculty.subjects.map((subject, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {subject.name} (Year: {subject.year}, Sem:{" "}
                      {subject.semester}, Div: {subject.division})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Class assignment */}
            {faculty.isClassTeacher && faculty.assignedClass && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">
                  Assigned Class:
                </h4>
                <p className="text-sm text-gray-600">
                  Year: {faculty.assignedClass.year}, Division:{" "}
                  {faculty.assignedClass.division}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    ));

    return filteredFaculty.map((faculty) => (
      <div
        key={faculty._id}
        className="border rounded-lg shadow-md mb-4 p-2 sm:p-4"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
          <h3 className="text-base sm:text-lg font-semibold">{faculty.name}</h3>
          <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => {
                setSelectedFacultyId(faculty._id);
                setIsModifyModalOpen(true);
              }}
              className="bg-yellow-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-700 text-xs sm:text-base"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => {
                setTeacherToDelete(faculty._id);
                setIsDeleteModalOpen(true);
              }}
              className="bg-red-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-700 text-xs sm:text-base"
            >
              <i className="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>
        {faculty.isSubjectTeacher && faculty.subjects?.length > 0 && (
          <div className="mt-2 sm:mt-4">
            <h4 className="text-sm sm:text-md font-semibold mb-1 sm:mb-2">
              Assigned Subjects:
            </h4>
            <ul className="list-disc pl-3 sm:pl-5">
              {faculty.subjects.map((subject, index) => (
                <li key={index} className="mb-1 text-xs sm:text-base">
                  {subject.name} (Year: {subject.year}, Semester:{" "}
                  {subject.semester}, Division: {subject.division})
                </li>
              ))}
            </ul>
          </div>
        )}
        {faculty.isClassTeacher && faculty.assignedClass && (
          <div className="mt-2 sm:mt-4">
            <h4 className="text-sm sm:text-md font-semibold mb-1 sm:mb-2">
              Assigned Class:
            </h4>
            <p className="text-gray-700 text-xs sm:text-base">
              Year: {faculty.assignedClass.year}, Division:{" "}
              {faculty.assignedClass.division}
            </p>
          </div>
        )}
      </div>
    ));
  };

  const toggleFields = (event) => {
    const isClassTeacher =
      event.target.name === "isClassTeacher" && event.target.checked;
    const isSubjectTeacher =
      event.target.name === "isSubjectTeacher" && event.target.checked;

    document.getElementById("classTeacherFields").style.display = isClassTeacher
      ? "block"
      : "none";
    document.getElementById("subjectTeacherFields").style.display =
      isSubjectTeacher ? "block" : "none";
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <header className="bg-purple-500 text-black p-2 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-8 text-center">
        <h1 className="text-xl sm:text-2xl">Faculty Management System</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-4">
          <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
            <h3 className="text-base sm:text-lg">Total Faculty</h3>
            <div className="flex items-center mt-1 sm:mt-2">
              <i className="fas fa-chalkboard-teacher text-gray-600"></i>
              <span className="ml-2">{faculties.length}</span>
            </div>
          </div>
          <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
            <h3 className="text-base sm:text-lg">Departments</h3>
            <div className="flex items-center mt-1 sm:mt-2">
              <i className="fas fa-building text-gray-600"></i>
              <span className="ml-2">
                {new Set(faculties.map((f) => f.department)).size}
              </span>
            </div>
          </div>
          <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
            <h3 className="text-base sm:text-lg">Total Subjects</h3>
            <div className="flex items-center mt-1 sm:mt-2">
              <i className="fas fa-book text-gray-600"></i>
              <span className="ml-2">
                {faculties.reduce((total, f) => total + f.subjects.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Faculty Directory
          </h2>
          <div className="w-full sm:w-auto">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md w-full sm:w-auto transition-colors"
              onClick={() => setIsFacultyModalOpen(true)}
            >
              Add Faculty
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, department or subject..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div
          className="w-full overflow-y-auto rounded-lg border border-gray-200"
          style={{ maxHeight: "60vh" }}
        >
          {renderFaculties()}
        </div>
      </div>

      {isFacultyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h3 className="text-base sm:text-lg">Add New Faculty</h3>
              <button
                className="text-gray-600"
                onClick={() => setIsFacultyModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={createFaculty} className="space-y-2 sm:space-y-4">
              <div className="form-group">
                <label className="block text-gray-700 text-xs sm:text-base">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 text-xs sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 text-xs sm:text-base">
                  Department
                </label>
                <select
                  name="department"
                  required
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Electronics & Telecommunication">
                    Electronics & Telecommunication
                  </option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isClassTeacher"
                    className="mr-2"
                    onChange={toggleFields}
                  />
                  <span className="text-xs sm:text-base">Class Teacher</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSubjectTeacher"
                    className="mr-2"
                    onChange={toggleFields}
                  />
                  <span className="text-xs sm:text-base">Subject Teacher</span>
                </label>
              </div>
              <div id="classTeacherFields" style={{ display: "none" }}>
                <div className="form-group">
                  <label className="block text-gray-700 text-xs sm:text-base">
                    Year
                  </label>
                  <select
                    name="year"
                    className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                  >
                    <option value="">Select Year</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 text-xs sm:text-base">
                    Division
                  </label>
                  <input
                    type="text"
                    name="division"
                    className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                  />
                </div>
              </div>
              <div id="subjectTeacherFields" style={{ display: "none" }}>
                <div className="form-group">
                  <label className="block text-gray-700 text-xs sm:text-base">
                    Year
                  </label>
                  <select
                    name="subjectYear"
                    className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                  >
                    <option value="">Select Year</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 text-xs sm:text-base">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 text-xs sm:text-base">
                    Semester
                  </label>
                  <select
                    name="semester"
                    className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 text-xs sm:text-base">
                    Division
                  </label>
                  <input
                    type="text"
                    name="subjectDivision"
                    className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 sm:gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
                >
                  Add Faculty
                </button>
                <button
                  type="button"
                  onClick={() => setIsFacultyModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubjectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h3 className="text-base sm:text-lg">
                Add Subject to:{" "}
                {faculties.find((f) => f._id === selectedFacultyId)?.name ||
                  "Faculty"}
              </h3>
              <button
                className="text-gray-600"
                onClick={() => setIsSubjectModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={addSubject} className="space-y-2 sm:space-y-4">
              <input type="hidden" name="facultyId" value={selectedFacultyId} />
              <div className="form-group">
                <label className="block text-gray-700 text-xs sm:text-base">
                  Subject Name
                </label>
                <input
                  type="text"
                  name="subjectName"
                  required
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 text-xs sm:text-base">
                  Year
                </label>
                <select
                  name="year"
                  required
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                >
                  <option value="">Select Year</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-gray-700 text-xs sm:text-base">
                  Semester
                </label>
                <select
                  name="semester"
                  required
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-gray-700 text-xs sm:text-base">
                  Division
                </label>
                <input
                  type="text"
                  name="division"
                  required
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base"
                />
              </div>
              <div className="flex justify-end gap-2 sm:gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
                >
                  Add Subject
                </button>
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 text-xs sm:text-base">
              Are you sure you want to delete this teacher? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2 sm:gap-4 mt-4 sm:mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={deleteTeacher}
                className="bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-800 text-xs sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isModifyModalOpen && selectedFacultyId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-base sm:text-lg font-semibold">
              Modify Subjects and Class for{" "}
              {faculties.find((f) => f._id === selectedFacultyId)?.name ||
                "Unknown Faculty"}
            </h3>
            <div>
              <h4 className="text-xs sm:text-base">Current Subjects:</h4>
              <ul>
                {faculties
                  .find((f) => f._id === selectedFacultyId)
                  ?.subjects.map((subject, index) => (
                    <li key={index} className="flex items-center mb-1">
                      <span className="text-xs sm:text-base">
                        {subject.name} (Year: {subject.year}, Semester:{" "}
                        {subject.semester}, Division: {subject.division})
                      </span>
                      <button
                        onClick={() =>
                          removeSubject(
                            subject.name,
                            subject.year,
                            subject.semester,
                            subject.division
                          )
                        }
                        className="text-red-500 hover:text-red-700 ml-2 text-xs sm:text-base"
                      >
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            {faculties.find((f) => f._id === selectedFacultyId)
              ?.isClassTeacher && (
              <div className="mt-2 sm:mt-4">
                <h4 className="text-xs sm:text-base">Assigned Class:</h4>
                <p className="text-xs sm:text-base">
                  Year:{" "}
                  {
                    faculties.find((f) => f._id === selectedFacultyId)
                      ?.assignedClass.year
                  }
                  , Division:{" "}
                  {
                    faculties.find((f) => f._id === selectedFacultyId)
                      ?.assignedClass.division
                  }
                </p>
                <button
                  onClick={() => removeClass()}
                  className="text-red-500 hover:text-red-700 mt-1 sm:mt-2 text-xs sm:text-base"
                >
                  <i className="fas fa-trash-alt"></i> Delete Class
                </button>
              </div>
            )}
            <div className="mt-2 sm:mt-4 flex justify-end gap-2 sm:gap-4">
              <button
                onClick={() => {
                  setIsModifyModalOpen(false);
                  setIsSubjectModalOpen(true);
                }}
                className="bg-green-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-green-700 text-xs sm:text-base"
              >
                Add Subject
              </button>
              <button
                onClick={() => setIsModifyModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <p className="text-gray-700 mt-3 text-xs sm:text-base">{message}</p>
      )}
    </div>
  );
};

export default FacultyManagementSystem;
