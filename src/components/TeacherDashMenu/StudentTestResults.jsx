import React, { useState, useEffect } from "react";

const StudentTestResults = () => {
  const [responses, setResponses] = useState([]);
  const [tests, setTests] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [selectedTest, setSelectedTest] = useState("all");

  useEffect(() => {
    // Load all responses
    const allResponses =
      JSON.parse(localStorage.getItem("studentTestResponses")) || {};

    // Convert object to array of responses
    const responseArray = Object.values(allResponses);
    setResponses(responseArray);
    setFilteredResponses(responseArray);

    // Load all tests for filtering
    const allTests =
      JSON.parse(localStorage.getItem("prerequisiteTests")) || [];
    setTests(allTests);
  }, []);

  const handleFilterChange = (e) => {
    const testId = e.target.value;
    setSelectedTest(testId);

    if (testId === "all") {
      setFilteredResponses(responses);
    } else {
      const filtered = responses.filter(
        (response) => response.testId === testId
      );
      setFilteredResponses(filtered);
    }
  };

  const calculateScore = (response) => {
    if (!response) return { score: 0, total: 0 };

    const test = tests.find((t) => t.id.toString() === response.testId);
    if (!test) return { score: 0, total: 0 };

    let score = 0;
    let totalPoints = 0;

    test.questions.forEach((question, index) => {
      const answer = response.answers && response.answers[index];
      totalPoints += question.points || 1;

      if (question.type === "single" && answer === question.correctOption) {
        score += question.points || 1;
      } else if (question.type === "multiple") {
        const isCorrect =
          Array.isArray(answer) &&
          Array.isArray(question.correctOption) &&
          answer.length === question.correctOption.length &&
          answer.every((val) => question.correctOption.includes(val));
        if (isCorrect) score += question.points || 1;
      }
    });

    return { score, total: totalPoints };
  };

  // Group students by test and calculate their best score
  const getStudentResults = () => {
    const studentResults = [];

    filteredResponses.forEach((response) => {
      const test = tests.find((t) => t.id.toString() === response.testId);
      const { score, total } = calculateScore(response);
      const percentage = total > 0 ? (score / total) * 100 : 0;

      studentResults.push({
        studentName: response.studentName || "Anonymous Student",
        studentEmail: response.studentEmail || "",
        testId: response.testId,
        testTitle: test ? test.title : "Unknown Test",
        score,
        total,
        percentage: percentage.toFixed(2),
        submittedAt: response.submittedAt,
      });
    });

    return studentResults;
  };

  const studentResults = getStudentResults();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Student Test Results</h2>
        <div className="flex items-center gap-2">
          <label className="text-gray-700">Filter by Test: </label>
          <select
            value={selectedTest}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="all">All Tests</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id.toString()}>
                {test.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {studentResults.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 mt-4">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Student Name</th>
                <th className="py-2 px-4 border-b">Test</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Percentage</th>
                <th className="py-2 px-4 border-b">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {studentResults.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{student.studentName}</td>
                  <td className="py-2 px-4 border-b">{student.testTitle}</td>
                  <td className="py-2 px-4 border-b">
                    {student.score}/{student.total}
                  </td>
                  <td className="py-2 px-4 border-b">{student.percentage}%</td>
                  <td className="py-2 px-4 border-b">{student.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-8 italic">
            No student results found
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentTestResults;
