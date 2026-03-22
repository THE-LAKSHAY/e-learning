import React, { useState, useRef, useEffect } from "react";
import "./OTPVerification.css";
import { useLocation, useNavigate } from "react-router-dom";

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const course        = location.state?.course;
  const student       = location.state?.student;
  const paymentMethod = location.state?.paymentMethod || "card";

  const [otp,       setOtp]       = useState(["", "", "", "", "", ""]);
  const [showModal, setShowModal]  = useState(false);
  const [shaking,   setShaking]    = useState(false);
  const [success,   setSuccess]    = useState(false);
  const [countdown, setCountdown]  = useState(3);
  const [timer,     setTimer]      = useState(30);
  const [canResend, setCanResend]  = useState(false);
  const [verifying, setVerifying]  = useState(false);
  const [verifyErr, setVerifyErr]  = useState("");

  const inputs = useRef([]);

  useEffect(() => {
    if (canResend) return;
    if (timer === 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, canResend]);

  useEffect(() => {
    if (!success) return;
    if (countdown === 0) { navigate("/dashboard"); return; }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [success, countdown, navigate]);

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
    await fetch("http://localhost:5000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: student?.email }),
    });
  };

  if (!course) {
    return (
      <div className="otp-invalid">
        <span>⚠️</span>
        <p>Invalid OTP Session</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const accent = course.accent || "#6366f1";
  const accentRgb = (() => {
    const hex = accent.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r},${g},${b}`;
  })();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const entered = otp.join("");
    if (entered.length < 6) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      return;
    }
    setVerifying(true);
    setVerifyErr("");
    try {
      const verifyRes = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: student?.email, otp: entered }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        setVerifyErr(verifyData.message || "Incorrect OTP. Try again.");
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
        setVerifying(false);
        return;
      }
      /* Save enrollment */
      const token = localStorage.getItem("token");
      if (token) {
        const paidAmount = parseInt((course.offer || course.price || "0").replace(/[^\d]/g, "")) || 0;
        await fetch("http://localhost:5000/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            courseTitle:   course.title,
            courseImage:   course.image,
            tech:          course.category || course.tech || "Course",
            level:         course.level || "Beginner",
            price:         course.price,
            paidAmount,
            paymentMethod,
          }),
        });
      }
      setSuccess(true);
    } catch {
      setVerifyErr("Server error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleBackConfirm = () => {
    setShowModal(false);
    navigate("/payment", { state: { course, student } });
  };

  const filled = otp.filter(Boolean).length;

  return (
    <div className="otp-root" style={{ "--accent": accent, "--accentRgb": accentRgb }}>
      <div className="otp-bg">
        <div className="otp-bg-orb otp-bg-orb--1" />
        <div className="otp-bg-orb otp-bg-orb--2" />
        <div className="otp-bg-grid" />
      </div>

      <div className={`otp-card ${success ? "otp-card--success" : ""}`}>
        <div className="otp-stripe"
          style={{ background: `linear-gradient(90deg, ${accent}, rgba(${accentRgb},0.3), transparent)` }} />

        {!success && (
          <button className="otp-back" onClick={() => setShowModal(true)} type="button">
            <ArrowLeftIcon />
          </button>
        )}

        {success ? (
          <div className="otp-success-state">
            <div className="otp-success-ring" style={{ borderColor: accent }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="otp-success-title">Payment Verified!</h2>
            <p className="otp-success-sub">
              Your enrollment in <strong style={{ color: "#e2e8f0" }}>{course.title}</strong> is confirmed and saved to your account.
            </p>
            <div className="otp-countdown-wrap">
              <svg className="otp-countdown-svg" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle cx="22" cy="22" r="18" fill="none" stroke={accent} strokeWidth="3"
                  strokeLinecap="round" strokeDasharray="113"
                  strokeDashoffset={113 - (113 * (3 - countdown) / 3)}
                  style={{ transition: "stroke-dashoffset 1s linear", transform: "rotate(-90deg)", transformOrigin: "center" }}
                />
              </svg>
              <span className="otp-countdown-num" style={{ color: accent }}>{countdown}</span>
            </div>
            <p className="otp-redirect-note">
              Redirecting to Dashboard in <strong style={{ color: accent }}>{countdown}s</strong>…
            </p>
            <button
              className="otp-home-btn"
              style={{ background: accent, boxShadow: `0 8px 24px rgba(${accentRgb},0.4)` }}
              onClick={() => navigate("/dashboard")}
              type="button"
            >
              Go to Dashboard →
            </button>
            <div className="otp-success-bar">
              <div className="otp-success-fill" style={{ background: accent, animationDuration: "3s" }} />
            </div>
          </div>
        ) : (
          <>
            <div className="otp-icon-wrap" style={{ background: `rgba(${accentRgb},0.12)` }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke={accent} strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="otp-title">Verify Your Payment</h2>
            <p className="otp-sub">
              We sent a 6-digit code to<br />
              <strong className="otp-email">{student?.email}</strong>
            </p>
            {verifyErr && <div className="otp-error-banner">⚠️ {verifyErr}</div>}
            <div className="otp-progress">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="otp-dot"
                  style={i < filled ? { background: accent, transform: "scale(1.3)" } : {}} />
              ))}
            </div>
            <div className={`otp-inputs ${shaking ? "otp-inputs--shake" : ""}`}>
              {otp.map((digit, index) => (
                <input key={index} ref={el => inputs.current[index] = el}
                  type="text" inputMode="numeric" maxLength="1"
                  value={digit}
                  onChange={e => handleChange(e.target.value, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`otp-box ${digit ? "otp-box--filled" : ""}`}
                  style={digit ? { borderColor: accent, boxShadow: `0 0 0 3px rgba(${accentRgb},0.18)` } : {}}
                  disabled={verifying}
                />
              ))}
            </div>
            <button
              className={`otp-verify-btn ${filled === 6 && !verifying ? "otp-verify-btn--ready" : ""}`}
              style={filled === 6 ? { background: verifying ? "#555" : accent, boxShadow: `0 10px 28px rgba(${accentRgb},0.4)` } : {}}
              onClick={handleVerify} type="button" disabled={verifying}
            >
              {verifying ? <span className="otp-spinner" /> : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ display: "block", flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verify &amp; Complete Payment
                </>
              )}
            </button>
            <p className="otp-resend">
              Didn't receive the code?{" "}
              {canResend ? (
                <span className="otp-resend-link" style={{ color: accent }} onClick={handleResend}>Resend OTP</span>
              ) : (
                <span className="otp-resend-timer">Resend in <strong style={{ color: accent }}>{timer}s</strong></span>
              )}
            </p>
            <div className="otp-trust">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ display: "block", flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              256-bit SSL encrypted · Powered by Learnify
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="otp-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="otp-modal" onClick={e => e.stopPropagation()}>
            <div className="otp-modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="otp-modal-title">End Session?</h3>
            <p className="otp-modal-body">
              Going back will cancel your current OTP session. Your payment has <strong>not</strong> been processed yet.
            </p>
            <div className="otp-modal-actions">
              <button className="otp-modal-cancel" type="button" onClick={() => setShowModal(false)}>Stay Here</button>
              <button className="otp-modal-confirm" type="button" onClick={handleBackConfirm}>Yes, Go Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;