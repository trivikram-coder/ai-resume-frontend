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
    <header className="topbar sticky-top">
      <div className="topbar-content d-flex justify-content-end align-items-center gap-2">
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

