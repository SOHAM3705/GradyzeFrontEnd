import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

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

  const fetchFaculty = async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      const response = await axios.get(
        "https://gradyzebackend.onrender.com/api/teacher/teacherslist",
        {
          params: { adminId },
        }
      );
      setFaculties(response.data.teachers);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
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
    const adminId = localStorage.getItem("adminId");

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
      const year = formData.get("year")?.trim();
      const semester = parseInt(formData.get("semester"), 10);
      const division = formData.get("division")?.trim();

      if (!subjectName || !year || isNaN(semester) || !division) {
        alert(
          "Subject Teachers must have a Subject, Year, Semester, and Division."
        );
        return;
      }

      facultyData.subjects = [{ name: subjectName, year, semester, division }];
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/add-teacher",
        facultyData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    const adminId = localStorage.getItem("adminId");

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
        "https://gradyzebackend.onrender.com/api/teacher/add-subject",
        subjectData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId");

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
        "https://gradyzebackend.onrender.com/api/teacher/remove-subject",
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
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId");

      if (!token || !adminId) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const response = await axios.delete(
        `https://gradyzebackend.onrender.com/api/teacher/delete/${teacherToDelete}`,
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

  const renderFaculties = () => {
    if (faculties.length === 0) {
      return (
        <div className="text-center p-8 text-gray-500">
          <div>No faculty data available</div>
          <p>Click on "Add Faculty" to get started</p>
        </div>
      );
    }

    return filteredFaculty.map((faculty) => (
      <div key={faculty._id} className="border rounded-lg shadow-md mb-4 p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{faculty.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedFacultyId(faculty._id);
                setIsModifyModalOpen(true);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => {
                setTeacherToDelete(faculty._id);
                setIsDeleteModalOpen(true);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <i className="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>
        {faculty.isSubjectTeacher && faculty.subjects?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Assigned Subjects:</h4>
            <ul className="list-disc pl-5">
              {faculty.subjects.map((subject, index) => (
                <li key={index} className="mb-1">
                  {subject.name} (Year: {subject.year}, Semester:{" "}
                  {subject.semester}, Division: {subject.division})
                  <button
                    onClick={() =>
                      removeSubject(
                        subject.name,
                        subject.year,
                        subject.semester,
                        subject.division
                      )
                    }
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {faculty.isClassTeacher && faculty.assignedClass && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Assigned Class:</h4>
            <p className="text-gray-700">
              Year: {faculty.assignedClass.year}, Division:{" "}
              {faculty.assignedClass.division}
            </p>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <header className="bg-purple-500 text-black p-4 rounded-lg shadow-md mb-8 text-center">
        <h1 className="text-2xl">Faculty Management System</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg">Total Faculty</h3>
            <div className="flex items-center mt-2">
              <i className="fas fa-chalkboard-teacher text-gray-600"></i>
              <span className="ml-2">{faculties.length}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg">Departments</h3>
            <div className="flex items-center mt-2">
              <i className="fas fa-building text-gray-600"></i>
              <span className="ml-2">
                {new Set(faculties.map((f) => f.department)).size}
              </span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg">Total Subjects</h3>
            <div className="flex items-center mt-2">
              <i className="fas fa-book text-gray-600"></i>
              <span className="ml-2">
                {faculties.reduce((total, f) => total + f.subjects.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Faculty Directory</h2>
          <div>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded"
              onClick={() => setIsFacultyModalOpen(true)}
            >
              Add Faculty
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search for a teacher..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border rounded mb-4"
        />
        <div id="facultyContainer">{renderFaculties()}</div>
      </div>

      {isFacultyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg">Add New Faculty</h3>
              <button
                className="text-gray-600"
                onClick={() => setIsFacultyModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={createFaculty} className="space-y-4">
              <div className="form-group">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Department</label>
                <select
                  name="department"
                  required
                  className="w-full p-2 border rounded"
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
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isClassTeacher"
                    className="mr-2"
                  />
                  Class Teacher
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSubjectTeacher"
                    className="mr-2"
                  />
                  Subject Teacher
                </label>
              </div>
              <div id="classTeacherFields" className="hidden">
                <div className="form-group">
                  <label className="block text-gray-700">Year</label>
                  <select name="year" className="w-full p-2 border rounded">
                    <option value="">Select Year</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-gray-700">Division</label>
                  <input
                    type="text"
                    name="division"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div id="subjectTeacherFields" className="hidden">
                <div className="form-group">
                  <label className="block text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-gray-700">Semester</label>
                  <select name="semester" className="w-full p-2 border rounded">
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
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Add Faculty
                </button>
                <button
                  type="button"
                  onClick={() => setIsFacultyModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
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
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg">
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
            <form onSubmit={addSubject} className="space-y-4">
              <input type="hidden" name="facultyId" value={selectedFacultyId} />
              <div className="form-group">
                <label className="block text-gray-700">Subject Name</label>
                <input
                  type="text"
                  name="subjectName"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Year</label>
                <select
                  name="year"
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Year</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Semester</label>
                <select
                  name="semester"
                  required
                  className="w-full p-2 border rounded"
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
                <label className="block text-gray-700">Division</label>
                <input
                  type="text"
                  name="division"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Add Subject
                </button>
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
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
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700">
              Are you sure you want to delete this teacher? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteTeacher}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isModifyModalOpen && selectedFacultyId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold">
              Modify Subjects for{" "}
              {faculties.find((f) => f._id === selectedFacultyId)?.name ||
                "Unknown Faculty"}
            </h3>
            <div>
              <h4>Current Subjects:</h4>
              <ul>
                {faculties
                  .find((f) => f._id === selectedFacultyId)
                  ?.subjects.map((subject, index) => (
                    <li key={index} className="flex items-center mb-1">
                      {subject.name} (Year: {subject.year}, Semester:{" "}
                      {subject.semester}, Division: {subject.division})
                      <button
                        onClick={() =>
                          removeSubject(
                            subject.name,
                            subject.year,
                            subject.semester,
                            subject.division
                          )
                        }
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModifyModalOpen(false);
                  setIsSubjectModalOpen(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Subject
              </button>
              <button
                onClick={() => setIsModifyModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="text-gray-700 mt-3">{message}</p>}
    </div>
  );
};

export default FacultyManagementSystem;
