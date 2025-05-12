import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function TecaherPrerequisiteTest() {
  const [showModal, setShowModal] = useState(false);
  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [savedTests, setSavedTests] = useState([]);
  const [responseCount, setResponseCount] = useState({});

  useEffect(() => {
    const storedTests =
      JSON.parse(localStorage.getItem("prerequisiteTests")) || [];
    setSavedTests(storedTests);

    const studentResponses =
      JSON.parse(localStorage.getItem("studentTestResponses")) || {};
    const counts = {};

    Object.values(studentResponses).forEach((response) => {
      counts[response.testId] = (counts[response.testId] || 0) + 1;
    });

    setResponseCount(counts);
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "single",
        options: ["", "", "", ""],
        correctOption: null,
        points: 1,
      },
    ]);
  };

  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const updateQuestionType = (index, type) => {
    const updated = [...questions];
    updated[index].type = type;

    if (type === "multiple") {
      updated[index].correctOption = [];
    } else if (type === "single") {
      updated[index].correctOption = null;
    } else {
      updated[index].correctOption = null;
    }

    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const updateCorrectOption = (qIndex, oIndex) => {
    const updated = [...questions];
    const question = updated[qIndex];

    if (question.type === "single") {
      question.correctOption = oIndex;
    } else if (question.type === "multiple") {
      if (!Array.isArray(question.correctOption)) {
        question.correctOption = [];
      }

      const optionIndex = question.correctOption.indexOf(oIndex);
      if (optionIndex === -1) {
        question.correctOption.push(oIndex);
      } else {
        question.correctOption.splice(optionIndex, 1);
      }
    }

    setQuestions(updated);
  };

  const updatePoints = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].points = Number(value);
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const saveTest = () => {
    if (!testName.trim()) {
      alert("Please enter a test name");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    const newTest = {
      id: Date.now(),
      title: testName,
      description: testDescription,
      questions,
      dateCreated: new Date().toLocaleDateString(),
      teacherId: "default-teacher",
    };
    const updatedTests = [...savedTests, newTest];
    setSavedTests(updatedTests);
    localStorage.setItem("prerequisiteTests", JSON.stringify(updatedTests));

    setTestName("");
    setTestDescription("");
    setQuestions([]);
    setShowModal(false);
  };

  const deleteTest = (id) => {
    const updatedTests = savedTests.filter((test) => test.id !== id);
    setSavedTests(updatedTests);
    localStorage.setItem("prerequisiteTests", JSON.stringify(updatedTests));

    const studentResponses =
      JSON.parse(localStorage.getItem("studentTestResponses")) || {};
    delete studentResponses[id];
    localStorage.setItem(
      "studentTestResponses",
      JSON.stringify(studentResponses)
    );
  };

  const copyTestLink = (id) => {
    const link = `${window.location.origin}/#/test/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <div>
      <header className="bg-white text-white p-4 shadow-md">
        <div className="flex items-center">
          <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
            T
          </div>
          <div className="font-bold text-xl">Test Creator</div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto my-8 px-4">
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            Create and manage your tests and Surveys
          </p>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
            onClick={() => setShowModal(true)}
          >
            Create New Test
          </button>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {savedTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl shadow-lg p-4 w-72 transition-transform hover:transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold mb-1">{test.title}</h3>
              <p className="text-gray-600 mb-2">
                {test.description || "No description provided"}
              </p>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{test.questions.length} questions</span>
                <span>{test.dateCreated}</span>
                <span>{responseCount[test.id] || 0} responses</span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                  onClick={() => copyTestLink(test.id)}
                >
                  Copy Link
                </button>
                {responseCount[test.id] ? (
                  <Link
                    to={`/teacher/test-responses/${test.id}`}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-center"
                  >
                    View Responses
                  </Link>
                ) : null}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                  onClick={() => deleteTest(test.id)}
                >
                  Delete
                </button>
              </div>
              <div className="mt-2 text-sm break-all">
                <a
                  href={`/#/test/${test.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {`${window.location.origin}/#/test/${test.id}`}
                </a>
              </div>
            </div>
          ))}
          {savedTests.length === 0 && (
            <div className="text-center text-gray-500">
              <p>
                No tests created yet. Click "Create New Test" to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-11/12 max-w-2xl max-h-screen overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create New Test</h2>
              <button className="text-2xl" onClick={() => setShowModal(false)}>
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
                      value={q.text}
                      onChange={(e) => updateQuestion(qIndex, e.target.value)}
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
                        updateQuestionType(qIndex, e.target.value)
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
                              checked={q.correctOption === oIndex}
                              onChange={() =>
                                updateCorrectOption(qIndex, oIndex)
                              }
                              className="ml-2"
                            />
                          )}
                          {q.type === "multiple" && (
                            <input
                              type="checkbox"
                              checked={
                                Array.isArray(q.correctOption) &&
                                q.correctOption.includes(oIndex)
                              }
                              onChange={() =>
                                updateCorrectOption(qIndex, oIndex)
                              }
                              className="ml-2"
                            />
                          )}
                          <label className="ml-1 text-sm">
                            {q.type === "single"
                              ? "Correct Answer"
                              : "Correct Option"}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-2">
                    <label className="block text-gray-700 mb-1">Points:</label>
                    <input
                      type="number"
                      min="1"
                      value={q.points}
                      onChange={(e) => updatePoints(qIndex, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={saveTest}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg w-full"
            >
              Save Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TecaherPrerequisiteTest;
