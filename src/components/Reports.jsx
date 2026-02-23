import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReports, deleteReport } from "../api/api";

export default function Reports() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await getReports(email);
        setReports(res?.reports || res || []);
      } catch {
        setError("Unable to load reports.");
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
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3 text-muted">Loading reports...</p>
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">All Reports</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* EMPTY STATE */}
      {reports.length === 0 ? (
        <div className="card shadow-sm border-0 text-center p-5">
          <div style={{ fontSize: 50 }}>📭</div>
          <h4 className="mt-3">No reports yet</h4>
          <p className="text-muted">
            Upload your first resume and get AI-powered insights.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/upload")}
          >
            🚀 Upload Resume
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {reports.map((r) => (
            <div className="col-md-6 col-lg-4" key={r.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <span className="badge bg-primary mb-2">
                    Report ID: {r.id}
                  </span>

                  <p className="small text-muted">
                    ATS: {r.atsScore}% | Match: {r.jobMatch}%
                  </p>

                  <p className="small">
                    {r.summary?.substring(0, 120)}...
                  </p>
                </div>

                <div className="card-footer bg-white d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/report/${r.id}`)}
                  >
                    View Details
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