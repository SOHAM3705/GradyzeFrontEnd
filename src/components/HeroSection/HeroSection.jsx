// src/HeroSection.jsx
import React from "react";
import backgroundImage from "./background.jpg";

const HeroSection = () => {
  const scrollToLogin = () => {
    document.getElementById("login").scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative h-[100vh] flex items-center justify-center text-center text-white mb-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 py-10 bg-black/50 rounded-lg shadow-md animate-slideIn">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 animate-fadeIn">
          Ready to Revolutionize Marks Management?
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 animate-fadeIn delay-200">
          Gradyze offers a comprehensive platform designed to streamline and
          digitize the process of managing academic marks for schools and
          colleges. Facilitate seamless coordination among Admin, Teacher, and
          Student roles.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={scrollToLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition transform hover:scale-105"
          >
            Get Started
          </button>
          <button
            onClick={scrollToFeatures}
            className="border border-white hover:bg-white/10 text-white font-bold py-3 px-6 rounded transition transform hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
