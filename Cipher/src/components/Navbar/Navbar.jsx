import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => (
  <nav className="navbar">
    <Link to="/" className="navbar__logo">
      CipherSQLStudio
    </Link>
    <div className="navbar__links">
      <Link to="/" className="navbar__link">
        Assignments
      </Link>
    </div>
  </nav>
);

export default Navbar;
