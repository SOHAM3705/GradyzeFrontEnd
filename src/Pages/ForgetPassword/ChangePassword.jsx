import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlToken = searchParams.get("token");
    if (!urlToken) {
      setMessage("❌ Token is missing.");
    }
    setToken(urlToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("❌ Invalid or missing token.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("⚠ Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/password/change-password",
        { token, newPassword, confirmPassword }
      );

      setMessage("✅ " + response.data.message);
      setTimeout(() => {
        navigate("/adminlogin");
      }, 2000);
    } catch (error) {
      setMessage(
        "❌ " +
          (error.response?.data?.message ||
            "An error occurred while updating your password. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center relative">
        {/* Back Button */}
        <button
          className="absolute left-4 top-4 text-purple-600 hover:text-purple-800"
          onClick={() => navigate("/adminlogin")}
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Reset Password
        </h2>

        <p className="text-gray-600 mb-4">Enter your new password below.</p>

        {/* Form */}
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
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-800 transition"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>

        {message && <p className="text-gray-700 mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
