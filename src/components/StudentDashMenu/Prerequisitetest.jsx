import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const [tests, setTests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Modal state
  const [previewModal, setPreviewModal] = useState({
    show: false,
    test: null,
    submission: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const testsResponse = await axios.get(
          `${API_BASE_URL}/api/student/tests/student`,
          {
            params: {
              year: user.year,
              division: user.division,
            },
          }
        );

        const submissionsResponse = await axios.get(
          `${API_BASE_URL}/api/student/submissions`,
          {
            params: { studentId: user._id },
          }
        );

        setTests(testsResponse.data);
        setSubmissions(submissionsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getSubmissionStatus = (testId) => {
    const submission = submissions.find((sub) => sub.testId === testId);
    if (!submission) return { status: "not-started", score: null };

    return {
      status: submission.status,
      score: submission.totalScore,
      submission,
    };
  };

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handlePreviewTest = async (testId) => {
    try {
      setLoading(true);

      const testResponse = await axios.get(
        `${API_BASE_URL}/api/student/tests/${testId}`
      );
      const submissionResponse = await axios.get(
        `${API_BASE_URL}/api/student/submissions/test/${testId}`,
        {
          params: { studentId: user._id },
        }
      );

      setPreviewModal({
        show: true,
        test: testResponse.data,
        submission: submissionResponse.data,
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

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Tests</h2>

        {tests.length === 0 ? (
          <p className="text-gray-500">No tests available at the moment.</p>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => {
              const { status, score, submission } = getSubmissionStatus(
                test._id
              );

              return (
                <div
                  key={test._id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{test.title}</h3>
                      <p className="text-gray-600">{test.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Subject: {test.subjectName || "N/A"}</span>
                        <span className="mx-2">|</span>
                        <span>
                          Total Marks:{" "}
                          {test.totalMarks ||
                            test.questions.reduce(
                              (sum, q) => sum + (q.points || 1),
                              0
                            )}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-x-2">
                      {status === "not-started" && (
                        <button
                          onClick={() => handleStartTest(test._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Start Test
                        </button>
                      )}
                      {status === "submitted" && (
                        <div className="text-green-600 font-medium">
                          Submitted (Pending Grading)
                        </div>
                      )}
                      {status === "graded" && (
                        <>
                          <div className="text-blue-600 font-medium">
                            Score: {score} /{" "}
                            {test.totalMarks ||
                              test.questions.reduce(
                                (sum, q) => sum + (q.points || 1),
                                0
                              )}
                          </div>
                          <button
                            onClick={() => handlePreviewTest(test._id)}
                            className="text-blue-500 hover:underline mt-1"
                          >
                            Review Answers
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewModal.show && previewModal.test && previewModal.submission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {previewModal.test.title} - Review
                </h2>
                <button
                  onClick={closePreviewModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
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

              <div className="flex justify-between items-center mb-4">
                <div className="text-lg">
                  <span className="font-medium">Your Score:</span>{" "}
                  {previewModal.submission.totalScore} /
                  {previewModal.test.totalMarks ||
                    previewModal.test.questions.reduce(
                      (sum, q) => sum + (q.points || 1),
                      0
                    )}
                </div>
                <div className="text-sm text-gray-500">
                  Submitted on:{" "}
                  {new Date(
                    previewModal.submission.submittedAt
                  ).toLocaleString()}
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {previewModal.test.questions.map((question, index) => {
                  const answer = previewModal.submission.answers.find(
                    (a) => a.questionId === (question._id || index.toString())
                  );

                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${
                        answer?.isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">
                            Q{index + 1}: {question.questionText}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {question.points || 1} point
                            {question.points !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${
                            answer?.isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {answer?.isCorrect ? "Correct" : "Incorrect"}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="font-medium text-gray-700">
                          Your Answer:
                        </p>
                        <div className="bg-white p-3 rounded border mt-1">
                          {Array.isArray(answer?.answer) ? (
                            <ul className="list-disc pl-5">
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
                        <div className="mt-3">
                          <p className="font-medium text-gray-700">
                            Correct Answer:
                          </p>
                          <div className="bg-white p-3 rounded border mt-1">
                            {Array.isArray(question.correctAnswer) ? (
                              <ul className="list-disc pl-5">
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

                      <div className="mt-3 text-sm text-gray-500">
                        Points awarded: {answer?.pointsAwarded || 0} /{" "}
                        {question.points || 1}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closePreviewModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
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

export default StudentDashboard;
