import React, { useState } from "react";
import "./PaymentGateway.css";
import { useLocation, useNavigate } from "react-router-dom";

/* ─── SVG Icons ─── */
const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconHome = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconLock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconCard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const IconZap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconBank = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
  </svg>
);

/* ─── Floating label input ─── */
const FloatInput = ({ id, label, type = "text", placeholder, value, onChange, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className={`pg-float ${active ? "pg-float--active" : ""} ${focused ? "pg-float--focused" : ""}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={active ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete || "off"}
        className="pg-float-input"
      />
      <label htmlFor={id} className="pg-float-label">{label}</label>
      <div className="pg-float-bar" />
      {value.length > 0 && (
        <span className="pg-float-check"><IconCheck /></span>
      )}
    </div>
  );
};

/* ─── Select field ─── */
const FloatSelect = ({ id, label, value, onChange, children }) => (
  <div className="pg-float pg-float--active">
    <select id={id} value={value} onChange={onChange} className="pg-float-input pg-float-select">
      {children}
    </select>
    <label htmlFor={id} className="pg-float-label">{label}</label>
    <div className="pg-float-bar" />
  </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const course  = location.state?.course;
  const student = location.state?.student;

  const [paymentMethod, setPaymentMethod] = useState(location.state?.paymentMethod || "card");
  const [email,      setEmail]      = useState(student?.email || "");
  const [firstName,  setFirstName]  = useState(student?.name?.split(" ")[0] || "");
  const [lastName,   setLastName]   = useState(student?.name?.split(" ").slice(1).join(" ") || "");
  const [country,    setCountry]    = useState("India");
  const [upi,        setUpi]        = useState("");
  const [bank,       setBank]       = useState("SBI");
  const [cardNum,    setCardNum]    = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv,    setCardCvv]    = useState("");
  const [loading,    setLoading]    = useState(false);

  if (!course) {
    return (
      <div className="pg-invalid">
        <span>⚠️</span>
        <p>Invalid payment session.</p>
        <button onClick={() => navigate("/")}>← Go Home</button>
      </div>
    );
  }

  const accent    = course.accent || "#4f9eff";
  const accentRgb = (() => {
    const hex = accent.replace("#", "");
    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    return `${r},${g},${b}`;
  })();

  /* ── Navigation payload shared by both success & fallback paths ── */
  const buildOtpNavState = () => ({
    course,
    student: {
      name: `${firstName} ${lastName}`.trim() || student?.name,
      email,
    },
    paymentMethod,
  });

  const handlePayment = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // Attempt to send OTP via backend; navigate regardless of outcome
      await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Backend unavailable — proceed to OTP page anyway
      // (OTPVerification can handle resend / mock OTP flow)
    } finally {
      setLoading(false);
      // Always redirect to OTP verification page
      navigate("/otp", { state: buildOtpNavState() });
    }
  };

  const METHODS = [
    { value: "card",       label: "Card",        icon: <IconCard /> },
    { value: "upi",        label: "UPI",         icon: <IconZap /> },
    { value: "netbanking", label: "Net Banking",  icon: <IconBank /> },
  ];

  return (
    <div className="pg-root" style={{ "--accent": accent, "--accentRgb": accentRgb }}>

      {/* Background */}
      <div className="pg-bg-glow" />
      <div className="pg-bg-grid" />

      {/* ── Navbar ── */}
      <header className="pg-nav">
        <div className="pg-nav-logo">
          <span className="pg-logo-mark">LV</span>
          <span className="pg-logo-text">Learnify</span>
        </div>

        <div className="pg-nav-center">
          <span className="pg-step-item pg-step-done">
            <span className="pg-step-circle">✓</span>
            Details
          </span>
          <span className="pg-step-line" />
          <span className="pg-step-item pg-step-active" style={{ "--accent": accent }}>
            <span className="pg-step-circle pg-step-circle--active" style={{ background: accent, borderColor: accent }}>2</span>
            Payment
          </span>
          <span className="pg-step-line" />
          <span className="pg-step-item">
            <span className="pg-step-circle">3</span>
            Confirm
          </span>
        </div>

        <div className="pg-nav-actions">
          <button className="pg-nav-btn" onClick={() => navigate("/book-now", { state: { car: course } })}>
            <IconArrowLeft />
            <span>Back</span>
          </button>
          <button className="pg-nav-btn pg-nav-btn--home" onClick={() => navigate("/")}>
            <IconHome />
            <span>Home</span>
          </button>
        </div>
      </header>

      {/* ── Layout ── */}
      <div className="pg-layout">

        {/* ── LEFT — Billing & Payment ── */}
        <div className="pg-left">

          {/* Billing */}
          <div className="pg-card pg-card--billing">
            <div className="pg-card-header">
              <h2 className="pg-card-title">Billing Details</h2>
              <span className="pg-card-badge">
                <IconShield /> Secure
              </span>
            </div>

            <div className="pg-fields">
              <FloatInput
                id="pg-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
              <div className="pg-row-2">
                <FloatInput
                  id="pg-fname"
                  label="First Name"
                  placeholder="Jane"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                <FloatInput
                  id="pg-lname"
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
              <FloatSelect
                id="pg-country"
                label="Country / Region"
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
              </FloatSelect>
            </div>
          </div>

          {/* Payment Method */}
          <div className="pg-card pg-card--payment">
            <h2 className="pg-card-title">Payment Method</h2>

            <div className="pg-methods">
              {METHODS.map(m => (
                <button
                  key={m.value}
                  className={`pg-method ${paymentMethod === m.value ? "pg-method--active" : ""}`}
                  style={paymentMethod === m.value ? { borderColor: accent } : {}}
                  onClick={() => setPaymentMethod(m.value)}
                  type="button"
                >
                  <span className="pg-method-icon"
                    style={paymentMethod === m.value ? { color: accent } : {}}
                  >
                    {m.icon}
                  </span>
                  <span className="pg-method-label">{m.label}</span>
                  {paymentMethod === m.value && (
                    <span className="pg-method-pip" style={{ background: accent }} />
                  )}
                </button>
              ))}
            </div>

            {/* Card fields */}
            {paymentMethod === "card" && (
              <div className="pg-pay-fields">
                <FloatInput
                  id="pg-cardnum"
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNum}
                  onChange={e => setCardNum(e.target.value.replace(/[^\d\s]/g, "").slice(0, 19))}
                  autoComplete="cc-number"
                />
                <div className="pg-row-2">
                  <FloatInput
                    id="pg-expiry"
                    label="Expiry (MM / YY)"
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    autoComplete="cc-exp"
                  />
                  <FloatInput
                    id="pg-cvv"
                    label="CVV"
                    type="password"
                    placeholder="•••"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.slice(0, 4))}
                    autoComplete="cc-csc"
                  />
                </div>
              </div>
            )}

            {/* UPI fields */}
            {paymentMethod === "upi" && (
              <div className="pg-pay-fields">
                <FloatInput
                  id="pg-upi"
                  label="UPI ID"
                  placeholder="yourname@upi"
                  value={upi}
                  onChange={e => setUpi(e.target.value)}
                />
                <div className="pg-upi-logos">
                  {["GPay", "PhonePe", "Paytm", "BHIM"].map(u => (
                    <span key={u} className="pg-upi-chip">{u}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Net banking */}
            {paymentMethod === "netbanking" && (
              <div className="pg-pay-fields">
                <FloatSelect
                  id="pg-bank"
                  label="Select Bank"
                  value={bank}
                  onChange={e => setBank(e.target.value)}
                >
                  {["SBI", "HDFC", "ICICI", "Axis Bank", "Kotak", "Yes Bank", "PNB"].map(b => (
                    <option key={b}>{b}</option>
                  ))}
                </FloatSelect>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT — Order summary ── */}
        <div className="pg-right">
          <div className="pg-card pg-card--summary">

            {/* Top accent line */}
            <div className="pg-summary-bar" style={{ background: `linear-gradient(90deg, ${accent}, rgba(${accentRgb},0.2), transparent)` }} />

            <h2 className="pg-card-title">Order Summary</h2>

            {/* Course thumbnail */}
            <div className="pg-course-row">
              <div className="pg-course-thumb">
                <img src={course.image} alt={course.title} />
                <div className="pg-course-thumb-overlay" />
              </div>
              <div className="pg-course-details">
                <span className="pg-course-cat" style={{ color: accent }}>
                  {course.category || course.tech || "Course"}
                </span>
                <h4 className="pg-course-name">{course.title}</h4>
                <div className="pg-course-meta">
                  <span>{course.lessons || "4 Lessons"}</span>
                  <span className="pg-meta-dot" />
                  <span>{course.level || "Beginner"}</span>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="pg-price-block">
              <div className="pg-price-row">
                <span>Original price</span>
                <span className="pg-price-strike">{course.price}</span>
              </div>
              <div className="pg-price-row">
                <span>Discount</span>
                <span className="pg-price-green">Applied</span>
              </div>
              <div className="pg-price-divider" />
              <div className="pg-price-total-row">
                <span>Total due</span>
                <span className="pg-price-total" style={{ color: accent }}>
                  {course.offer}
                </span>
              </div>
            </div>

            {/* What you get */}
            <div className="pg-includes">
              {[
                "Lifetime access",
                "Verified certificate",
                "Downloadable resources",
                "Community support",
              ].map(item => (
                <div key={item} className="pg-include-row">
                  <span className="pg-include-check" style={{ color: accent }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Pay button */}
            <button
              className={`pg-pay-btn ${loading ? "pg-pay-btn--loading" : ""}`}
              style={{ background: accent, boxShadow: `0 10px 32px rgba(${accentRgb},0.40)` }}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <span className="pg-spinner" />
              ) : (
                <>
                  <IconLock />
                  <span>Complete Payment</span>
                  <IconArrowRight />
                </>
              )}
            </button>

            {/* Trust note */}
            <div className="pg-trust">
              <IconLock />
              256-bit SSL encrypted · Instant access after payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;