import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReports } from "../api/api";

export default function Profile() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    email: email || "",
    phone: "",
    theme: "light",
    emailNotifications: true,
  });

  // Form errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    // Initialize form data
    const username = email.split("@")[0];
    setFormData({
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      email: email,
      phone: "",
      theme: localStorage.getItem("theme") || "light",
      emailNotifications: localStorage.getItem("emailNotifications") !== "false",
    });

    // Load resume activity
    loadResumeActivity();
  }, [email, navigate]);

  const loadResumeActivity = async () => {
    if (!email) return;
    
    try {
      setReportsLoading(true);
      const result = await getReports(email);
      if (result && result.status) {
        const reportsData = result.reports || result.data || (Array.isArray(result) ? result : []);
        setReports(Array.isArray(reportsData) ? reportsData : []);
      } else if (result && Array.isArray(result)) {
        setReports(result);
      }
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setReportsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setSuccessMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save preferences to localStorage
      localStorage.setItem("theme", formData.theme);
      localStorage.setItem("emailNotifications", formData.emailNotifications.toString());
      localStorage.setItem("displayName", formData.displayName);
      if (formData.phone) {
        localStorage.setItem("phone", formData.phone);
      }

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    const username = email.split("@")[0];
    setFormData({
      displayName: localStorage.getItem("displayName") || username.charAt(0).toUpperCase() + username.slice(1),
      email: email,
      phone: localStorage.getItem("phone") || "",
      theme: localStorage.getItem("theme") || "light",
      emailNotifications: localStorage.getItem("emailNotifications") !== "false",
    });
    setErrors({});
    setIsEditing(false);
    setSuccessMessage("");
  };

  const handleChangePassword = () => {
    // Navigate to change password modal or page
    // TODO: Implement change password functionality
    setError("Change password feature coming soon!");
    setTimeout(() => setError(""), 3000);
  };

  const getLastLoginDate = () => {
    const lastLogin = localStorage.getItem("lastLogin");
    if (lastLogin) {
      return new Date(lastLogin).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "Today";
  };

  const getLastAnalysisDate = () => {
    if (reports.length === 0) return "Never";
    // Assuming reports have a date field - adjust based on your API
    return "Recently";
  };

  if (!email) {
    return null;
  }

  const displayName = formData.displayName || email.split("@")[0];
  const totalResumes = reports.length;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            <span className="profile-initials-large">{getInitials(displayName)}</span>
          </div>
          <div className="profile-header-info">
            <div className="profile-header-top">
              <h1 className="profile-name">
                {isEditing ? (
                  <input
                    type="text"
                    className="profile-name-input"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    placeholder="Display Name"
                  />
                ) : (
                  displayName
                )}
              </h1>
              <span className="profile-status-badge">Active</span>
            </div>
            <p className="profile-email">{email}</p>
            {errors.displayName && (
              <p className="profile-error-text">{errors.displayName}</p>
            )}
          </div>
        </div>
        <div className="profile-header-actions">
          {isEditing ? (
            <div className="profile-edit-actions">
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="message profile-success">{successMessage}</div>
      )}

      {error && (
        <div className="message error">{error}</div>
      )}

      {errors.submit && (
        <div className="message error">{errors.submit}</div>
      )}

      {/* Profile Sections */}
      <div className="profile-sections">
        {/* Personal Information */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <span className="profile-section-icon">👤</span>
              Personal Information
            </h2>
          </div>
          <div className="profile-section-content">
            <div className="profile-field">
              <label className="profile-field-label">Display Name</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="profile-field-input"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    placeholder="Enter your display name"
                  />
                  {errors.displayName && (
                    <span className="profile-field-error">{errors.displayName}</span>
                  )}
                </>
              ) : (
                <p className="profile-field-value">{formData.displayName}</p>
              )}
            </div>

            <div className="profile-field">
              <label className="profile-field-label">Email</label>
              <p className="profile-field-value profile-field-value--readonly">
                {formData.email}
              </p>
              <span className="profile-field-hint">Email cannot be changed</span>
            </div>

            <div className="profile-field">
              <label className="profile-field-label">Phone Number (Optional)</label>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    className="profile-field-input"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <span className="profile-field-error">{errors.phone}</span>
                  )}
                </>
              ) : (
                <p className="profile-field-value">
                  {formData.phone || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Preferences */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <span className="profile-section-icon">⚙️</span>
              Account Preferences
            </h2>
          </div>
          <div className="profile-section-content">
            <div className="profile-field">
              <label className="profile-field-label">Theme</label>
              {isEditing ? (
                <select
                  className="profile-field-select"
                  value={formData.theme}
                  onChange={(e) => handleInputChange("theme", e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              ) : (
                <p className="profile-field-value">
                  {formData.theme.charAt(0).toUpperCase() + formData.theme.slice(1)}
                </p>
              )}
            </div>

            <div className="profile-field">
              <label className="profile-field-label">Email Notifications</label>
              {isEditing ? (
                <label className="profile-toggle">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) =>
                      handleInputChange("emailNotifications", e.target.checked)
                    }
                    className="profile-toggle-input"
                  />
                  <span className="profile-toggle-slider"></span>
                  <span className="profile-toggle-label">
                    {formData.emailNotifications ? "Enabled" : "Disabled"}
                  </span>
                </label>
              ) : (
                <p className="profile-field-value">
                  {formData.emailNotifications ? "Enabled" : "Disabled"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <span className="profile-section-icon">🔒</span>
              Security
            </h2>
          </div>
          <div className="profile-section-content">
            <div className="profile-field">
              <label className="profile-field-label">Password</label>
              <div className="profile-field-action">
                <p className="profile-field-value">••••••••</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleChangePassword}
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="profile-field">
              <label className="profile-field-label">Last Login</label>
              <p className="profile-field-value">{getLastLoginDate()}</p>
            </div>
          </div>
        </div>

        {/* Resume Activity */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <span className="profile-section-icon">📊</span>
              Resume Activity
            </h2>
          </div>
          <div className="profile-section-content">
            <div className="profile-field">
              <label className="profile-field-label">Total Resumes Uploaded</label>
              {reportsLoading ? (
                <p className="profile-field-value">Loading...</p>
              ) : (
                <p className="profile-field-value profile-field-value--highlight">
                  {totalResumes}
                </p>
              )}
            </div>

            <div className="profile-field">
              <label className="profile-field-label">Last Analysis Date</label>
              <p className="profile-field-value">{getLastAnalysisDate()}</p>
            </div>

            {totalResumes > 0 && (
              <div className="profile-field">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate("/reports")}
                >
                  View All Reports →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
