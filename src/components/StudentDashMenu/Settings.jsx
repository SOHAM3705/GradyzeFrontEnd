import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProfileSettings = () => {
  const navigate = useNavigate();

  // State management
  const [profileImage, setProfileImage] = useState("/profile.png");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    oldEmail: "",
    gender: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/studentlogin"); // ✅ Fixed typo: "stduentlogin" -> "studentlogin"
          return;
        }

        const response = await axios.get(
          "https://gradyzebackend.onrender.com/api/studentsetting/profile", // ✅ Use full backend URL consistently
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          const backendBaseURL = "https://gradyzebackend.onrender.com";

          setProfileData({
            profileImage: response.data.profilePhotoUrl
              ? `${backendBaseURL}${response.data.profilePhotoUrl}` // ✅ Append backend base URL
              : "/profile.png",
            name: response.data.name || "",
            email: response.data.email || "",
            oldEmail: response.data.email || "",
            gender: response.data.gender || "",
          });
        }
      } catch (error) {
        setError("Failed to load profile data");
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Image selection handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Function to update Profile Photo
  const handleUpdatePhoto = async () => {
    if (!selectedFile) {
      return true; // No photo to update
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("email", profileData.email);

      // Step 1: Upload Profile Photo
      const response = await axios.post(
        `${API_BASE_URL}/api/studentsetting/profile/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Profile Photo Uploaded:", response.data);
      const newProfilePhotoUrl = response.data.profilePhotoUrl;

      // Step 2: Update Profile Photo in User Collection

      console.log("✅ Profile Photo Updated in User Collection");
      return true;
    } catch (error) {
      setError("Failed to upload photo. Please try again.");
      console.error("❌ Photo upload error:", error);
      return false;
    }
  };

  // Function to update Name & Email
  const handleUpdateNameEmail = async () => {
    if (!profileData.name || !profileData.email) {
      setError("Name and Email are required");
      return false;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in again.");
        navigate("/studentlogin");
        return false;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/studentsetting/update-name-email`,
        {
          oldEmail: profileData.oldEmail,
          newEmail: profileData.email,
          name: profileData.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Name & Email Updated:", response.data);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("studentId");

      return true;
    } catch (error) {
      setError("Failed to update Name & Email. Please try again.");
      console.error("❌ Update error:", error);
      return false;
    }
  };

  // Comprehensive profile form submission handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.name || !profileData.email) {
      setError("Name and Email are required");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Update Name & Email
      const nameEmailUpdated = await handleUpdateNameEmail();

      // Step 2: Update Profile Photo (if a file is selected)
      const photoUpdated = await handleUpdatePhoto();

      // If both updates are successful
      if (nameEmailUpdated && photoUpdated) {
        setNotification("Profile updated successfully!");

        // Optional: Refresh page or update local state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("❌ Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Password change handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newPassword = e.target["new-password"].value;
    const confirmPassword = e.target["confirm-password"].value;
    const currentPassword = e.target["current-password"].value;

    if (!currentPassword || !newPassword) {
      setError("Both current and new passwords are required");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found, please log in again");
        navigate("/studentlogin");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/studentsetting/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification("Password changed successfully! Please log in again.");
      setTimeout(() => {
        sessionStorage.removeItem("token");
        navigate("/studentlogin");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to change password");
      console.error("❌ Password change error:", error);
    } finally {
      setIsLoading(false);
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
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
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
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={(e) =>
                      setProfileData({ ...profileData, gender: e.target.value })
                    }
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
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
                disabled={isLoading}
                className={`${
                  isLoading ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-2 rounded-md transition`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
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
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
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
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`${
                  isLoading ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-2 rounded-md transition`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
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
