import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, loginUser, registerUser } from "../api/api";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === "/register";
  const [activeTab, setActiveTab] = useState(isRegister ? "register" : "login");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [loginMessage, setLoginMessage] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerMessage, setRegisterMessage] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginMessage("");
    setLoginLoading(true);

    try {
      const result = await loginUser(loginForm);

      if (!result.status) {
        setLoginError(result.message || "Invalid credentials.");
        return;
      }

      // fetch user by email (NO JWT)
      const res = await getUser(loginForm.email);
      const data = await res.json();
      console.log(data)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("email", loginForm.email);

      setLoginMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setLoginError("Unable to login. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterMessage("");
    setRegisterLoading(true);

    try {
      const result = await registerUser(registerForm);

      if (!result.status) {
        setRegisterError(result.message || "Could not create account.");
        return;
      }

      setRegisterMessage("Account created! You can now login.");

      // clear form (FIXED)
      setRegisterForm({
        userName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        setActiveTab("login");
        navigate("/");
      }, 2000);
    } catch (err) {
      setRegisterError("Something went wrong. Try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <section className="panel auth-panel">
      {/* Tab Switcher */}
      <div className="auth-tabs">
        <button
          className={`auth-tab ${
            activeTab === "login" ? "auth-tab--active" : ""
          }`}
          onClick={() => {
            setActiveTab("login");
            navigate("/");
          }}
        >
          🔐 Sign In
        </button>
        <button
          className={`auth-tab ${
            activeTab === "register" ? "auth-tab--active" : ""
          }`}
          onClick={() => {
            setActiveTab("register");
            navigate("/register");
          }}
        >
          👤 Sign Up
        </button>
      </div>

      {/* Login Form */}
      {activeTab === "login" && (
        <div className="auth-form-container">
          <div className="panel-header">
            <p className="pill">Welcome back</p>
            <h1 className="panel-title">Sign in to your workspace</h1>
            <p className="panel-subtitle">
              Continue optimizing resumes, tracking reports, and sharing insights
              with hiring managers.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">Work email</label>
                <input
                  className="input-control"
                  type="email"
                  placeholder="you@company.com"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  className="input-control"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? "Signing in..." : "Sign in"}
              </button>
              <p className="muted">
                Secure login to keep your resume data private.
              </p>
            </div>

            {loginMessage && <div className="message">{loginMessage}</div>}
            {loginError && (
              <div className="message error">{loginError}</div>
            )}
          </form>
        </div>
      )}

      {/* Register Form */}
      {activeTab === "register" && (
        <div className="auth-form-container">
          <div className="panel-header">
            <p className="pill">Join the waitlist</p>
            <h1 className="panel-title">Create your account</h1>
            <p className="panel-subtitle">
              Store resumes, analyze them with AI, and download recruiter-ready
              reports in seconds.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">Full name</label>
                <input
                  className="input-control"
                  type="text"
                  placeholder="Taylor Jackson"
                  value={registerForm.userName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      userName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Work email</label>
                <input
                  className="input-control"
                  type="email"
                  placeholder="taylor@company.com"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  className="input-control"
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={registerLoading}
              >
                {registerLoading
                  ? "Creating account..."
                  : "Create account"}
              </button>
              <p className="muted">
                Get AI-powered resume insights instantly.
              </p>
            </div>

            {registerMessage && (
              <div className="message">{registerMessage}</div>
            )}
            {registerError && (
              <div className="message error">{registerError}</div>
            )}
          </form>
        </div>
      )}
    </section>
  );
}
