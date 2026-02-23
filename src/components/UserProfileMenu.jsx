import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfileMenu() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  if (!email) return null;

  const getInitials = (email) => {
    const name = email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (email) => {
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="dropdown" ref={menuRef}>
      <button
        className="btn d-flex align-items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, fontSize: 14 }}
        >
          {getInitials(email)}
        </div>
        <span className="fw-semibold d-none d-md-inline">
          {getDisplayName(email)}
        </span>
      </button>

      {isOpen && (
        <div
          className="dropdown-menu dropdown-menu-end show shadow-sm p-2"
          style={{ minWidth: 240 }}
        >
          <div className="px-3 py-2 border-bottom mb-2">
            <div className="fw-semibold">{getDisplayName(email)}</div>
            <small className="text-muted">{email}</small>
          </div>

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigate("/profile");
            }}
          >
            👤 Profile
          </button>

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigate("/settings");
            }}
          >
            ⚙️ Settings
          </button>

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigate("/reports");
            }}
          >
            📋 Resume History
          </button>

          <div className="dropdown-divider"></div>

          <button
            className="dropdown-item"
            onClick={() => window.open("https://github.com", "_blank")}
          >
            ℹ️ About
          </button>

          <button
            className="dropdown-item"
            onClick={() =>
              window.open("mailto:support@airesumeanalyzer.com", "_blank")
            }
          >
            ❓ Help / Support
          </button>

          <div className="dropdown-divider"></div>

          <button
            className="dropdown-item text-danger"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}