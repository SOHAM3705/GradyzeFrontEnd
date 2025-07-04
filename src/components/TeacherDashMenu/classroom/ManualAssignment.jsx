import React, { useState, useEffect } from "react";
import { ChevronRight, Plus, Edit, Trash2, Check, X } from "lucide-react";

const ManualAssignment = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [assignments, setAssignments] = useState({
    theory: [],
    practical: [],
    miniproject: [],
  });
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    theory: false,
    practical: false,
    miniproject: false,
  });

  // Get teacher ID from session storage
  const teacherId =
    sessionStorage.getItem("teacherId") || "67e27245766e6b0b923fe807";

  // Fetch subjects and students
  useEffect(() => {
    fetchSubjectsAndStudents();
  }, []);

  const fetchSubjectsAndStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gradyzebackend.onrender.com/api/studentmanagement/students-by-subject/${teacherId}`
      );
      const data = await response.json();

      console.log("Fetched data:", data); // Debug log

      setSubjects(data.subjects || []);
      setStudents(data.studentData || {});

      console.log("Students data:", data.studentData); // Debug log
    } catch (error) {
      console.error("Error fetching subjects and students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignments for selected subject
  const fetchAssignments = async (subjectId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gradyzebackend.onrender.com/api/assignments/${teacherId}/${subjectId}`
      );
      const data = await response.json();

      if (data.success) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    fetchAssignments(subject._id);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Create Assignment Modal Component
  const CreateAssignmentModal = () => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      type: "theory",
      dueDate: "",
    });

    const handleSubmit = async () => {
      if (!formData.title) {
        alert("Please enter a title");
        return;
      }

      try {
        const response = await fetch(
          "https://gradyzebackend.onrender.com/api/classroom/assignments",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              teacherId,
              subjectId: selectedSubject._id,
              year: selectedSubject.year,
              semester: selectedSubject.semester,
              division: selectedSubject.division,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setShowCreateModal(false);
          fetchAssignments(selectedSubject._id);
          setFormData({
            title: "",
            description: "",
            type: "theory",
            dueDate: "",
          });
        }
      } catch (error) {
        console.error("Error creating assignment:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Create New Assignment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded-md h-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="theory">Theory</option>
                <option value="practical">Practical</option>
                <option value="miniproject">Mini Project</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Marks
              </label>
              <input
                type="number"
                value={formData.maxMarks}
                onChange={(e) =>
                  setFormData({ ...formData, maxMarks: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Create Assignment
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Student Assignment Modal Component
  const StudentAssignmentModal = () => {
    const [studentData, setStudentData] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState({});

    useEffect(() => {
      if (selectedAssignment && selectedSubject && !loading) {
        fetchStudentAssignments();
      }
    }, [selectedAssignment?._id, selectedSubject?._id]); // Only trigger when these specific IDs change

    const fetchStudentAssignments = async () => {
      try {
        // First, fetch existing student assignments
        const assignmentResponse = await fetch(
          `https://gradyzebackend.onrender.com/api/classroom/student-assignments/${selectedAssignment._id}`
        );
        const assignmentData = await assignmentResponse.json();

        if (assignmentData.success) {
          setStudentAssignments(assignmentData.studentAssignments);
        }

        // Get students for this subject from the main API
        const subjectKey = `${selectedSubject.year}-${selectedSubject.division}`;
        const studentsForSubject = students[subjectKey] || [];
        setStudentData(studentsForSubject);

        // Initialize selected students state based on existing assignments
        const initialSelected = {};
        studentsForSubject.forEach((student) => {
          // Check if this student has already completed the assignment
          const existingAssignment = assignmentData.studentAssignments?.find(
            (sa) =>
              sa.studentId._id === student._id || sa.studentId === student._id
          );
          initialSelected[student._id] = existingAssignment
            ? existingAssignment.isCompleted
            : false;
        });
        setSelectedStudents(initialSelected);
      } catch (error) {
        console.error("Error fetching student assignments:", error);
      }
    };

    const handleStudentToggle = (studentId) => {
      setSelectedStudents((prev) => ({
        ...prev,
        [studentId]: !prev[studentId],
      }));
    };

    const handleSave = async () => {
      try {
        const updates = Object.entries(selectedStudents).map(
          ([studentId, isCompleted]) => ({
            studentId,
            isCompleted,
          })
        );

        const response = await fetch(
          `https://gradyzebackend.onrender.com/api/classroom/student-assignments/bulk/${selectedAssignment._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setShowStudentModal(false);
        }
      } catch (error) {
        console.error("Error updating student assignments:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {selectedAssignment?.title} - Student Assignments
          </h3>

          {/* Debug info */}
          <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
            <p>
              Subject: {selectedSubject?.year}-{selectedSubject?.division}
            </p>
            <p>Students found: {studentData.length}</p>
          </div>

          {studentData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No students found for this subject.</p>
              <p className="text-sm mt-2">
                Looking for students in: {selectedSubject?.year}-
                {selectedSubject?.division}
              </p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {studentData.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      Roll No: {student.rollNo}
                    </span>
                    <span>{student.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStudentToggle(student._id)}
                      className={`p-2 rounded-md transition-colors ${
                        selectedStudents[student._id]
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {selectedStudents[student._id] ? (
                        <Check size={16} />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                    <span className="text-sm">
                      {selectedStudents[student._id] ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowStudentModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render assignment section
  const renderAssignmentSection = (type, assignmentList) => {
    const isExpanded = expandedSections[type];
    const typeLabels = {
      theory: "Theory",
      practical: "Practical",
      miniproject: "Mini Project",
    };

    return (
      <div className="border rounded-lg mb-4">
        <div
          className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
          onClick={() => toggleSection(type)}
        >
          <h3 className="font-medium text-lg">
            {typeLabels[type]} ({assignmentList.length})
          </h3>
          <ChevronRight
            className={`transform transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </div>

        {isExpanded && (
          <div className="p-4 space-y-3">
            {assignmentList.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No {typeLabels[type].toLowerCase()} assignments found
              </p>
            ) : (
              assignmentList.map((assignment) => (
                <div
                  key={assignment._id}
                  className="flex items-center justify-between p-3 bg-white border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowStudentModal(true);
                  }}
                >
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">
                      {assignment.description}
                    </p>
                  </div>
                  <ChevronRight size={16} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manual Assignment Management</h1>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      )}

      {!selectedSubject ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select a Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSubjectSelect(subject)}
              >
                <h3 className="font-medium text-lg">{subject.name}</h3>
                <p className="text-sm text-gray-600">
                  {subject.year} - Semester {subject.semester} - Division{" "}
                  {subject.division}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-blue-500 hover:text-blue-700 mb-2"
              >
                ← Back to Subjects
              </button>
              <h2 className="text-xl font-semibold">
                {selectedSubject.name} - {selectedSubject.year} Sem{" "}
                {selectedSubject.semester} Div {selectedSubject.division}
              </h2>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={16} />
              Create Assignment
            </button>
          </div>

          {renderAssignmentSection("theory", assignments.theory)}
          {renderAssignmentSection("practical", assignments.practical)}
          {renderAssignmentSection("miniproject", assignments.miniproject)}
        </div>
      )}

      {showCreateModal && <CreateAssignmentModal />}
      {showStudentModal && <StudentAssignmentModal />}
    </div>
  );
};

export default ManualAssignment;
