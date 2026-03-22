import React, { useState } from "react";
import "./TestDriveForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaLock, FaPlay, FaCheckCircle,
  FaStar, FaClock, FaBook, FaUsers, FaTrophy,
  FaDownload, FaTimes, FaChevronRight, FaChevronDown,
  FaFileAlt, FaComments, FaClipboardList, FaUnlock,
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";

/* ═══════════════════════════════════════════
   COURSE VIDEO DATA
═══════════════════════════════════════════ */
const COURSE_VIDEOS = {
  "Python Fundamentals": [
    { title: "Introduction to Python",  duration: "5 min",  video: "https://www.youtube.com/embed/rfscVS0vtbw", free: true  },
    { title: "Variables & Data Types",  duration: "10 min", free: false },
    { title: "Control Flow",            duration: "8 min",  free: false },
    { title: "Functions",               duration: "12 min", free: false },
  ],
  "OOPS in Python": [
    { title: "Classes & Objects",       duration: "7 min",  video: "https://www.youtube.com/embed/JeznW_7DlB0", free: true  },
    { title: "Inheritance",             duration: "9 min",  free: false },
    { title: "Encapsulation",           duration: "6 min",  free: false },
    { title: "Polymorphism",            duration: "10 min", free: false },
  ],
  "AI Fundamentals": [
    { title: "What is AI",              duration: "6 min",  video: "https://www.youtube.com/embed/2ePf9rue1Ao", free: true  },
    { title: "History of AI",           duration: "9 min",  free: false },
    { title: "AI Applications",         duration: "10 min", free: false },
    { title: "Future of AI",            duration: "8 min",  free: false },
  ],
  "Machine Learning": [
    { title: "Intro to Machine Learning", duration: "7 min", video: "https://www.youtube.com/embed/Gv9_4yMHFhI", free: true },
    { title: "Supervised Learning",     duration: "12 min", free: false },
    { title: "Unsupervised Learning",   duration: "9 min",  free: false },
    { title: "ML Models",               duration: "11 min", free: false },
  ],
  "SQL Fundamentals": [
    { title: "Intro to SQL",            duration: "5 min",  video: "https://www.youtube.com/embed/HXV3zeQKqGY", free: true },
    { title: "SELECT Queries",          duration: "7 min",  free: false },
    { title: "Filtering Data",          duration: "6 min",  free: false },
    { title: "Sorting Data",            duration: "8 min",  free: false },
  ],
  "Queries & Joins": [
    { title: "Understanding Joins",     duration: "6 min",  video: "https://www.youtube.com/embed/9yeOJ0ZMUYw", free: true },
    { title: "Inner Join",              duration: "7 min",  free: false },
    { title: "Left Join",               duration: "6 min",  free: false },
    { title: "Complex Queries",         duration: "9 min",  free: false },
  ],
  "Java Fundamentals": [
    { title: "Java Introduction",       duration: "5 min",  video: "https://www.youtube.com/embed/eIrMbAQSU34", free: true },
    { title: "Variables",               duration: "6 min",  free: false },
    { title: "Loops",                   duration: "7 min",  free: false },
    { title: "Methods",                 duration: "8 min",  free: false },
  ],
  "OOPS in Java": [
    { title: "Java Classes",            duration: "6 min",  video: "https://www.youtube.com/embed/UmnCZ7-9yDY", free: true },
    { title: "Inheritance",             duration: "7 min",  free: false },
    { title: "Abstraction",             duration: "6 min",  free: false },
    { title: "Interfaces",              duration: "8 min",  free: false },
  ],
  "HTML Fundamentals": [
    { title: "HTML Basics",             duration: "4 min",  video: "https://www.youtube.com/embed/pQN-pnXPaVg", free: true },
    { title: "Tags & Elements",         duration: "6 min",  free: false },
    { title: "Forms",                   duration: "7 min",  free: false },
    { title: "Tables",                  duration: "5 min",  free: false },
  ],
  "CSS Styling": [
    { title: "Intro to CSS",            duration: "4 min",  video: "https://www.youtube.com/embed/1PnVor36_40", free: true },
    { title: "Selectors",               duration: "6 min",  free: false },
    { title: "Flexbox",                 duration: "8 min",  free: false },
    { title: "Responsive Design",       duration: "7 min",  free: false },
  ],
};

/* ═══════════════════════════════════════════
   COURSE NOTES DATA
═══════════════════════════════════════════ */
const COURSE_NOTES = {
  "Python Fundamentals": [
    {
      title: "Chapter 1 — Python Basics",
      preview: "Python is a high-level, interpreted programming language known for its clean syntax and readability.",
      content: `**What is Python?**\nPython is a high-level, general-purpose programming language created by Guido van Rossum in 1991. It emphasizes code readability and uses indentation to define blocks.\n\n**Key Features:**\n• Interpreted — runs line by line\n• Dynamically typed — no need to declare variable types\n• Extensive standard library\n• Multi-paradigm: OOP, functional, procedural\n\n**Your First Program:**\n\`\`\`python\nprint("Hello, World!")\n\`\`\`\n\n**Variables:**\n\`\`\`python\nname = "Alice"\nage = 25\npi = 3.14\nis_student = True\n\`\`\``,
      pages: 12, free: true,
    },
    {
      title: "Chapter 2 — Control Flow & Loops",
      preview: "Master if-else conditions, for loops, while loops and understand Python's indentation rules.",
      content: "Full content unlocked after enrollment.",
      pages: 18, free: false,
    },
    {
      title: "Chapter 3 — Functions & Modules",
      preview: "Learn to write reusable code blocks, pass arguments, return values, and import modules.",
      content: "Full content unlocked after enrollment.",
      pages: 22, free: false,
    },
    {
      title: "Chapter 4 — Data Structures",
      preview: "Deep dive into lists, tuples, dictionaries and sets with real-world examples.",
      content: "Full content unlocked after enrollment.",
      pages: 28, free: false,
    },
  ],
  "AI Fundamentals": [
    {
      title: "Chapter 1 — Introduction to AI",
      preview: "Artificial Intelligence is the simulation of human intelligence in machines programmed to think and learn.",
      content: `**What is Artificial Intelligence?**\nAI refers to the simulation of human intelligence in machines. These systems are programmed to think, reason, and learn from data.\n\n**Types of AI:**\n• Narrow AI — designed for a specific task (e.g., Siri, chess engines)\n• General AI — theoretical human-level intelligence\n• Super AI — surpasses human intelligence (theoretical)\n\n**Core Branches:**\n• Machine Learning\n• Natural Language Processing (NLP)\n• Computer Vision\n• Robotics\n\n**Real-World Applications:**\n• Recommendation systems (Netflix, Spotify)\n• Self-driving cars\n• Medical diagnosis\n• Fraud detection`,
      pages: 10, free: true,
    },
    {
      title: "Chapter 2 — Machine Learning Basics",
      preview: "Understand supervised, unsupervised, and reinforcement learning paradigms.",
      content: "Full content unlocked after enrollment.",
      pages: 20, free: false,
    },
    {
      title: "Chapter 3 — Neural Networks",
      preview: "Explore the architecture of neural networks, activation functions, and backpropagation.",
      content: "Full content unlocked after enrollment.",
      pages: 26, free: false,
    },
  ],
  "SQL Fundamentals": [
    {
      title: "Chapter 1 — Introduction to Databases",
      preview: "SQL is a domain-specific language used for managing and querying relational databases.",
      content: `**What is SQL?**\nStructured Query Language (SQL) is used to communicate with relational databases. Created in 1970s by IBM researchers.\n\n**Key Concepts:**\n• Database — organized collection of data\n• Table — rows and columns storing related data\n• Schema — blueprint of the database structure\n\n**Basic SQL Commands:**\n\`\`\`sql\n-- Create a table\nCREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  grade INT\n);\n\n-- Insert data\nINSERT INTO students VALUES (1, 'Alice', 90);\n\n-- Query data\nSELECT * FROM students;\n\`\`\`\n\n**Database Systems:**\n• MySQL, PostgreSQL, SQLite, MS SQL Server`,
      pages: 14, free: true,
    },
    {
      title: "Chapter 2 — Advanced Queries",
      preview: "Master WHERE clauses, aggregate functions, GROUP BY, HAVING and subqueries.",
      content: "Full content unlocked after enrollment.",
      pages: 24, free: false,
    },
    {
      title: "Chapter 3 — Joins & Relationships",
      preview: "Learn INNER, LEFT, RIGHT, FULL OUTER joins and database normalization.",
      content: "Full content unlocked after enrollment.",
      pages: 20, free: false,
    },
  ],
};

const getNotesForCourse = (title) => {
  if (COURSE_NOTES[title]) return COURSE_NOTES[title];
  return [
    {
      title: "Chapter 1 — Core Concepts",
      preview: `Foundational notes covering the essential concepts of ${title}. Start here for a structured overview.`,
      content: `**${title} — Core Concepts**\n\nThis chapter covers the fundamental concepts you need to master ${title}.\n\n**Key Topics:**\n• Introduction and overview\n• Core terminology and definitions\n• Practical applications\n• Getting started guide\n\n**Why This Matters:**\nUnderstanding the core concepts will give you a strong foundation for everything that follows in this course.`,
      pages: 14, free: true,
    },
    {
      title: "Chapter 2 — Intermediate Techniques",
      preview: "Build upon the basics with hands-on techniques and pattern-based problem solving.",
      content: "Full content unlocked after enrollment.",
      pages: 20, free: false,
    },
    {
      title: "Chapter 3 — Advanced Applications",
      preview: "Apply your skills to real-world projects and industry-grade challenges.",
      content: "Full content unlocked after enrollment.",
      pages: 26, free: false,
    },
    {
      title: "Chapter 4 — Interview Preparation",
      preview: "Curated questions, patterns, and mock scenarios used in top tech company interviews.",
      content: "Full content unlocked after enrollment.",
      pages: 18, free: false,
    },
  ];
};

/* ═══════════════════════════════════════════
   QUIZ QUESTIONS (mini quiz — 3 Qs)
═══════════════════════════════════════════ */
const QUIZ = [
  { q: "What does HTML stand for?", opts: ["Hyper Text Markup Language","High Text Machine Language","Hyperlinks Text Mark Language","None"], ans: "Hyper Text Markup Language" },
  { q: "Which language is used for styling web pages?", opts: ["HTML","CSS","Python","Java"], ans: "CSS" },
  { q: "Python is a ____ level language?", opts: ["Low level","High level","Assembly","Machine"], ans: "High level" },
];

const LEARN_ITEMS = [
  { title: "Non Refundable",    sub: "Payment once made is non-refundable"  },
  { title: "Learn Industry Skills",  sub: "Resume-ready competencies"     },
  { title: "Master Core Concepts",   sub: "Deep, structured understanding"},
  { title: "Interview Preparation",  sub: "Crack top tech interviews"     },
  { title: "Practice Exercises",     sub: "100+ curated challenges"       },
  { title: "Lifetime Access",        sub: "Learn at your own pace"        },
];

/* ═══════════════════════════════════════════
   DISCUSSION DATA
═══════════════════════════════════════════ */
const DISCUSSIONS = [
  { user: "Priya M.", avatar: "PM", time: "2h ago", msg: "The first lesson was super clear! Any tips for practicing the exercises?", likes: 12, replies: 3 },
  { user: "Rahul S.", avatar: "RS", time: "5h ago", msg: "Can someone explain the difference between lists and tuples again? The notes were helpful but I want more clarity.", likes: 8, replies: 5 },
  { user: "Aisha K.", avatar: "AK", time: "1d ago", msg: "Completed the free preview — enrolling today. This course looks amazing!", likes: 24, replies: 1 },
];

/* ═══════════════════════════════════════════
   NOTE MODAL
═══════════════════════════════════════════ */
const NoteModal = ({ note, onClose, onEnroll }) => {
  if (!note) return null;

  const renderContent = (text) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h4 key={i} className="note-content-h">{line.replace(/\*\*/g, "")}</h4>;
      }
      if (line.startsWith("• ")) {
        return <li key={i} className="note-content-li">{line.slice(2)}</li>;
      }
      if (line.startsWith("```")) {
        return null;
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="note-content-p">{line}</p>;
    });

  return (
    <div className="nm-backdrop" onClick={onClose}>
      <div className="nm-panel" onClick={(e) => e.stopPropagation()}>
        <div className="nm-header">
          <div className="nm-header-left">
            <span className="nm-badge"><FaFileAlt style={{ fontSize: 10 }} /> Lecture Notes</span>
            <h3 className="nm-title">{note.title}</h3>
            <span className="nm-pages">{note.pages} pages</span>
          </div>
          <button className="nm-close" onClick={onClose}><FaTimes /></button>
        </div>

        {note.free ? (
          <div className="nm-body">
            <div className="nm-content-area">
              {renderContent(note.content)}
            </div>
            <div className="nm-footer-bar">
              <span className="nm-free-badge"><FaUnlock style={{ fontSize: 10 }} /> Free Preview</span>
              <span className="nm-pages-info">Page 1 of {note.pages}</span>
            </div>
          </div>
        ) : (
          <div className="nm-locked-body">
            <div className="nm-lock-ring">
              <FaLock className="nm-lock-icon" />
            </div>
            <h4>Chapter Locked</h4>
            <p>This chapter is available after enrollment. Enroll now to unlock all {note.pages} pages of structured notes, code examples, and practice exercises.</p>
            <div className="nm-preview-strip">
              <span className="nm-preview-label">Preview:</span>
              <p className="nm-preview-text">{note.preview}</p>
            </div>
            <button className="nm-enroll-btn" onClick={onEnroll}>
              <HiSparkles style={{ marginRight: 8 }} /> Enroll to Unlock All Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const TestDriveForm = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const course     = state?.car;

  const [selectedVideo,    setSelectedVideo]    = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizStarted,      setQuizStarted]      = useState(false);
  const [answers,          setAnswers]          = useState({});
  const [quizCompleted,    setQuizCompleted]    = useState(false);
  const [activeNote,       setActiveNote]       = useState(null);
  const [likedPosts,       setLikedPosts]       = useState([]);
  const [activeTab,        setActiveTab]        = useState("curriculum"); // curriculum | notes | discuss

  if (!course) {
    return (
      <div style={{ padding: "120px 60px", color: "#edf0fa", fontFamily: "Outfit,sans-serif" }}>
        <p>No course selected. Please go back and choose a course.</p>
      </div>
    );
  }

  const lessons   = COURSE_VIDEOS[course.title] || [];
  const notes     = getNotesForCourse(course.title);
  const totalMinutes = lessons.reduce((acc, l) => acc + parseInt(l.duration), 0);
  const courseCompleted = completedLessons.length === lessons.length && lessons.length > 0;

  const handleEnroll = () => navigate("/book-now", { state: { car: course } });

  const openVideo = (lesson, index) => {
    if (!lesson.free) return;
    setSelectedVideo(lesson.video);
    if (!completedLessons.includes(index)) setCompletedLessons([...completedLessons, index]);
  };

  const score = QUIZ.filter((q, i) => answers[i] === q.ans).length;
  const getScoreBadge = () => {
    if (score === QUIZ.length) return { cls: "perfect", text: "Perfect Score! 🎉" };
    if (score >= QUIZ.length / 2) return { cls: "good", text: "Well Done! 👏" };
    return { cls: "try", text: "Keep Practicing 💪" };
  };

  const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const progressPct = lessons.length ? Math.round((completedLessons.length / lessons.length) * 100) : 0;

  return (
    <div className="course-page">

      {/* ── TOPBAR ── */}
      <div className="course-topbar">
        <button className="back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft style={{ fontSize: 12 }} /> Back to Courses
        </button>
        <div className="topbar-center">
          <span className="topbar-brand">LV Learnify</span>
          {user.fullName && (
            <span className="topbar-user">
              <span className="topbar-avatar">{user.fullName.charAt(0)}</span>
              {user.fullName}
            </span>
          )}
        </div>
        <button className="enroll-top-btn" onClick={handleEnroll}>
          Enroll Now <FaChevronRight style={{ fontSize: 11, marginLeft: 4 }} />
        </button>
      </div>

      {/* ── HERO ── */}
      <div className="course-hero">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <HiLightningBolt style={{ fontSize: 11 }} /> Online Course
          </div>
          <h1>{course.title}</h1>
          <p>{course.desc || "Master this skill from the ground up with expert-led video lessons, structured notes, and a certificate of completion."}</p>

          <div className="meta">
            <span className="meta-chip"><FaBook className="meta-chip-icon" /> {lessons.length} Lessons</span>
            <span className="meta-chip"><FaClock className="meta-chip-icon" /> {totalMinutes} min</span>
            <span className="meta-chip"><FaStar className="meta-chip-icon" style={{ color: "#f59e0b" }} /> 4.8</span>
            <span className="meta-chip"><FaUsers className="meta-chip-icon" /> 3.2k Students</span>
            <span className="meta-chip"><FaFileAlt className="meta-chip-icon" /> {notes.length} Notes</span>
          </div>

          <div className="price-row">
            <span className="price-old">{course.price || "₹2,999"}</span>
            <span className="price-new">{course.offer || "₹999"}</span>
            <span className="price-save">67% OFF</span>
          </div>

          <div className="hero-cta-row">
            <button className="enroll-btn" onClick={handleEnroll}>
              <HiSparkles style={{ marginRight: 8, fontSize: 16 }} />
              Enroll Now — Get Instant Access
            </button>
          </div>
        </div>

        <div className="hero-img">
          <img src={course.image} alt={course.title} />
        </div>
      </div>

      {/* ── PROGRESS TRACKER ── */}
      {completedLessons.length > 0 && (
        <div className="progress-tracker">
          <div className="pt-inner">
            <div className="pt-left">
              <span className="pt-icon">📈</span>
              <div>
                <strong>Your Progress</strong>
                <span>{completedLessons.length} of {lessons.length} lessons completed</span>
              </div>
            </div>
            <div className="pt-bar-wrap">
              <div className="pt-bar">
                <div className="pt-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="pt-pct">{progressPct}%</span>
            </div>
            {courseCompleted && (
              <span className="pt-complete-tag"><FaCheckCircle style={{ marginRight: 4, fontSize: 10 }} /> Complete!</span>
            )}
          </div>
        </div>
      )}

      {/* ── WHAT YOU'LL LEARN ── */}
      <div className="learn-section">
        <div className="section-head">
          <div className="section-eyebrow"><FaCheckCircle style={{ fontSize: 10 }} /> Learning Outcomes</div>
          <h2>What You'll Learn</h2>
          <p>Skills and knowledge you'll gain by completing this course.</p>
        </div>
        <div className="learn-grid">
          {LEARN_ITEMS.map((item) => (
            <div className="learn-tile" key={item.title}>
              <div className="learn-check"><FaCheckCircle style={{ fontSize: 12 }} /></div>
              <div className="learn-tile-text">
                <strong>{item.title}</strong>
                <span>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABBED SECTION: Curriculum / Notes / Discussion ── */}
      <div className="tabbed-section">
        <div className="tab-header-bar">
          <button className={`tab-btn ${activeTab === "curriculum" ? "tab-btn--active" : ""}`} onClick={() => setActiveTab("curriculum")}>
            <FaPlay style={{ fontSize: 10 }} /> Curriculum
          </button>
          <button className={`tab-btn ${activeTab === "notes" ? "tab-btn--active" : ""}`} onClick={() => setActiveTab("notes")}>
            <FaFileAlt style={{ fontSize: 10 }} /> Lecture Notes
          </button>
          <button className={`tab-btn ${activeTab === "discuss" ? "tab-btn--active" : ""}`} onClick={() => setActiveTab("discuss")}>
            <FaComments style={{ fontSize: 10 }} /> Discussion
          </button>
          <div className="tab-active-line" style={{ transform: `translateX(${activeTab === "curriculum" ? "0%" : activeTab === "notes" ? "100%" : "200%"})` }} />
        </div>

        {/* CURRICULUM */}
        {activeTab === "curriculum" && (
          <div className="tab-panel">
            <div className="section-head">
              <div className="section-eyebrow"><FaBook style={{ fontSize: 10 }} /> Course Content</div>
              <h2>Course Curriculum</h2>
              <p>{lessons.length} lessons · {totalMinutes} minutes · First lesson free to preview</p>
            </div>
            <div className="curriculum-list">
              {lessons.map((lesson, i) => {
                const isDone    = completedLessons.includes(i);
                const isPreview = lesson.free;
                return (
                  <div
                    key={i}
                    className={`lesson ${isPreview ? "preview" : "locked"} ${isDone ? "completed" : ""}`}
                    onClick={() => openVideo(lesson, i)}
                  >
                    <div className="lesson-left">
                      <div className="lesson-num">
                        {isDone ? <FaCheckCircle style={{ fontSize: 13 }} /> : i + 1}
                      </div>
                      <div className="lesson-info">
                        <h4>{lesson.title}</h4>
                        <span><FaClock style={{ marginRight: 4, fontSize: 10, opacity: .6 }} />{lesson.duration}</span>
                      </div>
                    </div>
                    <div className="lesson-right">
                      {isDone ? (
                        <span className="done-tag"><FaCheckCircle style={{ fontSize: 9 }} /> Completed</span>
                      ) : isPreview ? (
                        <span className="preview-tag"><FaPlay style={{ fontSize: 9 }} /> Free Preview</span>
                      ) : (
                        <span className="locked-tag"><FaLock style={{ fontSize: 9 }} /> Enroll to Unlock</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NOTES */}
        {activeTab === "notes" && (
          <div className="tab-panel">
            <div className="section-head">
              <div className="section-eyebrow"><FaFileAlt style={{ fontSize: 10 }} /> Study Material</div>
              <h2>Lecture Notes</h2>
              <p>{notes.length} chapters · Structured PDF-style notes with code examples</p>
            </div>
            <div className="notes-grid">
              {notes.map((note, i) => (
                <button
                  key={i}
                  className={`note-card ${note.free ? "note-card--free" : "note-card--locked"}`}
                  onClick={() => setActiveNote(note)}
                >
                  <div className="note-card-top">
                    <div className="note-icon-wrap">
                      {note.free ? <FaFileAlt className="note-icon" /> : <FaLock className="note-icon" />}
                    </div>
                    <span className={`note-status ${note.free ? "note-status--free" : "note-status--locked"}`}>
                      {note.free ? <><FaUnlock style={{ fontSize: 9 }} /> Free</> : <><FaLock style={{ fontSize: 9 }} /> Locked</>}
                    </span>
                  </div>
                  <h4 className="note-card-title">{note.title}</h4>
                  <p className="note-card-preview">{note.preview}</p>
                  <div className="note-card-footer">
                    <span className="note-pages"><FaBook style={{ fontSize: 10 }} /> {note.pages} pages</span>
                    <span className="note-action">
                      {note.free ? "Read Now →" : "Unlock →"}
                    </span>
                  </div>
                  {!note.free && <div className="note-lock-overlay"><div className="note-lock-shimmer" /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DISCUSSION */}
        {activeTab === "discuss" && (
          <div className="tab-panel">
            <div className="section-head">
              <div className="section-eyebrow"><FaComments style={{ fontSize: 10 }} /> Community</div>
              <h2>Discussion Board</h2>
              <p>Ask questions, share insights, and learn alongside peers.</p>
            </div>
            <div className="discuss-list">
              {DISCUSSIONS.map((post, i) => (
                <div className="discuss-card" key={i}>
                  <div className="discuss-avatar">{post.avatar}</div>
                  <div className="discuss-body">
                    <div className="discuss-meta">
                      <strong className="discuss-user">{post.user}</strong>
                      <span className="discuss-time">{post.time}</span>
                    </div>
                    <p className="discuss-msg">{post.msg}</p>
                    <div className="discuss-actions">
                      <button
                        className={`discuss-like ${likedPosts.includes(i) ? "liked" : ""}`}
                        onClick={() => setLikedPosts((lp) => lp.includes(i) ? lp.filter((x) => x !== i) : [...lp, i])}
                      >
                        ♥ {post.likes + (likedPosts.includes(i) ? 1 : 0)}
                      </button>
                      <span className="discuss-replies">💬 {post.replies} replies</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="discuss-compose">
                <div className="compose-avatar">{user.fullName ? user.fullName.charAt(0) : "?"}</div>
                <div className="compose-input">
                  <input type="text" placeholder="Ask a question or share an insight..." readOnly />
                  <button className="compose-btn" onClick={handleEnroll}>Post (Enroll first)</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CERTIFICATE ── */}
      {courseCompleted && quizCompleted && (
        <div className="certificate-section">
          <div className="cert-card">
            <div className="cert-left">
              <span className="cert-emoji">🏆</span>
              <h2>Course <span>Completed!</span></h2>
              <p>Congratulations — you've completed <strong>{course.title}</strong> and passed the quiz. Your certificate is ready.</p>
              {user.fullName && <p className="cert-username">Issued to: <strong>{user.fullName}</strong></p>}
              <div className="cert-tags">
                <span className="cert-tag green"><FaCheckCircle style={{ marginRight: 4, fontSize: 9 }} /> Verified</span>
                <span className="cert-tag violet"><FaTrophy style={{ marginRight: 4, fontSize: 9 }} /> {course.title}</span>
              </div>
            </div>
            <div className="cert-right">
              <button className="certificate-btn">
                <FaDownload style={{ marginRight: 10 }} /> Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO MODAL ── */}
      {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div className="video-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedVideo(null)}>
              <FaTimes style={{ fontSize: 12 }} /> Close
            </button>
            <iframe src={selectedVideo} title="Course Video" allowFullScreen />
          </div>
        </div>
      )}

      {/* ── NOTE MODAL ── */}
      {activeNote && (
        <NoteModal note={activeNote} onClose={() => setActiveNote(null)} onEnroll={handleEnroll} />
      )}

    </div>
  );
};

export default TestDriveForm;