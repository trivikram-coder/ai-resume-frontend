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

  // File validation
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = [".pdf", ".doc", ".docx"];

    if (!file) return { valid: false, error: "Please select a file." };

    // Check file type
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: "Invalid file type. Please upload a PDF or DOCX file.",
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size exceeds 5MB limit. Please upload a smaller file.",
      };
    }

    return { valid: true, error: null };
  };

  // Handle file selection
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

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  // File input change handler
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Upload handler
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file to upload.");
      return;
    }

    if (!email) {
      setError("Please login to upload a resume.");
      navigate("/");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadResume(email, file, desc);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.status) {
        setMessage(result.message || "Uploaded successfully! Analyzing your resume...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(result.message || "Upload failed. Please try again.");
        setUploadProgress(0);
      }
    } catch (err) {
      setError("Unable to upload right now. Please check your connection and try again.");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      {/* Page Header */}
      <div className="upload-header">
        <div className="upload-header-content">
          <div className="upload-badge">✨ AI-powered analysis</div>
          <h1 className="upload-title">Upload your resume</h1>
          <p className="upload-subtitle">
            Get instant AI feedback optimized for ATS and recruiters
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <div className="upload-card">
        {/* Drag and Drop Zone */}
        <div
          className={`upload-zone ${isDragging ? "upload-zone--dragging" : ""} ${
            file ? "upload-zone--has-file" : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInputChange}
            className="upload-input-hidden"
            aria-label="Upload resume file"
          />

          {!file ? (
            <div className="upload-zone-content">
              <div className="upload-icon">📄</div>
              <h3 className="upload-zone-title">Drag & drop your resume here</h3>
              <p className="upload-zone-subtitle">or click to browse</p>
              <div className="upload-zone-info">
                <span className="upload-zone-badge">PDF</span>
                <span className="upload-zone-badge">DOCX</span>
                <span className="upload-zone-badge">Max 5MB</span>
              </div>
            </div>
          ) : (
            <div className="upload-file-preview">
              <div className="upload-file-icon">📄</div>
              <div className="upload-file-info">
                <div className="upload-file-name">{file.name}</div>
                <div className="upload-file-size">{formatFileSize(file.size)}</div>
              </div>
              <button
                className="upload-file-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                aria-label="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {loading && uploadProgress > 0 && (
          <div className="upload-progress-container">
            <div className="upload-progress-bar">
              <div
                className="upload-progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="upload-progress-text">
              {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Processing..."}
            </p>
          </div>
        )}

        {/* Role/Job Target Input */}
        <div className="upload-form-section">
          <label className="upload-label">
            Target role or job description <span style={{color:"red"}}>(*)</span>
          </label>
          <textarea
            className="upload-textarea"
            placeholder="e.g., Senior Product Manager at a B2B SaaS company. Focus on roadmap ownership, stakeholder management, and data-driven decision making."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            disabled={loading}
            aria-label="Target role or job description"
          />
          <p className="upload-helper-text">
            💡 Providing context helps our AI tailor analysis to your specific role and industry.
          </p>
        </div>

        {/* CTA Button */}
        <button
          className="btn btn-primary btn-upload"
          onClick={handleUpload}
          disabled={!file || loading}
          aria-label="Analyze resume"
        >
          {loading ? (
            <>
              <span className="upload-spinner"></span>
              Analyzing...
            </>
          ) : (
            <>
              <span>🚀</span>
              Analyze Resume
            </>
          )}
        </button>

        {/* Trust Elements */}
        <div className="upload-trust-section">
          <div className="upload-trust-item">
            <span className="upload-trust-icon">🔒</span>
            <span className="upload-trust-text">Your resume is encrypted and never shared</span>
          </div>
          <div className="upload-trust-item">
            <span className="upload-trust-icon">✅</span>
            <span className="upload-trust-text">ATS-friendly analysis</span>
          </div>
          <div className="upload-trust-item">
            <span className="upload-trust-icon">⚡</span>
            <span className="upload-trust-text">Results in ~10 seconds</span>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="message upload-success">
            <span className="message-icon">✓</span>
            {message}
          </div>
        )}
        {error && (
          <div className="message error upload-error">
            <span className="message-icon">⚠</span>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
