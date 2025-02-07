import React, { useState } from "react";
import styles from "./Documentation.module.css"; // Import scoped CSS
import { Link } from "react-router-dom";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("endUser");

  const sections = [
    { id: "endUser", label: "End User Documentation" },
    { id: "technical", label: "Technical Documentation" },
    { id: "terms", label: "Terms of Service" },
  ];

  const handleNavClick = (event) => {
    const section = event.currentTarget.getAttribute("data-section");
    if (sections.some((s) => s.id === section)) {
      setActiveSection(section);
    }
  };

  return (
    <div className={styles.docsContainer}>
      {/* Back Button */}
      <Link to="/" className={styles.backButton}>
        <i className="fas fa-arrow-left"></i> Back
      </Link>

      {/* Navigation Bar */}
      <div className={styles.docsNavbar}>
        {sections.map((section) => (
          <button
            key={section.id}
            data-section={section.id}
            onClick={handleNavClick}
            className={`${styles.docsNavbarButton} ${
              activeSection === section.id ? styles.docsNavActive : ""
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Documentation Content */}
      <div className={styles.docsContent}>
        {activeSection === "endUser" && (
          <div className={styles.docsSection}>
            <h1 className={styles.docsTitle}>Gradyze End User Documentation</h1>
            <h2 className={styles.docsSubtitle}>1. Introduction</h2>
            <p className={styles.docsText}>
              Welcome to Gradyze, a web-based Marks Management System designed
              for educational institutions and students. This guide will help
              you navigate and use Gradyze effectively by explaining its
              features, functionalities, and best practices.
            </p>

            <h2>2. User Roles</h2>
            <h5>Gradyze supports three main user roles:</h5>
            <ul>
              <li>
                <strong>Admin:</strong> Manages users, settings, academic
                configurations, and system security.
              </li>
              <li>
                <strong>Teacher:</strong> Enters and updates student marks,
                generates reports, and monitors class performance.
              </li>
              <li>
                <strong>Student:</strong> Views marks, academic performance,
                feedback, and generated reports.
              </li>
            </ul>
            <p>
              Each role has specific permissions that ensure a smooth and
              structured workflow within the system.
            </p>
            <h2>3. Getting Started</h2>
            <h3>3.1 Creating an Account</h3>
            <ol>
              <li>Go to [Gradyze Sign-Up Page].</li>
              <li>Select your user role (Admin, Teacher, or Student).</li>
              <li>
                Enter the required details such as Name, Email, and Institution.
              </li>
              <li>
                Set a secure password and complete the verification process.
              </li>
              <li>
                Click <strong>Create Account</strong> to finalize registration.
              </li>
            </ol>
            <h3>3.2 Logging In</h3>
            <ol>
              <li>Go to [Gradyze Login Page].</li>
              <li>Enter your registered email and password.</li>
              <li>
                Click <strong>Login</strong>.
              </li>
              <li>
                If you are a new user, click <strong>Sign Up</strong> and follow
                the registration process.
              </li>
              <li>
                If you forget your password, click{" "}
                <strong>Forgot Password</strong> to reset it.
              </li>
            </ol>
            <h3>3.3 Dashboard Overview</h3>
            <ul>
              <li>
                <strong>Admins</strong> will see system statistics, user
                management options, and institution-wide reports.
              </li>
              <li>
                <strong>Teachers</strong> will see student lists, grading
                options, course management, and performance analytics.
              </li>
              <li>
                <strong>Students</strong> will see their marks, performance
                trends, notifications, and feedback from teachers.
              </li>
            </ul>
            <h2>4. Features & How to Use</h2>
            <h3>4.1 Adding Marks (For Teachers)</h3>
            <ol>
              <li>
                Navigate to <strong>Marks Entry</strong>.
              </li>
              <li>Select the class, subject, or individual student.</li>
              <li>Enter marks and add any additional comments or feedback.</li>
              <li>Save changes to update the student record.</li>
            </ol>
            <h3>4.2 Viewing Marks (For Students)</h3>
            <ol>
              <li>
                Click on <strong>My Marks</strong> in the dashboard.
              </li>
              <li>Select the subject, term, or exam.</li>
              <li>
                View detailed performance reports, feedback from teachers, and
                overall grade progress.
              </li>
            </ol>
            <h3>4.3 Generating Reports (For Teachers & Admins)</h3>
            <ol>
              <li>
                Go to <strong>Reports</strong>.
              </li>
              <li>Select the class, subject, or specific student.</li>
              <li>Choose a format (PDF, Excel) and export the report.</li>
              <li>
                Share reports with students or parents via email or download
                them for record-keeping.
              </li>
            </ol>
            <h3>4.4 Managing Users (For Admins)</h3>
            <ol>
              <li>
                Navigate to <strong>User Management</strong>.
              </li>
              <li>
                Add, edit, or remove students and teachers from the system.
              </li>
              <li>Assign roles and permissions as necessary.</li>
              <li>
                Monitor system activity and generate reports on platform usage.
              </li>
            </ol>
            <h3>4.5 Notifications & Alerts</h3>
            <ul>
              <li>
                Gradyze provides real-time notifications for grade updates,
                assignment submissions, and system alerts.
              </li>
              <li>
                Students receive notifications when their marks are updated.
              </li>
              <li>Teachers receive alerts for pending grading tasks.</li>
              <li>Admins can send system-wide announcements.</li>
            </ul>
            <h2>5. Security & Data Privacy</h2>
            <ul>
              <li>
                All data is encrypted using industry-leading security standards.
              </li>
              <li>
                Two-factor authentication (2FA) is available for additional
                security.
              </li>
              <li>Users can request account deletion or data download.</li>
              <li>
                Role-based access ensures only authorized personnel can view or
                modify specific data.
              </li>
            </ul>
            <h2>6. Frequently Asked Questions (FAQs)</h2>
            <p>
              <strong>Q: How can I reset my password?</strong>
            </p>
            <p>
              A: Click on <strong>Forgot Password</strong> on the login page,
              enter your email, and follow the instructions to reset your
              password.
            </p>
            <p>
              <strong>Q: Can I edit marks after submitting them?</strong>
            </p>
            <p>
              A: Yes, teachers and admins can edit marks from the{" "}
              <strong>Marks Entry</strong> section before finalizing reports.
            </p>
            <p>
              <strong>Q: How do I contact support?</strong>
            </p>
            <p>
              A: You can reach support via the <strong>Help & Support</strong>{" "}
              section within the platform or email [Insert Contact Email].
            </p>
            <p>
              <strong>
                Q: Can students request a re-evaluation of their marks?
              </strong>
            </p>
            <p>
              A: Yes, students can submit a request for mark verification
              through the <strong>Re-evaluation</strong> section, subject to
              teacher/admin approval.
            </p>
            <h2>7. Support & Troubleshooting</h2>
            <ul>
              <li>For any technical issues, feature requests, or queries:</li>
              <li>
                Visit the <strong>Help Center</strong> on our platform.
              </li>
              <li>Contact our support team via [Insert Contact Email].</li>
              <li>
                Check the <strong>Community Forum</strong> for discussions and
                solutions from other users.
              </li>
              <li>
                Use our <strong>Live Chat</strong> option for instant assistance
                during working hours.
              </li>
            </ul>
            <h2>8. Best Practices for Using Gradyze</h2>
            <ul>
              <li>
                Keep your login credentials secure and enable two-factor
                authentication.
              </li>
              <li>
                Regularly check your dashboard for updates and notifications.
              </li>
              <li>
                For teachers: Provide detailed feedback to students to enhance
                learning.
              </li>
              <li>
                For students: Review your reports frequently and seek help when
                needed.
              </li>
              <li>
                For admins: Monitor system usage and ensure data integrity.
              </li>
            </ul>
            <h2>9. Future Enhancements</h2>
            <p>
              We are continuously working to improve Gradyze. Upcoming features
              include:
            </p>
            <ul>
              <li>AI-based performance analysis for students.</li>
              <li>
                Integration with third-party learning management systems (LMS).
              </li>
              <li>Mobile app version for easier access on the go.</li>
            </ul>
            <h2>10. Contact Us</h2>
            <p>
              For any feedback, queries, or support requests, reach out to us at
              [Insert Contact Email].
            </p>
            <p>
              This guide ensures you have all the necessary information to use
              Gradyze efficiently. Happy Learning!
            </p>
          </div>
        )}

        {activeSection === "technical" && (
          <div className={styles.docsSection}>
            <h1 className={styles.docsTitle}>
              Gradyze Technical Documentation
            </h1>
            <h2 className={styles.docsSubtitle}>1. Introduction</h2>
            <p className={styles.docsText}>
              Gradyze is a web-based Marks Management System designed for
              academic institutions and students. This document provides
              technical insights into the platform’s architecture, database
              design, APIs, and security mechanisms.
            </p>
            <h2>2. System Architecture</h2>
            <p>
              Gradyze follows a <strong>three-tier architecture</strong>:
              <ul>
                <li>
                  <strong>Frontend:</strong> Built using React.js for a seamless
                  user experience.
                </li>
                <li>
                  <strong>Backend:</strong> Powered by Node.js with Express.js
                  for API development.
                </li>
                <li>
                  <strong>Database:</strong> Uses MongoDB for structured data
                  storage.
                </li>
              </ul>
            </p>
            <h2>3. Tech Stack</h2>
            <ul>
              <li>
                <strong>Frontend:</strong> React.js, Tailwind CSS, Redux (for
                state management)
              </li>
              <li>
                <strong>Backend:</strong> Node.js, Express.js
              </li>
              <li>
                <strong>Database:</strong> MongoDB (NoSQL database for flexible
                and scalable data management)
              </li>
              <li>
                <strong>Authentication:</strong> JWT-based authentication for
                security
              </li>
              <li>
                <strong>Hosting & Deployment:</strong> AWS EC2 (Backend), Vercel
                (Frontend), MongoDB Atlas (Database)
              </li>
            </ul>
            <h2>4. Database Schema</h2>
            <p>Key collections and their attributes:</p>
            <ul>
              <li>
                <strong>Users Collection:</strong> (id, name, email,
                password_hash, role)
              </li>
              <li>
                <strong>Students Collection:</strong> (id, user_id, institution,
                class, section)
              </li>
              <li>
                <strong>Teachers Collection:</strong>(id, user_id,
                subjects_taught)
              </li>
              <li>
                <strong>Marks Collection:</strong>(id, student_id, subject,
                marks, grade, created_at)
              </li>
              <li>
                <strong>Reports Collection:</strong>(id, student_id,
                report_type, generated_date, file_link)
              </li>
            </ul>
            <h2>5. API Documentation</h2>
            <h3>5.1 Authentication APIs</h3>
            <ul>
              <li>
                <strong>POST /api/auth/register</strong> - Register a new user
              </li>
              <li>
                <strong>POST /api/auth/login</strong> - Authenticate and get JWT
                token
              </li>
              <li>
                <strong>POST /api/auth/logout</strong> - Logout user and
                invalidate token
              </li>
            </ul>
            <h3>5.2 Student APIs</h3>
            <ul>
              <li>
                <strong>GET /api/students/</strong> - Retrieve student details
              </li>
              <li>
                <strong>POST /api/students/</strong> - Add a new student
              </li>
              <li>
                <strong>PUT /api/students/</strong> - Update student details
              </li>
              <li>
                <strong>DELETE /api/students/</strong> - Remove student record
              </li>
            </ul>
            <h3>5.3 Marks APIs</h3>
            <ul>
              <li>
                <strong>GET /api/marks/</strong> - Get marks for a student
              </li>
              <li>
                <strong>POST /api/marks/</strong> - Add marks for a student
              </li>
              <li>
                <strong>PUT /api/marks/</strong> - Update marks
              </li>
              <li>
                <strong>DELETE /api/marks/</strong> - Delete marks entry
              </li>
            </ul>
            <h3>5.4 Reports APIs</h3>
            <ul>
              <li>
                <strong>GET /api/reports/</strong> - Get student reports
              </li>
              <li>
                <strong>POST /api/reports/</strong> - Generate new report
              </li>
            </ul>
            <h2>6. Security Measures</h2>
            <ul>
              <li>
                <strong>Encryption:</strong> All sensitive data is encrypted
                before storage.
              </li>
              <li>
                <strong>Authentication:</strong> JWT tokens with refresh
                mechanisms.
              </li>
              <li>
                <strong>Role-Based Access Control (RBAC):</strong> Ensures
                correct data access for students, teachers, and admins.
              </li>
              <li>
                <strong>Data Backup:</strong> Automated backups using MongoDB
                Atlas backup solutions.
              </li>
            </ul>
            <h2>7. Deployment Strategy</h2>
            <ul>
              <li>
                <strong>CI/CD:</strong> GitHub Actions for automated testing and
                deployment.
              </li>
              <li>
                <strong>Monitoring:</strong> AWS CloudWatch and PM2 for process
                management.
              </li>
              <li>
                <strong>Scaling:</strong> Load balancing using AWS ELB to manage
                traffic spikes.
              </li>
            </ul>
            <h2>8. Future Enhancements</h2>
            <ul>
              <li>Implement AI-driven performance analytics for students.</li>
              <li>Introduce GraphQL for optimized API performance.</li>
              <li>
                Enhance real-time collaboration features for teachers and
                students using WebSockets.
              </li>
            </ul>
            <p>
              This document serves as a foundation for developers working on
              Gradyze. For any queries, contact support@gradyze.com.
            </p>
          </div>
        )}

        {activeSection === "terms" && (
          <div className={styles.docsSection}>
            <h1 className={styles.docsTitle}>Gradyze Terms of Service</h1>
            <p className={styles.docsText}>
              <strong className={styles.docsStrong}>Last Updated:</strong> 1 Jan
              2025
            </p>
            <h2 className={styles.docsSubtitle}>1. Introduction</h2>
            <p className={styles.docsText}>
              Welcome to Gradyze, a web-based Marks Management System. By using
              Gradyze, you agree to these Terms of Service. Please read them
              carefully.
            </p>
            <h2>2. User Accounts</h2>
            <ul>
              <li>
                Users must provide accurate information during registration.
              </li>
              <li>
                Account credentials should be kept secure and confidential.
              </li>
              <li>
                Gradyze reserves the right to suspend or terminate accounts
                violating these terms.
              </li>
            </ul>
            <h2>3. Acceptable Use</h2>
            <ul>
              <li>
                Users may not engage in unauthorized data access, hacking, or
                activities that disrupt the system.
              </li>
              <li>
                Content uploaded or entered into Gradyze must comply with legal
                and ethical standards.
              </li>
              <li>
                Misuse of Gradyze for fraudulent or malicious activities is
                strictly prohibited.
              </li>
            </ul>
            <h2>4. Data Privacy & Security</h2>
            <ul>
              <li>
                Gradyze collects and stores user data as described in our
                Privacy Policy.
              </li>
              <li>
                Users have control over their data, including options to modify
                or delete their accounts.
              </li>
              <li>
                Security measures such as encryption and role-based access
                control are in place to protect user data.
              </li>
            </ul>
            <h2>5. Service Availability & Modifications</h2>
            <ul>
              <li>
                Gradyze strives to maintain high uptime but does not guarantee
                uninterrupted access.
              </li>
              <li>
                We may update, modify, or discontinue features at any time, with
                or without prior notice.
              </li>
            </ul>
            <h2>6. Limitation of Liability</h2>
            <ul>
              <li>
                Gradyze is provided "as is" without warranties of any kind.
              </li>
              <li>
                We are not responsible for data loss, service interruptions, or
                damages arising from system use.
              </li>
            </ul>
            <h2>7. Termination of Services</h2>
            <ul>
              <li>
                Users may terminate their account at any time by requesting
                deletion.
              </li>
              <li>
                Gradyze may suspend access for users violating these terms or
                engaging in prohibited activities.
              </li>
            </ul>
            <h2>8. Governing Law</h2>
            <ul>
              <li>These Terms of Service are governed by the laws.</li>
              <li>
                Any disputes must be resolved through arbitration or the courts.
              </li>
            </ul>
            <h2>9. Contact Information</h2>
            <p>
              For any questions regarding these Terms, contact us at
              support@gradyze.com.
            </p>
            <p>
              By using Gradyze, you acknowledge that you have read, understood,
              and agree to these Terms of Service.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentation;
