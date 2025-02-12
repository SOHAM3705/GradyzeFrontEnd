import React, { useState, useEffect, useCallback } from "react";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    opinions: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the current field when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.feedback.trim())
      newErrors.feedback = "Please provide your feedback";
    if (!formData.opinions.trim())
      newErrors.opinions = "Please share your opinions";
    return newErrors;
  }, [formData]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setSuccessMessage(true);
        setFormData({ name: "", email: "", feedback: "", opinions: "" });
        setIsSubmitting(false);
        setTimeout(() => setSuccessMessage(false), 5000); // Hide success message after 5 seconds
      }, 1500);
    } else {
      setErrors(formErrors);
    }
  };

  // Clear errors when form data changes
  useEffect(() => {
    setErrors({});
  }, [formData]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-lg w-full max-w-xl opacity-0 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-purple-600 mb-2">
            Gradyze Feedback
          </h1>
          <p className="text-lg text-gray-600">
            We value your insights and opinions!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name Field */}
          <FormField
            label="Name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          {/* Email Field */}
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          {/* Feedback Field */}
          <FormField
            label="Project Feedback"
            name="feedback"
            type="textarea"
            placeholder="Share your thoughts about the Gradyze project"
            value={formData.feedback}
            onChange={handleChange}
            error={errors.feedback}
          />
          {/* Opinions Field */}
          <FormField
            label="Opinions"
            name="opinions"
            type="textarea"
            placeholder="Share your opinions"
            value={formData.opinions}
            onChange={handleChange}
            error={errors.opinions}
          />
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-4 bg-purple-600 text-white rounded-lg font-semibold transition-all duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:shadow-lg active:translate-y-0.5"
            }`}
            disabled={isSubmitting}
            aria-label="Submit Feedback"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">Submitting...</span>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
        {/* Success Message */}
        {successMessage && (
          <div className="mt-6 bg-green-500 text-white p-4 rounded-lg text-center animate-fadeIn">
            {successMessage}
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
      <label className="block text-purple-600 font-semibold mb-2">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white transition-all duration-300 min-h-[120px]"
          required
          aria-invalid={!!error}
          aria-describedby={`${name}-error`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white transition-all duration-300"
          required
          aria-invalid={!!error}
          aria-describedby={`${name}-error`}
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
