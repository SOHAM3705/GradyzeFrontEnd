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
      await axios.post("/api/feedbackRoutes/admin/submit-feedback", formData);
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
    <div
      className="flex justify-center items-center min-h-screen p-5"
      style={{ backgroundColor: "#7c3aed" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-white text-2xl mb-4">Admin Feedback</h1>
        <p className="text-gray-600 mb-6">
          We value your insights and opinions!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label className="block text-white font-bold mb-2" htmlFor="name">
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-white font-bold mb-2" htmlFor="email">
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="mb-4 text-left">
            <label
              className="block text-white font-bold mb-2"
              htmlFor="feedback"
            >
              Project Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              placeholder="Share your thoughts about the project"
              value={formData.feedback}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="mb-4 text-left">
            <label
              className="block text-white font-bold mb-2"
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-purple-700 py-2 rounded-md hover:bg-gray-100 transition duration-300"
          >
            Submit Feedback
          </button>
          {loading && <div className="mt-4 text-gray-600">Submitting...</div>}
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
