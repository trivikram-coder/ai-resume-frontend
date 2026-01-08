import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Auth from "./components/Auth";
import UploadResume from "./components/UploadResume";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Profile from "./components/Profile";
import Settings from "./components/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main-wrapper">
          <TopBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/upload" element={<UploadResume />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
