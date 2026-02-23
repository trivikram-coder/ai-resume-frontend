import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReports } from "../api/api";

export default function ReportDetails() {
  const { id } = useParams();
  const email = localStorage.getItem("email");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Helper Function: Convert to Title Case
  const toTitleCase = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    async function loadReport() {
      const res = await getReports(email);
      const reports = res?.reports || res || [];
      const found = reports.find((r) => String(r.id) === id);
      setReport(found);
      setLoading(false);
    }
    loadReport();
  }, [id, email]);
console.log(report)
  if (loading)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3 text-muted">Loading Report...</p>
      </div>
    );

  if (!report)
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: 50 }}>📭</div>
        <h4 className="mt-3">Report Not Found</h4>
      </div>
    );

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">
          Report Details
        </h2>
        <span className="badge bg-secondary mt-2">
          Report ID: {report.id}
        </span>
      </div>

      {/* Summary */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-bold text-primary">
            📄 Summary
          </h5>
          <p className="mt-2 text-muted">
            {toTitleCase(report.summary)}
          </p>
        </div>
      </div>

      {/* Scores */}
      <div className="row g-4 mb-5">

        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h6 className="fw-bold text-info mb-3">
              📊 ATS Score
            </h6>
            <div className="progress" style={{ height: 20 }}>
              <div
                className="progress-bar bg-info"
                style={{ width: `${report.atsScore}%` }}
              >
                {report.atsScore}%
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h6 className="fw-bold text-success mb-3">
              🎯 Job Match Score
            </h6>
            <div className="progress" style={{ height: 20 }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${report.jobMatch}%` }}
              >
                {report.jobMatch}%
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Strengths */}
      <div className="mb-5">
        <h5 className="fw-bold text-success mb-3">
          💪 Strengths
        </h5>
        {report.strengths?.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {report.strengths.map((s, i) => (
              <span key={i} className="badge bg-success-subtle text-success border">
                {toTitleCase(s)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted">No Strengths Identified.</p>
        )}
      </div>

      {/* Missing Keywords */}
      <div className="mb-5">
        <h5 className="fw-bold text-danger mb-3">
          ⚠ Missing Keywords
        </h5>
        {report.missingKeywords?.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {report.missingKeywords.map((k, i) => (
              <span key={i} className="badge bg-danger-subtle text-danger border">
                {toTitleCase(k)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted">No Missing Keywords 🎉</p>
        )}
      </div>

      {/* Recommended Roles */}
      <div className="mb-5">
        <h5 className="fw-bold text-primary mb-3">
          💼 Recommended Roles
        </h5>

        {report.jobRecommendation?.length > 0 ? (
          <div className="d-flex flex-wrap gap-3">
            {report.jobRecommendation.map((role, i) => (
              <a
                key={i}
                href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="badge bg-primary text-decoration-none p-2"
              >
                {toTitleCase(role)}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted">No Recommended Roles Available.</p>
        )}
      </div>

      {/* Recommended Improvements */}
      <div>
        <h5 className="fw-bold text-warning mb-3">
          🚀 Recommended Improvements
        </h5>
        {report.improvements?.length > 0 ? (
          <ul className="list-group list-group-flush">
            {report.improvements.map((imp, i) => (
              <li key={i} className="list-group-item">
                {toTitleCase(imp)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No Improvement Suggestions.</p>
        )}
      </div>

    </div>
  );
}