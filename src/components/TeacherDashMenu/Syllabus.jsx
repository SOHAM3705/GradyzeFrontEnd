import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherSyllabusView = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [filterPattern, setFilterPattern] = useState("");
  const [filterStream, setFilterStream] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Options for Stream, Pattern, and Year
  const streamOptions = [
    { value: "computer", label: "Computer" },
    { value: "it", label: "IT" },
    { value: "mechanical", label: "Mechanical" },
    { value: "electrical", label: "Electrical" },
    { value: "civil", label: "Civil" },
  ];

  const patternOptions = [
    { value: "2024", label: "2024" },
    { value: "2019", label: "2019" },
  ];

  const yearOptions = [
    { value: "FE", label: "FE" },
    { value: "SE", label: "SE" },
    { value: "TE", label: "TE" },
    { value: "BE", label: "BE" },
  ];

  // Fetch syllabus data from the backend for the logged-in teacher
  useEffect(() => {
    const fetchSyllabi = async () => {
      try {
        const adminId = localStorage.getItem("adminId"); // Retrieve admin ID
        const teacherId = localStorage.getItem("teacherId"); // Retrieve teacher ID

        if (!adminId || !teacherId) {
          console.error("Admin ID or Teacher ID not found in localStorage");
          return;
        }

        const response = await axios.get(
          `https://gradyzebackend.onrender.com/api/syllabi/teacher/${teacherId}/${adminId}`
        );

        console.log("Received syllabus data from API:", response.data);

        if (Array.isArray(response.data)) {
          const sortedSyllabi = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setSyllabusData(sortedSyllabi);
        } else {
          console.error("API did not return an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching syllabi:", error);
      }
    };

    fetchSyllabi();
  }, []);

  const handleDownload = (fileId) => {
    if (!fileId) {
      alert("No file available for download.");
      return;
    }

    window.open(
      `https://gradyzebackend.onrender.com/api/syllabus/files/${fileId}`,
      "_blank"
    );
  };

  const formatStream = (stream) => {
    const streamNames = {
      computer: "Computer Engineering",
      it: "Information Technology",
      mechanical: "Mechanical Engineering",
      electrical: "Electronics and Telecommunication Engineering",
      civil: "Civil Engineering",
    };
    return streamNames[stream] || stream;
  };

  const formatYear = (year) => {
    const yearNames = {
      FE: "First Year",
      SE: "Second Year",
      TE: "Third Year",
      BE: "Fourth Year",
    };
    return yearNames[year] || year;
  };

  const filterSyllabi = () => {
    return syllabusData.filter(
      (entry) =>
        (filterPattern === "" ||
          entry.pattern.toLowerCase().includes(filterPattern.toLowerCase())) &&
        (filterStream === "" ||
          entry.stream.toLowerCase().includes(filterStream.toLowerCase())) &&
        (filterYear === "" ||
          entry.year.toLowerCase().includes(filterYear.toLowerCase()))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Syllabus Management
        </h1>
      </div>

      <div className="filters grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          id="pattern"
          className="filter-select p-2 border rounded w-full"
          value={filterPattern}
          onChange={(e) => setFilterPattern(e.target.value)}
        >
          <option value="">All Patterns</option>
          <option value="2024">2024 Pattern</option>
          <option value="2019">2019 Pattern</option>
        </select>
        <select
          id="stream"
          className="filter-select p-2 border rounded w-full"
          value={filterStream}
          onChange={(e) => setFilterStream(e.target.value)}
        >
          <option value="">All Streams</option>
          <option value="computer">Computer Engineering</option>
          <option value="it">Information Technology</option>
          <option value="mechanical">Mechanical Engineering</option>
          <option value="electrical">
            Electronics and Telecommunication Engineering
          </option>
          <option value="civil">Civil Engineering</option>
        </select>
        <select
          id="year"
          className="filter-select p-2 border rounded w-full"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All Years</option>
          <option value="FE">First Year</option>
          <option value="SE">Second Year</option>
          <option value="TE">Third Year</option>
          <option value="BE">Fourth Year</option>
        </select>
      </div>

      <div className="syllabus-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterSyllabi().map((entry, index) => (
          <div
            key={index}
            className="syllabus-card p-4 bg-white rounded shadow relative"
          >
            <div className="syllabus-header mb-2">
              <div className="syllabus-title text-lg font-semibold">
                {formatStream(entry.stream)}
              </div>
              <div className="syllabus-pattern text-gray-600">
                {entry.pattern} Pattern • {formatYear(entry.year)}
              </div>
            </div>
            <div className="syllabus-info flex justify-between items-center mt-4 pt-4 border-t">
              {/* If the syllabus contains a file, show the download button */}
              {entry.fileId && (
                <div className="mt-3">
                  <p className="font-semibold text-gray-600">Attached File:</p>
                  <button
                    onClick={() => handleDownload(entry.fileId)}
                    className="text-blue-500 hover:underline"
                  >
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSyllabusView;
