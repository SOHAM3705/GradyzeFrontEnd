import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const adminId = localStorage.getItem("adminId"); // Use adminId instead of auth_token

  if (!adminId) {
    // Redirect to login if not authenticated
    return <Navigate to="/adminlogin" />;
  }

  return children;
};

export default PrivateRoute;
