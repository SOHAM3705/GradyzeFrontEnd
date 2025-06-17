import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

const StudentTestResults = ({ testId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(testId || "all");
  const [allTests, setAllTests] = useState([]);
  const [expandedResult, setExpandedResult] = useState(null);
  const [detailedResponse, setDetailedResponse] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const testsResponse = await axios.get(
          `${API_BASE_URL}/api/teacher/my-tests`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        setAllTests(testsResponse.data);

        // Fetch results based on whether we have a specific testId
        const endpoint = testId
          ? `/api/teacher/test-results/${testId}`
          : "/api/teacher/test-results";

        const resultsResponse = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        // Transform data if needed to match frontend expectations
        const formattedResults = resultsResponse.data.map((result) => ({
          ...result,
          student: {
            _id: result.student?._id || result.studentId,
            name: result.student?.name || result.studentName,
            email: result.student?.email || result.studentEmail,
          },
        }));

        setResults(formattedResults);
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
    setExpandedResult(null);

    try {
      const endpoint =
        selectedTestId === "all"
          ? "/api/teacher/test-results"
          : `/api/teacher/test-results/${selectedTestId}`;

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to filter results");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedResponse = async (submissionId, testId, studentId) => {
    try {
      setLoadingDetails(true);
      setDetailedResponse(null);

      // Try multiple endpoints to get detailed response
      let response;
      try {
        // First try the submission ID endpoint
        response = await axios.get(
          `${API_BASE_URL}/api/teacher/submission/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
      } catch (err) {
        // Fall back to test/student endpoint if first fails
        response = await axios.get(
          `${API_BASE_URL}/api/teacher/submission/test/${testId}/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
      }

      setDetailedResponse(response.data);
    } catch (err) {
      console.error("Failed to fetch detailed response:", err);
      setError("Failed to load detailed response");
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleExpandResult = async (result, index) => {
    if (expandedResult === index) {
      setExpandedResult(null);
      setDetailedResponse(null);
    } else {
      setExpandedResult(index);
      await fetchDetailedResponse(
        result.submissionId || result._id,
        result.test._id || result.testId,
        result.student._id || result.studentId
      );
    }
  };

  const renderAnswerValue = (answer, question) => {
    if (!answer || answer.answer === undefined || answer.answer === null) {
      return <span className="text-gray-400 italic">No answer provided</span>;
    }

    if (Array.isArray(answer.answer)) {
      return (
        <ul className="list-disc pl-5">
          {answer.answer.map((optionIndex, i) => (
            <li key={i}>
              {question.options?.[optionIndex] || `Option ${optionIndex + 1}`}
            </li>
          ))}
        </ul>
      );
    } else if (question.type === "single" && question.options) {
      return question.options[answer.answer] || `Option ${answer.answer + 1}`;
    } else {
      return answer.answer;
    }
  };

  const renderCorrectAnswer = (question) => {
    if (Array.isArray(question.correctAnswer)) {
      return (
        <ul className="list-disc pl-5">
          {question.correctAnswer.map((optionIndex, i) => (
            <li key={i}>
              {question.options?.[optionIndex] || `Option ${optionIndex + 1}`}
            </li>
          ))}
        </ul>
      );
    } else if (question.type === "single" && question.options) {
      return (
        question.options[question.correctAnswer] ||
        `Option ${question.correctAnswer + 1}`
      );
    } else {
      return question.correctAnswer || "N/A";
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading results...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg"
              >
                <div
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpandResult(result, index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <div className="font-medium">{result.student.name}</div>
                        <div className="text-sm text-gray-500">
                          {result.student.email}
                        </div>
                      </div>
                      <div>{result.test.title}</div>
                      <div>
                        {result.score} / {result.totalPossible}
                      </div>
                      <div>
                        {((result.score / result.totalPossible) * 100).toFixed(
                          2
                        )}
                        %
                      </div>
                      <div className="text-sm">
                        {new Date(result.submittedAt).toLocaleString()}
                      </div>
                      <div>
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
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedResult === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedResult === index && (
                  <div className="border-t bg-gray-50 p-4">
                    {loadingDetails ? (
                      <div className="text-center py-4">
                        Loading detailed responses...
                      </div>
                    ) : detailedResponse ? (
                      <div className="space-y-6">
                        <h4 className="font-semibold text-lg">
                          Detailed Response Analysis
                        </h4>

                        {detailedResponse.test?.questions?.map(
                          (question, qIndex) => {
                            const answer = detailedResponse.answers?.find(
                              (a) =>
                                a.questionId ===
                                (question._id || qIndex.toString())
                            );

                            return (
                              <div
                                key={qIndex}
                                className={`border rounded-lg p-4 ${
                                  answer?.isCorrect
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h5 className="font-medium">
                                      Question {qIndex + 1}:{" "}
                                      {question.questionText}
                                    </h5>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Points: {question.points || 1} | Type:{" "}
                                      {question.type}
                                    </p>
                                  </div>
                                  <div
                                    className={`px-3 py-1 rounded-full text-sm ${
                                      answer?.isCorrect
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {answer?.isCorrect
                                      ? "Correct"
                                      : "Incorrect"}
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="font-medium text-gray-700 mb-2">
                                      Student's Answer:
                                    </p>
                                    <div className="bg-white p-3 rounded border">
                                      {renderAnswerValue(answer, question)}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="font-medium text-gray-700 mb-2">
                                      Correct Answer:
                                    </p>
                                    <div className="bg-white p-3 rounded border">
                                      {renderCorrectAnswer(question)}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 text-sm text-gray-600">
                                  Points Awarded: {answer?.pointsAwarded || 0} /{" "}
                                  {question.points || 1}
                                </div>
                              </div>
                            );
                          }
                        )}

                        <div className="bg-white p-4 rounded border">
                          <h5 className="font-medium mb-2">Summary</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">
                                Total Questions:
                              </span>
                              <div className="font-medium">
                                {detailedResponse.test?.questions?.length || 0}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Correct Answers:
                              </span>
                              <div className="font-medium text-green-600">
                                {detailedResponse.answers?.filter(
                                  (a) => a.isCorrect
                                ).length || 0}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Incorrect Answers:
                              </span>
                              <div className="font-medium text-red-600">
                                {detailedResponse.answers?.filter(
                                  (a) => !a.isCorrect
                                ).length || 0}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Time Taken:</span>
                              <div className="font-medium">
                                {detailedResponse.timeTaken
                                  ? `${detailedResponse.timeTaken} min`
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No detailed response data available
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
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
