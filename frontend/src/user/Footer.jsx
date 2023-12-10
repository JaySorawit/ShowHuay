/********************************************************************
 *   Footer.jsx                                                     *
 *                                                                  *
 *   React component representing the footer section of the         *
 *   application. It typically includes, copyright information,     *
 *   and other relevant content.                                    *
 *                                                                  *
 ********************************************************************/

import React from "react";
import logo1 from "../assets/social-media-logo/fb-logo.png";
import logo2 from "../assets/social-media-logo/tw-logo.png";
import logo3 from "../assets/social-media-logo/ig-logo.png";
import logo4 from "../assets/social-media-logo/idk-logo.png";

const Footer = () => {
  return (
    <footer
      className="footer mt-auto"
      style={{ backgroundColor: "#D9D9D9", height: "200px" }}
    >
      <div className="container d-flex flex-column justify-content-between align-items-center h-100">
        <div style={{ marginTop: "56px" }}>
          <span style={{ fontSize: "16px" }}>
            © 2023 ShowHuay. All rights reserved
          </span>
        </div>
        <div style={{ marginTop: "34px", marginBottom: "64px" }}>
          <img
            src={logo1}
            alt="Logo 1"
            className="logo-img"
            style={{ marginRight: "27px" }}
          />
          <img
            src={logo2}
            alt="Logo 2"
            className="logo-img"
            style={{ marginRight: "27px" }}
          />
          <img
            src={logo3}
            alt="Logo 3"
            className="logo-img"
            style={{ marginRight: "27px" }}
          />
          <img src={logo4} alt="Logo 4" className="logo-img" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
