import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General Preferences
    emailNotifications: true,
    theme: "light",
    language: "en",
    
    // Security
    twoFactorAuth: false,
    
    // Privacy
    resumeDataVisibility: "private",
    
    // Notifications
    analysisAlerts: true,
    weeklySummary: true,
  });

  // Original settings for comparison
  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    // Load saved settings from localStorage
    const savedSettings = {
      emailNotifications: localStorage.getItem("emailNotifications") !== "false",
      theme: localStorage.getItem("theme") || "light",
      language: localStorage.getItem("language") || "en",
      twoFactorAuth: localStorage.getItem("twoFactorAuth") === "true",
      resumeDataVisibility: localStorage.getItem("resumeDataVisibility") || "private",
      analysisAlerts: localStorage.getItem("analysisAlerts") !== "false",
      weeklySummary: localStorage.getItem("weeklySummary") !== "false",
    };

    setSettings(savedSettings);
    setOriginalSettings(savedSettings);
  }, [email, navigate]);

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setErrorMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem("emailNotifications", settings.emailNotifications.toString());
      localStorage.setItem("theme", settings.theme);
      localStorage.setItem("language", settings.language);
      localStorage.setItem("twoFactorAuth", settings.twoFactorAuth.toString());
      localStorage.setItem("resumeDataVisibility", settings.resumeDataVisibility);
      localStorage.setItem("analysisAlerts", settings.analysisAlerts.toString());
      localStorage.setItem("weeklySummary", settings.weeklySummary.toString());

      setOriginalSettings({ ...settings });
      setHasChanges(false);
      setSuccessMessage("Settings saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrorMessage("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    // Navigate to change password modal or page
    // TODO: Implement change password functionality
    setErrorMessage("Change password feature coming soon!");
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
    );
    
    if (confirmed) {
      // Handle account deletion
      // TODO: Implement account deletion functionality
      setErrorMessage("Account deletion feature coming soon!");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const getLastLoginDate = () => {
    const lastLogin = localStorage.getItem("lastLogin");
    if (lastLogin) {
      return new Date(lastLogin).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "Today";
  };

  if (!email) {
    return null;
  }

  return (
    <div className="settings-page container-fluid py-3">
      {/* Page Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-header-icon">⚙️</div>
          <div>
            <h1 className="settings-page-title">Account Settings</h1>
            <p className="settings-page-subtitle">
              Manage your account preferences, security, and privacy settings.
            </p>
          </div>
        </div>
        {hasChanges && (
          <button
            className="btn btn-primary settings-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="message settings-success">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="message error">{errorMessage}</div>
      )}

      {/* Settings Sections */}
      <div className="settings-sections">
        {/* General Preferences */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <h2 className="settings-section-title">
              <span className="settings-section-icon">🎨</span>
              General Preferences
            </h2>
            <p className="settings-section-description">
              Customize your app experience and preferences.
            </p>
          </div>
          <div className="settings-section-content">
            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Email Notifications</label>
                <p className="settings-field-hint">
                  Receive email updates about your resume analysis and account activity.
                </p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Theme Mode</label>
                <p className="settings-field-hint">
                  Choose your preferred color theme for the application.
                </p>
              </div>
              <select
                className="settings-field-select"
                value={settings.theme}
                onChange={(e) => handleSettingChange("theme", e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Language</label>
                <p className="settings-field-hint">
                  Select your preferred language for the interface.
                </p>
              </div>
              <select
                className="settings-field-select"
                value={settings.language}
                onChange={(e) => handleSettingChange("language", e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <h2 className="settings-section-title">
              <span className="settings-section-icon">🔒</span>
              Security
            </h2>
            <p className="settings-section-description">
              Manage your account security and authentication settings.
            </p>
          </div>
          <div className="settings-section-content">
            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Password</label>
                <p className="settings-field-hint">
                  Change your account password regularly to keep your account secure.
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>

            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Last Login</label>
                <p className="settings-field-hint">
                  Information about your most recent account access.
                </p>
              </div>
              <p className="settings-field-value">{getLastLoginDate()}</p>
            </div>

            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Two-Factor Authentication</label>
                <p className="settings-field-hint">
                  Add an extra layer of security to your account with 2FA.
                </p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange("twoFactorAuth", e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <h2 className="settings-section-title">
              <span className="settings-section-icon">🔐</span>
              Privacy
            </h2>
            <p className="settings-section-description">
              Control how your resume data is shared and managed.
            </p>
          </div>
          <div className="settings-section-content">
            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Resume Data Visibility</label>
                <p className="settings-field-hint">
                  Choose who can see your resume analysis data.
                </p>
              </div>
              <select
                className="settings-field-select"
                value={settings.resumeDataVisibility}
                onChange={(e) => handleSettingChange("resumeDataVisibility", e.target.value)}
              >
                <option value="private">Private (Only You)</option>
                <option value="shared">Shared with Employers</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="settings-field settings-field--danger">
              <div className="settings-field-info">
                <label className="settings-field-label">Delete Account</label>
                <p className="settings-field-hint">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                className="btn btn-danger"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <h2 className="settings-section-title">
              <span className="settings-section-icon">🔔</span>
              Notifications
            </h2>
            <p className="settings-section-description">
              Configure how and when you receive notifications.
            </p>
          </div>
          <div className="settings-section-content">
            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Resume Analysis Alerts</label>
                <p className="settings-field-hint">
                  Get notified when your resume analysis is complete.
                </p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.analysisAlerts}
                  onChange={(e) => handleSettingChange("analysisAlerts", e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-field">
              <div className="settings-field-info">
                <label className="settings-field-label">Weekly Summary Emails</label>
                <p className="settings-field-hint">
                  Receive a weekly digest of your resume analysis activity.
                </p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.weeklySummary}
                  onChange={(e) => handleSettingChange("weeklySummary", e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Button (Mobile) */}
      {hasChanges && (
        <div className="settings-sticky-footer">
          <button
            className="btn btn-primary settings-save-btn-full"
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
