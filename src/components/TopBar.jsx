import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserProfileMenu from "./UserProfileMenu";

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("email");

  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  if (isAuthPage) return null;

  return (
    <nav className="navbar navbar-expand bg-white shadow-sm sticky-top px-4">
      <div className="container-fluid d-flex justify-content-end align-items-center">

        {email ? (
          <UserProfileMenu />
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            🔐 Login / Register
          </button>
        )}

      </div>
    </nav>
  );
}