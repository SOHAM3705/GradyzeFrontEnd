import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

// Create authenticated axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const TestPage = () => {
  const { studentId, testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [student, setStudent] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const sessionStudentId = sessionStorage.getItem("studentId");
        if (sessionStudentId !== studentId) {
          throw new Error("Student ID mismatch");
        }

        const studentResponse = await api.get(
          `/api/student/students/${studentId}`
        );
        setStudent(studentResponse.data);

        const submissionCheck = await api.get(
          `/api/student/test-submission-check/${testId}`,
          { params: { studentId } }
        );

        if (submissionCheck.data.submitted) {
          setSubmitted(true);
          return;
        }

        const testResponse = await api.get(`/api/student/tests/${testId}`);
        setTest(testResponse.data);

        const initialResponses = {};
        testResponse.data.questions.forEach((question, index) => {
          initialResponses[index] = question.type === "multiple" ? [] : "";
        });
        setResponses(initialResponses);
      } catch (err) {
        console.error("Error loading test:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load test"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId, studentId]);

  const handleSingleChoice = (questionIndex, optionIndex) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleMultipleChoice = (questionIndex, optionIndex) => {
    setResponses((prev) => {
      const currentSelections = [...(prev[questionIndex] || [])];
      if (currentSelections.includes(optionIndex)) {
        return {
          ...prev,
          [questionIndex]: currentSelections.filter((i) => i !== optionIndex),
        };
      } else {
        return {
          ...prev,
          [questionIndex]: [...currentSelections, optionIndex],
        };
      }
    });
  };

  const handleShortAnswer = (questionIndex, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const validateForm = () => {
    if (!test) return false;

    for (let i = 0; i < test.questions.length; i++) {
      const response = responses[i];
      if (
        (test.questions[i].type === "single" && response === "") ||
        (test.questions[i].type === "short" && response.trim() === "")
      ) {
        setValidationError("Please answer all required questions");
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !test || !student) return;

    try {
      setLoading(true);

      const submissionData = {
        testId,
        studentId,
        studentName: student.name,
        studentEmail: student.email,
        answers: test.questions.map((_, index) => responses[index]),
        questions: test.questions.map((q) => ({
          _id: q._id,
          type: q.type,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
        })),
      };

      const response = await api.post(
        "/api/student/submit-test",
        submissionData
      );

      setShowModal(true);
      setSubmitted(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.error ||
        "Submission failed. Please try again.";

      setValidationError(errorMessage);
      console.error("Submission error:", {
        error: err,
        response: err.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/studentdash/Forms");
  };

  const handleStartTest = () => {
    setShowStartModal(false);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(true);
  };

  if (loading) {
    return <div className="text-center p-8">Loading test...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate("/studentdash/Forms")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center p-8">
        <div className="text-green-600 mb-4">You have submitted this test.</div>
        <button
          onClick={() => navigate("/studentdash/Forms")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f1e6] min-h-screen overflow-auto">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <button
          onClick={() => navigate("/studentdash/Forms")}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded inline-flex items-center"
        >
          Back
        </button>
        {showStartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Instructions
              </h3>
              <p className="text-gray-700 mb-4">
                Please read the instructions carefully before starting the test.
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                <li>Ensure you have a stable internet connection.</li>
                <li>Do not refresh the page during the test.</li>
                <li>Answer all questions to the best of your ability.</li>
              </ul>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                onClick={handleStartTest}
              >
                Start Test
              </button>
            </div>
          </div>
        )}
        {student && (
          <div className="mb-6 p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Student Information
            </h3>
            <p className="text-gray-700">Name: {student.name}</p>
            <p className="text-gray-700">Email: {student.email}</p>
            {student.year && (
              <p className="text-gray-700">Year: {student.year}</p>
            )}
            {student.division && (
              <p className="text-gray-700">Division: {student.division}</p>
            )}
          </div>
        )}
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{test.title}</h2>
          {test.description && (
            <p className="text-gray-600 mt-2">{test.description}</p>
          )}
        </div>
        {validationError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {validationError}
          </div>
        )}
        <form className="space-y-6">
          {test.questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <p className="font-medium text-gray-900">
                {index + 1}. {q.questionText}
                {q.points && (
                  <span className="text-gray-500 ml-1">
                    ({q.points} point{q.points > 1 ? "s" : ""})
                  </span>
                )}
              </p>

              {q.type === "short" && (
                <input
                  type="text"
                  placeholder="Your answer"
                  value={responses[index] || ""}
                  onChange={(e) => handleShortAnswer(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {q.type === "single" && (
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`block p-3 border-2 rounded-md cursor-pointer ${
                        responses[index] === i
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${index}`}
                        checked={responses[index] === i}
                        onChange={() => handleSingleChoice(index, i)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === "multiple" && (
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`block p-3 border-2 rounded-md cursor-pointer ${
                        (responses[index] || []).includes(i)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={(responses[index] || []).includes(i)}
                        onChange={() => handleMultipleChoice(index, i)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </form>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mt-6"
          onClick={handleConfirmSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Test"}
        </button>
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Submission
              </h3>
              <p className="text-gray-700 mb-4">
                Are you sure you want to submit your test? You cannot make
                changes after submission.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Test Submitted
              </h3>
              <p className="text-gray-700 mb-4">
                Thank you, {student.name}! Your responses have been saved
                successfully!
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
