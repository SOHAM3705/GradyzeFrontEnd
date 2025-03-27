import React, { useState, useEffect } from "react";
import axios from "axios";

const Result = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const maxMarks = {
    Unit: 30,
    Insem: 30,
    Prelims: 70,
    Endsem: 70,
  };

  // Fetch available academic years
  const fetchYears = async () => {
    try {
      const response = await axios.get(
        "https://gradyzebackend.onrender.com/api/studentResult/years"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching years:", error);
      return ["First Year", "Second Year", "Third Year", "Fourth Year"];
    }
  };

  // Fetch semesters based on selected year
  const fetchSemesters = async (year) => {
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/studentResult/semesters?year=${year}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching semesters:", error);
      return ["Semester 1", "Semester 2"];
    }
  };

  // Fetch subjects based on year & semester
  const fetchSubjects = async (year, semester) => {
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/studentResult/subjects?year=${year}&semester=${semester}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return ["Mathematics", "Physics", "Computer Science"];
    }
  };

  // Fetch marks for a specific subject
  const fetchMarks = async (year, semester, subject) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://gradyzebackend.onrender.com/api/studentResult/marks?year=${year}&semester=${semester}&subject=${subject}`
      );

      // If API call fails, provide mock data
      const marksData = response.data.length
        ? response.data
        : [
            {
              examType: "Unit",
              marks: 25,
              maxMarks: 30,
            },
            {
              examType: "Insem",
              marks: 22,
              maxMarks: 30,
            },
            {
              examType: "Prelims",
              marks: 55,
              maxMarks: 70,
            },
            {
              examType: "Endsem",
              marks: 62,
              maxMarks: 70,
            },
          ];

      const marksArray = marksData.map((exam) => {
        const percentage = (exam.marks / maxMarks[exam.examType]) * 100;
        return {
          ...exam,
          percentage,
          performance: getPerformanceIndicator(percentage),
        };
      });
      setMarks(marksArray);
    } catch (error) {
      console.error("Error fetching marks:", error);
      setMarks([]);
    } finally {
      setLoading(false);
    }
  };

  // Determine performance based on percentage
  const getPerformanceIndicator = (percentage) => {
    if (percentage >= 80) return { class: "bg-green-500", text: "Excellent" };
    if (percentage >= 70) return { class: "bg-blue-500", text: "Good" };
    if (percentage >= 60) return { class: "bg-yellow-500", text: "Average" };
    return { class: "bg-red-500", text: "Needs Improvement" };
  };

  // Fetch initial years on component mount
  useEffect(() => {
    fetchYears().then((years) => {
      // Optional: You could set the first year automatically
      if (years.length) setSelectedYear(years[0]);
    });
  }, []);

  // Handle year change
  useEffect(() => {
    if (!selectedYear) return;
    fetchSemesters(selectedYear).then(setSemesters);
    setSelectedSemester("");
    setSubjects([]);
    setMarks([]);
  }, [selectedYear]);

  // Handle semester change
  useEffect(() => {
    if (!selectedYear || !selectedSemester) return;
    fetchSubjects(selectedYear, selectedSemester).then(setSubjects);
    setSelectedSubject("");
    setMarks([]);
  }, [selectedYear, selectedSemester]);

  // Handle subject change
  useEffect(() => {
    if (!selectedYear || !selectedSemester || !selectedSubject) return;
    fetchMarks(selectedYear, selectedSemester, selectedSubject);
  }, [selectedYear, selectedSemester, selectedSubject]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white font-poppins">
      <div className="w-full max-w-md p-8 bg-gray-100 rounded-2xl shadow-lg border border-gray-100 text-center animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:w-[70%] after:h-1 after:bottom-[-10px] after:left-[15%] after:bg-gradient-to-r after:from-transparent after:via-purple-600 after:to-transparent after:rounded">
          Academic Performance
        </h2>

        <div
          className={`text-sm text-gray-500 bg-purple-100 rounded-full py-2 px-4 mb-4 opacity-0 transition-opacity ${
            selectedYear || selectedSemester || selectedSubject
              ? "opacity-100"
              : ""
          }`}
        >
          {selectedYear} {selectedSemester && `→ ${selectedSemester}`}{" "}
          {selectedSubject && `→ ${selectedSubject}`}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 text-left transition-transform hover:translate-x-1">
            Select Year:
          </label>
          <select
            className="w-full p-3 border-2 border-purple-200 rounded-lg shadow-sm bg-white text-gray-700 outline-none transition-all hover:border-purple-500 hover:shadow-lg focus:border-purple-600 focus:shadow-lg cursor-pointer appearance-none"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">-- Select Year --</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 text-left transition-transform hover:translate-x-1">
            Select Semester:
          </label>
          <select
            className="w-full p-3 border-2 border-purple-200 rounded-lg shadow-sm bg-white text-gray-700 outline-none transition-all hover:border-purple-500 hover:shadow-lg focus:border-purple-600 focus:shadow-lg cursor-pointer appearance-none"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={!selectedYear}
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 text-left transition-transform hover:translate-x-1">
            Select Subject:
          </label>
          <select
            className="w-full p-3 border-2 border-purple-200 rounded-lg shadow-sm bg-white text-gray-700 outline-none transition-all hover:border-purple-500 hover:shadow-lg focus:border-purple-600 focus:shadow-lg cursor-pointer appearance-none"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedYear || !selectedSemester}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center mt-6">Loading...</div>
        ) : marks.length > 0 ? (
          <table className="w-full border-collapse border-gray-200 rounded-lg overflow-hidden shadow-lg mt-6">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <th className="py-3 px-4 font-semibold uppercase text-sm">
                  Exam Type
                </th>
                <th className="py-3 px-4 font-semibold uppercase text-sm">
                  Marks
                </th>
                <th className="py-3 px-4 font-semibold uppercase text-sm">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  } hover:bg-purple-50 transition-colors`}
                >
                  <td className="py-3 px-4">{mark.examType}</td>
                  <td className="py-3 px-4">
                    {mark.marks} / {mark.maxMarks}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${mark.performance.class}`}
                    ></span>
                    {mark.performance.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 italic mt-6">
            Select options above to view your performance
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
