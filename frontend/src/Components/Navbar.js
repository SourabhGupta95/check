import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close dropdown on clicking an item
  const closeDropdown = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        
        {/* Logo and Brand Name */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo.png" alt="Logo" width="80" height="60" className="me-2" />
          Smart Water Monitoring
        </Link>

        {/* Navbar Toggler for Mobile View */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="d-flex gap-2">
            <Link className="btn btn-light" to="/">Home</Link>
            <Link className="btn btn-light" to="/about">About Us</Link>
            <Link className="btn btn-light" to="/contact">Contact Us</Link>

            {/* Dropdown for Login / Register */}
            <div className="dropdown">
              <button 
                className="btn btn-light dropdown-toggle" 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
              >
                Login / Register
              </button>
              <ul className={`dropdown-menu ${isOpen ? "show" : ""}`} >
                <li><Link className="dropdown-item" to="/login" onClick={closeDropdown}>Login</Link></li>
                <li><Link className="dropdown-item" to="/register" onClick={closeDropdown}>Register</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
