import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  // ✅ Get token & role from sessionStorage
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  // ✅ Check if user is authenticated and authorized
  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to={`/${role ? role : "user"}login`} replace />;
  }

  // ✅ If authenticated & authorized, render the protected page
  return children;
};

export default PrivateRoute;
