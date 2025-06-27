import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { motion, AnimatePresence } from "framer-motion";

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
  // ... (keep the rest of your subjectsData)
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
  const [expandedFaculty, setExpandedFaculty] = useState(null);

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

  const toggleFacultyDetails = (facultyId) => {
    setExpandedFaculty(expandedFaculty === facultyId ? null : facultyId);
  };

  // ... (keep all your existing functions: createFaculty, addSubject, removeSubject, deleteTeacher, etc.)

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
        className="border rounded-lg shadow-md mb-4 p-4 transition-all duration-200"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {faculty.name}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => toggleFacultyDetails(faculty._id)}
              onKeyDown={(e) =>
                e.key === "Enter" && toggleFacultyDetails(faculty._id)
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              aria-expanded={expandedFaculty === faculty._id}
              aria-controls={`faculty-details-${faculty._id}`}
            >
              {expandedFaculty === faculty._id ? "Hide" : "Details"}
            </button>
            <button
              onClick={() => {
                setSelectedFacultyId(faculty._id);
                setIsModifyModalOpen(true);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              aria-label={`Edit ${faculty.name}`}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => {
                setTeacherToDelete(faculty._id);
                setIsDeleteModalOpen(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              aria-label={`Delete ${faculty.name}`}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {expandedFaculty === faculty._id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              id={`faculty-details-${faculty._id}`}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-200">
                {faculty.isSubjectTeacher && faculty.subjects?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Assigned Subjects:
                    </h4>
                    <ul className="space-y-1 pl-4">
                      {faculty.subjects.map((subject, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          <span className="font-medium">{subject.name}</span>
                          <span className="text-gray-500 ml-2">
                            (Year: {subject.year}, Sem: {subject.semester}, Div:{" "}
                            {subject.division})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {faculty.isClassTeacher && faculty.assignedClass && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">
                      Assigned Class:
                    </h4>
                    <p className="text-sm text-gray-600">
                      Year: {faculty.assignedClass.year}, Division:{" "}
                      {faculty.assignedClass.division}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ));
  };

  const filteredFaculty = useMemo(() => {
    return faculties.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.subjects &&
          f.subjects.some((subject) =>
            subject.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
    );
  }, [faculties, searchQuery]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <header className="bg-purple-500 text-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-center">
          Faculty Management System
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* ... (keep your existing stats cards) */}
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Faculty Directory
          </h2>
          <div className="mt-2 sm:mt-0">
            <button
              onClick={() => setIsFacultyModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Faculty
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search by name, department or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="space-y-4">{renderFaculties()}</div>
      </div>

      {/* ... (keep all your existing modal implementations) */}

      {message && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default FacultyManagementSystem;
