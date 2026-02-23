import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

      const res = await getUser(loginForm.email);
      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("email", loginForm.email);

      setLoginMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch {
      setLoginError("Unable to login. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

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

      setRegisterForm({
        userName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        setActiveTab("login");
        navigate("/");
      }, 2000);
    } catch {
      setRegisterError("Something went wrong. Try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">

          {/* Tabs */}
          <ul className="nav nav-pills nav-justified mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("login");
                  navigate("/");
                }}
              >
                🔐 Sign In
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "register" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("register");
                  navigate("/register");
                }}
              >
                👤 Sign Up
              </button>
            </li>
          </ul>

          {/* LOGIN */}
          {activeTab === "login" && (
            <div className="card shadow border-0">
              <div className="card-body">
                <h3 className="fw-bold mb-2">Sign in to your workspace</h3>
                <p className="text-muted mb-4">
                  Continue optimizing resumes and tracking reports.
                </p>

                <form onSubmit={handleLogin}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Work email</label>
                      <input
                        type="email"
                        className="form-control"
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

                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
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

                  <button
                    className="btn btn-primary w-100 mt-4"
                    type="submit"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Signing in..." : "Sign in"}
                  </button>

                  {loginMessage && (
                    <div className="alert alert-success mt-3">
                      {loginMessage}
                    </div>
                  )}

                  {loginError && (
                    <div className="alert alert-danger mt-3">
                      {loginError}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* REGISTER */}
          {activeTab === "register" && (
            <div className="card shadow border-0">
              <div className="card-body">
                <h3 className="fw-bold mb-2">Create your account</h3>
                <p className="text-muted mb-4">
                  Store resumes and analyze them with AI.
                </p>

                <form onSubmit={handleRegister}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full name</label>
                      <input
                        type="text"
                        className="form-control"
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

                    <div className="col-md-6">
                      <label className="form-label">Work email</label>
                      <input
                        type="email"
                        className="form-control"
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

                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
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

                  <button
                    className="btn btn-primary w-100 mt-4"
                    type="submit"
                    disabled={registerLoading}
                  >
                    {registerLoading
                      ? "Creating account..."
                      : "Create account"}
                  </button>

                  {registerMessage && (
                    <div className="alert alert-success mt-3">
                      {registerMessage}
                    </div>
                  )}

                  {registerError && (
                    <div className="alert alert-danger mt-3">
                      {registerError}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}