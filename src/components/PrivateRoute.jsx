import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  // Check for authentication tokens
  const adminId = localStorage.getItem("adminId");
  const teacherId = localStorage.getItem("teacherId");
  const studentId = localStorage.getItem("studentId");

  // Role-based authentication check
  if (role === "admin" && !adminId) {
    return <Navigate to="/adminlogin" />;
  }
  if (role === "teacher" && !teacherId) {
    return <Navigate to="/teacherlogin" />;
  }
  if (role === "student" && !studentId) {
    return <Navigate to="/studentlogin" />;
  }

  // If authenticated, allow access
  return children;
};

export default PrivateRoute;
