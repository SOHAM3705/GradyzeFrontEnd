import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminFeedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "", // Added required department field for teacher role
    feedback: "",
    opinions: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Gsheet/student/submit-feedback`,
        formData
      );

      // Check if response has data with status message
      if (response.data && response.data.message) {
        setMessage({ text: response.data.message, type: "success" });
      } else {
        setMessage({
          text: "Feedback submitted successfully!",
          type: "success",
        });
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        department: "",
        feedback: "",
        opinions: "",
        role: "student",
      });
    } catch (error) {
      // Display more specific error if available
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Error submitting feedback. Please try again.";

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-2 sm:p-5 bg-gray-100">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-lg sm:text-2xl font-bold text-[#2563eb] mb-2 sm:mb-4">
          Gradyze Feedback
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          We value your insights and opinions!
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-2 sm:mb-4 text-left">
            <label
              className="block text-gray-700 font-bold mb-1 sm:mb-2 text-sm sm:text-base"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-sm sm:text-base"
            />
          </div>

          <div className="mb-2 sm:mb-4 text-left">
            <label
              className="block text-gray-700 font-bold mb-1 sm:mb-2 text-sm sm:text-base"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-sm sm:text-base"
            />
          </div>

          <div className="mb-2 sm:mb-4 text-left">
            <label
              className="block text-gray-700 font-bold mb-1 sm:mb-2 text-sm sm:text-base"
              htmlFor="feedback"
            >
              Project Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              placeholder="Share your thoughts about the Gradyze project"
              value={formData.feedback}
              onChange={handleChange}
              required
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-sm sm:text-base"
            />
          </div>

          <div className="mb-2 sm:mb-4 text-left">
            <label
              className="block text-gray-700 font-bold mb-1 sm:mb-2 text-sm sm:text-base"
              htmlFor="opinions"
            >
              Opinions
            </label>
            <textarea
              id="opinions"
              name="opinions"
              placeholder="Share your opinions"
              value={formData.opinions}
              onChange={handleChange}
              required
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563eb] text-white py-1 sm:py-2 rounded-md hover:bg-[#1e4db7] transition duration-300 text-sm sm:text-base"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>

          {message.text && (
            <div
              className={`mt-2 sm:mt-4 p-1 sm:p-2 rounded text-xs sm:text-sm ${
                message.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminFeedback;
