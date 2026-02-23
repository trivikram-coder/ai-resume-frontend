import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/MainLayout";
import Auth from "./components/Auth";
import UploadResume from "./components/UploadResume";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import ReportDetails from "./components/ReportDetails";

/* ================= AUTH HELPERS ================= */

const isLoggedIn = () => Boolean(localStorage.getItem("email"));

const PublicRoute = ({ children }) => {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes (No Layout) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* Protected Routes (With Layout) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/report/:id" element={<ReportDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;