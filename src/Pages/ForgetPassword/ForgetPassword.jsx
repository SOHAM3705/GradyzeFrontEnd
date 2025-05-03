import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email.trim()) {
      setMessage("⚠️ Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Sending password reset request for:", email);
      const trimmedEmail = email.trim();
      const response = await axios.post(
        `${API_BASE_URL}/api/password/verify-email`,
        { email: trimmedEmail }
      );

      setMessage("✅ " + response.data.message);
    } catch (error) {
      console.error("❌ Error sending reset email:", error);
      if (error.response) {
        if (error.response.status === 404) {
          setMessage("⚠️ No account found with this email.");
        } else if (error.response.status === 400) {
          setMessage("⚠️ Please provide a valid email.");
        } else {
          setMessage("❌ Something went wrong. Please try again.");
        }
      } else {
        setMessage("❌ Network error. Please check your internet connection.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        {/* Back Button */}
        <button
          className="absolute left-4 top-4 text-purple-600 hover:text-purple-800"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Verify Email
        </h2>

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
            disabled={loading || !email.trim()}
            className={`w-full py-2 rounded-lg font-bold transition ${
              email.trim() && !loading
                ? "bg-purple-600 text-white hover:bg-purple-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending..." : "Verify Email"}
          </button>
        </form>

        {message && <p className="text-gray-700 mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;
