// src/Navbar.jsx
import React, { useState } from "react";
import "./Navbar.css";
import Navlogo from "./NavLogo.jpg";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar" id="home">
      <div className="nav-container">
        <div className="logo">
          <img src={Navlogo} alt="Logo" />
        </div>
        {isMobile ? (
          <div className="mobile-menu">
            <button onClick={toggleMenu}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        ) : (
          <div className="nav-links">
            <a href="#pricingsection">Pricing</a>
            <a href="#features">Features</a>
            <Link to="/aboutus">About</Link>
            <Link to="/contactus">Contact</Link>
            <a href="#login" className="login-btn">
              Login
            </a>
          </div>
        )}
      </div>
      {isMobile && isOpen && (
        <div className="mobile-links">
          <a href="#pricingsection" onClick={toggleMenu}>
            Pricing
          </a>
          <a href="#features" onClick={toggleMenu}>
            Features
          </a>
          <Link to="/aboutus" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/contactus" onClick={toggleMenu}>
            Contact
          </Link>
          <a href="#login" className="login-btn" onClick={toggleMenu}>
            Login
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
