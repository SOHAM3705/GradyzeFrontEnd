import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TestRedirector() {
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Get studentId from sessionStorage
    const studentId = sessionStorage.getItem("studentId");

    if (studentId) {
      // Redirect to student-specific test URL
      navigate(`/${studentId}/test/${testId}`, { replace: true });
    } else {
      // If not logged in, redirect to login with testId in state
      navigate("/studentlogin", {
        state: {
          redirectTo: `/test/${testId}`,
          message: "Please login to access your test",
        },
      });
    }
  }, [testId, navigate]);

  return <div className="text-center p-8">Redirecting to your test...</div>;
}

export default TestRedirector;
