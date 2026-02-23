import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReports } from "../api/api";

export default function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser?.email || localStorage.getItem("email");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  const [formData, setFormData] = useState({
    displayName: "",
    email: email || "",
    phone: "",
    theme: "light",
    emailNotifications: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    const nameFromUser =
      storedUser?.userName ||
      storedUser?.name ||
      localStorage.getItem("displayName");

    const fallbackName = email.split("@")[0];

    setFormData({
      displayName:
        nameFromUser ||
        fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
      email,
      phone: localStorage.getItem("phone") || "",
      theme: localStorage.getItem("theme") || "light",
      emailNotifications:
        localStorage.getItem("emailNotifications") !== "false",
    });

    loadResumeActivity();
  }, [email, navigate]);

  const loadResumeActivity = async () => {
    try {
      const result = await getReports(email);
      setReports(result?.reports || result || []);
    } catch {
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    await new Promise((res) => setTimeout(res, 600));

    localStorage.setItem("displayName", formData.displayName);
    localStorage.setItem("theme", formData.theme);
    localStorage.setItem(
      "emailNotifications",
      formData.emailNotifications.toString()
    );

    if (formData.phone) {
      localStorage.setItem("phone", formData.phone);
    }

    setSaving(false);
    setIsEditing(false);
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!email) return null;

  const totalResumes = reports.length;

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{ width: 70, height: 70, fontSize: 22 }}
            >
              {getInitials(formData.displayName)}
            </div>

            <div>
              {isEditing ? (
                <input
                  className="form-control"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                />
              ) : (
                <h4 className="fw-bold mb-1">{formData.displayName}</h4>
              )}
              <p className="text-muted mb-0">{email}</p>
            </div>
          </div>

          <div>
            {isEditing ? (
              <>
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Sections */}
      <div className="row g-4">

        {/* Personal Info */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Personal Information</h6>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                {isEditing ? (
                  <input
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-muted">
                    {formData.phone || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label">Theme</label>
                {isEditing ? (
                  <select
                    className="form-select"
                    value={formData.theme}
                    onChange={(e) =>
                      setFormData({ ...formData, theme: e.target.value })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                ) : (
                  <p className="text-muted text-capitalize">
                    {formData.theme}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Activity */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Resume Activity</h6>

              {reportsLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <h4 className="fw-bold">{totalResumes}</h4>
                  <p className="text-muted">Total Reports Generated</p>

                  {totalResumes > 0 && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate("/reports")}
                    >
                      View Reports
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}