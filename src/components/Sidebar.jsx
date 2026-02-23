import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const mainMenuItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/upload", label: "Upload Resume", icon: "📄" },
    { to: "/reports", label: "Reports", icon: "📋" },
  ];

  const userMenuItems = email
    ? [
        { to: "/profile", label: "Profile", icon: "👤" },
        { to: "/settings", label: "Settings", icon: "⚙️" },
      ]
    : [];

  const authMenuItem = !email
    ? [{ to: "/", label: "Login / Register", icon: "🔐" }]
    : [];

  const allMenuItems = [...mainMenuItems, ...userMenuItems, ...authMenuItem];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm"
      style={{ width: 260, minHeight: "100vh" }}
    >
      {/* Logo */}
      <div
        className="d-flex align-items-center mb-4 text-decoration-none"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        <span className="fs-4 me-2">✨</span>
        <div>
          <div className="fw-bold">AI Resume</div>
          <small className="text-muted">Analyzer</small>
        </div>
      </div>

      <hr />

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
        {allMenuItems.map((item) => (
          <li className="nav-item mb-1" key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${
                  isActive ? "active" : "text-dark"
                }`
              }
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr />

      {/* Footer */}
      <div className="text-center mt-auto">
        <small className="text-muted d-block">
          AI-powered insights
        </small>
        <small className="text-muted">
          Get hired faster
        </small>
      </div>
    </div>
  );
}