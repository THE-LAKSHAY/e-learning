import React, { useState, useRef, useEffect } from "react";
import "./Testimonials.css";

const reviews = [
  {
    name:    "Aisha Sharma",
    role:    "Python Developer",
    avatar:  "https://i.pravatar.cc/150?img=47",
    rating:  5,
    course:  "Python Fundamentals",
    text:    "This platform completely changed how I think about coding. The projects were real and the instructor explained everything with clarity I've never seen before.",
    accent:  "#3b82f6",
  },
  {
    name:    "Rahul Mehra",
    role:    "Data Analyst",
    avatar:  "https://i.pravatar.cc/150?img=12",
    rating:  5,
    course:  "Machine Learning",
    text:    "The ML course is genuinely world-class. Step-by-step, hands-on, and full of real-world case studies. I landed a job within 2 months of finishing.",
    accent:  "#a78bfa",
  },
  {
    name:    "Priya Nair",
    role:    "Frontend Engineer",
    avatar:  "https://i.pravatar.cc/150?img=32",
    rating:  5,
    course:  "CSS Styling",
    text:    "From zero to building full responsive UIs. The animations module alone was worth it. Highly recommended for anyone wanting to level up their frontend game.",
    accent:  "#10b981",
  },
  {
    name:    "Dev Kapoor",
    role:    "Backend Engineer",
    avatar:  "https://i.pravatar.cc/150?img=68",
    rating:  4,
    course:  "SQL Fundamentals",
    text:    "SQL finally clicked for me here. The query builder exercises and real database dumps made the difference. Excellent teaching style.",
    accent:  "#f59e0b",
  },
  {
    name:    "Sara Verma",
    role:    "Software Intern",
    avatar:  "https://i.pravatar.cc/150?img=23",
    rating:  5,
    course:  "Java OOP",
    text:    "I had tried 4 other courses on OOP before this one. None of them made inheritance and polymorphism as intuitive as this course does. Outstanding.",
    accent:  "#ef4444",
  },
  {
    name:    "Arjun Patel",
    role:    "Full Stack Dev",
    avatar:  "https://i.pravatar.cc/150?img=59",
    rating:  5,
    course:  "AI Fundamentals",
    text:    "Perfect intro to AI for developers. Concepts are clear, projects are practical, and the certificate opened real doors for me at interviews.",
    accent:  "#06b6d4",
  },
];

const Stars = ({ count, accent }) => (
  <div className="tm-stars">
    {[1,2,3,4,5].map(i => (
      <svg key={i} viewBox="0 0 16 16" fill={i <= count ? accent : "rgba(255,255,255,0.12)"}>
        <path d="M8 1l1.85 3.75 4.15.6-3 2.92.7 4.11L8 10.4l-3.7 1.98.7-4.11L2 5.35l4.15-.6z"/>
      </svg>
    ))}
  </div>
);

const Card = ({ r, index, visible }) => (
  <article
    className={`tm-card ${visible ? "tm-card-vis" : ""}`}
    style={{ "--a": r.accent, "--i": `${index * 0.08}s` }}
  >
    {/* glow */}
    <div className="tm-card-glow" style={{ background: r.accent }} />

    {/* quote mark */}
    <div className="tm-quote-mark" style={{ color: r.accent }}>"</div>

    {/* course badge */}
    <span className="tm-course-badge" style={{ color: r.accent, borderColor: `${r.accent}40`, background: `${r.accent}12` }}>
      {r.course}
    </span>

    {/* stars */}
    <Stars count={r.rating} accent={r.accent} />

    {/* text */}
    <p className="tm-text">{r.text}</p>

    {/* footer */}
    <div className="tm-footer">
      <div className="tm-avatar-wrap" style={{ borderColor: `${r.accent}60` }}>
        <img src={r.avatar} alt={r.name} className="tm-avatar" />
      </div>
      <div className="tm-info">
        <span className="tm-name">
          {r.name}
          <svg className="tm-verified" viewBox="0 0 20 20" fill={r.accent}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </span>
        <span className="tm-role">{r.role}</span>
      </div>
    </div>

    {/* bottom border sweep */}
    <div className="tm-card-bar" style={{ background: `linear-gradient(90deg, ${r.accent}, transparent)` }} />
  </article>
);

const VISIBLE = 3; // cards per page

const Testimonials = () => {
  const [page,    setPage]    = useState(0);
  const [visible, setVisible] = useState(false);
  const secRef = useRef(null);

  const totalPages = Math.ceil(reviews.length / VISIBLE);
  const paged = reviews.slice(page * VISIBLE, page * VISIBLE + VISIBLE);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); ob.disconnect(); } },
      { threshold: 0.08 }
    );
    if (secRef.current) ob.observe(secRef.current);
    return () => ob.disconnect();
  }, []);

  const prev = () => setPage(p => (p - 1 + totalPages) % totalPages);
  const next = () => setPage(p => (p + 1) % totalPages);

  return (
    <section className="tm-root" id="reviews" ref={secRef}>

      <div className="tm-mesh" />

      {/* ── HEADER ── */}
      <div className={`tm-header ${visible ? "tm-header-vis" : ""}`}>

        <div className="tm-eyebrow">
          <span className="tm-eyebrow-dot" />
          Student Reviews
        </div>

        <h2 className="tm-title">
          Real results from<br />
          <span className="tm-title-grad">real learners</span>
        </h2>

        <p className="tm-subtitle">
          Over 5,000 students have levelled up their careers. Here's what they say.
        </p>

        {/* overall rating */}
        <div className="tm-overall">
          <div className="tm-overall-score">4.9</div>
          <div className="tm-overall-right">
            <Stars count={5} accent="#f59e0b" />
            <span className="tm-overall-label">Based on 5,000+ reviews</span>
          </div>
        </div>

      </div>

      {/* ── CARDS ── */}
      <div className="tm-grid" key={page}>
        {paged.map((r, i) => (
          <Card key={r.name} r={r} index={i} visible={visible} />
        ))}
      </div>

      {/* ── NAVIGATION ── */}
      <div className={`tm-nav ${visible ? "tm-nav-vis" : ""}`}>
        {/* dots */}
        <div className="tm-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`tm-dot ${i === page ? "tm-dot-on" : ""}`}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>

        {/* arrows */}
        <div className="tm-arrows">
          <button className="tm-arrow" onClick={prev} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <button className="tm-arrow" onClick={next} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;