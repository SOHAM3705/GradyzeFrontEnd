// src/PrivacyPolicy.jsx
import React from "react";
import "./PPSection.css"; // Import the CSS file
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <Link to="/" className="back-button">
        <i className="fas fa-arrow-left"></i>
      </Link>
      <h1>Privacy Policy for Gradyze</h1>
      <p>
        <strong>Last Updated:</strong> [Insert Date]
      </p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to Gradyze, a web-based Marks Management System designed to
        provide a secure, transparent, and efficient academic experience for
        institutions and students. Your privacy is of utmost importance to us,
        and we are committed to ensuring your data is protected through the
        highest industry standards. This Privacy Policy explains how we collect,
        use, and safeguard your personal data.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We collect the following types of information to enhance our services:
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, Email, Institution
            Details, Contact Information
          </li>
          <li>
            <strong>Academic Data:</strong> Student Marks, Course Information,
            Attendance Records, Performance Trends
          </li>
          <li>
            <strong>Device Information:</strong> IP Address, Browser Type, OS,
            Device Identifiers
          </li>
          <li>
            <strong>Usage Data:</strong> Login history, Interaction with
            platform features, Time spent on pages
          </li>
          <li>
            <strong>Support Data:</strong> Queries, Support Tickets, Feedback
            provided through the platform
          </li>
        </ul>
      </p>

      <h2>3. How We Use Your Data</h2>
      <p>
        We use the collected data responsibly to:
        <ul>
          <li>Provide seamless academic record management</li>
          <li>Generate detailed reports and performance insights</li>
          <li>Ensure security, fraud prevention, and compliance</li>
          <li>
            Communicate updates, important notifications, and user support
          </li>
          <li>Improve platform usability through analytics and feedback</li>
          <li>
            Enhance personalized user experience through AI-driven insights (if
            applicable in the future)
          </li>
        </ul>
      </p>

      <h2>4. Data Security Measures</h2>
      <p>
        We implement state-of-the-art encryption, multi-layered authentication,
        and cloud-based security protocols to protect your data from
        unauthorized access. Our platform undergoes regular security audits,
        penetration testing, and compliance checks to ensure maximum safety.
      </p>

      <h2>5. Data Sharing & Third-Party Involvement</h2>
      <p>
        We maintain transparency regarding data sharing. Data may be shared
        with:
        <ul>
          <li>
            <strong>Third-Party Services:</strong> Trusted payment processors,
            analytics providers, and security services to optimize functionality
          </li>
          <li>
            <strong>Legal Authorities:</strong> If required by law to comply
            with legal obligations or protect user rights
          </li>
          <li>
            <strong>Educational Institutions:</strong> In case of authorized
            academic collaborations or integrations
          </li>
        </ul>
        We strictly <strong>do not sell user data</strong> to advertisers or
        external entities.
      </p>

      <h2>6. User Rights & Controls</h2>
      <p>
        We empower users with full control over their data. You have the right
        to:
        <ul>
          <li>
            <strong>Access Your Data:</strong> Request a detailed record of
            stored information
          </li>
          <li>
            <strong>Modify Your Data:</strong> Update incorrect or outdated
            details anytime
          </li>
          <li>
            <strong>Delete Your Account:</strong> Request complete removal of
            your data with no residual retention
          </li>
          <li>
            <strong>Download Data:</strong> Retrieve academic records in a
            structured, portable format
          </li>
          <li>
            <strong>Manage Preferences:</strong> Customize notification settings
            and data-sharing preferences
          </li>
        </ul>
      </p>

      <h2>7. Cookies & Tracking Technologies</h2>
      <p>
        Gradyze uses cookies and advanced tracking technologies to enhance user
        experience, analyze traffic, and improve services. Users can manage
        cookie preferences through their browser settings to maintain full
        control over their data.
      </p>

      <h2>8. Compliance & Legal Adherence</h2>
      <p>
        Gradyze fully complies with international data protection regulations
        such as GDPR, CCPA, and other relevant laws. Our commitment to privacy
        ensures full transparency and ethical handling of user data.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions, requests, or concerns regarding your privacy,
        feel free to contact us at: [Insert Contact Email]
      </p>

      <h2>10. Policy Updates & Notifications</h2>
      <p>
        We continuously improve our policies to reflect technological
        advancements and legal updates. Users will be notified of significant
        changes via email, platform alerts, or website announcements.
      </p>

      <p>
        By using Gradyze, you agree to the terms outlined in this Privacy
        Policy, ensuring a secure and streamlined academic experience.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
