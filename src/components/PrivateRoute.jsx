import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const adminId = localStorage.getItem("adminId");
  const teacherId = localStorage.getItem("teacherId");

  // Check authentication based on the role
  const isAuthenticated =
    (role === "admin" && adminId) || (role === "teacher" && teacherId);

  if (!isAuthenticated) {
    // Redirect to the correct login page
    const loginPath = role === "admin" ? "/adminlogin" : "/teacherlogin";
    return <Navigate to={loginPath} />;
  }

  return children;
};

export default PrivateRoute;
