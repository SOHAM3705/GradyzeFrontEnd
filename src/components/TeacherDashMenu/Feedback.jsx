import React, { useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    opinions: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Add successMessage state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending data:", formData); // Log the data before sending
      const response = await axios.post(
        `https://gradyzebackend.onrender.com/api/Gsheet/Adminfeedback`,
        formData
      );
      console.log("Response received:", response.data); // Log response from the server
      setResponseMessage(response.data.message);
      setSuccessMessage(
        "Thank you for your message! We'll get back to you soon."
      );
      setFormData({ name: "", email: "", feedback: "", opinions: "" }); // Reset form
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      setResponseMessage("Error submitting the form. Try again.");
      setSuccessMessage("");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-lg w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-teal-600 mb-2">
            Gradyze Feedback
          </h1>
          <p className="text-lg text-gray-600">
            We value your insights and opinions!
          </p>
        </div>
        <form
          id="AdminfeedBack"
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
        >
          {/* Name Field */}
          <FormField
            label="Name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          {/* Email Field */}
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {/* Feedback Field */}
          <FormField
            label="Project Feedback"
            name="feedback"
            type="textarea"
            placeholder="Share your thoughts about the Gradyze project"
            value={formData.feedback}
            onChange={handleChange}
          />
          {/* Opinions Field */}
          <FormField
            label="Opinions"
            name="opinions"
            type="textarea"
            placeholder="Share your opinions"
            value={formData.opinions}
            onChange={handleChange}
          />
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-4 bg-teal-600 text-white rounded-lg font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:shadow-lg active:translate-y-0.5"
            }`}
            disabled={loading}
            aria-label="Submit Feedback"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">Submitting...</span>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
        {/* Success/Error Message */}
        {responseMessage && (
          <div
            className={`mt-6 p-4 rounded-lg text-center animate-fadeIn ${
              responseMessage.includes("Error")
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
            aria-live="polite"
          >
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable FormField Component
const FormField = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="relative">
      <label className="block text-teal-600 font-semibold mb-2">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white transition-all duration-300 min-h-[120px]"
          required
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white transition-all duration-300"
          required
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Feedback;
