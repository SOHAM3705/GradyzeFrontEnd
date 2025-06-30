import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Prerequisitetest = () => {
  const [availableTests, setAvailableTests] = useState([]);
  const [submittedTests, setSubmittedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  // Modal state
  const [previewModal, setPreviewModal] = useState({
    show: false,
    test: null,
    submission: null,
  });

  const token = sessionStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentId = sessionStorage.getItem("studentId");
        if (!studentId) throw new Error("Student not logged in");

        const studentRes = await axios.get(
          `${API_BASE_URL}/api/student/students/${studentId}`,
          config
        );
        setStudent(studentRes.data);

        const [testsRes, submissionsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/student/tests/student`, {
            params: {
              year: studentRes.data.year,
              division: studentRes.data.division,
            },
            ...config,
          }),
          axios.get(`${API_BASE_URL}/api/student/submissions`, {
            params: { studentId },
            ...config,
          }),
        ]);

        const submittedTestIds = submissionsRes.data.map((sub) => {
          const testId = sub.testId?._id || sub.test || sub.formId || sub._id;
          return String(testId);
        });

        // Filter available tests (not submitted)
        const available = testsRes.data.filter((test) => {
          const testIdStr = String(test._id);
          const isSubmitted = submittedTestIds.includes(testIdStr);
          return !isSubmitted;
        });

        // Filter submitted tests and attach submission data
        const submitted = testsRes.data
          .filter((test) => {
            const testIdStr = String(test._id);
            return submittedTestIds.includes(testIdStr);
          })
          .map((test) => {
            const submission = submissionsRes.data.find((sub) => {
              const subTestId = String(
                sub.testId?._id || sub.test || sub.formId || sub._id
              );
              const testIdStr = String(test._id);
              return subTestId === testIdStr;
            });
            return { ...test, submission };
          });

        setAvailableTests(available);
        setSubmittedTests(submitted);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load data"
        );
        if (err.message === "Student not logged in") {
          navigate("/studentlogin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handlePreviewTest = async (testId) => {
    try {
      setLoading(true);
      const studentId = sessionStorage.getItem("studentId");

      const testResponse = await axios.get(
        `${API_BASE_URL}/api/student/tests/${testId}`,
        config
      );

      const submissionsResponse = await axios.get(
        `${API_BASE_URL}/api/student/submissions`,
        {
          params: { studentId },
          ...config,
        }
      );

      // Find submission for this testId
      const submission = submissionsResponse.data.find((sub) => {
        const subTestId = sub.testId?._id || sub.test || sub.formId || sub._id;
        return String(subTestId) === String(testId);
      });

      setPreviewModal({
        show: true,
        test: testResponse.data,
        submission: submission || null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load test preview");
    } finally {
      setLoading(false);
    }
  };

  const closePreviewModal = () => {
    setPreviewModal({
      show: false,
      test: null,
      submission: null,
    });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Available Tests Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-600">
          Available Tests ({availableTests.length})
        </h2>
        {availableTests.length === 0 ? (
          <p className="text-gray-500">No tests available at the moment.</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {availableTests.map((test) => (
              <div
                key={test._id}
                className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 border-blue-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-base sm:text-lg">
                      {test.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {test.description}
                    </p>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                      <span className="bg-blue-100 px-2 py-1 rounded text-blue-800">
                        Status: Available
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartTest(test._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base w-full sm:w-auto"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Tests Section */}
      {submittedTests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-600">
            Submitted Tests ({submittedTests.length})
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {submittedTests.map((test) => (
              <div
                key={test._id}
                className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 border-green-200 bg-green-50"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-base sm:text-lg">
                      {test.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {test.description}
                    </p>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                      <span className="bg-green-100 px-2 py-1 rounded text-green-800">
                        Status: Submitted
                      </span>
                      {test.submission && (
                        <span className="ml-2">
                          Score: {test.submission.totalScore} /
                          {test.questions?.reduce(
                            (sum, q) => sum + (q.points || 1),
                            0
                          ) || "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePreviewTest(test._id)}
                    className="text-blue-500 hover:underline text-sm sm:text-base w-full sm:w-auto text-left sm:text-right"
                  >
                    View Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModal.show && previewModal.test && previewModal.submission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {previewModal.test.title} - Review
                </h2>
                <button
                  onClick={closePreviewModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                <div className="text-base sm:text-lg">
                  <span className="font-medium">Your Score:</span>{" "}
                  {previewModal.submission.totalScore} /
                  {previewModal.test.questions.reduce(
                    (sum, q) => sum + (q.points || 1),
                    0
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Submitted on:{" "}
                  {new Date(
                    previewModal.submission.submittedAt
                  ).toLocaleString()}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                {previewModal.test.questions.map((question, index) => {
                  const answer = previewModal.submission.answers.find(
                    (a) => a.questionId === (question._id || index.toString())
                  );

                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 sm:p-4 ${
                        answer?.isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                        <div>
                          <h3 className="font-medium text-base sm:text-lg">
                            Q{index + 1}: {question.questionText}
                          </h3>
                          <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            {question.points || 1} point
                            {question.points !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                            answer?.isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {answer?.isCorrect ? "Correct" : "Incorrect"}
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4">
                        <p className="font-medium text-gray-700 text-sm sm:text-base">
                          Your Answer:
                        </p>
                        <div className="bg-white p-2 sm:p-3 rounded border mt-1 text-sm sm:text-base">
                          {Array.isArray(answer?.answer) ? (
                            <ul className="list-disc pl-4 sm:pl-5">
                              {answer.answer.map((opt, i) => (
                                <li key={i}>{question.options[opt]}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>
                              {question.type === "single"
                                ? question.options[answer?.answer]
                                : answer?.answer}
                            </p>
                          )}
                        </div>
                      </div>

                      {!answer?.isCorrect && question.type !== "short" && (
                        <div className="mt-2 sm:mt-3">
                          <p className="font-medium text-gray-700 text-sm sm:text-base">
                            Correct Answer:
                          </p>
                          <div className="bg-white p-2 sm:p-3 rounded border mt-1 text-sm sm:text-base">
                            {Array.isArray(question.correctAnswer) ? (
                              <ul className="list-disc pl-4 sm:pl-5">
                                {question.correctAnswer.map((opt, i) => (
                                  <li key={i}>{question.options[opt]}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>{question.options[question.correctAnswer]}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                        Points awarded: {answer?.pointsAwarded || 0} /{" "}
                        {question.points || 1}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                  onClick={closePreviewModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-1 sm:py-2 rounded text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prerequisitetest;
