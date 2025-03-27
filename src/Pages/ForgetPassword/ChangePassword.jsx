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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlToken = searchParams.get("token");

    if (!urlToken) {
      setMessage("❌ Token is missing.");
    } else {
      console.log("🔑 Token Retrieved:", urlToken);
      setToken(urlToken);
    }
  }, []);

  const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("❌ Invalid or missing token.");
      setLoading(false);
      return;
    }

    if (!isValidPassword(newPassword)) {
      setMessage(
        "⚠ Password must be at least 8 characters long, with 1 uppercase letter, 1 number, and 1 special character."
      );
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("⚠ Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      console.log("🔄 Sending password reset request...");
      console.log("📤 Payload:", { token, newPassword, confirmPassword });

      const response = await axios.post(
        "https://gradyzebackend.onrender.com/api/password/change-password",
        { token, newPassword, confirmPassword } // Ensure token is in the body
      );

      console.log("✅ Response:", response.data);
      setMessage("✅ " + response.data.message);
    } catch (error) {
      console.error("❌ Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center relative">
        {/* Back Button */}
        <button
          className="absolute left-4 top-4 text-green-600 hover:text-green-800"
          onClick={() => navigate("/login")}
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Reset Password
        </h2>

        <p className="text-gray-600 mb-4">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50 relative">
            <i className="fas fa-lock text-gray-500 mx-2"></i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } mx-2 text-gray-500`}
              ></i>
            </button>
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
            disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
            className={`w-full py-2 rounded-lg font-bold transition ${
              newPassword.trim() && confirmPassword.trim() && !loading
                ? "bg-green-600 text-white hover:bg-green-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
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
