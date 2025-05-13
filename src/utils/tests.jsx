import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const StudentTestViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);

        // Check if student already submitted this test
        const submissionCheck = await axios.get(
          `${API_BASE_URL}/test-submission-check/${id}`,
          {
            params: { studentEmail },
          }
        );

        if (submissionCheck.data.submitted) {
          setSubmitted(true);
          return;
        }

        // Fetch the test
        const response = await axios.get(`${API_BASE_URL}/test/${id}`);
        const testData = response.data;

        // Initialize responses object
        const initialResponses = {};
        testData.questions.forEach((question, index) => {
          if (question.type === "multiple") {
            initialResponses[index] = [];
          } else {
            initialResponses[index] = "";
          }
        });

        setTest(testData);
        setResponses(initialResponses);
      } catch (err) {
        console.error("Error loading test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, studentEmail]);

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
    if (!studentName.trim()) {
      setValidationError("Please enter your name");
      return false;
    }

    if (!studentEmail.trim()) {
      setValidationError("Please enter your email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

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
        testId: id,
        studentName,
        studentEmail,
        answers: responses,
        questions: test.questions.map((q, index) => ({
          questionId: q._id || index,
          type: q.type,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
        })),
      };

      // Submit to backend
      await axios.post(`${API_BASE_URL}/submit-test`, submission);

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
    navigate("/");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-700">Loading test...</h2>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Test Not Found</h2>
        </div>
        <p className="text-center mt-4">
          Sorry, we couldn't find the test you're looking for.
        </p>
        <button
          className="block mx-auto mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">
            Test Already Submitted
          </h2>
        </div>
        <p className="text-center mt-4">
          You have already submitted this test.
        </p>
        <button
          className="block mx-auto mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">{test.title}</h2>
      </div>
      <p className="text-gray-600 mb-6">{test.description}</p>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Student Information</h3>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email:</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
            required
          />
        </div>
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
              Thank you, {studentName}! Your responses have been saved
              successfully!
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCloseModal}
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTestViewer;
