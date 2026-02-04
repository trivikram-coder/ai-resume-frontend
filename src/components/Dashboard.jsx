import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReports, deleteReport } from "../api/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      if (!email) {
        setError("Please login to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        setError("");
        const result = await getReports(email);
        
        // Handle different response formats
        if (result && result.status) {
          const reportsData = result.reports || result.data || (Array.isArray(result) ? result : []);
          setReports(Array.isArray(reportsData) ? reportsData : []);
        } else if (result && Array.isArray(result)) {
          setReports(result);
        } else {
          setError(result?.message || "Failed to load reports. Please try again.");
        }
      } catch (err) {
        console.error("Error loading reports:", err);
        setError("Unable to load dashboard data. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [email]);

  const remove = async (id) => {
    try {
      const result = await deleteReport(id);
      if (result && result.status) {
        setReports((current) => current.filter((r) => r.id !== id));
      } else {
        setError(result?.message || "Failed to delete report.");
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      setError("Unable to delete report. Please try again.");
    }
  };

  const totalReports = reports.length;
  const recentReports = reports.slice(0, 3);

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's your resume analysis overview.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/upload")}>
          📄 Upload New Resume
        </button>
      </div>

      {error && <div className="message error">{error}</div>}

      {loading ? (
        <div className="empty">⏳ Loading dashboard...</div>
      ) : (
        <>
          {/* Stats Cards - Analytics Only */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{totalReports}</div>
                <div className="stat-label">Total Reports</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✨</div>
              <div className="stat-content">
                <div className="stat-value">{recentReports.length}</div>
                <div className="stat-label">Recent Reports</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{totalReports > 0 ? "Active" : "New"}</div>
                <div className="stat-label">Account Status</div>
              </div>
            </div>
            <div className="stat-card stat-card--action" onClick={() => navigate("/upload")}>
              <div className="stat-icon">🚀</div>
              <div className="stat-content">
                <div className="stat-label">Quick Action</div>
                <div className="stat-action">Upload Resume →</div>
              </div>
            </div>
          </div>

          {/* Recent Reports Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Recent Reports</h2>
              {reports.length > 3 && (
                <button className="btn btn-secondary" onClick={() => navigate("/reports")}>
                  View All ({totalReports})
                </button>
              )}
            </div>

            {reports.length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon">📭</div>
                <h3>No reports yet</h3>
                <p>Upload your first resume to get AI-powered insights and analysis.</p>
                <button className="btn btn-primary" onClick={() => navigate("/upload")}>
                  Upload Resume
                </button>
              </div>
            ) : (
              <div className="reports-grid">
                {recentReports.map((r) => (
                  <article className="report-card" key={r.id}>
                    <div className="report-header">
                      <span className="pill">🎯 Target Role</span>
                      <button 
                        className="btn-icon" 
                        onClick={() => remove(r.id)}
                        title="Delete report"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="report-body">
                      <div className="report-field">
                        <label className="report-label">Description</label>
                        <div className="report-text">{r.description || "No description"}</div>
                      </div>
                      <div className="report-field">
                        <label className="report-label">AI Analysis</label>
                        <div className="report-text report-text--preview">
                          {r.generatedText ? 
                            (r.generatedText.length > 150 
                              ? r.generatedText.substring(0, 150) + "..." 
                              : r.generatedText) 
                            : "No analysis available"}
                        </div>
                      </div>
                    </div>
                    <div className="report-footer">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate("/reports")}
                      >
                        View Full Report
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <div className="action-card" onClick={() => navigate("/upload")}>
                <div className="action-icon">📤</div>
                <h3>Upload Resume</h3>
                <p>Analyze a new resume with AI</p>
              </div>
              <div className="action-card" onClick={() => navigate("/reports")}>
                <div className="action-icon">📋</div>
                <h3>View All Reports</h3>
                <p>See all your analysis reports</p>
              </div>
              <div className="action-card">
                <div className="action-icon">⚙️</div>
                <h3>Settings</h3>
                <p>Manage your account preferences</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

