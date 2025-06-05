import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TestRedirector() {
  const { studentId, testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      navigate(`/${studentId}/test/${testId}`, { replace: true });
    } else {
      // Optional: If not logged in, show error or redirect
      navigate("/login");
    }
  }, [testId, navigate]);

  return <div>Redirecting to your test...</div>;
}

export default TestRedirector;
