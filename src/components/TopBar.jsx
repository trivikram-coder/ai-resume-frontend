import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserProfileMenu from "./UserProfileMenu";

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("email");
  
  // Don't show topbar on auth pages
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";
  
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="topbar">
      <div className="topbar-content">
        {email ? (
          <UserProfileMenu />
        ) : (
          <button 
            className="btn btn-primary btn-auth"
            onClick={() => navigate("/")}
          >
            🔐 Login / Register
          </button>
        )}
      </div>
    </header>
  );
}

