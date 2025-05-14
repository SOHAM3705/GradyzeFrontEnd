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
              const { data } = await axios.get(
                "https://gradyzebackend.onrender.com/api/admin/fetchmarks",
                {
                  params: {
                    adminId: sessionStorage.getItem("adminId"), // Replace with actual adminId or state
                    department: department,
                    year: year,
                    division: division,
                    examType: examType, // "unitTest" or "prelims"
                  },
                }
              );

              // Store fetched marks data in state
              setMarksData((prevData) => ({
                ...prevData,
                [classId]: data.marksData,
              }));

              // Store meta data for PDF generation
              setClassMetaMap((prevMeta) => ({
                ...prevMeta,
                [classId]: { department, year, division },
              }));

              // Update HTML table with marks data
              const marksContainer = document.getElementById(
                `marks-${classId}`
              );
              if (marksContainer) {
                let html = `
                  <div class="search-container mb-4">
                    <input type="text" id="search-${classId}" class="w-full p-2 border rounded" placeholder="Search students..." onkeyup="filterStudents('${classId}')">
                  </div>
                  <table class="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr>
                        <th class="py-2 px-2 sm:px-4 border-b">Roll No</th>
                        <th class="py-2 px-2 sm:px-4 border-b">Name</th>
                        <th class="py-2 px-2 sm:px-4 border-b">${
                          examType === "unitTest"
                            ? "Unit Test Marks"
                            : "Prelims Marks"
                        }</th>
                      </tr>
                    </thead>
                    <tbody id="student-list-${classId}">
                `;

                // Add student marks to table
                data.marksData.forEach((student) => {
                  html += `
                    <tr>
                      <td class="py-2 px-2 sm:px-4 border-b">${
                        student.rollNo
                      }</td>
                      <td class="py-2 px-2 sm:px-4 border-b">${
                        student.name
                      }</td>
                      <td class="py-2 px-2 sm:px-4 border-b">${
                        student.marks || "-"
                      }</td>
                    </tr>
                  `;
                });

                html += `</tbody></table>`;
                html += `<button class="btn bg-green-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm mt-4" onclick="generatePDF('${classId}')">Generate PDF</button>`;
                marksContainer.innerHTML = html;
                marksContainer.style.display = "block";
              }
            } catch (error) {
              console.error("Error fetching marks:", error);
            }
          }
        }
      }
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
  window.filterStudents = (classId) => {
    const input = document.getElementById(`search-${classId}`);
    const filter = input.value.toUpperCase();
    const table = document.getElementById(`student-list-${classId}`);
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

  // Add this script to make the generatePDF function available globally
  window.generatePDF = (classId) => {
    const students = marksData[classId]; // use marksData for marks
    const meta = classMetaMap[classId]; // use classMetaMap for meta

    if (!students || !meta) {
      alert("No data available to generate PDF.");
      return;
    }

    const { department, year, division } = meta;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`${department} - ${year}`, 20, 20);
    doc.text(`Division: ${division}`, 20, 30);
    doc.text(`Class Teacher: N/A`, 20, 40); // Optional: Replace with real teacher name if available

    if (students.length > 0) {
      const headers = ["Roll No", "Name", "Total Marks"];
      const body = students.map((s) => [
        s.rollNo,
        s.name,
        s.marks !== null && s.marks !== undefined ? s.marks : "-",
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
      `${department}_${year}_Division${division}_Marks.pdf`.replace(
        /\s+/g,
        "_"
      );
    doc.save(fileName);
  };

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
                className="department-container bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 border-l-4 border-blue-500"
              >
                <div
                  className="container-header flex justify-between items-center cursor-pointer"
                  onClick={() => toggleContainer(`${deptId}-body`)}
                >
                  <h3 className="text-sm sm:text-base font-semibold">
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
                          className="year-container bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 border-l-4 border-green-500"
                        >
                          <div
                            className="container-header flex justify-between items-center cursor-pointer"
                            onClick={() => toggleContainer(`${yearId}-body`)}
                          >
                            <h3 className="text-sm sm:text-base font-semibold">
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
                                              className="block w-full px-2 sm:px-3 py-1 sm:py-2 text-left text-xs sm:text-sm"
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
                                              className="block w-full px-2 sm:px-3 py-1 sm:py-2 text-left text-xs sm:text-sm"
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
                                              className="block w-full px-2 sm:px-3 py-1 sm:py-2 text-left text-xs sm:text-sm"
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
                                              className="block w-full px-2 sm:px-3 py-1 sm:py-2 text-left text-xs sm:text-sm"
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
