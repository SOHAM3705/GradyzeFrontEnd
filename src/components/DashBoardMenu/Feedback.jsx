import React, { useState } from "react";
import axios from "axios";

const AdminFeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    opinions: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Google Sheets Web App URL (Replace this with your actual URL)
  const GOOGLE_SHEET_WEBHOOK =
    "https://script.google.com/macros/s/AKfycbwNlBIgPcDyOcyEhCmD435CWChci3eUTAYYUQy6lBACaXUjtifh3NhKHLxB4UOu1jI/exec";

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
      await axios.post(GOOGLE_SHEET_WEBHOOK, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage({ text: "Feedback submitted successfully!", type: "success" });
      setFormData({
        name: "",
        email: "",
        feedback: "",
        opinions: "",
        role: "admin",
      });
    } catch (error) {
      setMessage({
        text: "Error submitting feedback. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">
          Gradyze Feedback
        </h1>
        <p className="text-gray-600 mb-6">
          We value your insights and opinions!
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label
              className="block text-gray-700 font-bold mb-2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4 text-left">
            <label
              className="block text-gray-700 font-bold mb-2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4 text-left">
            <label
              className="block text-gray-700 font-bold mb-2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4 text-left">
            <label
              className="block text-gray-700 font-bold mb-2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>

          {message.text && (
            <div
              className={`mt-4 p-2 rounded ${
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

export default AdminFeedbackForm;
