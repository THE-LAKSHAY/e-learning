import React, { useState, useEffect, useRef, useCallback } from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

import carVideo  from "./assets/E2.mp4";
import carVideo1 from "./assets/E1.mp4";
import logo      from "./assets/LDP Logo.png";

/* ─────────────────────────────────────────
   SLIDE DATA
───────────────────────────────────────── */
const slides = [
  {
    eyebrow: "Learning Library",
    titleLine1: "Start",
    titleLine2: "Learning",
    titleLine3: "Grow Fast",
    sub:     "Books · PDFs · Study Material · Weekly Updates",
    video:   carVideo1,
    tag:     "200+ Resources",
    accent:  "#f5c842",
    accentRgb: "245,200,66",
    meshA:   "rgba(245,200,66,0.12)",
    meshB:   "rgba(255,120,40,0.07)",
    specs: [
      { label: "Resources",  val: "200+ Books"      },
      { label: "Categories", val: "Tech / AI / Dev" },
      { label: "Format",     val: "PDF & Notes"     },
      { label: "Access",     val: "Online Anytime"  },
      { label: "Download",   val: "Enabled"         },
      { label: "Updates",    val: "Weekly"          },
      { label: "Level",      val: "All Levels"      },
      { label: "Language",   val: "English"         },
    ],
  },
  {
    eyebrow: "Featured Track",
    titleLine1: "Explore",
    titleLine2: "Every",
    titleLine3: "Resource",
    sub:     "100+ Lessons · 10+ Courses · Learn Anytime",
    video:   carVideo,
    tag:     "Beginner Friendly",
    accent:  "#00e5ff",
    accentRgb: "0,229,255",
    meshA:   "rgba(0,229,255,0.10)",
    meshB:   "rgba(0,100,255,0.08)",
    specs: [
      { label: "Courses",     val: "10+"                 },
      { label: "Lessons",     val: "100+"                },
      { label: "Level",       val: "Beginner → Advanced" },
      { label: "Access",      val: "Lifetime"            },
      { label: "Certificate", val: "Included"            },
      { label: "Projects",    val: "Real-world"          },
      { label: "Support",     val: "Community"           },
      { label: "Updates",     val: "Regular"             },
    ],
  },
];

const NAV_LINKS = [
  { label: "Home",    id: "hero"      },
  { label: "Courses", id: "inventory" },
  { label: "About",   id: "about"     },
  { label: "Reviews", id: "reviews"   },
  { label: "Blog",    id: "blog"      },
  { label: "Contact", id: "contact"   },
];

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
const Counter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const num = parseInt(value);
  useEffect(() => {
    let start = 0;
    const step = num / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [num]);
  return <>{count}{suffix}</>;
};

/* ─────────────────────────────────────────
   MAGNETIC BUTTON HOOK
───────────────────────────────────────── */
const useMagnetic = (strength = 0.35) => {
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    ref.current.style.transform = `translate(${dx}px,${dy}px)`;
  }, [strength]);
  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0,0)";
  }, []);
  return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave };
};

/* ─────────────────────────────────────────
   NOISE OVERLAY
───────────────────────────────────────── */
const Noise = () => (
  <svg className="hs2-noise" xmlns="http://www.w3.org/2000/svg">
    <filter id="hsNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#hsNoise)" opacity="0.06"/>
  </svg>
);

/* ─────────────────────────────────────────
   TICKER
───────────────────────────────────────── */
const TICKER_ITEMS = [
  "50,000+ Learners Enrolled",
  "Batch 2026 Now Open",
  "Live Mentorship",
  "Real Career Outcomes",
  "Industry-Led Curriculum",
  "Certificate Programs",
  "Full-Stack · AI · Cloud · Design",
  "94% Placement Rate",
];
const Ticker = ({ accent }) => {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="hs2-ticker">
      <div className="hs2-ticker-track">
        {doubled.map((t, i) => (
          <span key={i} className="hs2-ticker-item">
            <span className="hs2-ticker-star" style={{ color: accent }}>✦</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const HeroSection = () => {
  const [current,   setCurrent]   = useState(0);
  const [prev,      setPrev]      = useState(null);
  const [animKey,   setAnimKey]   = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [activeId,  setActiveId]  = useState("hero");
  const [mousePos,  setMousePos]  = useState({ x: 0.5, y: 0.5 });
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  const timerRef    = useRef(null);
  const navigate    = useNavigate();
  const rootRef     = useRef(null);
  const slide       = slides[current];
  const loginMag    = useMagnetic(0.4);

  /* auto-slide */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => changeSlide((c) => (c + 1) % slides.length), 7000);
  }, []);

  const changeSlide = useCallback((nextFn) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent((c) => {
      const next = typeof nextFn === "function" ? nextFn(c) : nextFn;
      setPrev(c);
      return next;
    });
    setAnimKey((k) => k + 1);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 900);
  }, [transitioning]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  /* scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* mouse parallax */
  useEffect(() => {
    const fn = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  /* close menu */
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close, { once: true });
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const go = (dir) => {
    changeSlide((c) => (c + dir + slides.length) % slides.length);
    startTimer();
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveId(id);
    setMenuOpen(false);
  };

  const handleProfile = () =>
    navigate(localStorage.getItem("user") ? "/dashboard" : "/auth");

  const isLoggedIn = !!localStorage.getItem("user");
  const pxShift = (mousePos.x - 0.5) * 28;
  const pyShift = (mousePos.y - 0.5) * 18;

  return (
    <div className="hs2-root" id="hero" ref={rootRef}>
      <Noise />

      {/* ── MESH GRADIENT ATMOSPHERE ── */}
      <div
        className="hs2-mesh"
        style={{
          "--meshA": slide.meshA,
          "--meshB": slide.meshB,
          "--mx": mousePos.x,
          "--my": mousePos.y,
        }}
      />

      {/* ── DECORATIVE GRID LINES ── */}
      <div className="hs2-grid-overlay" />

      {/* ── VIDEO BACKGROUND ── */}
      <div className="hs2-videos">
        {slides.map((s, i) => (
          <video
            key={i}
            className={`hs2-video ${i === current ? "hs2-video--in" : i === prev ? "hs2-video--out" : ""}`}
            src={s.video}
            autoPlay loop muted playsInline
          />
        ))}
        <div className="hs2-video-grade" />
        <div className="hs2-video-side-fade" />
      </div>

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <header className={`hs2-nav ${scrolled ? "hs2-nav--solid" : ""}`}>
        {/* Accent underline bar */}
        <div className="hs2-nav-accent-line" style={{ background: `linear-gradient(90deg, transparent, rgba(${slide.accentRgb},0.9), transparent)` }} />

        {/* ── LOGO ── */}
        <button
          className="hs2-logo-wrap"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Home"
        >
          <div className="hs2-logo-ring" style={{ "--accent": slide.accent, "--accentRgb": slide.accentRgb }} />
          <img src={logo} alt="LV Learnify" className="hs2-logo-img" />
          <div className="hs2-logo-glow" style={{ background: `radial-gradient(ellipse at center, rgba(${slide.accentRgb},0.18) 0%, transparent 65%)` }} />
        </button>

        {/* ── NAV LINKS ── */}
        <nav className={`hs2-navlinks ${menuOpen ? "hs2-navlinks--open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="hs2-navlinks-pill">
            {NAV_LINKS.map((n) => (
              <button
                key={n.id}
                className={`hs2-navlink ${activeId === n.id ? "hs2-navlink--active" : ""}`}
                data-accent={slide.accent}
                style={activeId === n.id ? { "--la": slide.accent, "--laRgb": slide.accentRgb } : {}}
                onClick={() => scrollTo(n.id)}
              >
                {activeId === n.id && (
                  <span className="hs2-navlink-pip" style={{ background: slide.accent, boxShadow: `0 0 8px rgba(${slide.accentRgb},0.8)` }} />
                )}
                {n.label}
              </button>
            ))}

            <div className="hs2-navlinks-divider" />

            <button
              className="hs2-navlink hs2-navlink-lib"
              style={{ "--la": slide.accent, "--laRgb": slide.accentRgb }}
              onClick={() => { navigate("/library"); setMenuOpen(false); }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Library
            </button>
          </div>
        </nav>

        {/* ── RIGHT SIDE ── */}
        <div className="hs2-nav-right">
          
          {/* Profile button — magnetic */}
          <button
            ref={loginMag.ref}
            className="hs2-login-btn"
            style={{ "--la": slide.accent, "--laRgb": slide.accentRgb }}
            onMouseMove={loginMag.onMouseMove}
            onMouseLeave={loginMag.onMouseLeave}
            onClick={handleProfile}
          >
            <span className="hs2-login-inner">
              <FaUserCircle className="hs2-login-icon" />
              <span className="hs2-login-text">{isLoggedIn ? "Profile" : "Login"}</span>
            </span>
          </button>

          {/* Burger */}
          <button
            className={`hs2-burger ${menuOpen ? "hs2-burger--open" : ""}`}
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
            aria-label="Menu"
          >
            <span style={{ "--i": 0 }} />
            <span style={{ "--i": 1 }} />
            <span style={{ "--i": 2 }} />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════
          HERO BODY
      ══════════════════════════════════ */}
      <main className="hs2-body">

        {/* ── LEFT CONTENT ── */}
        <div className="hs2-left">

          {/* EYEBROW */}
          <div className="hs2-eyebrow-row" key={`ey-${animKey}`}>
            <span className="hs2-tag" style={{ "--ta": slide.accent, "--taRgb": slide.accentRgb }}>
              {slide.tag}
            </span>
            <span className="hs2-eyebrow-divider" style={{ background: slide.accent }} />
            <span className="hs2-eyebrow">{slide.eyebrow}</span>
          </div>

          {/* GIANT TITLE */}
          <h1 className="hs2-title" key={`title-${animKey}`}>
            <span className="hs2-tword hs2-tword-1" style={{ animationDelay: "0s" }}>
              {slide.titleLine1}
            </span>
            <span
              className="hs2-tword hs2-tword-2"
              style={{
                animationDelay: "0.10s",
                "--ta": slide.accent,
                "--taRgb": slide.accentRgb,
                transform: `translate(${pxShift * 0.6}px, ${pyShift * 0.4}px)`,
                WebkitTextStrokeColor: slide.accent,
              }}
            >
              {slide.titleLine2}
            </span>
            <span className="hs2-tword hs2-tword-3" style={{ animationDelay: "0.20s", transform: `translate(${pxShift * 0.3}px, ${pyShift * 0.2}px)` }}>
              {slide.titleLine3}
            </span>
          </h1>

          {/* SUB */}
          <p className="hs2-sub" key={`sub-${animKey}`}>{slide.sub}</p>

          {/* STATS ROW */}
          <div className="hs2-stats-row" key={`stats-${animKey}`}>
            {[
              { n: "50", s: "K+", l: "Learners" },
              { n: "94", s: "%",  l: "Placement" },
              { n: "10", s: "+",  l: "Courses" },
            ].map((st, i) => (
              <div key={i} className="hs2-stat" style={{ animationDelay: `${0.4 + i * 0.09}s` }}>
                <span className="hs2-stat-num" style={{ color: slide.accent }}>
                  <Counter value={st.n} suffix={st.s} />
                </span>
                <span className="hs2-stat-label">{st.l}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hs2-ctas" key={`cta-${animKey}`}>
            <button
              className="hs2-cta-primary"
              style={{ "--ta": slide.accent, "--taRgb": slide.accentRgb, background: slide.accent }}
              onClick={() => scrollTo("inventory")}
            >
              <span className="hs2-cta-text">Explore Courses</span>
              <span className="hs2-cta-arrow">→</span>
              <span className="hs2-cta-ripple" />
            </button>

            <button
              className="hs2-cta-ghost"
              style={{ "--ta": slide.accent, "--taRgb": slide.accentRgb }}
              onClick={() => setShowSpecsModal(true)}
            >
              <span>View Details</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </button>
          </div>
        </div>

        {/* ── RIGHT SPEC CARD ── */}
        <aside className="hs2-card" key={`card-${animKey}`} style={{ "--ta": slide.accent, "--taRgb": slide.accentRgb }}>
          <div className="hs2-card-topbar">
            <span className="hs2-card-eyebrow">Course Snapshot</span>
            <span className="hs2-card-dot" style={{ background: slide.accent }} />
          </div>

          <div className="hs2-card-title-row">
            <span className="hs2-card-num" style={{ color: slide.accent }}>{slide.index}</span>
            <span className="hs2-card-slash">/</span>
            <span className="hs2-card-tagline">{slide.eyebrow}</span>
          </div>

          <div className="hs2-card-specs">
            {slide.specs.map((sp, i) => (
              <div key={i} className="hs2-card-row" style={{ animationDelay: `${0.15 + i * 0.045}s` }}>
                <span className="hs2-card-key">{sp.label}</span>
                <span className="hs2-card-val">{sp.val}</span>
              </div>
            ))}
          </div>

          <button
            className="hs2-card-cta"
            style={{ "--ta": slide.accent, "--taRgb": slide.accentRgb }}
            onClick={() => setShowSpecsModal(true)}
          >
            Full Details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
          </button>

          {/* Decorative corner accent */}
          <div className="hs2-card-corner" style={{ borderColor: slide.accent }} />
        </aside>

        {/* ── VERTICAL SLIDE STRIP ── */}
        <div className="hs2-vstrip">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hs2-vdot ${i === current ? "hs2-vdot--active" : ""}`}
              style={i === current ? { background: slide.accent, boxShadow: `0 0 12px rgba(${slide.accentRgb},0.7)` } : {}}
              onClick={() => { changeSlide(i); startTimer(); }}
            />
          ))}
          <div
            className="hs2-vline"
            style={{ background: `linear-gradient(to bottom, ${slide.accent}, transparent)` }}
          />
        </div>
      </main>

      {/* ══════════════════════════════════
          TICKER STRIP
      ══════════════════════════════════ */}
      <Ticker accent={slide.accent} />

      {/* ══════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════ */}
      <div className="hs2-bottom">
        <div className="hs2-bottom-left">
          <span className="hs2-scroll-hint">
            <span className="hs2-scroll-mouse">
              <span className="hs2-scroll-wheel" style={{ background: slide.accent }} />
            </span>
            Scroll to explore
          </span>
        </div>

        <div className="hs2-bottom-center">
          <button className="hs2-arrow" onClick={() => go(-1)} aria-label="Prev" style={{ "--ta": slide.accent, "--taRgb": slide.accentRgb }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>

          <div className="hs2-progress-track">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hs2-prog-seg ${i === current ? "hs2-prog-seg--active" : ""}`}
                style={i === current ? { "--ta": slide.accent, "--taRgb": slide.accentRgb } : {}}
                onClick={() => { changeSlide(i); startTimer(); }}
              >
                {i === current && <span className="hs2-prog-fill" />}
              </button>
            ))}
          </div>

          <button className="hs2-arrow" onClick={() => go(1)} aria-label="Next" style={{ "--ta": slide.accent, "--taRgb": slide.accentRgb }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div className="hs2-bottom-right">
          <span className="hs2-index-display">
            <em style={{ color: slide.accent, fontStyle: "normal" }}>{slide.index}</em>
            <span>—</span>
            <span>{slides.length.toString().padStart(2, "0")}</span>
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════
          SPECS MODAL
      ══════════════════════════════════ */}
      {showSpecsModal && (
        <div
          className="hs2-modal-bg"
          onClick={() => setShowSpecsModal(false)}
          role="dialog" aria-modal="true"
        >
          <div className="hs2-modal" onClick={e => e.stopPropagation()} style={{ "--ta": slide.accent, "--taRgb": slide.accentRgb }}>

            {/* Top accent bar */}
            <div className="hs2-modal-bar" style={{ background: `linear-gradient(90deg, ${slide.accent}, transparent)` }} />

            <div className="hs2-modal-head">
              <div>
                <p className="hs2-modal-eyebrow" style={{ color: slide.accent }}>{slide.index} · {slide.eyebrow}</p>
                <h2 className="hs2-modal-title">
                  {slide.titleLine1} {slide.titleLine2} {slide.titleLine3}
                </h2>
                <p className="hs2-modal-sub">{slide.sub}</p>
              </div>
              <button className="hs2-modal-x" onClick={() => setShowSpecsModal(false)}>✕</button>
            </div>

            <div className="hs2-modal-grid">
              {slide.specs.map((sp, i) => (
                <div key={i} className="hs2-modal-cell" style={{ animationDelay: `${i * 0.04}s` }}>
                  <span className="hs2-modal-key">{sp.label}</span>
                  <span className="hs2-modal-val" style={{ color: slide.accent }}>{sp.val}</span>
                </div>
              ))}
            </div>

            <div className="hs2-modal-foot">
              <button
                className="hs2-modal-enroll"
                style={{ background: slide.accent }}
                onClick={() => { setShowSpecsModal(false); scrollTo("inventory"); }}
              >
                Enroll Now →
              </button>
              <button className="hs2-modal-cancel" onClick={() => setShowSpecsModal(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;