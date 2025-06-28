import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Function to create division data
const createDivisionData = () => ({
  id: Math.floor(Math.random() * 10000),
  students: [], // Student data will be filled later
});

// Function to create year data
const createYearData = () => ({
  divisions: {
    A: createDivisionData(),
    B: createDivisionData(),
  },
});

// Function to create department data
const createDepartmentData = () => ({
  years: {
    "First Year": createYearData(),
    "Second Year": createYearData(),
    "Third Year": createYearData(),
    "Fourth Year": createYearData(),
  },
});

const AdminStudentMarks = () => {
  // State for structured data (department, year, division)
  const [structuredData] = useState({
    departments: {
      "Computer Science": createDepartmentData(),
      "Information Technology": createDepartmentData(),
      "Mechanical Engineering": createDepartmentData(),
      "Electronic & Telecommunication": createDepartmentData(),
      "Civil Engineering": createDepartmentData(),
    },
  });

  // State for tracking expanded sections
  const [expandedSections, setExpandedSections] = useState({});
  // State for managing open marks options
  const [openMarksOptions, setOpenMarksOptions] = useState(null);
  // State for storing fetched marks
  const [marksData, setMarksData] = useState({});
  // State for storing meta data for PDF generation
  const [classMetaMap, setClassMetaMap] = useState({});
  // State for loading indicators
  const [loadingMarks, setLoadingMarks] = useState({});
  // State for error messages
  const [errorMessages, setErrorMessages] = useState({});

  // Function to toggle section expansion
  const toggleContainer = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleMarksOptions = (classId) => {
    setOpenMarksOptions((prev) => (prev === classId ? null : classId));
  };

  const showMarks = async (classId, examType) => {
    setOpenMarksOptions(null);
    setLoadingMarks((prev) => ({ ...prev, [classId]: true }));
    setErrorMessages((prev) => ({ ...prev, [classId]: null }));

    // Loop through the structured data to find the correct class and fetch marks
    for (const department in structuredData.departments) {
      for (const year in structuredData.departments[department]?.years) {
        for (const division in structuredData.departments[department]?.years[
          year
        ]?.divisions) {
          const divisionData =
            structuredData.departments[department]?.years[year]?.divisions[
              division
            ];

          if (divisionData?.id === classId) {
            // Fetch marks data from the backend
            try {
              console.log(
                `Fetching marks for ${department}, ${year}, ${division}, ${examType}`
              );

              const { data } = await axios.get(
                "https://gradyzebackend.onrender.com/api/admin/fetchmarks",
                {
                  params: {
                    adminId: sessionStorage.getItem("adminId"), // Get the adminId from session storage
                    department: department,
                    year: year,
                    division: division,
                    examType: examType, // "unitTest", "reunitTest", "prelims", or "reprelims"
                  },
                }
              );

              console.log("Marks data received:", data);

              // Store fetched marks data in state
              setMarksData((prevData) => ({
                ...prevData,
                [classId]: data.marksData,
              }));

              // Store meta data for PDF generation
              setClassMetaMap((prevMeta) => ({
                ...prevMeta,
                [classId]: { department, year, division, examType },
              }));

              // Update HTML table with marks data
              updateMarksTable(classId, data.marksData, examType);
            } catch (error) {
              console.error("Error fetching marks:", error);
              let errorMessage = "Failed to fetch marks";

              if (error.response) {
                errorMessage = error.response.data.error || errorMessage;
                console.log(
                  "Server responded with error:",
                  error.response.data
                );
              }

              setErrorMessages((prev) => ({
                ...prev,
                [classId]: errorMessage,
              }));

              // Display error in marks container
              const marksContainer = document.getElementById(
                `marks-${classId}`
              );
              if (marksContainer) {
                marksContainer.innerHTML = `
                  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline"> ${errorMessage}</span>
                  </div>
                `;
                marksContainer.style.display = "block";
              }
            } finally {
              setLoadingMarks((prev) => ({ ...prev, [classId]: false }));
            }
          }
        }
      }
    }
  };

  // Function to update the marks table
  const updateMarksTable = (classId, marksData, examType) => {
    const marksContainer = document.getElementById(`marks-${classId}`);
    if (marksContainer) {
      let html = `
        <div class="search-container mb-4">
          <input type="text" id="search-${classId}" class="w-full p-2 border rounded" placeholder="Search students..." onkeyup="filterStudents('${classId}')">
        </div>
      `;

      // Show exam type title
      let examTypeDisplay = "";
      switch (examType) {
        case "unitTest":
          examTypeDisplay = "Unit Test";
          break;
        case "reunitTest":
          examTypeDisplay = "Re-Unit Test";
          break;
        case "prelims":
          examTypeDisplay = "Prelims";
          break;
        case "reprelims":
          examTypeDisplay = "Re-Prelims";
          break;
        default:
          examTypeDisplay = examType;
      }

      html += `<h4 class="text-lg font-semibold mb-3">${examTypeDisplay} Results</h4>`;

      html += `
        <table class="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th class="py-2 px-2 sm:px-4 border-b">Roll No</th>
              <th class="py-2 px-2 sm:px-4 border-b">Name</th>
              <th class="py-2 px-2 sm:px-4 border-b">Overall Marks</th>
            </tr>
          </thead>
          <tbody id="student-list-${classId}">
      `;

      // Check if we have any marks data
      if (marksData && marksData.length > 0) {
        // Sort marksData by roll number
        const sortedMarks = [...marksData].sort((a, b) => {
          // Convert to numbers if they are string-based roll numbers
          const rollA = isNaN(a.rollNo) ? a.rollNo : Number(a.rollNo);
          const rollB = isNaN(b.rollNo) ? b.rollNo : Number(b.rollNo);
          return rollA > rollB ? 1 : rollA < rollB ? -1 : 0;
        });

        sortedMarks.forEach((student) => {
          html += `
      <tr>
        <td class="py-2 px-2 sm:px-4 border-b">${student.rollNo}</td>
        <td class="py-2 px-2 sm:px-4 border-b">${student.name}</td>
        <td class="py-2 px-2 sm:px-4 border-b ${
          student.marks === null ? "text-red-500" : ""
        }">${
            student.marks !== null && student.marks !== undefined
              ? student.marks
              : "Not Available"
          }</td>
      </tr>
    `;
        });
      } else {
        // No marks data available
        html += `
          <tr>
            <td colspan="3" class="py-4 text-center text-gray-500">No marks data available</td>
          </tr>
        `;
      }

      html += `</tbody></table>`;

      // Only add PDF button if we have marks data
      if (marksData && marksData.length > 0) {
        html += `<button class="btn bg-green-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm mt-4" onclick="generatePDF('${classId}')">Generate PDF</button>`;
      }

      marksContainer.innerHTML = html;
      marksContainer.style.display = "block";
    }
  };

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".marks-section")) {
        setOpenMarksOptions(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Add this script to make the filterStudents function available globally
  useEffect(() => {
    window.filterStudents = (classId) => {
      const input = document.getElementById(`search-${classId}`);
      const filter = input.value.toUpperCase();
      const table = document.getElementById(`student-list-${classId}`);
      if (!table) return;

      const tr = table.getElementsByTagName("tr");

      for (let i = 0; i < tr.length; i++) {
        const tdName = tr[i].getElementsByTagName("td")[1];
        if (tdName) {
          const txtValue = tdName.textContent || tdName.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    };

    // Make generatePDF function available globally
    window.generatePDF = (classId) => {
      const students = marksData[classId]; // use marksData for marks
      const meta = classMetaMap[classId]; // use classMetaMap for meta

      if (!students || !meta) {
        alert("No data available to generate PDF.");
        return;
      }

      const { department, year, division, examType } = meta;
      let examTypeDisplay = "";
      switch (examType) {
        case "unitTest":
          examTypeDisplay = "Unit Test";
          break;
        case "reunitTest":
          examTypeDisplay = "Re-Unit Test";
          break;
        case "prelims":
          examTypeDisplay = "Prelims";
          break;
        case "reprelims":
          examTypeDisplay = "Re-Prelims";
          break;
        default:
          examTypeDisplay = examType;
      }

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text(`${department} - ${year}`, 20, 20);
      doc.text(`Division: ${division}`, 20, 30);
      doc.text(`Exam: ${examTypeDisplay}`, 20, 40);

      if (students.length > 0) {
        const headers = ["Roll No", "Name", "Marks"];
        const sorted = [...students].sort((a, b) => {
          const rollA = isNaN(a.rollNo) ? a.rollNo : Number(a.rollNo);
          const rollB = isNaN(b.rollNo) ? b.rollNo : Number(b.rollNo);
          return rollA > rollB ? 1 : rollA < rollB ? -1 : 0;
        });

        const body = sorted.map((s) => [
          s.rollNo,
          s.name,
          s.marks !== null && s.marks !== undefined ? s.marks : "Not Available",
        ]);

        doc.autoTable({
          startY: 50,
          head: [headers],
          body: body,
          styles: { fontSize: 11, halign: "center" },
          headStyles: { fillColor: [100, 100, 255] },
        });
      } else {
        doc.text("No student marks available.", 20, 50);
      }

      const fileName =
        `${department}_${year}_Division${division}_${examTypeDisplay}_Marks.pdf`.replace(
          /\s+/g,
          "_"
        );
      doc.save(fileName);
    };
  }, [marksData, classMetaMap]);

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="header mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          Student Marks
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Organize by Department, Year, and Division
        </p>
      </div>

      <div id="hierarchicalContainer">
        {structuredData &&
          Object.keys(structuredData.departments).map((department) => {
            const deptId = `dept-${department
              .replace(/\s+/g, "-")
              .toLowerCase()}`;

            return (
              <div
                key={deptId}
                className="department-container bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 border-l-4 border-blue-500"
              >
                <div
                  className="container-header flex justify-between items-center cursor-pointer"
                  onClick={() => toggleContainer(`${deptId}-body`)}
                >
                  <h3 className="text-base sm:text-lg font-semibold">
                    {department} Department
                  </h3>

                  <i
                    className={`fas fa-chevron-${
                      expandedSections[`${deptId}-body`] ? "up" : "down"
                    }`}
                  ></i>
                </div>

                {expandedSections[`${deptId}-body`] && (
                  <div
                    id={`${deptId}-body`}
                    className="container-body mt-2 sm:mt-4"
                  >
                    {Object.keys(
                      structuredData.departments[department]?.years
                    ).map((year) => {
                      const yearId = `${deptId}-year-${year
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`;

                      return (
                        <div
                          key={yearId}
                          className="year-container bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 border-l-4 border-green-500"
                        >
                          <div
                            className="container-header flex justify-between items-center cursor-pointer"
                            onClick={() => toggleContainer(`${yearId}-body`)}
                          >
                            <h3 className="text-base sm:text-lg font-semibold">
                              {year}
                            </h3>

                            <i
                              className={`fas fa-chevron-${
                                expandedSections[`${yearId}-body`]
                                  ? "up"
                                  : "down"
                              }`}
                            ></i>
                          </div>

                          {expandedSections[`${yearId}-body`] && (
                            <div
                              id={`${yearId}-body`}
                              className="container-body mt-2 sm:mt-4"
                            >
                              {Object.keys(
                                structuredData.departments[department]?.years[
                                  year
                                ]?.divisions
                              ).map((division) => {
                                const divisionData =
                                  structuredData.departments[department]?.years[
                                    year
                                  ]?.divisions[division];

                                return (
                                  <div
                                    key={divisionData.id}
                                    className="division-container bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 border-l-4 border-yellow-500"
                                  >
                                    <div className="container-header flex flex-col sm:flex-row justify-between items-center">
                                      <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-0">
                                        Division {division}
                                      </h3>
                                      <div className="marks-section relative">
                                        <button
                                          className="btn bg-yellow-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm"
                                          onClick={() =>
                                            toggleMarksOptions(divisionData.id)
                                          }
                                        >
                                          View Marks
                                        </button>

                                        {openMarksOptions ===
                                          divisionData.id && (
                                          <div className="marks-options absolute right-0 bg-white border border-gray-300 shadow-md rounded-md p-1 sm:p-2 z-10">
                                            <button
                                              className="block w-full px-2 sm:px-3 py-1 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100"
                                              onClick={() =>
                                                showMarks(
                                                  divisionData.id,
                                                  "unitTest"
                                                )
                                              }
                                            >
                                              Unit Test
                                            </button>

                                            <button
                                              className="block w-full px-2 sm:px-3 py-1 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100"
                                              onClick={() =>
                                                showMarks(
                                                  divisionData.id,
                                                  "reunitTest"
                                                )
                                              }
                                            >
                                              Re-Unit Test
                                            </button>

                                            <button
                                              className="block w-full px-2 sm:px-3 py-1 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100"
                                              onClick={() =>
                                                showMarks(
                                                  divisionData.id,
                                                  "prelims"
                                                )
                                              }
                                            >
                                              Prelims
                                            </button>

                                            <button
                                              className="block w-full px-2 sm:px-3 py-1 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100"
                                              onClick={() =>
                                                showMarks(
                                                  divisionData.id,
                                                  "reprelims"
                                                )
                                              }
                                            >
                                              Re-Prelims
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Show loading indicator */}
                                    {loadingMarks[divisionData.id] && (
                                      <div className="flex justify-center items-center py-8">
                                        <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                                        <p className="ml-2">Loading marks...</p>
                                      </div>
                                    )}

                                    {/* Container for marks data */}
                                    <div
                                      id={`marks-${divisionData.id}`}
                                      className="marks-container mt-2 sm:mt-4"
                                      style={{ display: "none" }}
                                    ></div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AdminStudentMarks;
