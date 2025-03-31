import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const TestCreationSystem = () => {
  // State variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const selectedYear = watch("year");

  // Load tests from API on component mount
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(
        "https://gradyzebackend.onrender.com/api/teachertest/tests"
      );
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
      showAlert("Failed to load tests", "error");
    }
  };

  const onSubmit = (data) => {
    setIsConfirmDialogOpen(true);
  };

  const handleCreateTest = async () => {
    if (!isAuthenticated) {
      showAlert("Please sign in to Google first", "error");
      return;
    }

    setIsConfirmDialogOpen(false);
    setIsLoading(true);

    try {
      const formData = {
        title: watch("testTitle"),
        department: watch("department"),
        year: watch("year"),
        semester: watch("semester"),
        description: watch("description"),
        questions: parseInt(watch("questions")),
      };

      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teachertest/tests",
        formData
      );

      setTests([response.data, ...tests]);
      closeModal();
      showAlert(
        "Test created successfully! You can now view and share the test link.",
        "success"
      );
    } catch (error) {
      console.error("Error creating test:", error);
      showAlert(
        `Failed to create Google Form. Error: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleGoogleLogin = async () => {
    try {
      // This would be replaced with actual Google authentication
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teachertest/tests"
      );
      if (response.data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.token);
        showAlert("Successfully signed in", "success");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showAlert("Failed to sign in", "error");
    }
  };

  // Generate semester options based on selected year
  const getSemesterOptions = () => {
    if (!selectedYear) return [];

    switch (selectedYear) {
      case "First Year":
        return ["Semester 1", "Semester 2"];
      case "Second Year":
        return ["Semester 3", "Semester 4"];
      case "Third Year":
        return ["Semester 5", "Semester 6"];
      case "Fourth Year":
        return ["Semester 7", "Semester 8"];
      default:
        return [];
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <header className="bg-blue-700 text-white p-6 rounded-md mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Test Creation System</h1>
          <p className="text-xl">Create and manage engineering tests easily</p>
        </header>

        {/* Auth Status */}
        <div
          className={`flex items-center justify-center p-3 rounded-md mb-6 ${
            isAuthenticated
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          <span className="mr-2 text-xl">{isAuthenticated ? "✅" : "⚠️"}</span>
          <span>
            {isAuthenticated
              ? "Signed in to Google. You can now create tests."
              : "Please sign in with Google to create tests"}
          </span>
        </div>

        {/* Google Sign In Button */}
        {!isAuthenticated && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleGoogleLogin}
              className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center"
            >
              <img
                src="https://gradyzebackend.onrender.com/api/teachertest/tests"
                alt="Google logo"
                className="mr-2"
              />
              Sign in with Google
            </button>
          </div>
        )}

        {/* Create Test Button */}
        <button
          onClick={openModal}
          disabled={!isAuthenticated}
          className={`block mx-auto mb-8 px-6 py-3 rounded-md text-white font-medium transition-all ${
            isAuthenticated
              ? "bg-blue-600 hover:bg-blue-400 hover:-translate-y-0.5 hover:shadow-md"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Create New Test
        </button>

        {/* Alert */}
        {alert.show && (
          <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 py-3 px-6 rounded-md shadow-lg ${
              alert.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Test Creation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl mx-auto my-8 p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Create New Test</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 text-2xl font-bold hover:text-gray-800"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="testTitle" className="font-semibold">
                    Test Title*
                  </label>
                  <input
                    id="testTitle"
                    {...register("testTitle", {
                      required: "Test Title is required",
                    })}
                    className={`p-2 border rounded-md ${
                      errors.testTitle ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter test title"
                  />
                  {errors.testTitle && (
                    <p className="text-red-500 text-sm">
                      {errors.testTitle.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="department" className="font-semibold">
                    Department*
                  </label>
                  <select
                    id="department"
                    {...register("department", {
                      required: "Department is required",
                    })}
                    className={`p-2 border rounded-md ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-sm">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="year" className="font-semibold">
                    Year*
                  </label>
                  <select
                    id="year"
                    {...register("year", { required: "Year is required" })}
                    className={`p-2 border rounded-md ${
                      errors.year ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Year</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                  {errors.year && (
                    <p className="text-red-500 text-sm">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="semester" className="font-semibold">
                    Semester*
                  </label>
                  <select
                    id="semester"
                    {...register("semester", {
                      required: "Semester is required",
                    })}
                    className={`p-2 border rounded-md ${
                      errors.semester ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={!selectedYear}
                  >
                    <option value="">Select Semester</option>
                    {getSemesterOptions().map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="text-red-500 text-sm">
                      {errors.semester.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="description" className="font-semibold">
                    Test Description*
                  </label>
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className={`p-2 border rounded-md min-h-32 resize-y ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter detailed description of the test"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="questions" className="font-semibold">
                    Number of Questions*
                  </label>
                  <input
                    id="questions"
                    type="number"
                    {...register("questions", {
                      required: "Number of questions is required",
                      min: { value: 1, message: "Minimum value is 1" },
                      max: { value: 50, message: "Maximum value is 50" },
                    })}
                    defaultValue={10}
                    className={`p-2 border rounded-md ${
                      errors.questions ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.questions && (
                    <p className="text-red-500 text-sm">
                      {errors.questions.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition-colors mt-4"
                >
                  Create Test
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {isConfirmDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-md mx-auto p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Confirm Test Creation</h3>
              <p className="mb-4">
                Are you sure you want to create this test? This will generate a
                Google Form.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCreateTest}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md"
                >
                  Yes, Create Test
                </button>
                <button
                  onClick={() => setIsConfirmDialogOpen(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="mb-4">Creating your test...</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full animate-pulse"
                  style={{ width: "100%", animation: "progress 1.5s infinite" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Created Tests List */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Your Tests</h2>

          {tests.length === 0 ? (
            <p>No tests created yet. Click "Create New Test" to get started.</p>
          ) : (
            <div className="space-y-4">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-lg p-5 shadow-md hover:-translate-y-1 transition-transform"
                >
                  <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h3 className="text-xl font-medium text-blue-700">
                      {test.title}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {test.department} | {test.year} | {test.semester}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Created: {test.createdAt}
                  </div>
                  <p className="mb-3">{test.description}</p>
                  <p className="mb-3">Number of Questions: {test.questions}</p>
                  <a
                    href={test.formLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Open Test Form
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCreationSystem;
