import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TeacherChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const resetToken = searchParams.get("token");

    if (!resetToken) {
      setError("Token is missing.");
    } else {
      setToken(resetToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid request. Missing reset token.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/teacher/password/change-password", // ✅ Teacher API
        { token, newPassword, confirmPassword }
      );

      if (response.data && response.data.message) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/teacher-login"); // ✅ Redirect to teacher login page
        }, 2000);
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || "Something went wrong.");
      } else if (error.request) {
        setError("No response from the server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center relative">
        {/* 🔙 Back Button */}
        <button
          className="absolute left-4 top-4 text-purple-600 hover:text-purple-800"
          onClick={() => navigate("/teacher-login")}
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Enter a new password below.
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
            <i className="fas fa-lock text-gray-500 mx-2"></i>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
            <i className="fas fa-lock text-gray-500 mx-2"></i>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-800 transition disabled:bg-purple-400"
          >
            {loading ? "Updating..." : "Change Password"}
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

export default TeacherChangePassword;
