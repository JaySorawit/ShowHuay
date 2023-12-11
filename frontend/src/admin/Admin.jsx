/********************************************************************
 *   Admin.jsx                                                      *
 *                                                                  *
 *   React component representing the admin dashboard. It           *
 *   includes various tools and sections for managing and           *
 *   overseeing different aspects of the application.               *
 *                                                                  *
 ********************************************************************/

import React from "react";
import "admin-lte/dist/css/adminlte.css";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css";
import "admin-lte/dist/js/adminlte.min.js";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";

function Admin() {
  return (
    <div>
      <Header />
      <Sidebar />
      <Content />
    </div>
  );
}

export default Admin;
