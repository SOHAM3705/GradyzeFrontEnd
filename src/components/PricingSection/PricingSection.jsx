// src/SubscriptionPlan.jsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const SubscriptionPlan = () => {
  return (
    <div
      className="min-h-screen bg-blue-50 flex flex-col items-center p-8"
      id="pricingsection"
    >
      {/* Header Section */}
      <div className="header text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
          Choose Your Plan
          <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 z-[-1] opacity-50"></span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Whether you want to get organized, keep your personal life on track,
          or boost workplace productivity, Evernote has the right plan for you.
        </p>
      </div>

      {/* Pricing Plans Container */}
      <div className="pricing-container flex flex-wrap justify-center gap-10 max-w-5xl mx-auto">
        {/* Plan Component */}
        {[
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
        ].map((plan, index) => (
          <div
            key={index}
            className={`rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:translate-y-[-0.5rem] hover:shadow-xl w-full sm:w-72 flex flex-col justify-between
              ${
                plan.highlight
                  ? "bg-blue-900 text-white border-4 border-yellow-300 scale-105"
                  : "bg-white text-gray-900"
              }
            `}
          >
            <div>
              <div
                className={`plan-badge py-1 px-3 rounded-full mb-4 text-sm font-semibold ${
                  plan.highlight
                    ? "bg-yellow-300 text-gray-900"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {plan.title}
              </div>
              <h2 className="plan-name text-2xl font-semibold mb-2">
                {plan.title}
              </h2>
              <div className="plan-price text-4xl font-bold mb-4">
                {plan.price}
              </div>
              <p className="plan-description text-gray-600 mb-4">
                Great features for managing your workflow.
              </p>
              <ul className="features space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="feature flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
