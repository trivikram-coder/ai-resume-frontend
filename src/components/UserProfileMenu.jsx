import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfileMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const email = localStorage.getItem("email");

  // Get user initials from email
  const getInitials = (email) => {
    if (!email) return "U";
    const parts = email.split("@")[0];
    if (parts.length >= 2) {
      return parts.substring(0, 2).toUpperCase();
    }
    return parts.charAt(0).toUpperCase();
  };

  // Get display name from email
  const getDisplayName = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("email");
    setIsOpen(false);
    navigate("/");
  };

  const menuItems = [
    {
      icon: "👤",
      label: "Profile",
      action: () => {
        setIsOpen(false);
        navigate("/profile");
      },
    },
    {
      icon: "⚙️",
      label: "Settings",
      action: () => {
        setIsOpen(false);
        navigate("/settings");
      },
    },
    {
      icon: "📋",
      label: "Resume History",
      action: () => {
        setIsOpen(false);
        navigate("/reports");
      },
    },
    {
      divider: true,
    },
    {
      icon: "ℹ️",
      label: "About",
      action: () => {
        setIsOpen(false);
        // Could open a modal or navigate to about page
        window.open("https://github.com", "_blank");
      },
    },
    {
      icon: "❓",
      label: "Help / Support",
      action: () => {
        setIsOpen(false);
        // Could open support modal or navigate to help page
        window.open("mailto:support@airesumeanalyzer.com", "_blank");
      },
    },
    {
      divider: true,
    },
    {
      icon: "🚪",
      label: "Logout",
      action: handleLogout,
      danger: true,
    },
  ];

  if (!email) {
    return null; // Don't show menu if not logged in
  }

  return (
    <div className="user-profile-menu" ref={menuRef}>
      <button
        className="user-profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="user-avatar">
          <span className="user-initials">{getInitials(email)}</span>
        </div>
        <span className="user-name">{getDisplayName(email)}</span>
        <svg
          className={`user-chevron ${isOpen ? "user-chevron--open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="user-profile-dropdown">
          <div className="user-profile-header">
            <div className="user-profile-avatar-large">
              <span className="user-initials-large">{getInitials(email)}</span>
            </div>
            <div className="user-profile-info">
              <div className="user-profile-name">{getDisplayName(email)}</div>
              <div className="user-profile-email">{email}</div>
            </div>
          </div>

          <div className="user-profile-menu-items">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="user-menu-divider" />;
              }

              return (
                <button
                  key={index}
                  className={`user-menu-item ${item.danger ? "user-menu-item--danger" : ""}`}
                  onClick={item.action}
                >
                  <span className="user-menu-icon">{item.icon}</span>
                  <span className="user-menu-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

