import React from "react";

const StudentTestViewer = ({ test, previewMode, onClose }) => {
  // Check if test is not available
  if (!test) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Test Data Not Loaded
          </h2>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close Preview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      {previewMode && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-blue-700">TEST PREVIEW MODE</h2>
          <p className="text-gray-500">
            This is how students will see the test
          </p>
        </div>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">{test.title}</h2>
      </div>

      {test.description && (
        <p className="text-gray-600 mb-6">{test.description}</p>
      )}

      {test.questions && test.questions.length > 0 ? (
        test.questions.map((q, index) => (
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
                className="w-full p-2 border rounded"
                disabled={previewMode}
              />
            )}

            {q.type === "single" && (
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`block p-3 border rounded ${
                      q.correctAnswer === i
                        ? "bg-green-50 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${index}`}
                      className="mr-2"
                      disabled={previewMode}
                    />
                    {opt}
                    {previewMode && q.correctAnswer === i && (
                      <span className="text-green-600 ml-2">
                        ✓ Correct Answer
                      </span>
                    )}
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
                      (q.correctAnswer || []).includes(i)
                        ? "bg-green-50 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      disabled={previewMode}
                    />
                    {opt}
                    {previewMode && (q.correctAnswer || []).includes(i) && (
                      <span className="text-green-600 ml-2">✓ Correct</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">
          No questions in this test
        </p>
      )}

      {previewMode && (
        <div className="text-center mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentTestViewer;
