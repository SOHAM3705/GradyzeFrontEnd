// src/LandingPage.jsx
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection/HeroSection";
import LoginSection from "../../components/LoginSection/LoginSection";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import Footer from "../../components/Footor/Footer";
import PricingSection from "../../components/PricingSection/PricingSection";
import Testimonials from "../../components/Testimonials/Testimonials";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <LoginSection />
      <FeaturesSection />
      <PricingSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
