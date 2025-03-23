import React, { useState, useEffect } from "react";

const Result = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);

  const marksData = {
    "First Year": {
      "Semester 1": {
        Math: { Unit: 18, Insem: 40, Prelims: 35, Endsem: 75 },
        Physics: { Unit: 20, Insem: 42, Prelims: 38, Endsem: 78 },
      },
      "Semester 2": {
        Chemistry: { Unit: 22, Insem: 45, Prelims: 40, Endsem: 80 },
        Biology: { Unit: 24, Insem: 48, Prelims: 43, Endsem: 85 },
      },
    },
    "Second Year": {
      "Semester 3": {
        Programming: { Unit: 26, Insem: 50, Prelims: 45, Endsem: 88 },
        Networks: { Unit: 28, Insem: 52, Prelims: 47, Endsem: 90 },
      },
      "Semester 4": {
        "Data Science": { Unit: 30, Insem: 55, Prelims: 50, Endsem: 92 },
        AI: { Unit: 32, Insem: 58, Prelims: 53, Endsem: 95 },
      },
    },
    "Third Year": {
      "Semester 5": {
        "Machine Learning": { Unit: 23, Insem: 48, Prelims: 42, Endsem: 82 },
        "Cloud Computing": { Unit: 25, Insem: 46, Prelims: 44, Endsem: 85 },
      },
      "Semester 6": {
        Cybersecurity: { Unit: 27, Insem: 51, Prelims: 46, Endsem: 88 },
        "Web Development": { Unit: 29, Insem: 53, Prelims: 49, Endsem: 91 },
      },
    },
    "Fourth Year": {
      "Semester 7": {
        "Big Data": { Unit: 31, Insem: 56, Prelims: 51, Endsem: 93 },
        IoT: { Unit: 33, Insem: 57, Prelims: 52, Endsem: 94 },
      },
      "Semester 8": {
        "Project Work": { Unit: 35, Insem: 59, Prelims: 54, Endsem: 96 },
        "Technical Writing": { Unit: 34, Insem: 58, Prelims: 53, Endsem: 95 },
      },
    },
  };

  const maxMarks = {
    Unit: 30,
    Insem: 30,
    Prelims: 70,
    Endsem: 70,
  };

  useEffect(() => {
    if (selectedYear) {
      setSemesters(Object.keys(marksData[selectedYear]));
    } else {
      setSemesters([]);
    }
    setSubjects([]);
    setMarks([]);
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedSemester) {
      setSubjects(Object.keys(marksData[selectedYear][selectedSemester]));
    } else {
      setSubjects([]);
    }
    setMarks([]);
  }, [selectedYear, selectedSemester]);

  useEffect(() => {
    if (selectedYear && selectedSemester && selectedSubject) {
      const subjectMarks =
        marksData[selectedYear][selectedSemester][selectedSubject];
      const marksArray = Object.keys(subjectMarks).map((examType) => {
        const percentage = (subjectMarks[examType] / maxMarks[examType]) * 100;
        const performance = getPerformanceIndicator(percentage);
        return {
          examType,
          marks: subjectMarks[examType],
          maxMarks: maxMarks[examType],
          performance,
        };
      });
      setMarks(marksArray);
    } else {
      setMarks([]);
    }
  }, [selectedYear, selectedSemester, selectedSubject]);

  const getPerformanceIndicator = (percentage) => {
    if (percentage >= 80) {
      return { class: "bg-green-500", text: "Excellent" };
    } else if (percentage >= 70) {
      return { class: "bg-blue-500", text: "Good" };
    } else if (percentage >= 60) {
      return { class: "bg-yellow-500", text: "Average" };
    } else {
      return { class: "bg-red-500", text: "Needs Improvement" };
    }
  };

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
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {marks.length > 0 ? (
          <table className="w-full border-collapse border-gray-200 rounded-lg overflow-hidden shadow-lg mt-6 opacity-0 transform translate-y-5 transition-all">
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
