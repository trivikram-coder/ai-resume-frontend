import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const email = localStorage.getItem("email");
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  // Main navigation items (always visible)
  const mainMenuItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/upload", label: "Upload Resume", icon: "📄" },
    { to: "/reports", label: "Reports", icon: "📋" },
  ];

  // User-specific items (only when logged in)
  const userMenuItems = email
    ? [
        { to: "/profile", label: "Profile", icon: "👤" },
        { to: "/settings", label: "Settings", icon: "⚙️" },
      ]
    : [];

  // Auth item (only when not logged in)
  const authMenuItem = !email
    ? [{ to: "/", label: "Login / Register", icon: "🔐" }]
    : [];

  const allMenuItems = [...mainMenuItems, ...userMenuItems, ...authMenuItem];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">✨</div>
          <div className="logo-text">
            <div className="logo-title">AI Resume</div>
            <div className="logo-subtitle">Analyzer</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {allMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "sidebar-item--active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-content">
          <p className="sidebar-footer-text">AI-powered insights</p>
          <p className="sidebar-footer-subtext">Get hired faster</p>
        </div>
      </div>
    </aside>
  );
}

