import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentTestResults from "./StudentTestResults";
import StudentTestViewer from "./StudentTestViewer"; // Import your preview component
import { API_BASE_URL } from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";

function TeacherPrerequisiteTest() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testType = queryParams.get("type");
  const year = queryParams.get("year");
  const division = queryParams.get("division");
  const subjectName = queryParams.get("subjectName");
  const semester = queryParams.get("semester");

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [savedTests, setSavedTests] = useState([]);
  const [responseCount, setResponseCount] = useState({});
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTest, setEditingTest] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTestData, setPreviewTestData] = useState(null);
  const navigate = useNavigate();

  const previewTest = async (testId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/teacher/test/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setPreviewTestData(response.data);
      setShowPreviewModal(true);
    } catch (err) {
      setError("Failed to load test for preview");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (testId) => {
    setDropdownOpen({
      ...dropdownOpen,
      [testId]: !dropdownOpen[testId],
    });
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          testType,
          ...(testType === "class" && { year, division }),
          ...(testType === "subject" && { subjectName, semester }),
        });

        const response = await axios.get(
          `${API_BASE_URL}/api/teacher/my-tests?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        setSavedTests(response.data);

        const counts = {};
        for (const test of response.data) {
          try {
            const res = await axios.get(
              `${API_BASE_URL}/api/teacher/test-responses/${test._id}`,
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
              }
            );
            counts[test._id] = res.data.count;
          } catch (err) {
            counts[test._id] = 0;
          }
        }
        setResponseCount(counts);
      } catch (err) {
        setError("Failed to fetch tests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [testType, year, division, subjectName, semester]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        type: "single",
        options: ["", ""],
        correctAnswer: null,
        points: 1,
      },
    ]);
  };

  const updateTest = async (testId) => {
    try {
      setLoading(true);
      const testToEdit = savedTests.find((test) => test._id === testId);
      if (!testToEdit) {
        throw new Error("Test not found");
      }

      setEditingTest(testToEdit);
      setTestName(testToEdit.title);
      setTestDescription(testToEdit.description || "");
      setQuestions(
        testToEdit.questions.map((q) => ({
          ...q,
          correctAnswer:
            q.type === "multiple"
              ? Array.isArray(q.correctAnswer)
                ? q.correctAnswer
                : []
              : q.correctAnswer,
        }))
      );

      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load test for editing");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const updateCorrectAnswer = (qIndex, answer) => {
    const updated = [...questions];
    const question = updated[qIndex];

    if (question.type === "single") {
      question.correctAnswer = answer;
    } else if (question.type === "multiple") {
      if (!Array.isArray(question.correctAnswer)) {
        question.correctAnswer = [];
      }
      const index = question.correctAnswer.indexOf(answer);
      if (index === -1) {
        question.correctAnswer.push(answer);
      } else {
        question.correctAnswer.splice(index, 1);
      }
    }
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const saveTest = async () => {
    if (!testName.trim()) {
      setError("Please enter a test name");
      return;
    }

    if (questions.length === 0) {
      setError("Please add at least one question");
      return;
    }

    const invalidQuestions = questions.filter(
      (q) => q.type !== "short" && q.correctAnswer === null
    );

    if (invalidQuestions.length > 0) {
      setError("Please select correct answers for all questions");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const testData = {
        title: testName,
        description: testDescription,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          options: q.type !== "short" ? q.options : undefined,
          correctAnswer: q.correctAnswer,
          points: q.points,
          type: q.type,
        })),
        status: "draft",
        teacherId: sessionStorage.getItem("teacherId"),
        testType,
        ...(testType === "class" && { year, division }),
        ...(testType === "subject" && { subjectName, semester }),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/teacher/create-test`,
        testData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      setSavedTests([...savedTests, response.data.test]);
      setTestName("");
      setTestDescription("");
      setQuestions([]);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save test");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveUpdatedTest = async () => {
    if (!editingTest) return;

    if (!testName.trim()) {
      setError("Please enter a test name");
      return;
    }

    if (questions.length === 0) {
      setError("Please add at least one question");
      return;
    }

    const invalidQuestions = questions.filter(
      (q) =>
        q.type !== "short" &&
        (q.correctAnswer === null ||
          (q.type === "multiple" && q.correctAnswer.length === 0))
    );

    if (invalidQuestions.length > 0) {
      setError("Please select correct answers for all questions");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedTest = {
        title: testName,
        description: testDescription,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          options: q.type !== "short" ? q.options : undefined,
          correctAnswer: q.correctAnswer,
          points: q.points,
          type: q.type,
        })),
        status: editingTest.status,
        testType: editingTest.testType,
        ...(editingTest.testType === "class" && {
          year: editingTest.year,
          division: editingTest.division,
        }),
        ...(editingTest.testType === "subject" && {
          subjectName: editingTest.subjectName,
          semester: editingTest.semester,
        }),
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/teacher/update-test/${editingTest._id}`,
        updatedTest,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      setSavedTests(
        savedTests.map((test) =>
          test._id === editingTest._id ? response.data.test : test
        )
      );

      setEditingTest(null);
      setTestName("");
      setTestDescription("");
      setQuestions([]);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update test");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (testId) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `${API_BASE_URL}/api/teacher/publish-test/${testId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      setSavedTests(
        savedTests.map((test) =>
          test._id === testId ? { ...test, status: response.data.status } : test
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update test status");
    } finally {
      setLoading(false);
    }
  };

  const deleteTest = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/api/teacher/delete-test/${testId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      setSavedTests(savedTests.filter((test) => test._id !== testId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete test");
    } finally {
      setLoading(false);
    }
  };

  const copyTestLink = (testId) => {
    const link = `${window.location.origin}/test/${testId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const viewResults = (testId) => {
    setSelectedTestId(testId);
    setShowResultsModal(true);
  };

  const goBackToTestClassSelector = () => {
    navigate("/teacherdash/create-test");
  };

  return (
    <div className="teacher-test-container">
      <div className="max-w-4xl mx-auto my-8 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && <div className="text-center py-4">Loading...</div>}

        <div className="text-center mb-8">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg mt-4 mr-4"
            onClick={goBackToTestClassSelector}
            disabled={loading}
          >
            Back to Test Class Selector
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
            onClick={() => {
              setEditingTest(null);
              setTestName("");
              setTestDescription("");
              setQuestions([]);
              setShowModal(true);
            }}
            disabled={loading}
          >
            Create New Test
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Current Filters:</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold">Test Type:</span> {testType}
            </div>
            {testType === "class" && (
              <>
                <div>
                  <span className="font-semibold">Year:</span> {year}
                </div>
                <div>
                  <span className="font-semibold">Division:</span> {division}
                </div>
              </>
            )}
            {testType === "subject" && (
              <>
                <div>
                  <span className="font-semibold">Subject:</span> {subjectName}
                </div>
                <div>
                  <span className="font-semibold">Semester:</span> {semester}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {savedTests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-xl shadow-lg p-4 w-100 transition-transform hover:transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1">{test.title}</h3>
                  <p className="text-gray-600 mb-2">
                    {test.description || "No description provided"}
                  </p>
                </div>
                <span
                  className={`status ${test.status} px-2 py-1 rounded text-xs`}
                >
                  {test.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {test.testType === "subject" ? (
                  <>
                    <span className="font-semibold">Subject:</span>{" "}
                    {test.subjectName} (Sem {test.semester})
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Class:</span> {test.year} -{" "}
                    {test.division}
                  </>
                )}
              </div>

              <div className="flex justify-between text-sm text-gray-500 mt-2 gap-1">
                <span>{(test.questions || []).length} questions</span>
                <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                <span>{responseCount[test._id] || 0} responses</span>
              </div>

              <div className="mt-4 relative">
                <button
                  onClick={() => toggleDropdown(test._id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                  Actions
                </button>

                {dropdownOpen[test._id] && (
                  <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg transition-all duration-300 ease-in-out transform origin-top">
                    <button
                      onClick={() => copyTestLink(test._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => previewTest(test._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                    >
                      Preview Test
                    </button>
                    {responseCount[test._id] > 0 && (
                      <button
                        onClick={() => viewResults(test._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                      >
                        View Responses
                      </button>
                    )}
                    {test.status === "draft" ? (
                      <button
                        onClick={() => togglePublishStatus(test._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => togglePublishStatus(test._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      onClick={() => updateTest(test._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteTest(test._id)}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-11/12 max-w-2xl max-h-screen overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingTest ? "Update Test" : "Create New Test"}
              </h2>
              <button
                className="text-2xl"
                onClick={() => {
                  setShowModal(false);
                  setEditingTest(null);
                  setTestName("");
                  setTestDescription("");
                  setQuestions([]);
                }}
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Test Name:</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Enter test name"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Description:</label>
              <textarea
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                placeholder="Enter test description"
                className="w-full p-2 border rounded min-h-20"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Questions</h3>
                <button
                  onClick={addQuestion}
                  className="bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded"
                >
                  Add Question
                </button>
              </div>

              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Question {qIndex + 1}</h4>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-2">
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) =>
                        updateQuestion(qIndex, "questionText", e.target.value)
                      }
                      placeholder="Enter your question"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-700 mb-1">
                      Question Type:
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={q.type}
                      onChange={(e) =>
                        updateQuestion(qIndex, "type", e.target.value)
                      }
                    >
                      <option value="single">Single Choice</option>
                      <option value="multiple">Multiple Choice</option>
                      <option value="short">Short Answer</option>
                    </select>
                  </div>

                  {q.type !== "short" && (
                    <div className="mb-2">
                      <label className="block text-gray-700 mb-1">
                        Options:
                      </label>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center mb-1">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, e.target.value)
                            }
                            placeholder={`Option ${oIndex + 1}`}
                            className="flex-grow p-2 border rounded"
                          />
                          {q.type === "single" && (
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correctAnswer === oIndex}
                              onChange={() =>
                                updateCorrectAnswer(qIndex, oIndex)
                              }
                              className="ml-2"
                            />
                          )}
                          {q.type === "multiple" && (
                            <input
                              type="checkbox"
                              checked={
                                Array.isArray(q.correctAnswer) &&
                                q.correctAnswer.includes(oIndex)
                              }
                              onChange={() =>
                                updateCorrectAnswer(qIndex, oIndex)
                              }
                              className="ml-2"
                            />
                          )}
                          <label className="ml-1 text-sm">
                            {q.type === "single"
                              ? "Correct Answer"
                              : "Correct Option"}
                          </label>
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => removeOption(qIndex, oIndex)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        className="bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded mt-2"
                        onClick={() => addOption(qIndex)}
                      >
                        Add Option
                      </button>
                    </div>
                  )}

                  <div className="mb-2">
                    <label className="block text-gray-700 mb-1">Points:</label>
                    <input
                      type="number"
                      min="1"
                      value={q.points}
                      onChange={(e) =>
                        updateQuestion(
                          qIndex,
                          "points",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={editingTest ? saveUpdatedTest : saveTest}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg w-full"
            >
              {editingTest ? "Update Test" : "Save Test"}
            </button>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-11/12 max-w-4xl max-h-screen overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Test Preview</h2>
              <button
                className="text-2xl"
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewTestData(null);
                }}
              >
                ×
              </button>
            </div>
            {previewTestData ? (
              <div className="p-4 border rounded-lg">
                <StudentTestViewer
                  test={previewTestData}
                  previewMode={true}
                  onClose={() => {
                    setShowPreviewModal(false);
                    setPreviewTestData(null);
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Loading test preview...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-11/12 max-w-4xl max-h-screen overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Test Preview</h2>
              <button
                className="text-2xl"
                onClick={() => setShowPreviewModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-4 border rounded-lg">
              <StudentTestViewer
                test={editingTest}
                previewMode={true}
                onClose={() => setShowPreviewModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-11/12 max-w-4xl max-h-screen overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Student Test Results</h2>
              <button
                className="text-2xl"
                onClick={() => setShowResultsModal(false)}
              >
                ×
              </button>
            </div>
            <StudentTestResults testId={selectedTestId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherPrerequisiteTest;
