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
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState(new FormData());

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

  // Updates for createFaculty function
  const createFaculty = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Get values from form
    const nameValue = formData.get("name");
    const emailValue = formData.get("email");
    const departmentValue = formData.get("department");
    const roleValue = formData.get("role");
    const divisionValue = formData.get("division");

    // Get subject info if subject teacher
    let subjectsList = [];
    if (roleValue === "Subject Teacher") {
      const yearValue = document.getElementById("year").value;
      const semesterText = document.getElementById("semester").value;
      const subjectName = document.getElementById("subject").value;

      // Extract semester number from text
      const semesterNumber = semesterText
        ? parseInt(semesterText.replace("Semester ", ""))
        : null;

      if (!yearValue || !semesterText || !subjectName || !divisionValue) {
        alert("Please fill in all subject details");
        return;
      }

      subjectsList.push({
        name: subjectName,
        year: yearValue,
        semester: semesterNumber,
        division: divisionValue,
      });
    }

    // Map role values to the expected teacherType in the backend
    const teacherTypeMapping = {
      "Subject Teacher": "subjectTeacher",
      "Class Teacher": "classTeacher",
    };

    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      alert("Admin ID is missing.");
      return;
    }

    // Structure the data according to your API's expected format
    const teacherData = {
      name: nameValue,
      email: emailValue,
      department: departmentValue,
      teacherType: teacherTypeMapping[roleValue],
      division: roleValue === "Class Teacher" ? divisionValue : undefined,
      subjects: roleValue === "Subject Teacher" ? subjectsList : undefined,
      adminId,
    };

    console.log("Sending teacher data:", teacherData);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/add-teacher-subject",
        teacherData
      );

      if (response.status === 201 || response.status === 200) {
        setMessage(response.data.message);
        setFaculties((prev) => [...prev, response.data.teacher]);
        alert(response.data.message || "Teacher added successfully!");
      } else {
        setMessage("Failed to add teacher. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("Failed to add teacher.");
      alert(
        "Failed to add teacher: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
      closeFacultyModal();
      form.reset();
    }
  };

  // Update the subject related functions
  const updateSubjects = () => {
    const department = document.querySelector(
      'select[name="department"]'
    ).value;
    const yearSelect = document.getElementById("year");
    const semesterSelect = document.getElementById("semester");
    const subjectSelect = document.getElementById("subject");

    const year = yearSelect.value;
    const semesterText = semesterSelect.value;
    // Extract semester number from the text
    const semesterNumber = semesterText
      ? parseInt(semesterText.replace("Semester ", ""))
      : null;

    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjectSelect.disabled = !semesterText;

    // Map year names to keys in subjectsData
    const yearMap = {
      "First Year": "First",
      "Second Year": "Second",
      "Third Year": "Third",
      "Fourth Year": "Fourth",
    };

    const yearKey = yearMap[year];

    if (
      department &&
      yearKey &&
      semesterNumber &&
      subjectsData[department] &&
      subjectsData[department][yearKey] &&
      subjectsData[department][yearKey][semesterNumber]
    ) {
      subjectsData[department][yearKey][semesterNumber].forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
      });

      // Enable the subject dropdown now that options are loaded
      subjectSelect.disabled = false;
    }
  };
  const addSubject = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    if (!selectedFacultyId) {
      alert("Faculty selection is missing.");
      return;
    }

    const subjectName = formData.get("subjectName");
    const yearValue = formData.get("year");
    const semesterNumber = parseInt(formData.get("semester"));
    const divisionValue = formData.get("division");

    // Validate that all fields are filled
    if (!subjectName || !yearValue || isNaN(semesterNumber) || !divisionValue) {
      alert(
        "Please fill all required fields: Subject Name, Year, Semester, and Division."
      );
      return;
    }

    const newSubject = {
      name: subjectName,
      year: yearValue,
      semester: semesterNumber,
      division: divisionValue,
    };

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId");

      if (!adminId) {
        alert("Admin ID is missing.");
        setLoading(false);
        return;
      }

      if (!token) {
        alert("Authorization token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      // Prepare the data according to your API structure
      const payload = {
        teacherId: selectedFacultyId,
        subjects: [newSubject],
        adminId,
      };

      console.log("Sending subject payload:", payload);

      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/add-teacher-subject",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert(response.data.message || "Subject added successfully!");
        // Update local state
        setFaculties((prev) =>
          prev.map((teacher) =>
            teacher._id === selectedFacultyId
              ? {
                  ...teacher,
                  subjects: [...(teacher.subjects || []), newSubject],
                }
              : teacher
          )
        );
      } else {
        alert("Failed to add subject. Please try again.");
      }
    } catch (error) {
      console.error("Error adding subject:", error.response?.data || error);
      alert(
        "Error: " + (error.response?.data?.message || "Failed to add subject.")
      );
    } finally {
      setLoading(false);
      closeSubjectModal();
      form.reset();
    }
  };

  const removeSubject = async (
    facultyEmail,
    subjectName,
    year,
    semester,
    division
  ) => {
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

      // Ensure semester is correctly formatted
      let semesterValue = semester;
      if (
        typeof semester === "string" &&
        semester.toLowerCase().includes("semester")
      ) {
        semesterValue = parseInt(semester.replace(/[^0-9]/g, ""));
      }

      // Log the values before sending the request
      console.log("🟢 Faculty Email:", facultyEmail);
      console.log("🟢 Subject Name:", subjectName);
      console.log("🟢 Year:", year);
      console.log("🟢 Semester:", semesterValue);
      console.log("🟢 Division:", division);
      console.log("🟢 Admin ID:", adminId);

      // Validate required fields
      if (
        !facultyEmail ||
        !subjectName ||
        !year ||
        semesterValue === undefined ||
        !division
      ) {
        alert("One or more required fields are missing.");
        return;
      }

      // Construct payload
      const payload = {
        email: facultyEmail.trim().toLowerCase(),
        subjectName: subjectName.trim().toLowerCase(),
        year: year.trim().toLowerCase(),
        semester: semesterValue,
        division: division.trim().toLowerCase(),
        adminId,
      };

      console.log("🚀 Sending payload:", payload);

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
      } else {
        alert(response.data?.message || "Failed to remove subject.");
      }
    } catch (error) {
      console.error(
        "Error removing subject:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to remove subject. Please try again."
      );
    }
  };

  // Update the updateSemesters function to call updateSubjects
  const updateSemesters = () => {
    const yearSelect = document.getElementById("year");
    const semesterSelect = document.getElementById("semester");
    const year = yearSelect.value;

    semesterSelect.innerHTML = '<option value="">Select Semester</option>';
    semesterSelect.disabled = !year;

    const semesterMap = {
      "First Year": ["Semester 1", "Semester 2"],
      "Second Year": ["Semester 3", "Semester 4"],
      "Third Year": ["Semester 5", "Semester 6"],
      "Fourth Year": ["Semester 7", "Semester 8"],
    };

    if (year && semesterMap[year]) {
      semesterMap[year].forEach((sem) => {
        const option = document.createElement("option");
        option.value = sem;
        option.textContent = sem;
        semesterSelect.appendChild(option);
      });
    }

    // Clear any previously selected subject
    const subjectSelect = document.getElementById("subject");
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjectSelect.disabled = true;
  };

  // Add event listener to semester select to update subjects when changed
  const attachSemesterListener = () => {
    const semesterSelect = document.getElementById("semester");
    if (semesterSelect) {
      semesterSelect.addEventListener("change", updateSubjects);
    }
  };

  // Call this after opening the faculty modal
  const setupFormListeners = () => {
    const semesterSelect = document.getElementById("semester");
    if (semesterSelect) {
      semesterSelect.addEventListener("change", updateSubjects);
    }
  };

  // Update openFacultyModal to include setup
  const openFacultyModal = () => {
    setIsFacultyModalOpen(true);
    // Use setTimeout to ensure the modal is rendered before setting up listeners
    setTimeout(() => {
      setupFormListeners();
    }, 100);
  };
  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId");

      console.log("Admin ID from localStorage:", adminId);
      console.log("Token from localStorage:", token);

      if (!token || !adminId) {
        console.error("Token or Admin ID not found");
        alert("Authentication error: Please log in again.");
        return;
      }

      const response = await axios.get(
        "https://gradyzebackend.onrender.com/api/teacher/teacherslist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: { adminId },
        }
      );

      console.log("Response Data:", response.data);

      setFaculties(response.data.teachers);
    } catch (error) {
      console.error(
        "Failed to fetch faculty data:",
        error.response || error.message
      );
      alert(error.response?.data?.message || "Failed to fetch faculty data.");
      setFaculties([]);
    }
  };

  const groupFacultyByStructure = (facultyData) => {
    const grouped = {};

    if (!facultyData || facultyData.length === 0) {
      return grouped;
    }

    facultyData.forEach((f) => {
      if (!Array.isArray(f.subjects)) {
        return;
      }

      f.subjects.forEach((subject) => {
        if (
          !subject.year ||
          !subject.division ||
          !subject.name ||
          !subject.semester
        ) {
          return; // ✅ Now we check if semester is present
        }

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

        // ✅ Push the faculty along with the semester
        grouped[f.department][subject.year][subject.division][
          subject.name
        ].push({
          ...f,
          semester: subject.semester, // ✅ Now semester is stored
        });
      });
    });

    return grouped;
  };
  const groupedFaculty = useMemo(
    () => groupFacultyByStructure(faculties),
    [faculties]
  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFaculty = faculties.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subjects.some((subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const filteredGroupedFaculty = useMemo(() => {
    const filteredGroup = {};

    Object.keys(groupedFaculty).forEach((department) => {
      const yearGroup = groupedFaculty[department];
      filteredGroup[department] = {};

      Object.keys(yearGroup).forEach((year) => {
        const divisionGroup = yearGroup[year];
        filteredGroup[department][year] = {};

        Object.keys(divisionGroup).forEach((division) => {
          const subjectGroup = divisionGroup[division];
          filteredGroup[department][year][division] = {};

          Object.keys(subjectGroup).forEach((subjectName) => {
            const facultyForSubject = subjectGroup[subjectName];
            const filteredFacultyForSubject = facultyForSubject.filter(
              (f) =>
                f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.department
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                f.subjects.some((subject) =>
                  subject.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );

            if (filteredFacultyForSubject.length > 0) {
              filteredGroup[department][year][division][subjectName] =
                filteredFacultyForSubject;
            }
          });
        });
      });
    });

    return filteredGroup;
  }, [groupedFaculty, searchQuery]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const renderFaculties = () => {
    if (filteredFaculty.length === 0) {
      return (
        <div className="text-center p-8 text-gray-500">
          <div>No faculty data available</div>
          <p>Click on "Add Faculty" to get started</p>
        </div>
      );
    }

    return Object.keys(filteredGroupedFaculty).map((department) => (
      <div
        key={department}
        className="border rounded-lg shadow-md mb-4 overflow-hidden"
      >
        <div
          className="bg-gray-200 p-4 flex justify-between items-center cursor-pointer"
          onClick={() =>
            toggleCollapse(`department-${department.replace(/\s/g, "-")}`)
          }
        >
          <span>{department}</span>
          <button className="text-gray-600">▼</button>
        </div>
        {Object.keys(filteredGroupedFaculty[department]).map((year) => (
          <div key={year} className="border-t">
            <div
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleCollapse(`year-${department}-${year}`)}
            >
              <span>Year: {year}</span>
              <button className="text-gray-600">▼</button>
            </div>
            <div id={`year-${department}-${year}`} className="p-4 grid gap-4">
              {Object.keys(filteredGroupedFaculty[department][year]).map(
                (division) => (
                  <div
                    key={division}
                    className="border rounded-lg shadow-md p-4"
                  >
                    <div className="text-xl font-semibold">
                      Division {division}
                    </div>
                    {Object.keys(
                      filteredGroupedFaculty[department][year][division]
                    ).map((subjectName) => (
                      <div key={subjectName} className="mt-4 border-t pt-4">
                        <div className="text-lg font-semibold">
                          {subjectName}
                        </div>
                        {filteredGroupedFaculty[department][year][division][
                          subjectName
                        ].map((faculty) => (
                          <div
                            key={faculty.teacherId}
                            className="bg-white p-4 rounded-lg shadow-md mt-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3>{faculty.name}</h3>
                                <p>{faculty.email}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    openSubjectModal(faculty.teacherId)
                                  }
                                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    removeSubject(
                                      faculty.email,
                                      subjectName,
                                      year,
                                      faculty.semester,
                                      division
                                    )
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const toggleCollapse = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle("hidden");
    }
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
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={openFacultyModal}
          >
            Add Faculty
          </button>
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
              <button className="text-gray-600" onClick={closeFacultyModal}>
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
                <label className="block text-gray-700">Role</label>
                <div className="flex gap-4">
                  <div>
                    <input
                      type="radio"
                      id="subjectTeacher"
                      name="role"
                      value="Subject Teacher"
                      required
                    />
                    <label htmlFor="subjectTeacher">Subject Teacher</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="classTeacher"
                      name="role"
                      value="Class Teacher"
                      required
                    />
                    <label htmlFor="classTeacher">Class Teacher</label>
                  </div>
                </div>
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
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
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
              {formData.get("role") !== "Class Teacher" && (
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
              )}
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

      {isSubjectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg">
                Add Subject to:{" "}
                {faculties.find((f) => f._id === selectedFacultyId)?.name ||
                  "Faculty"}
              </h3>
              <button className="text-gray-600" onClick={closeSubjectModal}>
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

export default FacultyManagementSystem;
