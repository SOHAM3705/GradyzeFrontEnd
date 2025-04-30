// src/SubscriptionPlan.jsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import "./SubscriptionPlan.css";

const SubscriptionPlan = () => {
  const plans = [
    {
      title: "BASIC",
      price: "₹0",
      features: [
        "Faculty Management",
        "Student Management",
        "Notification",
        "Feedback",
        "Student Mark",
        "Free Access Only for 7 Days",
      ],
      highlight: false,
    },
    {
      title: "PROFESSIONAL",
      price: "₹8999",
      features: [
        "Student Analysis",
        "Faculty Analysis",
        "Class Analysis",
        "Student Attendance",
        "Auto-Grading",
        "Smart Analytics",
        "Admin Dashboard",
        "Custom Reports",
        "Cloud Storage",
        "24/7 Support",
      ],
      highlight: true, // Highlighting this plan
    },
    {
      title: "ORGANIZATION",
      price: "₹5999",
      features: [
        "Faculty Management",
        "Student Management",
        "Report Export",
        "Student Dashboard",
        "Teacher Dashboard",
        "Departmental Reports",
        "Multi-User Access",
        "Role-Based Permissions",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="subscription-plan" id="pricingsection">
      {/* Header Section */}
      <div className="header">
        <h1 className="header-title">Choose Your Plan</h1>
        <p className="header-description">
          Whether you want to get organized, keep your personal life on track,
          or boost workplace productivity, Evernote has the right plan for you.
        </p>
      </div>

      {/* Pricing Plans Container */}
      <div className="pricing-container">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`plan-card ${plan.highlight ? "highlight" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="plan-badge">{plan.title}</div>
            <h2 className="plan-name">{plan.title}</h2>
            <div className="plan-price">{plan.price}</div>
            <p className="plan-description">
              Great features for managing your workflow.
            </p>
            <ul className="features">
              {plan.features.map((feature, i) => (
                <li key={i} className="feature">
                  <FaCheckCircle className="feature-icon" /> {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
