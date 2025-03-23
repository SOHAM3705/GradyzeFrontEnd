import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import ProfileSettings from "./components/DashBoardMenu/Settings";
import SyllabusManagement from "./components/DashBoardMenu/Syllabus";
import Notification from "./components/DashBoardMenu/Notifications";
import Feedback from "./components/DashBoardMenu/Feedback";
import SubscriptionPlan from "./components/DashBoardMenu/SubscriptionPlan";
import StudentManagement from "./components/DashBoardMenu/StudentManage";
import FacultyManagement from "./components/DashBoardMenu/FacultyManage";
import AdminStudentMarks from "./components/DashBoardMenu/StudentsMarks";
import AdminOverview from "./components/DashBoardMenu/Overview";
import AdminAttendanceDashboard from "./components/DashBoardMenu/AttendanceReport";

import TeacherDash from "./Pages/TeacherDash/TeacherDash";
import ChangePassword from "./Pages/ForgetPassword/ChangePassword";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import TeacherForgetPassword from "./Pages/TeacherLogin/teacherforgetpassword";
import TeacherChangePassword from "./Pages/TeacherLogin/teacherchangepassword";

import StudentManage from "./components/TeacherDashMenu/StudentManage";
import SubjectMarks from "./components/TeacherDashMenu/SubjectMarks";
import TeacherAttendanceDashboard from "./components/TeacherDashMenu/AttendanceReport";
import TeacherNotifications from "./components/TeacherDashMenu/Notification";
import TeacherSyllabusView from "./components/TeacherDashMenu/Syllabus";
import TeacherFeedback from "./components/TeacherDashMenu/Feedback";
import TeacherSettings from "./components/TeacherDashMenu/Settings";
import TeacherOverview from "./components/TeacherDashMenu/teacherOverview";

import StudentDash from "./Pages/StudentDash/StudentDash";
import StudentAttendanceDashboard from "./components/StudentDashMenu/AttendnaceReport";
import StudentNotifications from "./components/StudentDashMenu/Notification";
import StudentSyllabus from "./components/StudentDashMenu/Syllabus";
import StudentFeedback from "./components/StudentDashMenu/Feedback";
import StudentSettings from "./components/StudentDashMenu/Settings";
import StudentOverview from "./components/StudentDashMenu/Overview";
import StudentResults from "./components/StudentDashMenu/Results";

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
      <Route path="/studentdash" element={<StudentDash />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route
        path="/teacher-forget-password"
        element={<TeacherForgetPassword />}
      />
      <Route
        path="/teacher-change-password"
        element={<TeacherChangePassword />}
      />

      {/* 🔹 Admin Routes */}
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route
        path="/admindash"
        element={
          <PrivateRoute role="admin">
            <AdminDash />
          </PrivateRoute>
        }
      >
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="Syllbus" element={<SyllabusManagement />} />
        <Route path="notifications" element={<Notification />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="subscription-plan" element={<SubscriptionPlan />} />
        <Route path="AdminStudentManage" element={<StudentManagement />} />
        <Route path="FacultyManage" element={<FacultyManagement />} />
        <Route path="students-marks" element={<AdminStudentMarks />} />
        <Route path="" element={<AdminOverview />} />
        <Route path="AttendanceReport" element={<AdminAttendanceDashboard />} />
      </Route>

      <Route path="/teacherlogin" element={<TeacherLogin />} />
      <Route
        path="/teacherdash"
        element={
          <PrivateRoute role="teacher">
            <TeacherDash />
          </PrivateRoute>
        }
      >
        <Route path="TeacherStudentManage" element={<StudentManage />} />
        <Route path="" element={<TeacherOverview />} />
        <Route path="subject-marks" element={<SubjectMarks />} />
        <Route
          path="attendance-report"
          element={<TeacherAttendanceDashboard />}
        />
        <Route path="notifications" element={<TeacherNotifications />} />
        <Route path="syllabus" element={<TeacherSyllabusView />} />
        <Route path="feedback" element={<TeacherFeedback />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>

      <Route path="/studentdash" element={<StudentDash />}>
        <Route path="" element={<StudentOverview />} />
        <Route
          path="attendance-reports"
          element={<StudentAttendanceDashboard />}
        />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="syllabus" element={<StudentSyllabus />} />
        <Route path="feedback" element={<StudentFeedback />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="results" element={<StudentResults />} />
      </Route>
    </Routes>
  );
}

export default App;
