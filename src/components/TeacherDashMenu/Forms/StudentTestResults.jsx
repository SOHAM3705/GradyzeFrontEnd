import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

const StudentTestResults = ({ testId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(testId || "all");
  const [allTests, setAllTests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all tests for the filter dropdown
        const testsResponse = await axios.get(
          `${API_BASE_URL}/api/teacher/my-tests`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
          }
        );
        setAllTests(testsResponse.data);

        // Fetch results for the specific test or all tests
        const endpoint = testId
          ? `/api/teacher/test-results/${testId}`
          : "/api/teacher/test-results";

        const resultsResponse = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
          },
        });

        setResults(resultsResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId]);

  const handleFilterChange = async (e) => {
    const selectedTestId = e.target.value;
    setSelectedTest(selectedTestId);
    setLoading(true);

    try {
      const endpoint =
        selectedTestId === "all"
          ? "/api/teacher/test-results"
          : `/api/teacher/test-results/${selectedTestId}`;

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to filter results");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading results...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Student Test Results</h2>

        {!testId && (
          <div className="flex items-center gap-2">
            <label className="text-gray-700">Filter by Test: </label>
            <select
              value={selectedTest}
              onChange={handleFilterChange}
              className="p-2 border rounded"
              disabled={loading}
            >
              <option value="all">All Tests</option>
              {allTests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        {results.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left">Student</th>
                <th className="py-3 px-4 border-b text-left">Test</th>
                <th className="py-3 px-4 border-b text-left">Score</th>
                <th className="py-3 px-4 border-b text-left">Percentage</th>
                <th className="py-3 px-4 border-b text-left">Submitted</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    <div className="font-medium">{result.student.name}</div>
                    <div className="text-sm text-gray-500">
                      {result.student.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b">{result.test.title}</td>
                  <td className="py-3 px-4 border-b">
                    {result.score} / {result.totalPossible}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {((result.score / result.totalPossible) * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(result.submittedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        result.score / result.totalPossible >= 0.7
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.score / result.totalPossible >= 0.7
                        ? "Passed"
                        : "Failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 border rounded bg-gray-50">
            <p className="text-gray-500 italic">No student results found</p>
            {selectedTest !== "all" && (
              <p className="text-sm mt-2">
                This test hasn't been taken by any students yet.
              </p>
            )}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {results.length} result{results.length !== 1 ? "s" : ""}
          {selectedTest !== "all" && ` for this test`}
        </div>
      )}
    </div>
  );
};

export default StudentTestResults;
