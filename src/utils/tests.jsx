import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const TestPage = () => {
  const { studentId, testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [student, setStudent] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Verify session studentId matches URL studentId
        const sessionStudentId = sessionStorage.getItem("studentId");
        if (sessionStudentId !== studentId) {
          throw new Error("Student ID mismatch");
        }

        // Fetch student details
        const studentResponse = await axios.get(
          `${API_BASE_URL}/api/student/students/${studentId}`
        );
        setStudent(studentResponse.data);

        // Check if already submitted
        const submissionCheck = await axios.get(
          `${API_BASE_URL}/api/student/test-submission-check/${testId}`,
          { params: { studentId } }
        );

        if (submissionCheck.data.submitted) {
          setSubmitted(true);
          return;
        }

        // Fetch test details
        const testResponse = await axios.get(
          `${API_BASE_URL}/api/student/tests/${testId}`
        );
        setTest(testResponse.data);

        // Initialize responses
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
    if (!validateForm() || !test) return;

    try {
      setLoading(true);

      // Prepare submission data
      const submission = {
        testId,
        studentId,
        answers: responses,
        questions: test.questions.map((q, index) => ({
          questionId: q._id || index,
          type: q.type,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
        })),
      };

      // Submit to backend
      await axios.post(`${API_BASE_URL}/api/student/submit-test`, submission);

      setShowModal(true);
      setSubmitted(true);
    } catch (err) {
      setValidationError(err.response?.data?.error || "Failed to submit test");
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/studentdash/Forms");
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center p-8">
        <div className="text-green-600 mb-4">
          You have already submitted this test.
        </div>
        <button
          onClick={() => navigate("/studentdash/Forms")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      {student && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Student Information</h3>
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

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">{test.title}</h2>
        {test.description && (
          <p className="text-gray-600 mt-2">{test.description}</p>
        )}
      </div>

      {validationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {validationError}
        </div>
      )}

      {test.questions.map((q, index) => (
        <div className="mb-6 pb-4 border-b border-gray-200" key={index}>
          <p className="font-semibold mb-2">
            Q{index + 1}: {q.questionText}
            {q.points && (
              <span className="text-gray-500 ml-2">
                ({q.points} point{q.points > 1 ? "s" : ""})
              </span>
            )}
          </p>

          {q.type === "short" && (
            <input
              type="text"
              placeholder="Your answer..."
              value={responses[index] || ""}
              onChange={(e) => handleShortAnswer(index, e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          )}

          {q.type === "single" && (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`block p-3 border rounded ${
                    responses[index] === i
                      ? "bg-blue-50 border-blue-500"
                      : "border-gray-300"
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
                  className={`block p-3 border rounded ${
                    (responses[index] || []).includes(i)
                      ? "bg-blue-50 border-blue-500"
                      : "border-gray-300"
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

      <button
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Test"}
      </button>

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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCloseModal}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
