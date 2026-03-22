import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

import {
  FaHome, FaBook, FaCertificate, FaUser,
  FaPlay, FaClock, FaCheckCircle, FaStar,
  FaGraduationCap, FaMedal, FaEnvelope, FaPhone,
  FaChartLine, FaLayerGroup, FaLock, FaTrophy,
  FaFileAlt, FaClipboardCheck, FaVideo, FaStickyNote,
  FaDownload, FaEye, FaUnlock, FaEdit, FaSave, FaTimes,
  FaShieldAlt, FaKey,
} from "react-icons/fa";
import { FiLogOut, FiZap, FiBookOpen, FiTrendingUp, FiRefreshCw, FiAward } from "react-icons/fi";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./assets/LDP Logo.png";

const NAV = [
  { id: "dashboard",    label: "Dashboard",    icon: <FaHome /> },
  { id: "courses",      label: "My Courses",   icon: <FaBook /> },
  { id: "certificates", label: "Certificates", icon: <FaCertificate /> },
  { id: "profile",      label: "Profile",      icon: <FaUser /> },
];

/* ── MCQ Bank (20 questions per course, randomized) ── */
const QUESTION_BANK = [
  { q: "What is the primary purpose of a variable in programming?", options: ["To store data", "To delete data", "To display output", "To connect servers"], ans: 0 },
  { q: "Which data structure follows LIFO order?", options: ["Queue", "Stack", "Array", "Tree"], ans: 1 },
  { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Meta Language", "None"], ans: 0 },
  { q: "Which CSS property controls text size?", options: ["font-weight", "text-size", "font-size", "size"], ans: 2 },
  { q: "What is the output of 2 + '3' in JavaScript?", options: ["5", "23", "Error", "undefined"], ans: 1 },
  { q: "Which keyword declares a constant in JavaScript?", options: ["var", "let", "const", "def"], ans: 2 },
  { q: "What does API stand for?", options: ["Application Programming Interface", "Applied Protocol Integration", "Automated Process Instance", "Application Process Integrator"], ans: 0 },
  { q: "Which HTTP method is used to retrieve data?", options: ["POST", "PUT", "GET", "DELETE"], ans: 2 },
  { q: "What is a closure in JavaScript?", options: ["A loop construct", "A function with access to its outer scope", "A CSS selector", "An HTML tag"], ans: 1 },
  { q: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "Standard Question List", "Sequential Query Language"], ans: 0 },
];

/* ════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════ */
const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [activeTab,        setActiveTab]        = useState("dashboard");
  const [selectedCourse,   setSelectedCourse]   = useState(null);
  const [courseSection,    setCourseSection]     = useState("video");
  const [selectedLesson,   setSelectedLesson]    = useState(0);
  const [showCertificate,  setShowCertificate]  = useState(false);
  const [downloadOptions,  setDownloadOptions]  = useState(false);
  const [certCourse,       setCertCourse]       = useState("");
  const [activeFilter,     setActiveFilter]     = useState("All");

  /* Assessment state */
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentDone,    setAssessmentDone]    = useState(false);
  const [currentQ,          setCurrentQ]          = useState(0);
  const [answers,           setAnswers]           = useState({});
  const [score,             setScore]             = useState(null);
  const [passed,            setPassed]            = useState(false);
  const [courseScores,      setCourseScores]      = useState({});

  /* Video progress tracking: { courseId: Set of completed lesson indices } */
  const [watchedLessons, setWatchedLessons] = useState({});

  /* Profile edit state */
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm,         setEditForm]         = useState({ fullName: "", phone: "" });
  const [editEmailMode,    setEditEmailMode]    = useState(false);
  const [newEmail,         setNewEmail]         = useState("");
  const [otpSent,          setOtpSent]          = useState(false);
  const [otpInput,         setOtpInput]         = useState("");
  const [otpVerified,      setOtpVerified]      = useState(false);
  const [fakeOtp,          setFakeOtp]          = useState("");
  const [profileSaving,    setProfileSaving]    = useState(false);
  const [profileSaveMsg,   setProfileSaveMsg]   = useState("");
  const [otpError,         setOtpError]         = useState("");

  /* Real data */
  const [user,        setUser]        = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError,   setDataError]   = useState("");

  const certRef = useRef();

  /* ── Auth guard ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) { navigate("/auth"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.isAdmin) { navigate("/admin-dashboard"); return; }
    setUser(parsed);
    const savedScores = localStorage.getItem("courseScores");
    if (savedScores) setCourseScores(JSON.parse(savedScores));
    const savedWatched = localStorage.getItem("watchedLessons");
    if (savedWatched) {
      const parsed2 = JSON.parse(savedWatched);
      // Convert arrays back to Sets
      const withSets = {};
      Object.keys(parsed2).forEach(k => { withSets[k] = new Set(parsed2[k]); });
      setWatchedLessons(withSets);
    }
  }, [navigate]);

  /* ── Fetch real profile + enrollments ── */
  const loadData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingData(true);
    setDataError("");
    try {
      const [profileRes, enrollRes] = await Promise.all([
        fetch("http://localhost:5000/me", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/enrollments/my", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (profileRes.status === 401) {
        localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/auth"); return;
      }
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
        localStorage.setItem("user", JSON.stringify({
          id: profileData._id, fullName: profileData.fullName,
          email: profileData.email, phone: profileData.phone, isAdmin: profileData.isAdmin,
        }));
      }
      if (enrollRes.ok) { const enrollData = await enrollRes.json(); setEnrollments(enrollData); }
    } catch { setDataError("Could not connect to server."); }
    finally   { setLoadingData(false); }
  }, [navigate]);

  useEffect(() => { if (user) loadData(); }, [user?.email]);

  /* ── Demo lessons ── */
  const getDemoLessons = (course) => [
    { title: "Introduction & Overview",          duration: "12:30", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", notes: "Welcome to the course! In this lesson we cover the big picture and what you will learn throughout the program. Pay attention to the learning objectives." },
    { title: "Core Concepts & Fundamentals",     duration: "18:45", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", notes: "Fundamental principles form the bedrock of everything we'll build. Master these concepts before moving forward." },
    { title: "Hands-on Practice: Part 1",        duration: "22:10", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", notes: "In this session we apply theory to practice. Follow along with the code examples and complete the exercises." },
    { title: "Deep Dive: Advanced Topics",       duration: "25:00", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", notes: "Advanced concepts build on what you have already learned. Take notes on the patterns and best practices shown here." },
    { title: "Real-world Project Walkthrough",   duration: "30:15", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", notes: "We build a real project from scratch. Focus on project structure, file organization, and clean code practices." },
    { title: "Assessment Prep & Summary",        duration: "10:00", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", notes: "Final review of all key topics. Use this lesson to consolidate your knowledge before taking the assessment." },
  ];

  /* ── Video progress helpers ── */
  const getWatchedSet = (courseId) => watchedLessons[courseId] || new Set();

  const markLessonWatched = (courseId, lessonIdx, totalLessons) => {
    setWatchedLessons(prev => {
      const current = new Set(prev[courseId] || []);
      current.add(lessonIdx);
      const updated = { ...prev, [courseId]: current };
      // Persist as arrays (Sets not JSON serializable)
      const toStore = {};
      Object.keys(updated).forEach(k => { toStore[k] = Array.from(updated[k]); });
      localStorage.setItem("watchedLessons", JSON.stringify(toStore));
      return updated;
    });
  };

  const getCourseVideoProgress = (courseId, totalLessons) => {
    const watched = getWatchedSet(courseId);
    if (!totalLessons) return 0;
    return Math.round((watched.size / totalLessons) * 100);
  };

  /* ── Handlers ── */
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };
  const goTab  = (id) => { setActiveTab(id); setSelectedCourse(null); setCourseSection("video"); };

  const openCourse = (enrollment) => {
    setSelectedCourse(enrollment);
    setCourseSection("video");
    setSelectedLesson(0);
    const cid = enrollment._id;
    const saved = courseScores[cid];
    if (saved) { setScore(saved.score); setPassed(saved.passed); setAssessmentDone(true); }
    else        { setScore(null); setPassed(false); setAssessmentDone(false); }
    setAssessmentStarted(false);
    setCurrentQ(0);
    setAnswers({});
  };

  /* When user clicks a lesson, mark it watched */
  const handleSelectLesson = (idx) => {
    setSelectedLesson(idx);
    if (selectedCourse) {
      const lessons = getDemoLessons(selectedCourse);
      markLessonWatched(selectedCourse._id, idx, lessons.length);
    }
  };

  const openCert = (c)  => { setCertCourse(c); setShowCertificate(true); };
  const openDl   = (c)  => { setCertCourse(c); setDownloadOptions(true); };

  const downloadJPG = async () => {
    const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
    const a = document.createElement("a");
    a.download = `${certCourse}-certificate.jpg`;
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.click();
    setDownloadOptions(false);
  };

  const downloadPDF = async () => {
    const canvas  = await html2canvas(certRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf     = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${certCourse}-certificate.pdf`);
    setDownloadOptions(false);
  };

  /* ── Assessment logic ── */
  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentQ(0);
    setAnswers({});
    setScore(null);
    setPassed(false);
    setAssessmentDone(false);
  };

  const selectAnswer = (qIdx, optIdx) => setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));

  const submitAssessment = () => {
    let correct = 0;
    QUESTION_BANK.forEach((q, i) => { if (answers[i] === q.ans) correct++; });
    const pct = Math.round((correct / QUESTION_BANK.length) * 100);
    const pass = pct >= 65;
    setScore(pct);
    setPassed(pass);
    setAssessmentDone(true);
    setAssessmentStarted(false);
    const newScores = { ...courseScores, [selectedCourse._id]: { score: pct, passed: pass } };
    setCourseScores(newScores);
    localStorage.setItem("courseScores", JSON.stringify(newScores));
  };

  /* ── Profile edit handlers ── */
  const startEditProfile = () => {
    setEditForm({ fullName: user?.fullName || "", phone: user?.phone || "" });
    setEditEmailMode(false);
    setNewEmail("");
    setOtpSent(false);
    setOtpInput("");
    setOtpVerified(false);
    setFakeOtp("");
    setProfileSaveMsg("");
    setOtpError("");
    setIsEditingProfile(true);
  };

  const cancelEditProfile = () => {
    setIsEditingProfile(false);
    setEditEmailMode(false);
    setOtpSent(false);
    setOtpVerified(false);
    setProfileSaveMsg("");
    setOtpError("");
  };

  const sendOtp = () => {
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setOtpError("Please enter a valid email address.");
      return;
    }
    // Generate a fake 6-digit OTP for demo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setFakeOtp(otp);
    setOtpSent(true);
    setOtpError("");
    // In production you'd call your backend here
    console.log("Demo OTP (would be emailed):", otp);
  };

  const verifyOtp = () => {
    if (otpInput.trim() === fakeOtp) {
      setOtpVerified(true);
      setOtpError("");
    } else {
      setOtpError("Incorrect OTP. Please try again.");
    }
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileSaveMsg("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        fullName: editForm.fullName,
        phone: editForm.phone,
        ...(otpVerified && newEmail ? { email: newEmail } : {}),
      };
      const res = await fetch("http://localhost:5000/me/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(prev => ({ ...prev, ...updated }));
        localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), ...updated }));
        setProfileSaveMsg("Profile updated successfully!");
        setTimeout(() => { setIsEditingProfile(false); setProfileSaveMsg(""); }, 1500);
      } else {
        // If backend not available, update locally for demo
        setUser(prev => ({ ...prev, fullName: editForm.fullName, phone: editForm.phone, ...(otpVerified && newEmail ? { email: newEmail } : {}) }));
        setProfileSaveMsg("Profile updated (demo mode)!");
        setTimeout(() => { setIsEditingProfile(false); setProfileSaveMsg(""); }, 1500);
      }
    } catch {
      // Demo fallback: update locally
      setUser(prev => ({ ...prev, fullName: editForm.fullName, phone: editForm.phone, ...(otpVerified && newEmail ? { email: newEmail } : {}) }));
      setProfileSaveMsg("Profile updated (demo mode)!");
      setTimeout(() => { setIsEditingProfile(false); setProfileSaveMsg(""); }, 1500);
    }
    setProfileSaving(false);
  };

  /* ── Stats ── */
  const totalCourses = enrollments.length;
  const totalLessons = enrollments.reduce((a, e) => a + (e.lessonsCount || 0), 0);
  const avgProgress  = totalCourses ? Math.round(enrollments.reduce((a, e) => a + (e.progress || 0), 0) / totalCourses) : 0;
  const completed    = enrollments.filter(e => e.progress >= 100 || e.status === "completed").length;

  const pageMeta = {
    dashboard:    { title: `Hey, ${user?.fullName?.split(" ")[0] || "Learner"} 👋`, sub: "Here's your real learning snapshot." },
    courses:      { title: "My Courses",       sub: "Your enrolled courses from the database." },
    certificates: { title: "My Certificates",  sub: "Achievements for completed courses." },
    profile:      { title: "Profile Settings", sub: "Your real account information." },
  };
  const pm = pageMeta[activeTab] || pageMeta.dashboard;

  const filteredEnrollments = activeFilter === "All" ? enrollments
    : activeFilter === "Completed" ? enrollments.filter(e => e.progress >= 100 || e.status === "completed")
    : activeFilter === "In Progress" ? enrollments.filter(e => (e.progress || 0) < 100 && e.status !== "completed")
    : enrollments;

  const isCourseCompleted = (cid) => courseScores[cid]?.passed;
  const getCourseScore    = (cid) => courseScores[cid]?.score || 0;

  if (!user) return null;

  const lessons = selectedCourse ? getDemoLessons(selectedCourse) : [];
  const currentVideoProgress = selectedCourse ? getCourseVideoProgress(selectedCourse._id, lessons.length) : 0;
  const watchedSet = selectedCourse ? getWatchedSet(selectedCourse._id) : new Set();

  return (
    <div className="dashboard">

      {/* ─── SIDEBAR ─── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark" onClick={() => navigate("/")}>L</div>
        </div>
        <nav>
          <ul>
            {NAV.map((item) => (
              <li
                key={item.id}
                data-label={item.label}
                className={activeTab === item.id && !selectedCourse ? "active" : ""}
                onClick={() => goTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
              </li>
            ))}
          </ul>
        </nav>
        <button className="logout-btn" title="Sign Out" onClick={logout}>
          <FiLogOut />
        </button>
      </aside>

      {/* ─── TOPBAR ─── */}
      <header className="topbar">
        <div className="topbar-left">
          <h1>{selectedCourse ? selectedCourse.courseTitle : pm.title}</h1>
          <p>{selectedCourse ? "Enrolled course" : pm.sub}</p>
        </div>
        <div className="topbar-right">
          <button className="btn-refresh-sm" onClick={loadData} title="Refresh"><FiRefreshCw /></button>
          <div className="user-pill">
            <img className="user-avatar" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="avatar" />
            <div>
              <div className="user-pill-name">{user?.fullName || "Student"}</div>
              <div className="user-pill-role">Learner</div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main className="main-dashboard">

        {loadingData && (
          <div className="dash-loading"><div className="dash-spinner" /> Loading your data…</div>
        )}
        {dataError && !loadingData && (
          <div className="dash-error">⚠️ {dataError}<button onClick={loadData} style={{ marginLeft: 12 }}>Retry</button></div>
        )}

        {/* ══ DASHBOARD ══ */}
        {activeTab === "dashboard" && !loadingData && (
          <>
            <div className="welcome-card">
              <div className="welcome-text">
                <div className="wt-tag"><HiLightningBolt style={{ fontSize: 12 }} /> Learning Dashboard</div>
                <h2>Keep the <em>momentum</em> going.</h2>
                <p>{totalCourses > 0 ? `You're enrolled in ${totalCourses} course${totalCourses > 1 ? "s" : ""}. Keep learning!` : "You haven't enrolled in any courses yet. Browse courses to get started."}</p>
              </div>
              <div className="welcome-emoji">🎓</div>
            </div>

            <div className="section-heading">Overview <span className="sh-line" /></div>

            <div className="stats-grid">
              {[
                { icon: <FiBookOpen />,      color: "cyan",   line: "cyan",   val: totalCourses,   label: "Enrolled Courses", sub: "Active now"   },
                { icon: <FaPlay />,          color: "violet", line: "violet", val: totalLessons || totalCourses * 6, label: "Total Lessons", sub: "Available"    },
                { icon: <FaGraduationCap />, color: "amber",  line: "amber",  val: completed,      label: "Completed",        sub: "Courses done" },
                { icon: <FiTrendingUp />,    color: "green",  line: "green",  val: `${avgProgress}%`, label: "Avg. Progress", sub: "Keep going!"  },
              ].map((s) => (
                <div className="stat-card" key={s.label}>
                  <div className={`stat-accent-line ${s.line}`} />
                  <div className={`stat-icon-wrap ${s.color}`}>{s.icon}</div>
                  <div className="stat-value">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="dash-bottom">
              <div className="dash-panel">
                <div className="dash-panel-head">
                  <h3><FiBookOpen style={{ marginRight: 8, opacity: .7 }} />Continue Learning</h3>
                  <span className="see-all" onClick={() => goTab("courses")}>See all →</span>
                </div>
                {enrollments.length === 0 ? (
                  <div className="dash-empty">No courses yet. <span onClick={() => navigate("/")} style={{ color: "var(--cyan)", cursor: "pointer" }}>Browse courses →</span></div>
                ) : (
                  enrollments.map((e) => {
                    const vp = getCourseVideoProgress(e._id, 6);
                    return (
                      <div key={e._id} className="dash-course-row" onClick={() => { setActiveTab("courses"); openCourse(e); }}>
                        {e.courseImage
                          ? <img className="dash-course-thumb" src={e.courseImage} alt={e.courseTitle} />
                          : <div className="dash-course-thumb-placeholder">📚</div>}
                        <div className="dcr-info">
                          <div className="dcr-title">{e.courseTitle}</div>
                          <div className="dcr-bar-wrap"><div className="dcr-bar" style={{ width: `${vp || e.progress || 0}%` }} /></div>
                        </div>
                        <span className="dcr-pct">{vp || e.progress || 0}%</span>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="dash-panel">
                <div className="dash-panel-head"><h3><FiZap style={{ marginRight: 8, opacity: .7 }} />Your Account</h3></div>
                <div className="activity-row">
                  <div className="activity-icon cyan"><FaEnvelope /></div>
                  <div className="activity-info"><p><strong>Email</strong></p><div className="activity-time">{user?.email}</div></div>
                </div>
                <div className="activity-row">
                  <div className="activity-icon amber"><FaPhone /></div>
                  <div className="activity-info"><p><strong>Phone</strong></p><div className="activity-time">{user?.phone || "Not set"}</div></div>
                </div>
                <div className="activity-row">
                  <div className="activity-icon violet"><FaLayerGroup /></div>
                  <div className="activity-info"><p><strong>Enrolled Courses</strong></p><div className="activity-time">{totalCourses} courses</div></div>
                </div>
                <div className="activity-row">
                  <div className="activity-icon green"><FaMedal /></div>
                  <div className="activity-info"><p><strong>Total Spent</strong></p><div className="activity-time">₹{enrollments.reduce((a, e) => a + (e.paidAmount || 0), 0).toLocaleString()}</div></div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ MY COURSES (list) ══ */}
        {activeTab === "courses" && !selectedCourse && !loadingData && (
          <>
            <div className="courses-page-header">
              <div className="page-eyebrow"><FiBookOpen /> My Learning Library</div>
              <h2>Your Courses</h2>
              <p>{totalCourses > 0 ? `You have ${totalCourses} enrolled course${totalCourses > 1 ? "s" : ""}.` : "You haven't enrolled in any courses yet."}</p>
            </div>

            <div className="courses-filter-bar">
              {["All", "In Progress", "Completed"].map((f) => (
                <button key={f} className={`filter-chip ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>
                  {f}
                  {f === "All" && <span className="chip-count">{totalCourses}</span>}
                </button>
              ))}
            </div>

            <div className="section-heading">Enrolled Courses <span className="sh-line" /><span className="sh-count">{filteredEnrollments.length} courses</span></div>

            {filteredEnrollments.length === 0 ? (
              <div className="courses-empty">
                <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
                <h3>No courses yet</h3>
                <p>Browse our catalog and enroll in a course to get started.</p>
                <button className="btn-browse" onClick={() => navigate("/")}>Browse Courses →</button>
              </div>
            ) : (
              <div className="courses-grid">
                {filteredEnrollments.map((enrollment) => {
                  const vp = getCourseVideoProgress(enrollment._id, 6);
                  return (
                    <div key={enrollment._id} className="course-card" onClick={() => openCourse(enrollment)}>
                      <div className="cc-img-wrap">
                        {enrollment.courseImage
                          ? <img src={enrollment.courseImage} alt={enrollment.courseTitle} className="cc-img" />
                          : <div className="cc-img-placeholder">📚</div>}
                        <div className="cc-img-overlay" />
                        {enrollment.tech && <span className="cc-badge">{enrollment.tech}</span>}
                        {isCourseCompleted(enrollment._id) && <span className="cc-badge-pass">✓ Passed</span>}
                      </div>
                      <div className="cc-body">
                        <div className="cc-meta">
                          <span>{enrollment.level || "Beginner"}</span>
                          <span className="cc-dot">·</span>
                          <span>{enrollment.status}</span>
                        </div>
                        <h3 className="cc-title">{enrollment.courseTitle}</h3>
                        <div className="cc-progress-wrap">
                          <div className="cc-progress-bar">
                            <div className="cc-progress-fill" style={{ width: `${vp || enrollment.progress || 0}%` }} />
                          </div>
                          <span className="cc-pct">{vp || enrollment.progress || 0}%</span>
                        </div>
                        <div className="cc-footer">
                          <span>Enrolled {new Date(enrollment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span>₹{enrollment.paidAmount} paid</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══ COURSE DETAIL with tabs ══ */}
        {activeTab === "courses" && selectedCourse && (
          <div className="course-detail-wrapper">
            <div className="cd-topbar">
              <button className="cd-back" onClick={() => { setSelectedCourse(null); setCourseSection("video"); }}>
                ← Back to My Courses
              </button>
              <div className="cd-section-tabs">
                {[
                  { id: "video",       icon: <FaVideo />,           label: "Video Lessons"  },
                  { id: "notes",       icon: <FaStickyNote />,      label: "Notes"          },
                  { id: "assessment",  icon: <FaClipboardCheck />,  label: "Assessment"     },
                  { id: "certificate", icon: <FaCertificate />,     label: "Certificate"    },
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`cd-tab ${courseSection === tab.id ? "active" : ""} ${tab.id === "certificate" && !isCourseCompleted(selectedCourse._id) ? "locked" : ""}`}
                    onClick={() => setCourseSection(tab.id)}
                  >
                    <span className="cd-tab-icon">{tab.id === "certificate" && !isCourseCompleted(selectedCourse._id) ? <FaLock /> : tab.icon}</span>
                    <span className="cd-tab-label">{tab.label}</span>
                    {tab.id === "certificate" && !isCourseCompleted(selectedCourse._id) && <span className="cd-tab-lock-badge">Locked</span>}
                    {tab.id === "certificate" && isCourseCompleted(selectedCourse._id) && <span className="cd-tab-pass-badge">Unlocked</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* ── VIDEO SECTION ── */}
            {courseSection === "video" && (
              <div className="cd-video-section">
                <div className="cd-player-layout">
                  <div className="cd-video-panel">
                    <div className="cd-video-frame-wrap">
                      <iframe
                        src={lessons[selectedLesson]?.videoUrl}
                        title={lessons[selectedLesson]?.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="cd-video-info">
                      <div className="cd-lesson-badge">Lesson {selectedLesson + 1} of {lessons.length}</div>
                      <h2 className="cd-video-title">{lessons[selectedLesson]?.title}</h2>
                      <div className="cd-video-meta">
                        <span><FaClock style={{ marginRight: 5 }} />{lessons[selectedLesson]?.duration}</span>
                        <span><FaVideo style={{ marginRight: 5 }} />{selectedCourse.courseTitle}</span>
                        {watchedSet.has(selectedLesson) && (
                          <span className="cd-watched-tag"><FaCheckCircle style={{ marginRight: 4, color: "var(--green)" }} /> Watched</span>
                        )}
                      </div>
                      <div className="cd-nav-btns">
                        <button className="cd-nav-btn" disabled={selectedLesson === 0} onClick={() => handleSelectLesson(selectedLesson - 1)}>← Previous</button>
                        <button className="cd-nav-btn primary" disabled={selectedLesson === lessons.length - 1} onClick={() => handleSelectLesson(selectedLesson + 1)}>Next →</button>
                      </div>
                    </div>
                  </div>

                  <div className="cd-lesson-list-panel">
                    <div className="cd-lesson-list-head">
                      <FaBook style={{ color: "var(--cyan)", marginRight: 8 }} />
                      Course Lessons
                      <span className="lesson-count-chip">{lessons.length}</span>
                    </div>
                    <div className="cd-lesson-scroll">
                      {lessons.map((lesson, idx) => (
                        <div
                          key={idx}
                          className={`cd-lesson-item ${selectedLesson === idx ? "active" : ""} ${watchedSet.has(idx) ? "watched" : ""}`}
                          onClick={() => handleSelectLesson(idx)}
                        >
                          <div className="cd-lesson-num">
                            {watchedSet.has(idx)
                              ? <FaCheckCircle style={{ fontSize: 12, color: "var(--green)" }} />
                              : idx + 1}
                          </div>
                          <div className="cd-lesson-text">
                            <div className="cd-lesson-name">{lesson.title}</div>
                            <div className="cd-lesson-dur"><FaClock style={{ marginRight: 4, fontSize: 10 }} />{lesson.duration}</div>
                          </div>
                          {selectedLesson === idx && <div className="cd-lesson-playing"><FaPlay /></div>}
                        </div>
                      ))}
                    </div>
                    <div className="cd-lesson-footer">
                      <div className="cd-lesson-progress-label">
                        <span>Video Progress</span>
                        <span>{currentVideoProgress}%</span>
                      </div>
                      <div className="cd-lesson-progress-bar">
                        <div className="cd-lesson-progress-fill" style={{ width: `${currentVideoProgress}%` }} />
                      </div>
                      <div className="cd-watched-count">{watchedSet.size} of {lessons.length} lessons watched</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTES SECTION ── */}
            {courseSection === "notes" && (
              <div className="cd-notes-section">
                <div className="cd-notes-header">
                  <div className="cd-notes-eyebrow"><FaStickyNote /> Course Notes</div>
                  <h2>Lesson Notes</h2>
                  <p>Key takeaways and study material for each lesson.</p>
                </div>
                <div className="cd-notes-grid">
                  {lessons.map((lesson, idx) => (
                    <div key={idx} className="cd-note-card">
                      <div className="cd-note-card-top">
                        <div className="cd-note-num">Lesson {idx + 1}</div>
                        <div className={`cd-note-status ${watchedSet.has(idx) ? "watched" : "pending"}`}>
                          {watchedSet.has(idx) ? <><FaCheckCircle /> Watched</> : <><FaClock /> Pending</>}
                        </div>
                      </div>
                      <h3 className="cd-note-title">{lesson.title}</h3>
                      <p className="cd-note-content">{lesson.notes}</p>
                      <div className="cd-note-footer">
                        <span><FaClock style={{ marginRight: 4 }} />{lesson.duration}</span>
                        <button className="cd-note-watch-btn" onClick={() => { handleSelectLesson(idx); setCourseSection("video"); }}>
                          <FaPlay /> Watch Lesson
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ASSESSMENT SECTION ── */}
            {courseSection === "assessment" && (
              <div className="cd-assessment-section">
                {!assessmentStarted && !assessmentDone && (
                  <div className="cd-assessment-intro">
                    <div className="cd-assessment-icon-wrap"><FaClipboardCheck /></div>
                    <h2>Course Assessment</h2>
                    <p className="cd-assessment-sub">Test your knowledge with 20 multiple-choice questions. You need <strong>65% or more</strong> to pass and unlock your certificate.</p>
                    <div className="cd-assessment-rules">
                      <div className="cd-rule"><FaCheckCircle style={{ color: "var(--green)" }} /><span>20 MCQ Questions</span></div>
                      <div className="cd-rule"><FaCheckCircle style={{ color: "var(--green)" }} /><span>Passing score: 65% (13/20 correct)</span></div>
                      <div className="cd-rule"><FaCheckCircle style={{ color: "var(--green)" }} /><span>Certificate unlocked on passing</span></div>
                      <div className="cd-rule"><FaCheckCircle style={{ color: "var(--green)" }} /><span>Retake allowed if you fail</span></div>
                    </div>
                    <button className="cd-start-btn" onClick={startAssessment}><FaPlay /> Start Assessment</button>
                  </div>
                )}

                {assessmentStarted && !assessmentDone && (
                  <div className="cd-quiz-wrapper">
                    <div className="cd-quiz-header">
                      <div className="cd-quiz-progress-info">
                        <span className="cd-quiz-q-num">Question {currentQ + 1} / {QUESTION_BANK.length}</span>
                        <span className="cd-quiz-answered">{Object.keys(answers).length} answered</span>
                      </div>
                      <div className="cd-quiz-progress-bar">
                        <div className="cd-quiz-progress-fill" style={{ width: `${((currentQ + 1) / QUESTION_BANK.length) * 100}%` }} />
                      </div>
                    </div>
                    <div className="cd-quiz-card">
                      <div className="cd-quiz-q-tag">Q{currentQ + 1}</div>
                      <h3 className="cd-quiz-question">{QUESTION_BANK[currentQ].q}</h3>
                      <div className="cd-quiz-options">
                        {QUESTION_BANK[currentQ].options.map((opt, oi) => (
                          <button
                            key={oi}
                            className={`cd-quiz-option ${answers[currentQ] === oi ? "selected" : ""}`}
                            onClick={() => selectAnswer(currentQ, oi)}
                          >
                            <span className="cd-quiz-opt-letter">{String.fromCharCode(65 + oi)}</span>
                            <span className="cd-quiz-opt-text">{opt}</span>
                            {answers[currentQ] === oi && <FaCheckCircle className="cd-quiz-check" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="cd-quiz-nav">
                      <button className="cd-quiz-nav-btn" disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)}>← Previous</button>
                      <div className="cd-quiz-dots">
                        {QUESTION_BANK.map((_, i) => (
                          <div key={i} className={`cd-quiz-dot ${i === currentQ ? "current" : ""} ${answers[i] !== undefined ? "answered" : ""}`} onClick={() => setCurrentQ(i)} />
                        ))}
                      </div>
                      {currentQ < QUESTION_BANK.length - 1
                        ? <button className="cd-quiz-nav-btn primary" onClick={() => setCurrentQ(p => p + 1)}>Next →</button>
                        : <button className="cd-quiz-submit-btn" onClick={submitAssessment} disabled={Object.keys(answers).length < QUESTION_BANK.length}>Submit Assessment</button>
                      }
                    </div>
                  </div>
                )}

                {assessmentDone && (
                  <div className="cd-result-wrapper">
                    <div className={`cd-result-card ${passed ? "passed" : "failed"}`}>
                      <div className="cd-result-icon">{passed ? <FaTrophy /> : <FaClipboardCheck />}</div>
                      <div className={`cd-result-badge ${passed ? "pass" : "fail"}`}>{passed ? "🎉 Assessment Passed!" : "❌ Not Passed"}</div>
                      <div className="cd-result-score-ring">
                        <svg viewBox="0 0 120 120" className="cd-score-svg">
                          <circle cx="60" cy="60" r="50" className="cd-score-track" />
                          <circle cx="60" cy="60" r="50" className={`cd-score-fill ${passed ? "pass" : "fail"}`} strokeDasharray={`${(score / 100) * 314} 314`} />
                        </svg>
                        <div className="cd-score-text">
                          <div className="cd-score-pct">{score}%</div>
                          <div className="cd-score-label">Score</div>
                        </div>
                      </div>
                      <p className="cd-result-msg">
                        {passed ? `Excellent work! You scored ${score}% and have unlocked your certificate.` : `You scored ${score}%. You need at least 65% to pass. Review the lessons and try again.`}
                      </p>
                      <div className="cd-result-actions">
                        {passed
                          ? <button className="cd-result-btn primary" onClick={() => setCourseSection("certificate")}><FiAward /> View Certificate</button>
                          : <button className="cd-result-btn" onClick={startAssessment}><FaPlay /> Retake Assessment</button>
                        }
                        <button className="cd-result-btn" onClick={() => setCourseSection("video")}><FaVideo /> Review Lessons</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CERTIFICATE SECTION ── */}
            {courseSection === "certificate" && (
              <div className="cd-cert-section">
                {!isCourseCompleted(selectedCourse._id) ? (
                  <div className="cd-cert-locked">
                    <div className="cd-cert-lock-icon"><FaLock /></div>
                    <h2>Certificate Locked</h2>
                    <p>Complete the assessment with a score of <strong>65% or higher</strong> to unlock your certificate.</p>
                    <div className="cd-cert-lock-steps">
                      <div className="cd-cert-lock-step"><div className="cd-lock-step-num">1</div><div className="cd-lock-step-text">Watch all video lessons</div></div>
                      <div className="cd-cert-lock-step"><div className="cd-lock-step-num">2</div><div className="cd-lock-step-text">Review the notes for each lesson</div></div>
                      <div className="cd-cert-lock-step"><div className="cd-lock-step-num">3</div><div className="cd-lock-step-text">Pass the 20-question assessment (65%+)</div></div>
                    </div>
                    <button className="cd-goto-assessment-btn" onClick={() => setCourseSection("assessment")}><FaClipboardCheck /> Take Assessment</button>
                  </div>
                ) : (
                  <div className="cd-cert-unlocked">
                    <div className="cd-cert-unlocked-header">
                      <div className="cd-cert-unlocked-icon"><FaUnlock /></div>
                      <div>
                        <h2>🎉 Certificate Earned!</h2>
                        <p>You scored <strong>{getCourseScore(selectedCourse._id)}%</strong> — Congratulations on completing <strong>{selectedCourse.courseTitle}</strong>!</p>
                      </div>
                    </div>
                    <div className="cd-cert-preview-wrap" onClick={() => openCert(selectedCourse.courseTitle)} title="Click to preview fullscreen">
                      <div ref={certRef} className="certificate-card">
                        <div className="cert-bg-lines" />
                        <div className="cert-top">
                          <img src={logo} alt="Learnify" className="cert-logo" />
                          <div className="cert-badge">✦ OFFICIAL CERTIFICATE ✦</div>
                        </div>
                        <p className="cert-awarded">This certifies that</p>
                        <h1 className="cert-student-name">{user?.fullName}</h1>
                        <p className="cert-has-completed">has successfully completed</p>
                        <h2 className="cert-course-name">{selectedCourse.courseTitle}</h2>
                        <div className="cert-details-row">
                          <div><span>Score</span><strong>{getCourseScore(selectedCourse._id)}%</strong></div>
                          <div><span>Grade</span><strong>{getCourseScore(selectedCourse._id) >= 85 ? "Distinction" : getCourseScore(selectedCourse._id) >= 75 ? "Merit" : "Pass"}</strong></div>
                          <div><span>Date</span><strong>{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</strong></div>
                        </div>
                        <div className="cert-footer">
                          <div className="cert-sig"><div className="cert-sig-line" /><p>Learnify Education</p></div>
                        </div>
                      </div>
                      <div className="cd-cert-click-hint"><FaEye /> Click to preview fullscreen</div>
                    </div>
                    <div className="cd-cert-download-actions">
                      <button className="cd-cert-dl-btn jpg" onClick={downloadJPG}><FaDownload /> Download as JPG</button>
                      <button className="cd-cert-dl-btn pdf" onClick={downloadPDF}><FaFileAlt /> Download as PDF</button>
                      <button className="cd-cert-view-btn" onClick={() => openCert(selectedCourse.courseTitle)}><FaEye /> Preview Fullscreen</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ CERTIFICATES ══ */}
        {activeTab === "certificates" && !loadingData && (
          <>
            <div className="section-heading">Your Certificates <span className="sh-line" /></div>
            {enrollments.filter(e => isCourseCompleted(e._id)).length === 0 ? (
              <div className="courses-empty">
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
                <h3>No certificates yet</h3>
                <p>Pass the assessment in any course to earn your certificate.</p>
                <button className="btn-browse" onClick={() => goTab("courses")}>Go to My Courses →</button>
              </div>
            ) : (
              <div className="certs-grid">
                {enrollments.filter(e => isCourseCompleted(e._id)).map((e, i) => (
                  <div className="cert-card cert-card--clickable" key={e._id || i} onClick={() => openCert(e.courseTitle)}>
                    <div className="cert-card-hover-overlay">
                      <FaEye className="cert-card-eye" />
                      <span>Preview Certificate</span>
                    </div>
                    <div className="cert-card-top">
                      <FaGraduationCap style={{ fontSize: 28, color: "#F0A500" }} />
                      <div className="cert-grade">Completed · {getCourseScore(e._id)}%</div>
                    </div>
                    <h4 className="cert-name">{e.courseTitle}</h4>
                    <p className="cert-skills">{e.tech} · {e.level}</p>
                    <div className="cert-actions">
                      <button className="cert-view-btn" onClick={(ev) => { ev.stopPropagation(); openCert(e.courseTitle); }}>
                        <FaEye /> View
                      </button>
                      <button className="cert-dl-btn" onClick={(ev) => { ev.stopPropagation(); openDl(e.courseTitle); }}>
                        <FaDownload /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══ PROFILE ══ */}
        {activeTab === "profile" && (
          <div className="profile-section">
            {/* Profile hero */}
            <div className="profile-hero">
              <img className="profile-avatar-lg" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="avatar" />
              <div>
                <h2 className="profile-name">{user?.fullName}</h2>
                <p className="profile-role">Learnify Student</p>
              </div>
              {!isEditingProfile && (
                <button className="profile-edit-btn" onClick={startEditProfile}>
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            {/* ── EDIT MODE ── */}
            {isEditingProfile ? (
              <div className="profile-edit-panel">
                <div className="pep-header">
                  <div className="pep-title"><FaEdit style={{ color: "var(--cyan)", marginRight: 8 }} /> Edit Profile</div>
                  <button className="pep-cancel-btn" onClick={cancelEditProfile}><FaTimes /> Cancel</button>
                </div>

                {/* Full Name */}
                <div className="pep-field">
                  <label className="pep-label"><FaUser style={{ marginRight: 6 }} /> Full Name</label>
                  <input
                    className="pep-input"
                    type="text"
                    value={editForm.fullName}
                    onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>

                {/* Phone */}
                <div className="pep-field">
                  <label className="pep-label"><FaPhone style={{ marginRight: 6 }} /> Phone Number</label>
                  <input
                    className="pep-input"
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Your phone number"
                  />
                </div>

                {/* Email change */}
                <div className="pep-field">
                  <label className="pep-label"><FaEnvelope style={{ marginRight: 6 }} /> Email Address</label>
                  <div className="pep-email-current">
                    <span className="pep-current-email-val">{user?.email}</span>
                    {!editEmailMode && (
                      <button className="pep-change-email-btn" onClick={() => setEditEmailMode(true)}>
                        <FaEdit /> Change Email
                      </button>
                    )}
                  </div>

                  {editEmailMode && (
                    <div className="pep-email-change-block">
                      <div className="pep-otp-note">
                        <FaShieldAlt style={{ color: "var(--cyan)", marginRight: 6 }} />
                        Email change requires OTP verification for security.
                      </div>
                      <div className="pep-email-row">
                        <input
                          className="pep-input"
                          type="email"
                          value={newEmail}
                          onChange={e => { setNewEmail(e.target.value); setOtpSent(false); setOtpVerified(false); setOtpInput(""); }}
                          placeholder="Enter new email address"
                          disabled={otpVerified}
                        />
                        {!otpVerified && (
                          <button className="pep-send-otp-btn" onClick={sendOtp} disabled={otpSent && !otpVerified}>
                            {otpSent ? "Resend OTP" : "Send OTP"}
                          </button>
                        )}
                      </div>

                      {otpSent && !otpVerified && (
                        <div className="pep-otp-block">
                          <div className="pep-otp-sent-msg">
                            ✉️ OTP sent to <strong>{newEmail}</strong>
                            {fakeOtp && <span className="pep-demo-otp"> (Demo OTP: <strong>{fakeOtp}</strong>)</span>}
                          </div>
                          <div className="pep-otp-row">
                            <input
                              className="pep-input pep-otp-input"
                              type="text"
                              maxLength={6}
                              value={otpInput}
                              onChange={e => { setOtpInput(e.target.value); setOtpError(""); }}
                              placeholder="Enter 6-digit OTP"
                            />
                            <button className="pep-verify-btn" onClick={verifyOtp}>
                              <FaKey style={{ marginRight: 6 }} /> Verify
                            </button>
                          </div>
                          {otpError && <div className="pep-otp-error">{otpError}</div>}
                        </div>
                      )}

                      {otpVerified && (
                        <div className="pep-otp-success">
                          <FaCheckCircle style={{ marginRight: 6 }} /> Email verified! New email: <strong>{newEmail}</strong>
                        </div>
                      )}

                      {!otpVerified && (
                        <button className="pep-cancel-email-btn" onClick={() => { setEditEmailMode(false); setNewEmail(""); setOtpSent(false); setOtpInput(""); setOtpError(""); }}>
                          Cancel email change
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {profileSaveMsg && (
                  <div className={`pep-save-msg ${profileSaveMsg.includes("successfully") || profileSaveMsg.includes("demo") ? "success" : "error"}`}>
                    <FaCheckCircle style={{ marginRight: 6 }} /> {profileSaveMsg}
                  </div>
                )}

                <div className="pep-actions">
                  <button className="pep-save-btn" onClick={saveProfile} disabled={profileSaving}>
                    {profileSaving ? <><div className="pep-spinner" /> Saving…</> : <><FaSave /> Save Changes</>}
                  </button>
                  <button className="pep-discard-btn" onClick={cancelEditProfile}>Discard</button>
                </div>
              </div>
            ) : (
              /* ── VIEW MODE ── */
              <div className="profile-fields">
                {[
                  { label: "Full Name",   val: user?.fullName,  icon: <FaUser /> },
                  { label: "Email",       val: user?.email,     icon: <FaEnvelope /> },
                  { label: "Phone",       val: user?.phone,     icon: <FaPhone /> },
                  { label: "Enrolled",    val: `${totalCourses} course${totalCourses !== 1 ? "s" : ""}`, icon: <FaBook /> },
                  { label: "Total Spent", val: `₹${enrollments.reduce((a, e) => a + (e.paidAmount || 0), 0).toLocaleString()}`, icon: <FaChartLine /> },
                ].map((f) => (
                  <div className="profile-field-row" key={f.label}>
                    <div className="pf-icon">{f.icon}</div>
                    <div className="pf-content">
                      <div className="pf-label">{f.label}</div>
                      <div className="pf-val">{f.val || "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isEditingProfile && (
              <button className="profile-logout-btn" onClick={logout}><FiLogOut /> Sign Out</button>
            )}
          </div>
        )}

      </main>

      {/* ─── CERTIFICATE FULLSCREEN MODAL ─── */}
      {showCertificate && (
        <div className="cert-modal-overlay" onClick={() => setShowCertificate(false)}>
          <div className="cert-modal-inner" onClick={e => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={() => setShowCertificate(false)}>✕</button>
            <div className="cert-modal-actions-top">
              <button className="cert-modal-dl-btn" onClick={() => { setDownloadOptions(true); setShowCertificate(false); }}>
                <FaDownload /> Download
              </button>
            </div>
            <div className="certificate-card">
              <div className="cert-bg-lines" />
              <div className="cert-top">
                <img src={logo} alt="Learnify" className="cert-logo" />
                <div className="cert-badge">✦ OFFICIAL CERTIFICATE ✦</div>
              </div>
              <p className="cert-awarded">This certifies that</p>
              <h1 className="cert-student-name">{user?.fullName}</h1>
              <p className="cert-has-completed">has successfully completed</p>
              <h2 className="cert-course-name">{certCourse}</h2>
              <div className="cert-details-row">
                <div><span>Score</span><strong>{getCourseScore(enrollments.find(e => e.courseTitle === certCourse)?._id)}%</strong></div>
                <div><span>Grade</span><strong>Distinction</strong></div>
                <div><span>Date</span><strong>{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</strong></div>
              </div>
              <div className="cert-footer">
                <div className="cert-sig"><div className="cert-sig-line" /><p>Learnify Education</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DOWNLOAD OPTIONS MODAL ─── */}
      {downloadOptions && (
        <div className="cert-modal-overlay" onClick={() => setDownloadOptions(false)}>
          <div className="dl-modal" onClick={e => e.stopPropagation()}>
            <div ref={certRef} className="certificate-card" style={{ transform: "scale(0.6)", transformOrigin: "top center", marginBottom: -160 }}>
              <div className="cert-top">
                <img src={logo} alt="Learnify" className="cert-logo" />
              </div>
              <h1 className="cert-student-name">{user?.fullName}</h1>
              <h2 className="cert-course-name">{certCourse}</h2>
              <div className="cert-details-row">
                <div><span>Score</span><strong>{getCourseScore(enrollments.find(e => e.courseTitle === certCourse)?._id)}%</strong></div>
              </div>
            </div>
            <h3>Download Certificate</h3>
            <p>{certCourse}</p>
            <div className="dl-btns">
              <button onClick={downloadJPG}><FaDownload /> Download as JPG</button>
              <button onClick={downloadPDF}><FaFileAlt /> Download as PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;