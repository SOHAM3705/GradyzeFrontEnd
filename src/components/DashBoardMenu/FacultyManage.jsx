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
  const [isClassTeacherModalOpen, setIsClassTeacherModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const closeFacultyModal = () => setIsFacultyModalOpen(false);
  const closeClassTeacherModal = () => setIsClassTeacherModalOpen(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const openSubjectModal = (facultyId) => {
    setSelectedFacultyId(facultyId);
    setIsSubjectModalOpen(true);
  };

  const closeSubjectModal = () => {
    setIsSubjectModalOpen(false);
    setSelectedFacultyId(null);
  };

  const openModifyModal = (facultyId) => {
    const faculty = faculties.find((f) => f._id === facultyId);
    setSelectedFaculty(faculty);
    setSelectedFacultyId(facultyId); // Ensure facultyId is set
    setIsModifyModalOpen(true);
  };

  const openAddSubjectModal = (facultyId) => {
    setIsModifyModalOpen(false); // Close Modify Modal
    setSelectedFacultyId(facultyId);
    setIsAddSubjectModalOpen(true); // Open Add Subject Modal
  };

  const openDeleteModal = (teacherId) => {
    setTeacherToDelete(teacherId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTeacherToDelete(null);
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

  const createFaculty = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const nameValue = formData.get("name");
    const emailValue = formData.get("email");
    const departmentValue = formData.get("department");
    const divisionValue = formData.get("division");
    const yearValue = formData.get("year"); // ✅ Fix: Retrieve year
    const semesterValue = parseInt(formData.get("semester")); // ✅ Fix: Parse semester as number
    const subjectName = formData.get("subject");

    if (!yearValue || isNaN(semesterValue)) {
      alert("Please select a valid year and semester.");
      return;
    }

    const adminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("token");

    if (!adminId || !token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    const teacherData = {
      name: nameValue,
      email: emailValue,
      department: departmentValue,
      teacherType: "subjectTeacher",
      subjects: [
        {
          name: subjectName,
          year: yearValue,
          semester: semesterValue,
          division: divisionValue,
        },
      ],
      adminId,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/add-teacher-subject",
        teacherData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert("Teacher added successfully!");
        setFaculties((prev) => [...prev, response.data.teacher]);
      } else {
        alert("Failed to add teacher.");
      }
    } catch (error) {
      console.error("Error adding faculty:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to add teacher.");
    } finally {
      setLoading(false);
      closeFacultyModal();
      form.reset();
    }
  };

  const addClassTeacher = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const nameValue = formData.get("name");
    const emailValue = formData.get("email");
    const departmentValue = formData.get("department");
    const divisionValue = formData.get("division");
    const yearValue = formData.get("year");

    const adminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("token");

    if (!adminId) {
      alert("Admin ID is missing.");
      return;
    }

    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    const teacherData = {
      name: nameValue,
      email: emailValue,
      department: departmentValue,
      teacherType: "classTeacher",
      assignedClass: {
        year: yearValue,
        division: divisionValue,
      },
      adminId,
    };

    console.log("Sending teacher data:", teacherData);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/add-teacher-subject",
        teacherData,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Added token
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMessage(response.data.message);
        setFaculties((prev) => [...prev, response.data.teacher]);
        alert(response.data.message || "Class Teacher added successfully!");
      } else {
        setMessage("Failed to add class teacher. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        "Failed to add class teacher: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
      closeClassTeacherModal();
      form.reset();
    }
  };

  const updateSubjects = () => {
    const department = document.querySelector(
      'select[name="department"]'
    ).value;
    const yearSelect = document.getElementById("year");
    const semesterSelect = document.getElementById("semester");
    const subjectSelect = document.getElementById("subject");

    const year = yearSelect.value;
    const semesterText = semesterSelect.value;
    const semesterNumber = semesterText
      ? parseInt(semesterText.replace("Semester ", ""))
      : null;

    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjectSelect.disabled = !semesterText;

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

    // Extract form values
    const subjectName = formData.get("subjectName")?.trim();
    const yearValue = formData.get("year")?.trim();
    const semesterValue = parseInt(formData.get("semester"));
    const divisionValue = formData.get("division")?.trim();

    // Check if any field is empty
    if (!subjectName || !yearValue || isNaN(semesterValue) || !divisionValue) {
      alert(
        "Please fill all required fields: Subject Name, Year, Semester, and Division."
      );
      return;
    }

    const newSubject = {
      name: subjectName,
      year: yearValue,
      semester: semesterValue,
      division: divisionValue,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId");

      if (!adminId || !token) {
        alert("Authentication error. Please log in again.");
        setLoading(false);
        return;
      }

      const payload = {
        teacherId: selectedFacultyId,
        subjects: [newSubject],
        adminId,
      };

      console.log("🚀 Sending subject payload:", payload);

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
        setIsAddSubjectModalOpen(false); // Close Add Subject Modal on success
      } else {
        alert("Failed to add subject. Please try again.");
      }
    } catch (error) {
      console.error("Error adding subject:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to add subject.");
    } finally {
      setLoading(false);
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

      // Ensure semester is a number
      let semesterValue = parseInt(semester);
      if (isNaN(semesterValue)) {
        alert("Invalid semester value.");
        return;
      }

      if (!facultyId || !subjectName || !year || !division) {
        alert("One or more required fields are missing.");
        return;
      }

      const payload = {
        teacherId: facultyId,
        subjectName: subjectName.trim(),
        year: year.trim(),
        semester: semesterValue,
        division: division.trim(),
        adminId,
      };

      console.log("🚀 Sending subject removal payload:", payload);

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
          prev.map((teacher) => ({
            ...teacher,
            subjects: teacher.subjects.filter(
              (subject) =>
                subject.name !== subjectName ||
                subject.year !== year ||
                subject.semester !== semesterValue ||
                subject.division !== division
            ),
          }))
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
          data: { adminId }, // Pass adminId in request body
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
      closeDeleteModal();
    }
  };

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

    const subjectSelect = document.getElementById("subject");
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjectSelect.disabled = true;
  };

  const attachSemesterListener = () => {
    const semesterSelect = document.getElementById("semester");
    if (semesterSelect) {
      semesterSelect.addEventListener("change", updateSubjects);
    }
  };

  const setupFormListeners = () => {
    const semesterSelect = document.getElementById("semester");
    if (semesterSelect) {
      semesterSelect.addEventListener("change", updateSubjects);
    }
  };

  const openFacultyModal = () => {
    setIsFacultyModalOpen(true);
    setTimeout(() => {
      setupFormListeners();
    }, 100);
  };

  const openClassTeacherModal = () => {
    setIsClassTeacherModalOpen(true);
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
          return;
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

        grouped[f.department][subject.year][subject.division][
          subject.name
        ].push({
          ...f,
          semester: subject.semester,
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

    return filteredFaculty.map((faculty) => (
      <div key={faculty._id} className="border rounded-lg shadow-md mb-4 p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{faculty.name}</h3>
          <div className="flex gap-2">
            {/* Modify Button */}
            <button
              onClick={() => openModifyModal(faculty._id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              <i className="fas fa-edit"></i>
            </button>

            <button
              onClick={() => openDeleteModal(faculty._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <i className="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>

        {/* Assigned Subjects (For Subject Teachers) */}
        {faculty.teacherType === "subjectTeacher" &&
          faculty.subjects.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Assigned Subjects:</h4>
              <ul className="list-disc pl-5">
                {faculty.subjects.map((subject, index) => (
                  <li key={index} className="mb-1 flex items-center">
                    {subject.name} (Year: {subject.year}, Semester:{" "}
                    {subject.semester}, Division: {subject.division})
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Assigned Class (For Class Teachers) */}
        {faculty.teacherType === "classTeacher" && faculty.assignedClass && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Assigned Class:</h4>
            <p className="text-gray-700">
              {faculty.assignedClass.year} - Division{" "}
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
              onClick={openFacultyModal}
            >
              Add Faculty
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
              onClick={openClassTeacherModal}
            >
              Add Class Teacher
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
              <div className="form-group">
                <label className="block text-gray-700">Subject</label>
                <select
                  id="subject"
                  name="subject"
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

      {isClassTeacherModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg">Add New Class Teacher</h3>
              <button
                className="text-gray-600"
                onClick={closeClassTeacherModal}
              >
                &times;
              </button>
            </div>
            <form onSubmit={addClassTeacher} className="space-y-4">
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
                  Add Class Teacher
                </button>
                <button
                  type="button"
                  onClick={closeClassTeacherModal}
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
                onClick={closeDeleteModal}
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

      {selectedFacultyId && (
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
                        selectedFacultyId,
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
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold">Add Subject</h3>

            <form onSubmit={addSubject} className="space-y-4 mt-4">
              <input type="hidden" name="teacherId" value={selectedFacultyId} />

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

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add Subject
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModifyModalOpen && selectedFaculty && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold">
              Modify Subjects for {selectedFaculty.name}
            </h3>

            <div>
              <h4>Current Subjects:</h4>
              <ul>
                {selectedFaculty.subjects.map((subject, index) => (
                  <li key={index} className="flex items-center mb-1">
                    {subject.name} (Year: {subject.year}, Semester:{" "}
                    {subject.semester}, Division: {subject.division})
                    <button
                      onClick={() =>
                        removeSubject(
                          selectedFaculty._id,
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

            {/* Add Subject Button */}
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => openAddSubjectModal(selectedFacultyId)}
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
