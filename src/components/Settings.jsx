import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    theme: "light",
    language: "en",
    twoFactorAuth: false,
    resumeDataVisibility: "private",
    analysisAlerts: true,
    weeklySummary: true,
  });

  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    const saved = {
      emailNotifications: localStorage.getItem("emailNotifications") !== "false",
      theme: localStorage.getItem("theme") || "light",
      language: localStorage.getItem("language") || "en",
      twoFactorAuth: localStorage.getItem("twoFactorAuth") === "true",
      resumeDataVisibility:
        localStorage.getItem("resumeDataVisibility") || "private",
      analysisAlerts: localStorage.getItem("analysisAlerts") !== "false",
      weeklySummary: localStorage.getItem("weeklySummary") !== "false",
    };

    setSettings(saved);
    setOriginalSettings(saved);
  }, [email, navigate]);

  useEffect(() => {
    setHasChanges(
      JSON.stringify(settings) !== JSON.stringify(originalSettings)
    );
  }, [settings, originalSettings]);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setErrorMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 800));

    Object.keys(settings).forEach((key) => {
      localStorage.setItem(key, settings[key].toString());
    });

    setOriginalSettings(settings);
    setHasChanges(false);
    setSaving(false);
    setSuccessMessage("Settings saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!email) return null;

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Account Settings</h2>
          <p className="text-muted mb-0">
            Manage your preferences, security and privacy.
          </p>
        </div>

        {hasChanges && (
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        )}
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      <div className="row g-4">

        {/* General */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">General Preferences</h6>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange(
                      "emailNotifications",
                      e.target.checked
                    )
                  }
                />
                <label className="form-check-label">
                  Email Notifications
                </label>
              </div>

              <div className="mb-3">
                <label className="form-label">Theme</label>
                <select
                  className="form-select"
                  value={settings.theme}
                  onChange={(e) =>
                    handleSettingChange("theme", e.target.value)
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="form-label">Language</label>
                <select
                  className="form-select"
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Security</h6>

              <button className="btn btn-outline-secondary mb-3">
                Change Password
              </button>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) =>
                    handleSettingChange(
                      "twoFactorAuth",
                      e.target.checked
                    )
                  }
                />
                <label className="form-check-label">
                  Two-Factor Authentication
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Privacy</h6>

              <div className="mb-3">
                <label className="form-label">
                  Resume Data Visibility
                </label>
                <select
                  className="form-select"
                  value={settings.resumeDataVisibility}
                  onChange={(e) =>
                    handleSettingChange(
                      "resumeDataVisibility",
                      e.target.value
                    )
                  }
                >
                  <option value="private">Private</option>
                  <option value="shared">Shared</option>
                  <option value="public">Public</option>
                </select>
              </div>

              <button className="btn btn-danger">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Notifications</h6>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.analysisAlerts}
                  onChange={(e) =>
                    handleSettingChange(
                      "analysisAlerts",
                      e.target.checked
                    )
                  }
                />
                <label className="form-check-label">
                  Resume Analysis Alerts
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.weeklySummary}
                  onChange={(e) =>
                    handleSettingChange(
                      "weeklySummary",
                      e.target.checked
                    )
                  }
                />
                <label className="form-check-label">
                  Weekly Summary Emails
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>

      {hasChanges && (
        <div className="fixed-bottom bg-white p-3 shadow d-md-none">
          <button
            className="btn btn-primary w-100"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}