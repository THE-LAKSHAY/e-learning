import React, { useState, useRef } from "react";
import "./BookingPage.css";
import { useLocation, useNavigate } from "react-router-dom";

/* ─── constants ─── */
const PAYMENT_METHODS = [
  { value: "card",       label: "Credit / Debit Card", icon: "💳" },
  { value: "upi",        label: "UPI",                 icon: "⚡" },
  { value: "netbanking", label: "Net Banking",          icon: "🏦" },
];

const BENEFITS = [
  { icon: "♾️", text: "Lifetime Access"        },
  { icon: "🏆", text: "Verified Certificate"   },
  { icon: "📥", text: "Downloadable Resources" },
  { icon: "🔄", text: "Free Updates"           },
];

/* ─── Minimal SVG icons ─── */
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72 12 12 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.97-.97a2 2 0 0 1 2.11-.45 12 12 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconLock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ─── Input Field ─── */
const Field = ({ id, label, type = "text", placeholder, value, onChange, icon: Icon, required }) => {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div className={`bk-field ${focused ? "bk-field--focused" : ""} ${filled ? "bk-field--filled" : ""}`}>
      <label className="bk-field-label" htmlFor={id}>{label}</label>
      <div className="bk-field-input-wrap">
        {Icon && <span className="bk-field-icon"><Icon /></span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          autoComplete="off"
          className="bk-field-input"
        />
        {filled && (
          <span className="bk-field-check">
            <IconCheck />
          </span>
        )}
      </div>
      <div className="bk-field-bar" />
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course   = location.state?.car || location.state?.course;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  if (!course) {
    return (
      <div className="bk-empty">
        <div className="bk-empty-icon">🎓</div>
        <p>No course selected.</p>
        <button onClick={() => navigate("/")}>← Browse Courses</button>
      </div>
    );
  }

  const origNum  = parseInt((course.price || "").replace(/[^\d]/g, "")) || 0;
  const offNum   = parseInt((course.offer || "").replace(/[^\d]/g, "")) || 0;
  const discount = origNum && offNum ? Math.round(((origNum - offNum) / origNum) * 100) : 0;
  const accent   = course.accent || "#4f9eff";
  const accentRgb = (() => {
    const hex = accent.replace("#","");
    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    return `${r},${g},${b}`;
  })();

  const canSubmit = name.trim() && email.trim() && phone.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setTimeout(() => {
      navigate("/payment", {
        state: {
          course: {
            title:    course.title,
            image:    course.image,
            price:    course.price,
            offer:    course.offer,
            category: course.fuel || course.tech || "Course",
            lessons:  course.mileage || course.lessons || "4 Lessons",
            level:    course.transmission || course.level || "Beginner",
            accent:   course.accent,
          },
          student:       { name, email, phone },
          paymentMethod,
        },
      });
    }, 700);
  };

  return (
    <div
      className="bk-root"
      style={{ "--accent": accent, "--accentRgb": accentRgb }}
    >
      {/* Subtle ambient background */}
      <div className="bk-bg-glow" />
      <div className="bk-bg-grid" />

      {/* ── Back button ── */}
      <button className="bk-back" onClick={() => navigate(-1)}>
        <ArrowLeft />
        <span>Back</span>
      </button>

      {/* ══════════════════════════════
          MAIN LAYOUT
      ══════════════════════════════ */}
      <div className="bk-layout">

        {/* ── LEFT — Course summary ── */}
        <aside className="bk-aside">

          {/* Course card */}
          <div className="bk-course-card">
            <div className="bk-course-img-wrap">
              <img src={course.image} alt={course.title} className="bk-course-img" />
              <div className="bk-course-img-overlay" />
              <span className="bk-course-tech" style={{ background: accent, color: "#000" }}>
                {course.tech || course.fuel || "Course"}
              </span>
              {discount > 0 && (
                <span className="bk-course-disc">-{discount}%</span>
              )}
            </div>

            <div className="bk-course-info">
              <span className="bk-course-level">{course.level || course.transmission || "Beginner"}</span>
              <h3 className="bk-course-title">{course.title}</h3>
              <div className="bk-course-meta">
                <span>{course.lessons || course.mileage || "4 Lessons"}</span>
                <span className="bk-dot" />
                <span>Lifetime Access</span>
                <span className="bk-dot" />
                <span>Certificate</span>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bk-price-card">
            <div className="bk-price-row">
              <span className="bk-price-label">Original price</span>
              <span className="bk-price-strike">{course.price}</span>
            </div>
            <div className="bk-price-row">
              <span className="bk-price-label">Discount</span>
              <span className="bk-price-save">−{discount}%</span>
            </div>
            <div className="bk-price-divider" />
            <div className="bk-price-total-row">
              <span className="bk-price-total-label">Total</span>
              <span className="bk-price-total" style={{ color: accent }}>
                {course.offer}
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="bk-benefits">
            {BENEFITS.map((b) => (
              <div key={b.text} className="bk-benefit">
                <span className="bk-benefit-check" style={{ color: accent }}>✓</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="bk-trust-strip">
            <span><IconLock /> SSL Secured</span>
            <span className="bk-dot" />
            <span>Instant Access</span>
            <span className="bk-dot" />
            <span>30-day Guarantee</span>
          </div>
        </aside>

        {/* ── RIGHT — Enrollment form ── */}
        <main className="bk-main">

          {/* Header */}
          <div className="bk-form-header">
            <span className="bk-step-label">
              <span className="bk-step-dot" style={{ background: accent }} />
              Step 1 of 2
            </span>
            <h1 className="bk-heading">
              Complete Enrollment
            </h1>
            <p className="bk-subheading">
              Enter your details to proceed to secure payment.
            </p>
          </div>

          {/* Form */}
          <form ref={formRef} className="bk-form" onSubmit={handleSubmit} noValidate>

            {/* Personal details */}
            <div className="bk-section">
              <p className="bk-section-title">Your Details</p>

              <Field
                id="bk-name"
                label="Full Name"
                placeholder="Jane Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                icon={IconUser}
                required
              />
              <Field
                id="bk-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={IconMail}
                required
              />
              <Field
                id="bk-phone"
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                icon={IconPhone}
                required
              />
            </div>

            {/* Payment method */}
            <div className="bk-section">
              <p className="bk-section-title">Payment Method</p>
              <div className="bk-pm-grid">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    className={`bk-pm ${paymentMethod === m.value ? "bk-pm--active" : ""}`}
                    style={paymentMethod === m.value ? {
                      "--accent": accent,
                      "--accentRgb": accentRgb,
                      borderColor: accent,
                    } : {}}
                    onClick={() => setPaymentMethod(m.value)}
                  >
                    <span className="bk-pm-icon">{m.icon}</span>
                    <span className="bk-pm-label">{m.label}</span>
                    {paymentMethod === m.value && (
                      <span className="bk-pm-pip" style={{ background: accent }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`bk-submit ${loading ? "bk-submit--loading" : ""} ${!canSubmit ? "bk-submit--disabled" : ""}`}
              style={{ "--accent": accent, "--accentRgb": accentRgb }}
              disabled={loading || !canSubmit}
            >
              {loading ? (
                <span className="bk-spinner" />
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <ArrowRight />
                </>
              )}
            </button>

            <p className="bk-form-trust">
              <IconLock />
              256-bit SSL encrypted · Your data is safe
            </p>
          </form>
        </main>
      </div>
    </div>
  );
};

export default BookingPage;