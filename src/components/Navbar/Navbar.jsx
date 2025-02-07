// src/Navbar.jsx
import React from "react";
import "./Navbar.css";
import Navlogo from "./NavLogo.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar" id="home">
      <div className="nav-container">
        <div className="logo">
          <img src={Navlogo}></img>
        </div>
        <div className="nav-links">
          <a href="#pricingsection">Pricing</a>
          <a href="#features">Features</a>
          <Link to="/aboutus">About</Link>
          <Link to="/contactus">Contact</Link>
          <a href="#login" className="login-btn">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
