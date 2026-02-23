import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReports } from "../api/api";

export default function ReportDetails() {
  const { id } = useParams();
  const email = localStorage.getItem("email");

  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadReport() {
      const res = await getReports(email);
      const reports = res?.reports || res || [];
      const found = reports.find((r) => String(r.id) === id);
      setReport(found);
    }
    loadReport();
  }, [id, email]);

  if (!report)
    return <div className="container py-5 text-center">Loading report...</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Report ID: {report.id}</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>Summary</h5>
          <p>{report.summary}</p>
        </div>
      </div>

      <div className="row g-4">

        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h6>ATS Score</h6>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${report.atsScore}%` }}
              >
                {report.atsScore}%
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h6>Job Match</h6>
            <div className="progress">
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

      <div className="mt-5">
        <h5>Strengths</h5>
        <ul>
          {report.strengths?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <h5 className="mt-4">Missing Keywords</h5>
        {report.missingKeywords?.length > 0 ? (
          <ul>
            {report.missingKeywords.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        ) : (
          <p>No missing keywords.</p>
        )}

        <h5 className="mt-4">Recommended Improvements</h5>
        <ul>
          {report.improvements?.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}