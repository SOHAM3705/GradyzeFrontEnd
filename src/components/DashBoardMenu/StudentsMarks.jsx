import React, { useState, useEffect } from "react";

const AdminStudentMarks = () => {
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
  const [openMarksOptions, setOpenMarksOptions] = useState(null);

  const createDepartmentData = () => {
    return {
      years: {
        "First Year": createYearData(),
        "Second Year": createYearData(),
        "Third Year": createYearData(),
        "Fourth Year": createYearData(),
      },
    };
  };

  const createYearData = () => {
    return {
      divisions: {
        A: createDivisionData(),
        B: createDivisionData(),
      },
    };
  };

  const createDivisionData = () => {
    return {
      id: Math.floor(Math.random() * 10000),
      students: [], // Add student data here if needed
    };
  };

  const toggleContainer = (id) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleMarksOptions = (classId) => {
    if (openMarksOptions === classId) {
      setOpenMarksOptions(null);
    } else {
      setOpenMarksOptions(classId);
    }
  };

  const showMarks = (classId, examType) => {
    setOpenMarksOptions(null);

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
            const marksContainer = document.getElementById(`marks-${classId}`);
            if (!marksContainer) return;

            let html = `
              <table class="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th class="py-2 px-4 border-b">Roll No</th>
                    <th class="py-2 px-4 border-b">Name</th>
                    <th class="py-2 px-4 border-b">${
                      examType === "unitTest"
                        ? "Unit Test Marks"
                        : "Prelims Marks"
                    }</th>
                  </tr>
                </thead>
                <tbody>
            `;

            divisionData.students.forEach((student) => {
              html += `
                <tr>
                  <td class="py-2 px-4 border-b">${student.rollNo}</td>
                  <td class="py-2 px-4 border-b">${student.name}</td>
                  <td class="py-2 px-4 border-b">${student[examType]}</td>
                </tr>
              `;
            });

            html += `</tbody></table>`;
            marksContainer.innerHTML = html;
            marksContainer.style.display = "block";

            return;
          }
        }
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".marks-section")) {
        setOpenMarksOptions(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="header mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Marks</h1>
          <p className="text-gray-600">
            Organize by Department, Year, and Division
          </p>
        </div>
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
                                  className="division-container bg-white p-6 rounded-lg shadow-md mb-4 border-l-4 border-yellow-500 relative"
                                >
                                  <div className="container-header flex justify-between items-center">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                      <i className="fas fa-users"></i> Division{" "}
                                      {division}
                                    </h3>
                                    <div className="marks-section relative">
                                      <button
                                        className="btn bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                        onClick={() =>
                                          toggleMarksOptions(divisionData.id)
                                        }
                                      >
                                        <i className="fas fa-eye"></i> View
                                        Marks
                                      </button>
                                      {openMarksOptions === divisionData.id && (
                                        <div
                                          id={`marks-options-${divisionData.id}`}
                                          className="marks-options absolute top-10 left-0 bg-white border border-gray-300 shadow-md rounded-md p-2 z-10 w-40"
                                        >
                                          <button
                                            className="block w-full px-3 py-2 text-left rounded hover:bg-gray-200"
                                            onClick={() =>
                                              showMarks(
                                                divisionData.id,
                                                "unitTest"
                                              )
                                            }
                                          >
                                            <i className="fas fa-file-alt"></i>{" "}
                                            Unit Test
                                          </button>
                                          <button
                                            className="block w-full px-3 py-2 text-left rounded hover:bg-gray-200"
                                            onClick={() =>
                                              showMarks(
                                                divisionData.id,
                                                "prelims"
                                              )
                                            }
                                          >
                                            <i className="fas fa-graduation-cap"></i>{" "}
                                            Re-Unit Test
                                          </button>
                                          <button
                                            className="block w-full px-3 py-2 text-left rounded hover:bg-gray-200"
                                            onClick={() =>
                                              showMarks(
                                                divisionData.id,
                                                "unitTest"
                                              )
                                            }
                                          >
                                            <i className="fas fa-file-alt"></i>{" "}
                                            Prelims
                                          </button>
                                          <button
                                            className="block w-full px-3 py-2 text-left rounded hover:bg-gray-200"
                                            onClick={() =>
                                              showMarks(
                                                divisionData.id,
                                                "prelims"
                                              )
                                            }
                                          >
                                            <i className="fas fa-graduation-cap"></i>{" "}
                                            Re-Prelims
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div
                                    id={`marks-${divisionData.id}`}
                                    className="marks-container mt-4"
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
