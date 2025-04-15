import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Define helper functions first
const createDivisionData = () => ({
  id: Math.floor(Math.random() * 10000),
  students: [], // Add student data if needed
});

const createYearData = () => ({
  divisions: {
    A: createDivisionData(),
    B: createDivisionData(),
  },
});

const createDepartmentData = () => ({
  years: {
    "First Year": createYearData(),
    "Second Year": createYearData(),
    "Third Year": createYearData(),
    "Fourth Year": createYearData(),
  },
});

const StudentManagement = () => {
  const [structuredData] = useState({
    departments: {
      "Computer Science": createDepartmentData(),
      "Information Technology": createDepartmentData(),
      "Mechanical Engineering": createDepartmentData(),
      "Electronic & Telecommunication": createDepartmentData(),
      "Civil Engineering": createDepartmentData(),
    },
  });

  const [expandedSections, setExpandedSections] = useState({});

  const toggleContainer = (id) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const generatePDF = (classId) => {
    for (const department in structuredData.departments) {
      for (const year in structuredData.departments[department].years) {
        for (const division in structuredData.departments[department].years[
          year
        ].divisions) {
          const divisionData =
            structuredData.departments[department].years[year].divisions[
              division
            ];

          if (divisionData.id === classId) {
            const doc = new jsPDF();

            // Add Header
            doc.setFontSize(18);
            doc.text(`${department} - ${year}`, 20, 20);
            doc.text(`Division: ${division}`, 20, 30);
            doc.text(
              `Class Teacher: ${divisionData.classTeacher || "N/A"}`,
              20,
              40
            );

            // Student List Table
            if (divisionData.students.length > 0) {
              const headers = ["Roll No", "Name", "Email"];
              const data = divisionData.students.map((student) => [
                student.rollNo,
                student.name,
                student.email,
              ]);

              doc.autoTable({
                startY: 50,
                head: [headers],
                body: data,
              });
            } else {
              doc.text("No students available.", 20, 50);
            }

            // Save the PDF
            doc.save(`${department}_${year}_Division${division}.pdf`);
            return;
          }
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="header mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <p className="text-gray-600">
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
              className="department-container bg-white p-6 rounded-lg shadow-md mb-4 border-l-4 border-blue-500"
            >
              <div
                className="container-header flex justify-between items-center cursor-pointer"
                onClick={() => toggleContainer(`${deptId}-body`)}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <i className="fas fa-building"></i> {department} Department
                </h3>
                <i
                  className={`fas fa-chevron-${
                    expandedSections[`${deptId}-body`] ? "up" : "down"
                  }`}
                ></i>
              </div>
              {expandedSections[`${deptId}-body`] && (
                <div id={`${deptId}-body`} className="container-body mt-4">
                  {Object.keys(
                    structuredData.departments[department].years
                  ).map((year) => {
                    const yearId = `${deptId}-year-${year
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`;
                    return (
                      <div
                        key={yearId}
                        className="year-container bg-white p-6 rounded-lg shadow-md mb-4 border-l-4 border-green-500"
                      >
                        <div
                          className="container-header flex justify-between items-center cursor-pointer"
                          onClick={() => toggleContainer(`${yearId}-body`)}
                        >
                          <h3 className="text-lg font-semibold flex items-center gap-2">
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
                            className="container-body mt-4"
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
                                  className="division-container bg-white p-6 rounded-lg shadow-md mb-4 border-l-4 border-yellow-500"
                                >
                                  <div className="container-header flex justify-between items-center">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                      <i className="fas fa-users"></i> Division{" "}
                                      {division}
                                    </h3>
                                    <button
                                      className="btn bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
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
