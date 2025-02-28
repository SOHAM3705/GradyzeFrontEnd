import React, { useState, useEffect } from "react";
import axios from "axios";

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const subjectDatabase = {
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
        4: [
          "Digital Communication",
          "Microprocessors",
          "Electromagnetic Theory",
        ],
      },
      Third: {
        5: [
          "Communication Systems",
          "VLSI Design",
          "Digital Signal Processing",
        ],
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
        4: [
          "Construction Technology",
          "Hydraulics",
          "Environmental Engineering",
        ],
      },
      Third: {
        5: [
          "Structural Analysis",
          "Transportation Engineering",
          "Geotechnical Engineering",
        ],
        6: [
          "Design of Structures",
          "Water Resources",
          "Construction Management",
        ],
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

  const openFacultyModal = () => setIsFacultyModalOpen(true);
  const closeFacultyModal = () => setIsFacultyModalOpen(false);

  const openSubjectModal = (facultyId) => {
    setSelectedFacultyId(facultyId);
    setIsSubjectModalOpen(true);
  };

  const closeSubjectModal = () => {
    setIsSubjectModalOpen(false);
    setSelectedFacultyId(null);
  };

  const updateFields = () => {
    const department = document.querySelector(
      'select[name="department"]'
    ).value;
    const yearSelect = document.getElementById("year");
    const semesterSelect = document.getElementById("semester");
    const subjectSelect = document.getElementById("subject");

    yearSelect.disabled = !department;
    semesterSelect.disabled = !department;
    subjectSelect.disabled = true;

    if (department) updateSemesters();
  };

  const updateSemesters = () => {
    const yearSelect = document.getElementById("year");
    const semesterSelect = document.getElementById("semester");
    const year = yearSelect.value;

    semesterSelect.innerHTML = '<option value="">Select Semester</option>';
    semesterSelect.disabled = !year;

    const semesterMap = {
      First: ["1", "2"],
      Second: ["3", "4"],
      Third: ["5", "6"],
      Fourth: ["7", "8"],
    };

    if (year && semesterMap[year]) {
      semesterMap[year].forEach((sem) => {
        const option = document.createElement("option");
        option.value = sem;
        option.textContent = `Semester ${sem}`;
        semesterSelect.appendChild(option);
      });
    }
  };

  const updateSubjects = () => {
    const department = document.querySelector(
      'select[name="department"]'
    ).value;
    const year = document.getElementById("year").value;
    const semester = document.getElementById("semester").value;
    const subjectSelect = document.getElementById("subject");

    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjectSelect.disabled = !semester;

    if (
      department &&
      year &&
      semester &&
      subjectDatabase?.[department]?.[year]?.[semester]
    ) {
      subjectDatabase[department][year][semester].forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
      });
    }
  };

  const createFaculty = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const subjectName = document.getElementById("subject").value;
    const yearValue = document.getElementById("year").value;
    const semesterValue = document.getElementById("semester").value;
    const divisionValue = formData.get("division");

    if (!subjectName || !yearValue || !semesterValue || !divisionValue) {
      alert("Please fill in all required fields including Division");
      return;
    }

    const newFaculty = {
      name: formData.get("name"),
      email: formData.get("email"),
      department: formData.get("department"),
      subjects: [
        {
          name: subjectName,
          year: yearValue,
          semester: semesterValue,
          division: divisionValue,
        },
      ],
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/add",
        newFaculty
      );
      setMessage(response.data.message);
      fetchFaculty();
    } catch (error) {
      setMessage("Failed to add teacher.");
    } finally {
      setLoading(false);
      closeFacultyModal();
      form.reset();
    }
  };

  const addSubject = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const facultyId = parseInt(formData.get("facultyId"));
    const facultyIndex = faculty.findIndex((f) => f.id === facultyId);

    if (facultyIndex === -1) return;

    const newSubject = {
      name: formData.get("subjectName"),
      year: formData.get("year"),
      semester: parseInt(formData.get("semester")),
      division: formData.get("division"),
    };

    if (
      !newSubject.name ||
      !newSubject.year ||
      isNaN(newSubject.semester) ||
      !newSubject.division
    ) {
      alert(
        "Please fill all required fields: Subject Name, Year, Semester, Division"
      );
      return;
    }

    const isDuplicate = faculty[facultyIndex].subjects.some(
      (s) =>
        s.name === newSubject.name &&
        s.year === newSubject.year &&
        s.semester === newSubject.semester &&
        s.division === newSubject.division
    );

    if (isDuplicate) {
      alert(
        "This subject with the same year, semester, and division is already assigned to this faculty"
      );
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/add",
        {
          name: faculty[facultyIndex].name,
          email: faculty[facultyIndex].email,
          department: faculty[facultyIndex].department,
          subjects: [...faculty[facultyIndex].subjects, newSubject],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      fetchFaculty();
    } catch (error) {
      console.error("Error adding subject:", error.response || error);
      setMessage("Failed to add subject.");
    } finally {
      setLoading(false);
      closeSubjectModal();
    }
  };

  const fetchFaculty = async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

      if (!adminId || !token) {
        console.error("Admin ID or Token not found");
        return;
      }

      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/teacher/teacherslist`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in headers
          },
        }
      );

      setFaculty(response.data.teachers || []);
    } catch (error) {
      console.error("Failed to fetch faculty data:", error);
      setFaculty([]);
    }
  };

  const removeSubject = async (
    facultyId,
    subjectName,
    year,
    semester,
    division
  ) => {
    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/remove-subject",
        {
          email: faculty[facultyId].email,
          subjectName,
          year,
          semester,
          division,
        }
      );
      setMessage(response.data.message);
      fetchFaculty();
    } catch (error) {
      setMessage("Failed to remove subject.");
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const groupFacultyByStructure = () => {
    const grouped = {};

    if (!faculty || faculty.length === 0) {
      return grouped;
    }

    faculty.forEach((f) => {
      if (!f.subjects || !Array.isArray(f.subjects)) {
        return;
      }

      f.subjects.forEach((subject) => {
        if (!grouped[f.department]) {
          grouped[f.department] = {};
        }
        if (!grouped[f.department][subject.year]) {
          grouped[f.department][subject.year] = {};
        }
        if (!grouped[f.department][subject.year][subject.division]) {
          grouped[f.department][subject.year][subject.division] = {};
        }
        if (
          !grouped[f.department][subject.year][subject.division][subject.name]
        ) {
          grouped[f.department][subject.year][subject.division][subject.name] =
            [];
        }
        grouped[f.department][subject.year][subject.division][
          subject.name
        ].push(f);
      });
    });

    return grouped;
  };

  const groupedFaculty = groupFacultyByStructure();

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFaculty = faculty.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 admin-theme">
      <div className="container mx-auto">
        {/* Header */}
        <div className="header flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Faculty Management
            </h1>
            <p className="text-gray-600">Manage faculty and their subjects</p>
          </div>
          <button
            onClick={openFacultyModal}
            className="bg-[#7c3aed] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#6d28d9]"
          >
            <i className="fas fa-plus-circle"></i>
            Add New Faculty
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for a teacher..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Stats */}
        <div className="stats-container grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Faculty</h3>
            <div className="stat-value flex items-center gap-2">
              <i className="fas fa-chalkboard-teacher"></i>
              <span id="totalFaculty">{faculty.length}</span>
            </div>
          </div>
          <div className="stat-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Departments</h3>
            <div className="stat-value flex items-center gap-2">
              <i className="fas fa-building"></i>
              <span id="totalDepartments">
                {new Set(faculty.map((f) => f.department)).size}
              </span>
            </div>
          </div>
          <div className="stat-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Subjects</h3>
            <div className="stat-value flex items-center gap-2">
              <i className="fas fa-book"></i>
              <span id="totalSubjects">
                {faculty.reduce(
                  (total, f) => total + (f.subjects?.length || 0),
                  0
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Faculty List by Structure */}
        <div id="facultyList" className="space-y-4">
          {Object.keys(groupedFaculty).map((department) => (
            <div key={department} className="department-section">
              <h2 className="text-xl font-semibold mb-4">{department}</h2>
              {Object.keys(groupedFaculty[department]).map((year) => (
                <div key={year} className="year-section pl-4">
                  <h3 className="text-lg font-semibold mb-2">{year} Year</h3>
                  {Object.keys(groupedFaculty[department][year]).map(
                    (division) => (
                      <div key={division} className="division-section pl-4">
                        <h4 className="text-md font-semibold mb-2">
                          Division {division}
                        </h4>
                        {Object.keys(
                          groupedFaculty[department][year][division]
                        ).map((subject) => (
                          <div
                            key={subject}
                            className="subject-section pl-4 mb-4"
                          >
                            <h5 className="text-md font-semibold mb-2">
                              {subject}
                            </h5>
                            <div className="faculty-list space-y-2">
                              {groupedFaculty[department][year][division][
                                subject
                              ]
                                .filter((f) =>
                                  f.name
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                                )
                                .map((f) => (
                                  <div
                                    key={f.id}
                                    className="faculty-card bg-white p-4 rounded-lg shadow"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3>{f.name}</h3>
                                        <p>{f.email}</p>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => openSubjectModal(f.id)}
                                          className="bg-[#7c3aed] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#6d28d9]"
                                        >
                                          <i className="fas fa-plus"></i>
                                          Add Subject
                                        </button>
                                        <button
                                          onClick={() => {
                                            const subjectData = f.subjects.find(
                                              (s) =>
                                                s.name === subject &&
                                                s.year === year &&
                                                s.division === division
                                            );
                                            if (subjectData) {
                                              removeSubject(
                                                f.id,
                                                subject,
                                                year,
                                                subjectData.semester,
                                                division
                                              );
                                            }
                                          }}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <i className="fas fa-trash-alt"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Add Faculty Modal */}
      {isFacultyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-content bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Faculty</h2>
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
                  onChange={updateFields}
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
              <div className="form-group">
                <label className="block text-gray-700">Year</label>
                <select
                  id="year"
                  required
                  className="w-full p-2 border rounded"
                  onChange={updateSemesters}
                  disabled
                >
                  <option value="">Select Year</option>
                  <option value="First">First Year</option>
                  <option value="Second">Second Year</option>
                  <option value="Third">Third Year</option>
                  <option value="Fourth">Fourth Year</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Semester</label>
                <select
                  id="semester"
                  required
                  className="w-full p-2 border rounded"
                  onChange={updateSubjects}
                  disabled
                >
                  <option value="">Select Semester</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Subject</label>
                <select
                  id="subject"
                  required
                  className="w-full p-2 border rounded"
                  disabled
                >
                  <option value="">Select Subject</option>
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
                  className="bg-[#7c3aed] text-white px-4 py-2 rounded hover:bg-[#6d28d9]"
                >
                  Add Faculty
                </button>
                <button
                  type="button"
                  onClick={closeFacultyModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-content bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add Subject</h2>
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
                  <option value="First">First Year</option>
                  <option value="Second">Second Year</option>
                  <option value="Third">Third Year</option>
                  <option value="Fourth">Fourth Year</option>
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
                  className="bg-[#7c3aed] text-white px-4 py-2 rounded hover:bg-[#6d28d9]"
                >
                  Add Subject
                </button>
                <button
                  type="button"
                  onClick={closeSubjectModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {message && <p className="text-gray-700 mt-3">{message}</p>}
    </div>
  );
};

export default FacultyManagement;
