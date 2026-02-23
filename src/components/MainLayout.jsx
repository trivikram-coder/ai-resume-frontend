import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function MainLayout() {
  const location = useLocation();

  // Hide layout on auth pages
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="d-flex">

      {/* Sidebar */}
      <div className="d-none d-md-block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: "100vh" }}>
        
        {/* Topbar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-grow-1 p-4 bg-light">
          <Outlet />
        </main>

      </div>
    </div>
  );
}