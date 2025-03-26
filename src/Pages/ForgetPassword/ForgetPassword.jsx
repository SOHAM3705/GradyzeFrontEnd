import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Ensure FontAwesome is loaded

const TeacherForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // 🔥 Separate error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(""); // Reset error state

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/password/verify-email", // ✅ Updated API for teachers
        { email }
      );
      setMessage(response.data.message);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Something went wrong.";
      setError(errorMsg);
    }

    setLoading(false);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/teacher-login"); // ✅ Change to your teacher login page
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        {/* 🔙 Back Button */}
        <button
          className="absolute left-4 top-4 text-purple-600 hover:text-purple-800"
          onClick={handleBack}
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Teacher Forgot Password
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Enter your registered email to receive a reset link.
        </p>

        {/* ✉️ Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
            <i className="fas fa-envelope text-gray-500 mx-2"></i>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-800 transition disabled:bg-purple-400"
          >
            {loading ? "Sending..." : "Verify Email"}
          </button>
        </form>

        {/* ✅ Success Message */}
        {message && (
          <p className="text-green-600 mt-3 font-medium">{message}</p>
        )}

        {/* ❌ Error Message */}
        {error && <p className="text-red-600 mt-3 font-medium">{error}</p>}
      </div>
    </div>
  );
};

export default TeacherForgetPassword;
