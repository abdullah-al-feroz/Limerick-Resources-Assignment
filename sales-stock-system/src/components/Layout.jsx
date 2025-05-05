"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaHome, FaBox, FaShoppingCart, FaChartBar, FaSignOutAlt, FaBars, FaSearch, FaUser } from "react-icons/fa"

const Layout = ({ children, logout }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const user = JSON.parse(localStorage.getItem("user") || '{"username":"User"}')

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "d-block" : "d-none"} d-md-block`}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <Link to="/dashboard" className="text-decoration-none text-white fs-4 fw-bold">
            Stock System
          </Link>
          <button className="btn btn-link text-white d-md-none p-0" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>

        <div className="p-3">
          <div className="position-relative mb-3">
            <input type="text" className="form-control" placeholder="Search..." />
            <FaSearch className="position-absolute top-50 translate-middle-y" style={{ left: "10px" }} />
          </div>
        </div>

        <div className="nav flex-column">
          <div className="sidebar-heading">Main Navigation</div>
          <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <FaHome /> Dashboard
          </Link>
          <Link to="/products" className={`nav-link ${location.pathname.startsWith("/products") ? "active" : ""}`}>
            <FaBox /> Products
          </Link>
          <Link to="/sales" className={`nav-link ${location.pathname.startsWith("/sales") ? "active" : ""}`}>
            <FaShoppingCart /> Sales
          </Link>

          <div className="sidebar-heading mt-3">Reports</div>
          <Link to="/reports/stock" className={`nav-link ${location.pathname === "/reports/stock" ? "active" : ""}`}>
            <FaChartBar /> Stock Report
          </Link>
          <Link
            to="/reports/date-wise"
            className={`nav-link ${location.pathname === "/reports/date-wise" ? "active" : ""}`}
          >
            <FaChartBar /> Date-wise Report
          </Link>
        </div>

        <div className="mt-auto p-3 border-top">
          <div className="d-flex align-items-center">
            <div className="avatar me-2">{user.username.charAt(0).toUpperCase()}</div>
            <div>
              <div className="fw-bold">{user.username}</div>
              <div className="small text-muted">{user.role || "User"}</div>
            </div>
            <button className="btn btn-link text-white ms-auto p-0" onClick={logout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <button className="btn btn-outline-secondary d-md-none me-2" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <div className="navbar-brand">
              {location.pathname === "/dashboard" && "Dashboard"}
              {location.pathname === "/products" && "Products"}
              {location.pathname === "/products/new" && "Add New Product"}
              {location.pathname === "/sales" && "Sales"}
              {location.pathname === "/sales/new" && "New Sale"}
              {location.pathname === "/reports/stock" && "Current Stock Report"}
              {location.pathname === "/reports/date-wise" && "Date-wise Stock Report"}
            </div>
            <div className="ms-auto d-flex align-items-center">
              <div className="dropdown">
                <button
                  className="btn btn-link text-dark p-0"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div className="container-fluid py-4">{children}</div>
      </div>
    </div>
  )
}

export default Layout
