import { useState } from "react";
import axios from "axios";

const ProfileSettings = () => {
  const [profileImage, setProfileImage] = useState("/assets/profile.png");
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Handle profile settings submission
    setNotification("Profile settings saved successfully!");
    setTimeout(() => setNotification(""), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newPassword = e.target["new-password"].value;
    const confirmPassword = e.target["confirm-password"].value;
    const currentPassword = e.target["current-password"].value;

    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/api/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setNotification("Password changed successfully!");
        setTimeout(() => setNotification(""), 3000);
        setShowChangePassword(false); // Close change password section after success
      } else {
        setError(response.data.message || "Failed to change password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {notification && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-slide-in">
          {notification}
        </div>
      )}
      {error && (
        <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-slide-in">
          {error}
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 flex gap-6">
        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-md">
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Profile Settings
          </h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {!showChangePassword ? (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                Personal Information
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 font-medium">
                    Gender
                  </label>
                  <select
                    name="gender"
                    className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Change Password
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                Change Password
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current-password"
                  className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new-password"
                    className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
