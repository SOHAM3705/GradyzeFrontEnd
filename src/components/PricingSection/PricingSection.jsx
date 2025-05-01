import React from "react";
import { FaCheckCircle, FaStar, FaTrophy, FaBuilding } from "react-icons/fa";
import "./SubscriptionPlan.css";
import { Link } from "react-router-dom";

const SubscriptionPlan = () => {
  const plans = [
    {
      title: "BASIC",
      icon: <FaStar />,
      price: "₹0",
      period: "free",
      features: [
        "Faculty Management",
        "Student Management",
        "Notification",
        "Feedback",
        "Student Mark",
        "Free Access Only for 7 Days",
      ],
      highlight: false,
      buttonText: "Get Started",
      color: "#3b82f6",
    },
    {
      title: "PROFESSIONAL",
      icon: <FaTrophy />,
      price: "₹8999",
      period: "per year",
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
      highlight: true,
      buttonText: "Most Popular",
      color: "#4f46e5",
      badge: "BEST VALUE",
    },
    {
      title: "ORGANIZATION",
      icon: <FaBuilding />,
      price: "₹5999",
      period: "per year",
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
      buttonText: "Get Started",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="subscription-plan" id="pricingsection">
      {/* Header Section */}
      <div className="header">
        <h1 className="header-title">Choose Your Plan</h1>
        <div className="header-underline"></div>
        <p className="header-description">
          Whether you want to get organized, keep your personal life on track,
          or boost workplace productivity, Evernote has the right plan for you.
        </p>
      </div>

      {/* Pricing Plans Container */}
      <div className="pricing-container">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`plan-card ${plan.highlight ? "highlight" : ""}`}
          >
            {plan.badge && <div className="best-value-badge">{plan.badge}</div>}
            <div
              className="plan-header"
              style={{ background: plan.highlight ? "#4f46e5" : "#f3f4f6" }}
            >
              <div className="icon-wrapper" style={{ background: plan.color }}>
                {plan.icon}
              </div>
              <h2 className="plan-name">{plan.title}</h2>
            </div>
            <div className="price-container">
              <div className="plan-price">{plan.price}</div>
              <div className="price-period">{plan.period}</div>
            </div>
            <p className="plan-description">
              Perfect for {plan.title.toLowerCase()} education management needs.
            </p>
            <ul className="features">
              {plan.features.map((feature, i) => (
                <li key={i} className="feature">
                  <FaCheckCircle
                    className="feature-icon"
                    style={{ color: plan.highlight ? "#4f46e5" : "#10b981" }}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/adminsignup">
              <button
                className={`plan-button ${
                  plan.highlight ? "highlight-button" : ""
                }`}
                style={{
                  background: plan.highlight ? "#4f46e5" : "transparent",
                }}
              >
                {plan.buttonText}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
