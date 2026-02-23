import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../api/api";

export default function UploadResume() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024;
    const allowed = ["pdf", "doc", "docx"];

    if (!file) return { valid: false, error: "Please select a file." };

    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      return { valid: false, error: "Only PDF or DOCX allowed." };
    }

    if (file.size > maxSize) {
      return { valid: false, error: "File exceeds 5MB limit." };
    }

    return { valid: true };
  };

  const handleFileSelect = useCallback((selectedFile) => {
    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setMessage("");
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file.");
      return;
    }

    if (!desc.trim()) {
      setError("Please enter target role or job description.");
      return;
    }

    if (!email) {
      navigate("/");
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setError("");
    setMessage("");

    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const result = await uploadResume(email, file, desc);

      clearInterval(interval);
      setUploadProgress(100);

      if (result.status) {
        setMessage("Resume uploaded successfully! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setError(result.message || "Upload failed.");
        setUploadProgress(0);
      }
    } catch {
      setError("Network error. Please try again.");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Upload Your Resume</h2>
        <p className="text-muted">
          Get AI-powered ATS & recruiter feedback instantly
        </p>
      </div>

      <div className="card shadow-sm border-0 p-4">

        {/* Drag & Drop */}
        <div
          className={`border rounded-4 p-5 text-center bg-light ${
            isDragging ? "border-primary bg-white" : ""
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) handleFileSelect(droppedFile);
          }}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              e.target.files && handleFileSelect(e.target.files[0])
            }
          />

          {!file ? (
            <>
              <div style={{ fontSize: 40 }}>📄</div>
              <h5 className="mt-3">Drag & drop resume</h5>
              <p className="text-muted small">
                PDF or DOCX • Max 5MB
              </p>
            </>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{file.name}</strong>
                <div className="text-muted small">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        {loading && (
          <div className="mt-4">
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mt-4">
          <label className="form-label">
            Target Role / Job Description *
          </label>
          <textarea
            className="form-control"
            rows="4"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={loading}
            placeholder="e.g. Backend Developer focusing on Spring Boot and Microservices..."
          />
          <div className="form-text">
            Providing context improves AI analysis accuracy.
          </div>
        </div>

        {/* CTA */}
        <button
          className="btn btn-primary w-100 mt-4"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? "Analyzing..." : "🚀 Analyze Resume"}
        </button>

        {/* Trust Row */}
        <div className="row text-center mt-4 small text-muted">
          <div className="col-md-4">🔒 Encrypted & Secure</div>
          <div className="col-md-4">✅ ATS Optimized</div>
          <div className="col-md-4">⚡ Results in seconds</div>
        </div>

        {/* Messages */}
        {message && (
          <div className="alert alert-success mt-4">{message}</div>
        )}
        {error && (
          <div className="alert alert-danger mt-4">{error}</div>
        )}
      </div>
    </div>
  );
}