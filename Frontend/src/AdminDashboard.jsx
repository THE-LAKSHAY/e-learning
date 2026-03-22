import React, { useState, useEffect, useCallback } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

import {
  FaUsers, FaBook, FaShoppingCart, FaChartLine,
  FaPlus, FaEdit, FaTimes, FaGraduationCap,
  FaDollarSign, FaArrowUp, FaArrowDown,
  FaCheckCircle, FaHourglassHalf, FaTrash,
} from "react-icons/fa";
import { FiLogOut, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COURSE_ICONS = ["🐍", "🤖", "🗄️", "☕", "🌐", "📊"];

const NAV = [
  { id: "dashboard", label: "Dashboard",  icon: <FaChartLine /> },
  { id: "users",     label: "Users",      icon: <FaUsers /> },
  { id: "courses",   label: "Courses",    icon: <FaBook /> },
  { id: "orders",    label: "Orders",     icon: <FaShoppingCart /> },
];

const PAGE_META = {
  dashboard: { title: "Dashboard Overview",  sub: "Welcome back, Admin. Real-time data from MongoDB." },
  users:     { title: "User Management",     sub: "All registered learners from the database." },
  courses:   { title: "Course Analytics",    sub: "Enrollment data per course." },
  orders:    { title: "Orders & Revenue",    sub: "Real purchase records from your learners." },
};

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activePage,   setActivePage]   = useState("dashboard");
  const [orderFilter,  setOrderFilter]  = useState("week");
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  /* Real data states */
  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [orders,  setOrders]  = useState([]);

  /* Course modal */
  const [showModal,  setShowModal]  = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseStudents, setCourseStudents] = useState("");

  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  /* ── Auth guard ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = localStorage.getItem("user");
    if (!token || !user) { navigate("/admin-login"); return; }
    const parsed = JSON.parse(user);
    if (!parsed.isAdmin) { navigate("/dashboard"); }
  }, [navigate]);

  /* ── API helper ── */
  const apiFetch = useCallback(async (endpoint) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin-login");
      throw new Error("Unauthorized");
    }
    return res.json();
  }, [navigate]);

  /* ── Load all data ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, usersData, ordersData] = await Promise.all([
        apiFetch("/admin/stats"),
        apiFetch("/admin/users"),
        apiFetch("/admin/orders"),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setOrders(ordersData);
    } catch (err) {
      if (err.message !== "Unauthorized") {
        setError("Failed to load data. Is the server running?");
      }
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── Delete user ── */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  /* ── Chart data from real daily enrollments ── */
  const buildChartData = () => {
    if (!stats?.dailyEnrollments?.length) {
      return {
        labels: ["No Data"],
        datasets: [{ label: "Enrollments", data: [0], backgroundColor: "rgba(240,165,0,0.5)", borderRadius: 8, borderSkipped: false }],
      };
    }
    return {
      labels: stats.dailyEnrollments.map(d => d._id),
      datasets: [{
        label: "Enrollments",
        data: stats.dailyEnrollments.map(d => d.count),
        backgroundColor: [
          "rgba(240,165,0,.75)", "rgba(139,92,246,.75)", "rgba(6,182,212,.75)",
          "rgba(34,197,94,.75)", "rgba(244,63,94,.75)", "rgba(240,165,0,.55)",
          "rgba(139,92,246,.55)",
        ],
        borderRadius: 8,
        borderSkipped: false,
      }],
    };
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: "#141728", borderColor: "rgba(240,165,0,.3)", borderWidth: 1,
      titleColor: "#edf0fa", bodyColor: "rgba(237,240,250,.7)",
      padding: 10, cornerRadius: 8,
    }},
    scales: {
      x: { grid: { color: "rgba(255,255,255,.04)" }, ticks: { color: "rgba(237,240,250,.45)" } },
      y: { grid: { color: "rgba(255,255,255,.04)" }, ticks: { color: "rgba(237,240,250,.45)" }, beginAtZero: true },
    },
  };

  const pm = PAGE_META[activePage];

  /* ── Loading / Error ── */
  if (loading) return (
    <div className="admin-loading">
      <div className="admin-spinner-lg" />
      <p>Loading real data from MongoDB…</p>
    </div>
  );

  if (error) return (
    <div className="admin-loading">
      <p style={{ color: "#ef4444", marginBottom: 16 }}>⚠️ {error}</p>
      <button className="btn btn-gold" onClick={loadAll}>
        <FiRefreshCw /> Retry
      </button>
    </div>
  );

  /* ── Initials helper ── */
  const initials = (name = "") => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
  const avatarCls = ["a","b","c","a","b","c"];

  return (
    <div className="admin-wrapper">

      {/* ─── SIDEBAR ─── */}
      <aside className="admin-sidebar">
        <div className="admin-logo-mark" onClick={() => navigate("/")}>
          <div className="admin-logo-tile">A</div>
        </div>
        <nav>
          <ul>
            {NAV.map((item) => (
              <li
                key={item.id}
                data-label={item.label}
                className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
              </li>
            ))}
          </ul>
        </nav>
        <button className="sidebar-logout" onClick={logout}>
          <FiLogOut />
        </button>
      </aside>

      {/* ─── TOPBAR ─── */}
      <header className="admin-topbar">
        <div className="topbar-title">
          <h1>{pm.title}</h1>
          <p>{pm.sub}</p>
        </div>
        <div className="topbar-right">
          <button className="btn btn-ghost" onClick={loadAll} title="Refresh data">
            <FiRefreshCw style={{ fontSize: 13 }} /> Refresh
          </button>
          <div className="topbar-admin-pill">
            <div className="topbar-admin-avatar">A</div>
            <div>
              <div className="topbar-admin-name">{adminUser.fullName || "Administrator"}</div>
              <div className="topbar-admin-role">Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="admin-main">

        {/* ══ DASHBOARD ══ */}
        {activePage === "dashboard" && (
          <>
            <div className="admin-cards">
              {[
                {
                  icon: <FaUsers />, color: "gold", stripe: "gold",
                  val: stats?.totalUsers ?? 0,
                  label: "Total Users", delta: "Real count", up: true,
                },
                {
                  icon: <FaGraduationCap />, color: "violet", stripe: "violet",
                  val: stats?.totalEnrollments ?? 0,
                  label: "Enrollments", delta: "Course purchases", up: true,
                },
                {
                  icon: <FaShoppingCart />, color: "cyan", stripe: "cyan",
                  val: stats?.totalBookings ?? 0,
                  label: "Bookings", delta: "Course bookings", up: true,
                },
                {
                  icon: <FaDollarSign />, color: "green", stripe: "green",
                  val: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`,
                  label: "Revenue", delta: "Total paid", up: true,
                },
              ].map((s) => (
                <div className="stat-card" key={s.label}>
                  <div className={`stat-stripe ${s.stripe}`} />
                  <div className={`stat-icon-box ${s.color}`}>{s.icon}</div>
                  <div className="stat-value">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className={`stat-delta ${s.up ? "up" : "down"}`}>
                    <FaArrowUp style={{ fontSize: 9 }} />
                    {s.delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-bottom">
              {/* Recent users */}
              <div className="mini-panel">
                <div className="mini-panel-head">
                  <h3>Recent Users</h3>
                  <span className="see-all" onClick={() => setActivePage("users")}>See all →</span>
                </div>
                {users.slice(0, 5).map((u, i) => (
                  <div className="mini-row" key={u._id}>
                    <div className="mini-row-icon gold">
                      <div className={`user-avatar-sm ${avatarCls[i % 6]}`} style={{ width: 28, height: 28, fontSize: 11 }}>
                        {initials(u.fullName)}
                      </div>
                    </div>
                    <div className="mini-row-body">
                      <div className="mini-row-title">{u.fullName}</div>
                      <div className="mini-row-sub">{u.email}</div>
                    </div>
                    <span className="status-badge active">active</span>
                  </div>
                ))}
                {users.length === 0 && (
                  <p style={{ color: "rgba(238,237,246,0.3)", fontSize: 13, padding: "12px 0" }}>
                    No users registered yet.
                  </p>
                )}
              </div>

              {/* Recent orders */}
              <div className="mini-panel">
                <div className="mini-panel-head">
                  <h3>Recent Orders</h3>
                  <span className="see-all" onClick={() => setActivePage("orders")}>See all →</span>
                </div>
                {orders.slice(0, 5).map((o, i) => (
                  <div className="mini-row" key={o._id || i}>
                    <div className="mini-row-icon violet">
                      <FaCheckCircle />
                    </div>
                    <div className="mini-row-body">
                      <div className="mini-row-title">{o.courseTitle}</div>
                      <div className="mini-row-sub">by {o.userName}</div>
                    </div>
                    <span className="mini-row-val">₹{o.paidAmount}</span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p style={{ color: "rgba(238,237,246,0.3)", fontSize: 13, padding: "12px 0" }}>
                    No orders yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* ══ USERS ══ */}
        {activePage === "users" && (
          <>
            <div className="page-header">
              <div className="page-header-left">
                <h2>All Learners</h2>
                <p>{users.length} registered accounts</p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-cell">
                          <div className={`user-avatar-sm ${avatarCls[i % 6]}`}>{initials(u.fullName)}</div>
                          <div className="user-name">{u.fullName}</div>
                        </div>
                      </td>
                      <td style={{ color: "var(--t2)" }}>{u.email}</td>
                      <td style={{ color: "var(--t2)" }}>{u.phone}</td>
                      <td style={{ color: "var(--t2)", fontSize: 12 }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => deleteUser(u._id)}
                          title="Delete user"
                        >
                          <FaTrash style={{ fontSize: 12 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="empty-state">No users found in the database.</div>
              )}
            </div>
          </>
        )}

        {/* ══ COURSES ══ */}
        {activePage === "courses" && (
          <>
            <div className="page-header">
              <div className="page-header-left">
                <h2>Course Enrollment Analytics</h2>
                <p>{stats?.coursePop?.length ?? 0} courses with enrollments</p>
              </div>
              <div className="page-header-right">
                <button className="btn btn-gold" onClick={() => setShowModal(true)}>
                  <FaPlus style={{ fontSize: 11 }} /> Add Course
                </button>
              </div>
            </div>

            <div className="course-cards-grid">
              {(stats?.coursePop ?? []).map((course, i) => (
                <div className="course-tile" key={course._id}>
                  <div className="course-tile-icon">
                    {COURSE_ICONS[i % COURSE_ICONS.length]}
                  </div>
                  <h3>{course._id}</h3>
                  <div className="course-tile-meta">
                    <FaUsers style={{ fontSize: 10, opacity: .6 }} />
                    {course.students} Students
                    <span style={{ opacity: .3 }}>·</span>
                    ₹{course.revenue?.toLocaleString() || 0} revenue
                  </div>
                  <div className="course-tile-bar">
                    <div
                      className="course-tile-fill"
                      style={{ width: `${Math.min((course.students / Math.max(...(stats.coursePop.map(c=>c.students)))) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!stats?.coursePop?.length) && (
                <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                  No enrollments recorded yet.
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ ORDERS ══ */}
        {activePage === "orders" && (
          <>
            <div className="page-header">
              <div className="page-header-left">
                <h2>Orders & Analytics</h2>
                <p>Real enrollment data — {orders.length} total orders</p>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div>
                  <h3>Enrollment Volume — Last 7 Days</h3>
                  <p>Daily enrollment breakdown</p>
                </div>
                <div className="stat-delta up" style={{ padding: "4px 12px", borderRadius: 20 }}>
                  <FaArrowUp style={{ fontSize: 9 }} />
                  Total: {stats?.totalEnrollments ?? 0}
                </div>
              </div>
              <div className="chart-canvas-wrap" style={{ height: 260 }}>
                <Bar data={buildChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Orders table */}
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Course</th>
                    <th>Paid</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o._id || i}>
                      <td>
                        <div className="user-cell">
                          <div className={`user-avatar-sm ${avatarCls[i % 6]}`}>
                            {initials(o.userName)}
                          </div>
                          <div>
                            <span className="user-name">{o.userName}</span>
                            <div style={{ fontSize: 11, color: "var(--t2)", marginTop: 2 }}>{o.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>{o.courseTitle}</td>
                      <td><span className="price-cell">₹{o.paidAmount}</span></td>
                      <td style={{ color: "var(--t2)", fontSize: 12, textTransform: "capitalize" }}>{o.paymentMethod}</td>
                      <td style={{ color: "var(--t2)", fontSize: 12 }}>
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </td>
                      <td>
                        <span className={`status-badge ${o.status === "active" ? "active" : "completed"}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="empty-state">No orders found. Users need to complete purchases first.</div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ─── ADD COURSE MODAL ─── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            <div className="modal-header">
              <div className="modal-icon-wrap"><FaPlus /></div>
              <div>
                <h2>Add <span>Course</span></h2>
                <p style={{ fontSize: 12, color: "var(--t2)", marginTop: 3 }}>
                  Create a new course on the platform
                </p>
              </div>
            </div>
            <div className="modal-form">
              <div className="modal-field">
                <label>Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced React"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Category</label>
                <select>
                  <option>Programming</option>
                  <option>Data Science</option>
                  <option>Web Development</option>
                  <option>Design</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={() => setShowModal(false)}>
                <HiSparkles style={{ fontSize: 13 }} /> Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;