// src/FeaturesSection.jsx
import React from "react";
import "./FeaturesSection.css";

const FeaturesSection = () => {
  return (
    <div id="features" className="features-section">
      <div className="section-header">
        <h2>Key Features</h2>
        <p>Advanced tools for comprehensive student evaluation and support</p>
      </div>
      <div className="features-grid">
        {/* Centralized Performance Data */}
        <div className="feature-card">
          <div className="featuresection-icon">
            <i className="fas fa-database"></i>
          </div>
          <h3>Centralized Performance Data</h3>
          <p>
            Unified platform that consolidates student performance metrics,
            assessments, and progress tracking in one accessible location.
          </p>
        </div>

        {/* Learning Challenge Detection */}
        <div className="feature-card">
          <div className="featuresection-icon">
            <i className="fas fa-search-plus"></i>
          </div>
          <h3>Learning Challenge Detection</h3>
          <p>
            Advanced analytics to identify learning gaps and challenges early,
            enabling timely intervention and support strategies.
          </p>
        </div>

        {/* Data-Driven Academic Support */}
        <div className="feature-card">
          <div className="featuresection-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <h3>Data-Driven Academic Support</h3>
          <p>
            Personalized learning recommendations and support plans based on
            comprehensive performance analysis.
          </p>
        </div>

        {/* Administrative Efficiency */}
        <div className="feature-card">
          <div className="featuresection-icon">
            <i className="fas fa-cogs"></i>
          </div>
          <h3>Administrative Efficiency</h3>
          <p>
            Streamlined administrative processes for managing student records,
            generating reports, and tracking institutional metrics.
          </p>
        </div>

        {/* Enhanced Communication */}
        <div className="feature-card">
          <div className="featuresection-icon">
            <i className="fas fa-comments"></i>
          </div>
          <h3>Enhanced Communication</h3>
          <p>
            Integrated communication tools facilitating seamless interaction
            between students, teachers, and administrators.
          </p>
        </div>

        {/* Reliability */}
        <div className="feature-card">
          <div className="featuresection-icon">
            <i className="fas fa-thumbs-up"></i>
          </div>
          <h3>Reliability</h3>
          <p>
            Gradyze ensures reliable, accurate, and transparent evaluations,
            empowering teachers, students, and administrators effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
