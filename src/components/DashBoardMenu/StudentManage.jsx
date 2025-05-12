import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

// Main component
const StudentManagement = () => {
  const [structuredData, setStructuredData] = useState(null);
  const [studentsData, setStudentsData] = useState({});
  const [classMetaMap, setClassMetaMap] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  const adminId = sessionStorage.getItem("adminId");

  // Build department/year/division structure + classId metadata
  useEffect(() => {
    const departments = [
      "Computer Science",
      "Information Technology",
      "Mechanical Engineering",
      "Electronic & Telecommunication",
      "Civil Engineering",
    ];

    const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
    const divisions = ["A", "B"];

    const newStructure = { departments: {} };
    const newMetaMap = {};

    departments.forEach((dept) => {
      newStructure.departments[dept] = { years: {} };

      years.forEach((year) => {
        newStructure.departments[dept].years[year] = { divisions: {} };

        divisions.forEach((division) => {
          const classId = Math.floor(Math.random() * 100000);
          newStructure.departments[dept].years[year].divisions[division] = {
            id: classId,
          };

          newMetaMap[classId] = {
            department: dept,
            year,
            division,
          };
        });
      });
    });

    setStructuredData(newStructure);
    setClassMetaMap(newMetaMap);
  }, []);

  // Fetch student data from backend after structure is built
  useEffect(() => {
    if (!adminId || !structuredData) return;

    const fetchStudents = async () => {
      for (const department in structuredData.departments) {
        for (const year in structuredData.departments[department].years) {
          for (const division in structuredData.departments[department].years[
            year
          ].divisions) {
            const classObj =
              structuredData.departments[department].years[year].divisions[
                division
              ];
            const classId = classObj.id;

            try {
              const response = await axios.get(
                "https://gradyzebackend.onrender.com/api/admin/fetchstudents",
                {
                  params: {
                    adminId,
                    department,
                    year,
                    division,
                  },
                }
              );

              const students = response.data.students || [];
              setStudentsData((prev) => ({
                ...prev,
                [classId]: students,
              }));
            } catch (error) {
              console.warn(
                `No students for ${department} - ${year} - ${division}`
              );
            }
          }
        }
      }
    };

    fetchStudents();
  }, [adminId, structuredData]);

  // Toggle expand/collapse
  const toggleContainer = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Generate PDF using metadata
  const generatePDF = (classId) => {
    const students = studentsData[classId];
    const meta = classMetaMap[classId];

    if (!students || !meta) {
      alert("No data available to generate PDF.");
      return;
    }

    const { department, year, division } = meta;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`${department} - ${year}`, 20, 20);
    doc.text(`Division: ${division}`, 20, 30);
    doc.text(`Class Teacher: N/A`, 20, 40); // Optional: replace with real teacher data

    if (students.length > 0) {
      const headers = ["Roll No", "Name", "Email"];
      const body = students.map((s) => [s.rollNo, s.name, s.email]);

      doc.autoTable({
        startY: 50,
        head: [headers],
        body: body,
      });
    } else {
      doc.text("No students found.", 20, 50);
    }

    doc.save(`${department}_${year}_Division${division}.pdf`);
  };

  if (!structuredData) return <div>Loading structure...</div>;

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="header mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Student Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Organize by Department, Year, and Division
        </p>
      </div>

      <div id="hierarchicalContainer">
        {Object.keys(structuredData.departments).map((department) => {
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
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <i className="fas fa-building"></i> {department} Department
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
                    structuredData.departments[department].years
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
                          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                            <i className="fas fa-calendar-alt"></i> {year}
                          </h3>
                          <i
                            className={`fas fa-chevron-${
                              expandedSections[`${yearId}-body`] ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                        {expandedSections[`${yearId}-body`] && (
                          <div
                            id={`${yearId}-body`}
                            className="container-body mt-2 sm:mt-4"
                          >
                            {Object.keys(
                              structuredData.departments[department].years[year]
                                .divisions
                            ).map((division) => {
                              const divisionData =
                                structuredData.departments[department].years[
                                  year
                                ].divisions[division];
                              return (
                                <div
                                  key={divisionData.id}
                                  className="division-container bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 border-l-4 border-yellow-500"
                                >
                                  <div className="container-header flex justify-between items-center">
                                    <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                                      <i className="fas fa-users"></i> Division{" "}
                                      {division}
                                    </h3>
                                    <button
                                      className="btn bg-yellow-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600 text-xs sm:text-base"
                                      onClick={() =>
                                        generatePDF(divisionData.id)
                                      }
                                    >
                                      <i className="fas fa-file-pdf"></i>{" "}
                                      Generate PDF
                                    </button>
                                  </div>
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

export default StudentManagement;
