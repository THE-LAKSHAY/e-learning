import React, { useRef, useEffect, useState } from "react";
import "./WhyChooseUs.css";
import {
  FaChalkboardTeacher,
  FaLaptopCode,
  FaCertificate,
  FaUserGraduate,
  FaRocket,
} from "react-icons/fa";

const features = [
  {
    icon:   <FaChalkboardTeacher />,
    title:  "Expert Instructors",
    desc:   "Learn from industry professionals with real-world experience who guide you step-by-step throughout every course.",
    accent: "#3b82f6",
    num:    "01",
    stat:   "50+ Mentors",
  },
  {
    icon:   <FaLaptopCode />,
    title:  "Hands-On Learning",
    desc:   "Work on real projects and practical assignments that build strong skills and a portfolio employers notice.",
    accent: "#a78bfa",
    num:    "02",
    stat:   "100+ Projects",
  },
  {
    icon:   <FaCertificate />,
    title:  "Certification",
    desc:   "Receive a verified certificate after completing courses to showcase your skills and advance your career.",
    accent: "#10b981",
    num:    "03",
    stat:   "Verified Badge",
  },
  {
    icon:   <FaUserGraduate />,
    title:  "Career Support",
    desc:   "Get personal guidance, mentorship and career tips to help you land internships and jobs in your field.",
    accent: "#f59e0b",
    num:    "04",
    stat:   "1-on-1 Help",
  },
  {
    icon:   <FaRocket />,
    title:  "Lifetime Access",
    desc:   "Get unlimited, lifetime access to all course materials, updates and resources — learn at your own pace, forever.",
    accent: "#ef4444",
    num:    "05",
    stat:   "Forever Free",
  },
];

/* 
  Card uses a simple CSS-class-based reveal (no inline transform manipulation)
  to avoid the jank caused by JS re-renders on scroll.
  Hover effects are pure CSS for maximum smoothness.
*/
const Card = ({ item, index }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          ob.disconnect();
        }
      },
      { threshold: 0.10, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`wcu-card ${vis ? "wcu-card-vis" : ""}`}
      style={{ "--a": item.accent, "--i": `${index * 0.10}s` }}
    >
      {/* ambient glow — CSS only, no JS */}
      <div className="wcu-card-glow" style={{ background: item.accent }} />

      {/* watermark number */}
      <span className="wcu-num">{item.num}</span>

      {/* icon */}
      <div className="wcu-icon-wrap" style={{ "--a": item.accent }}>
        <div className="wcu-icon-ring" />
        <span className="wcu-icon">{item.icon}</span>
      </div>

      {/* text */}
      <h3 className="wcu-card-title">{item.title}</h3>
      <p className="wcu-card-desc">{item.desc}</p>

      {/* stat pill */}
      <div
        className="wcu-stat"
        style={{
          color:       item.accent,
          borderColor: `${item.accent}40`,
          background:  `${item.accent}12`,
        }}
      >
        {item.stat}
      </div>

      {/* hover sweep border — pure CSS */}
      <div className="wcu-card-border" />
    </div>
  );
};

const WhyChooseUs = () => {
  const secRef = useRef(null);
  const [titleVis, setTitleVis] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTitleVis(true);
          ob.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (secRef.current) ob.observe(secRef.current);
    return () => ob.disconnect();
  }, []);

  return (
    <section className="wcu-root" id="about" ref={secRef}>

      {/* bg layers */}
      <div className="wcu-mesh" />

      {/* header */}
      <div className={`wcu-header ${titleVis ? "wcu-header-vis" : ""}`}>
        <div className="wcu-eyebrow">
          <span className="wcu-eyebrow-dot" />
          Why Learn With Us
        </div>
        <h2 className="wcu-title">
          Built for those who
          <br />
          <span className="wcu-title-grad">take learning seriously</span>
        </h2>
        <p className="wcu-subtitle">
          Every feature is designed to take you from curious beginner to
          confident professional — faster.
        </p>
      </div>

      {/* cards — 5 items */}
      <div className="wcu-grid">
        {features.map((item, i) => (
          <Card key={i} item={item} index={i} />
        ))}
      </div>

      {/* bottom CTA */}
      <div className={`wcu-cta-strip ${titleVis ? "wcu-cta-vis" : ""}`}>
        <p>
          Join <strong>5,000+</strong> learners already growing their skills.
        </p>
        <button
          className="wcu-cta-btn"
          onClick={() =>
            document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Explore Courses
          <svg
            width="14" height="14"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default WhyChooseUs;