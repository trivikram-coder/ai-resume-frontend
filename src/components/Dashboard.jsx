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
        const result = await getReports(email);
        const data = result?.reports || result || [];
        setReports(Array.isArray(data) ? data : []);
      } catch {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [email]);

  const remove = async (id) => {
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading)
    return <div className="container py-5 text-center">⏳ Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Dashboard</h2>
          <p className="text-muted mb-0">
            Overview of your resume analysis activity.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/upload")}
        >
          Upload Resume
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats */}
      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h4 className="fw-bold">{reports.length}</h4>
            <p className="text-muted mb-0">Total Reports</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h4 className="fw-bold">
              {reports.length > 0 ? "Active" : "New"}
            </h4>
            <p className="text-muted mb-0">Account Status</p>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <h4 className="fw-semibold mb-3">Recent Reports</h4>

      {reports.length === 0 ? (
        <div className="alert alert-secondary">
          No reports yet. Upload your first resume.
        </div>
      ) : (
        <div className="row g-4">
          {reports.slice(0, 3).map((r) => (
            <div className="col-md-4" key={r.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-2">Report ID: {r.id}</h6>
                  <p className="text-muted small">
                    {r.summary?.substring(0, 100)}...
                  </p>
                </div>
                <div className="card-footer bg-white d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/report/${r.id}`)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => remove(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}