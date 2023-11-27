import React from 'react'

function Sidebar() {
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-orange elevation-4">

        {/* Brand Logo */}
        <a href="" className="brand-link" style={{ textDecoration: 'none' }}>
          <img src="../src/assets/icon/logo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">ShowHuay</span>
        </a>

        {/* Sidebar */}
        <div className="sidebar">

          {/* SidebarSearch Form */}
          <div className="form-inline mt-3 mb-3 d-flex">
            <div className="input-group" data-widget="sidebar-search">
              <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Menu */}
          <div className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item menu-open">
                <a href="#" className="nav-link active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>
                    Dashboard
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="/Admin" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Dashboard v1</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/Admin" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Dashboard v2</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/Admin" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Dashboard v3</p>
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <a href="/Orders" className="nav-link">
                  <i className="nav-icon fas fa-shopping-cart" />
                  <p>
                    Orders
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <a href="/Users" className="nav-link">
                  <i className="nav-icon fas fa-users" />
                  <p>
                    Users
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <a href="/Products" className="nav-link">
                  <i className="nav-icon fas fa-store" />
                  <p>
                    Products
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <a href="/Coupons" className="nav-link">
                  <i className="nav-icon fas fa-tag" />
                  <p>
                    Coupons
                  </p>
                </a>
              </li>
            </ul>
          </div>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>

    </div>
  )
}

export default Sidebar;
