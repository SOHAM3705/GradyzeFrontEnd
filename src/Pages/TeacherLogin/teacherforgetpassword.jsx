import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Ensure FontAwesome is loaded

const TeacherForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/password/teacherpassword/verify-email",
        { email }
      );
      setMessage("📩 " + response.data.message);
    } catch (error) {
      setMessage(
        "❌ " + (error.response?.data?.message || "Something went wrong.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/teacherlogin"); // Redirects to the teacher login page
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        {/* Back Button */}
        <button
          className="absolute left-4 top-4 text-green-600 hover:text-green-800"
          onClick={handleBack}
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Forgot Password
        </h2>

        <p className="text-gray-600 mb-4">
          Enter your registered email to receive a password reset link.
        </p>

        {/* Form */}
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
            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-800 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="text-gray-700 mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default TeacherForgetPassword;
