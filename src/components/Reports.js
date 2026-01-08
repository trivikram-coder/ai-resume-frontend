import React, { useEffect, useState } from "react";
import { getReports, deleteReport } from "../api/api";

export default function Reports() {
  const email = localStorage.getItem("email");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      if (!email) {
        setError("Please login to view your reports.");
        setLoading(false);
        return;
      }
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

  if (loading) return <div style={{ padding: 20 }}>⏳ Loading reports...</div>;
  if (error) return <div style={{ padding: 20, color: "#b91c1c" }}>{error}</div>;

  return (
    <section style={{ padding: "24px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <span style={{
          fontSize: 12,
          padding: "4px 10px",
          borderRadius: 999,
          background: "#eef2ff",
          color: "#4f46e5",
          fontWeight: 500
        }}>
          Insights
        </span>

        <h1 style={{ marginTop: 10, fontSize: 22 }}>
          AI Resume Analysis Reports
        </h1>

        <p style={{ color: "#6b7280", fontSize: 14 }}>
          ATS readiness, role fit, and skill-gap insights explained clearly.
        </p>
      </div>

      {reports.length === 0 && (
        <div style={{ color: "#6b7280" }}>
          📭 No reports yet.
        </div>
      )}

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
        gap: 20
      }}>
        {reports.map((r) => (
          <article key={r.id} style={{
            background: "#ffffff",
            borderRadius: 14,
            padding: "18px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 14
          }}>

            {/* META */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "#eef2ff",
                  color: "#4f46e5"
                }}>
                  ATS {r.atsScore}%
                </span>

                <span style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "#ecfeff",
                  color: "#0369a1"
                }}>
                  Job Match {r.jobMatch}%
                </span>
              </div>

              <button
                onClick={() => remove(r.id)}
                title="Delete report"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  opacity: 0.6,
                  fontSize: 14
                }}
              >
                🗑️
              </button>
            </div>

            {/* SUMMARY */}
            <p style={{
              fontSize: 14,
              color: "#4b5563",
              lineHeight: 1.5
            }}>
              {r.summary}
            </p>

            {/* STRENGTHS */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>Strengths</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {r.strengths?.map((s, i) => (
                  <span key={i} style={{
                    fontSize: 12,
                    padding: "4px 8px",
                    borderRadius: 8,
                    background: "#ecfdf5",
                    color: "#047857"
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>Missing Keywords</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {r.missingKeywords<1?<span style={{
                    fontSize: 12,
                    padding: "4px 8px",
                    borderRadius: 8,
                    background: "#fef2f2",
                    color: "#b91c1c"
                  }}>No missing Keywords</span>:r.missingKeywords?.map((k, i) => (
                  <span key={i} style={{
                    fontSize: 12,
                    padding: "4px 8px",
                    borderRadius: 8,
                    background: "#fef2f2",
                    color: "#b91c1c"
                  }}>
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* IMPROVEMENTS */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>
                Recommended Improvements
              </p>
              <ul style={{
                paddingLeft: 16,
                fontSize: 13,
                color: "#4b5563"
              }}>
                {r.improvements?.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>

            {/* JOB ROLES */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>
                Better-Fit Roles
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {r.jobRecommendation?.map((job, i) => (
                  <span key={i} style={{
                    fontSize: 12,
                    padding: "4px 8px",
                    borderRadius: 8,
                    background: "#f1f5f9",
                    color: "#334155"
                  }}>
                    {job}
                  </span>
                ))}
              </div>
            </div>

          </article>
        ))}
      </div>
    </section>
  );
}
