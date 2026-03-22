import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  /* If already admin-logged-in, redirect */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = localStorage.getItem("user");
    if (token && user) {
      const parsed = JSON.parse(user);
      if (parsed.isAdmin) navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res  = await fetch("http://localhost:5000/admin-login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid admin credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));
      navigate("/admin-dashboard");

    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-root">
      <div className="al-bg-orb al-bg-orb--a" />
      <div className="al-bg-orb al-bg-orb--b" />
      <div className="al-bg-grid" />

      <div className="al-card">
        <div className="al-card-top-bar" />

        {/* Logo */}
        <div className="al-logo">
          <div className="al-logo-mark">A</div>
          <div>
            <div className="al-logo-title">Learnify Admin</div>
            <div className="al-logo-sub">Restricted Access</div>
          </div>
        </div>

        <h2 className="al-heading">Admin Sign In</h2>
        <p className="al-subheading">
          This portal is for authorized administrators only.
        </p>

        {error && (
          <div className="al-alert">
            ⚠️ {error}
          </div>
        )}

        <form className="al-form" onSubmit={handleLogin}>
          <div className="al-field">
            <label htmlFor="al-email">Admin Email</label>
            <input
              id="al-email"
              type="email"
              placeholder="admin@learnify.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
              disabled={loading}
            />
          </div>

          <div className="al-field">
            <label htmlFor="al-password">Password</label>
            <input
              id="al-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="al-submit" disabled={loading}>
            {loading ? (
              <span className="al-spinner" />
            ) : (
              "Sign In as Admin →"
            )}
          </button>
        </form>

        <button className="al-back" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <p className="al-hint">
          Not an admin?{" "}
          <span onClick={() => navigate("/auth")}>Sign in as user →</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;