import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AboutUs from "./Pages/AboutUs/AboutUs";
import ContactUs from "./Pages/contactus/contactus";
import AdminLogin from "./Pages/AdminLogin/AdminLogin";
import AdminSignUp from "./Pages/AdminSignup/AdminSignup";
import StudentLogin from "./Pages/StudentLogin/StudentLogin";
import TeacherLogin from "./Pages/TeacherLogin/TeacherLogin";
import PPSection from "./Pages/PPSection/PPSection";
import Documentation from "./Pages/Documentation/Documentation";
import AdminDash from "./Pages/AdminDash/AdminDash";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import ChangePassword from "./Pages/ForgetPassword/ChangePassword";

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
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Protect the Admin Dashboard route with PrivateRoute */}
      <Route
        path="/admindash"
        element={
          <PrivateRoute>
            <AdminDash />
          </PrivateRoute>
        }
      >
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="Syllbus" element={<SyllabusManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
