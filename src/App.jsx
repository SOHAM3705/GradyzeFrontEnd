import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AboutUs from "./Pages/AboutUs/AboutUs";
import ContactUs from "./Pages/contactus/ContactUs";
import AdminLogin from "./Pages/AdminLogin/AdminLogin";
import AdminSignUp from "./Pages/AdminSignup/AdminSignup";
import StudentLogin from "./Pages/StudentLogin/StudentLogin";
import TeacherLogin from "./Pages/TeacherLogin/TeacherLogin";
import PPSection from "./Pages/PPSection/PPSection";
import Documentation from "./Pages/Documentation/Documentation";
import AdminDash from "./Pages/AdminDash/AdminDash";

// Import the PrivateRoute component
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/adminsignup" element={<AdminSignUp />} />
      <Route path="/studentlogin" element={<StudentLogin />} />
      <Route path="/teacherlogin" element={<TeacherLogin />} />
      <Route path="/privacypolicy" element={<PPSection />} />
      <Route path="/documentation" element={<Documentation />} />

      {/* Protect the Admin Dashboard route with PrivateRoute */}
      <Route
        path="/admindash"
        element={
          <PrivateRoute>
            <AdminDash />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
