/********************************************************************
 *   Header.jsx                                                     *
 *                                                                  *
 *   React component representing the header section of the admin   *
 *   dashboard. It often includes navigation links, menus, or other *
 *   elements specific to the administration interface.             *
 *                                                                  *
 ********************************************************************/

import React from "react";
import { Link } from "react-router-dom";

function Header() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/Admin" className="nav-link">
            Home
          </a>
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        <li>
          <button
            className="btn btn-danger d-flex align-items-center me-3"
            style={{ height: "40px" }}
            onClick={handleLogout}
          >
            <Link
              className="nav-link"
              style={{ fontWeight: "500", color: "#FFFFFF" }}
              to="/"
            >
              Logout
            </Link>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Header;
