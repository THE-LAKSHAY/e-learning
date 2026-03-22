import React, { useState, useEffect, useRef } from "react";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";

/* ── NOISE ── */
const NoiseOverlay = () => (
  <svg className="noise-svg" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" opacity="0.045"/>
  </svg>
);

/* ── TICKER ── */
const TICKER_ITEMS = [
  "50,000+ learners enrolled",
  "Live mentorship sessions",
  "Career placement support",
  "Industry-led curriculum",
  "Batch 2026 now open",
  "Full-stack · AI · Design · Cloud",
];
const Ticker = () => {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot"/>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── ORB RING ── */
const OrbRing = ({ size, delay, reverse }) => (
  <div
    className={`orb-ring ${reverse ? "reverse" : ""}`}
    style={{ width: size, height: size, animationDelay: delay }}
  />
);

/* ── OTP INPUT BOX ── */
const OtpInput = ({ value, onChange, onKeyDown, onPaste, inputRef, filled }) => (
  <input
    ref={inputRef}
    type="text"
    inputMode="numeric"
    maxLength="1"
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onPaste={onPaste}
    className={`ap-otp-box ${filled ? "ap-otp-box--filled" : ""}`}
    autoComplete="off"
  />
);

/* ══════════════════════════════════════════
   STEPS:
   "form"    → user fills email/password (+ name/phone for signup)
   "sending" → spinner while OTP email is being sent
   "otp"     → user enters 6-digit OTP
   "done"    → success flash before redirect
══════════════════════════════════════════ */
const AuthPage = () => {
  const [mode,    setMode]    = useState("login");   // "login" | "signup"
  const [step,    setStep]    = useState("form");    // "form" | "sending" | "otp" | "done"
  const [animKey, setAnimKey] = useState(0);
  const [focused, setFocused] = useState(null);

  /* form fields */
  const [fullName, setFullName] = useState("");
  const [phone,    setPhone]    = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  /* otp state */
  const [otp,       setOtp]       = useState(["","","","","",""]);
  const [otpError,  setOtpError]  = useState("");
  const [otpTimer,  setOtpTimer]  = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);

  /* ui feedback */
  const [formError,   setFormError]   = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [shaking,     setShaking]     = useState(false);

  const otpRefs   = useRef([]);
  const timerRef  = useRef(null);
  const navigate  = useNavigate();

  /* redirect if already logged in */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = localStorage.getItem("user");
    if (token && user) {
      const parsed = JSON.parse(user);
      navigate(parsed.isAdmin ? "/admin-dashboard" : "/dashboard");
    }
  }, [navigate]);

  /* OTP countdown timer */
  useEffect(() => {
    if (step !== "otp") return;
    setOtpTimer(60);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setOtpTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step, animKey]);

  /* auto-focus first otp box when step changes to otp */
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const switchMode = (next) => {
    setMode(next);
    setStep("form");
    setAnimKey(k => k + 1);
    setFullName(""); setPhone(""); setEmail(""); setPassword("");
    setFormError(""); setOtpError("");
    setOtp(["","","","","",""]);
  };

  const shake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  /* ══════════════════════════════
     STEP 1 — Submit form → send OTP
  ══════════════════════════════ */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    setStep("sending");

    try {
      /* For signup — pre-check if email already registered */
      if (mode === "signup") {
        const checkRes = await fetch("http://localhost:5000/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const checkData = await checkRes.json();
        if (checkData.exists) {
          setFormError("This email is already registered. Sign in instead.");
          setStep("form");
          setFormLoading(false);
          return;
        }
      }

      /* For login — check credentials first before sending OTP */
      if (mode === "login") {
        const credRes = await fetch("http://localhost:5000/check-credentials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const credData = await credRes.json();
        if (!credData.valid) {
          setFormError(credData.message || "Invalid email or password.");
          setStep("form");
          setFormLoading(false);
          return;
        }
      }

      /* Send OTP to email */
      const otpRes = await fetch("http://localhost:5000/send-auth-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setFormError(otpData.message || "Failed to send OTP. Check your email.");
        setStep("form");
        setFormLoading(false);
        return;
      }

      /* Success → move to OTP step */
      setStep("otp");
    } catch {
      setFormError("Cannot connect to server. Make sure backend is running.");
      setStep("form");
    } finally {
      setFormLoading(false);
    }
  };

  /* ══════════════════════════════
     STEP 2 — Verify OTP → login/register
  ══════════════════════════════ */
  const handleOtpVerify = async () => {
    const entered = otp.join("");
    if (entered.length < 6) { shake(); return; }

    setVerifying(true);
    setOtpError("");

    try {
      /* Verify OTP */
      const verRes = await fetch("http://localhost:5000/verify-auth-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: entered }),
      });
      const verData = await verRes.json();

      if (!verData.success) {
        setOtpError(verData.message || "Incorrect OTP. Please try again.");
        shake();
        setVerifying(false);
        return;
      }

      /* OTP valid → now complete login or register */
      const endpoint = mode === "login" ? "/login" : "/register";
      const body = mode === "login"
        ? { email, password }
        : { fullName, phone, email, password };

      const authRes  = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const authData = await authRes.json();

      if (!authRes.ok) {
        setOtpError(authData.message || "Authentication failed.");
        setVerifying(false);
        return;
      }

      /* Store JWT */
      localStorage.setItem("token", authData.token);
      localStorage.setItem("user",  JSON.stringify(authData.user));

      setStep("done");
      setTimeout(() => {
        navigate(authData.user.isAdmin ? "/admin-dashboard" : "/dashboard");
      }, 1600);

    } catch {
      setOtpError("Server error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (!canResend) return;
    setOtp(["","","","","",""]);
    setOtpError("");
    setCanResend(false);
    clearInterval(timerRef.current);

    await fetch("http://localhost:5000/send-auth-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setAnimKey(k => k + 1); /* restart timer */
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (val, idx) => {
    if (!/^[0-9]?$/.test(val)) return;
    const n = [...otp]; n[idx] = val; setOtp(n);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    setOtpError("");
  };
  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
    if (e.key === "Enter") handleOtpVerify();
  };
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const n = [...otp];
    pasted.split("").forEach((ch, i) => { n[i] = ch; });
    setOtp(n);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const isLogin  = mode === "login";
  const otpFilled = otp.filter(Boolean).length;

  /* ── form fields config ── */
  const fields = isLogin
    ? [
        { id:"email",    label:"Email address", type:"email",    placeholder:"you@gmail.com",    value:email,    set:setEmail,    icon:"↗" },
        { id:"password", label:"Password",       type:"password", placeholder:"min. 8 characters", value:password, set:setPassword, icon:"◈" },
      ]
    : [
        { id:"fullName", label:"Full name",      type:"text",     placeholder:"Jane Doe",           value:fullName, set:setFullName, icon:"◎" },
        { id:"phone",    label:"Phone number",   type:"tel",      placeholder:"+91 98765 43210",    value:phone,    set:setPhone,    icon:"◇" },
        { id:"email",    label:"Email address",  type:"email",    placeholder:"you@gmail.com",      value:email,    set:setEmail,    icon:"↗" },
        { id:"password", label:"Password",       type:"password", placeholder:"min. 8 characters",  value:password, set:setPassword, icon:"◈" },
      ];

  return (
    <div className="ap-root">
      <NoiseOverlay/>

      {/* NAVBAR */}
      <header className="ap-nav">
        <div className="ap-logo">
          <span className="ap-logo-mark">LV</span>
          <span className="ap-logo-word">Learnify</span>
        </div>
        <div className="ap-nav-actions">
          <button className="ap-btn-admin" onClick={() => navigate("/admin-login")}>Admin&nbsp;↗</button>
          <button className="ap-btn-back"  onClick={() => navigate("/")}>← Home</button>
        </div>
      </header>

      {/* MAIN */}
      <main className="ap-main">

        {/* LEFT PANEL */}
        <section className="ap-left">
          <div className="ap-orbs">
            <OrbRing size="640px" delay="0s"  reverse={false}/>
            <OrbRing size="440px" delay="-4s" reverse={true} />
            <OrbRing size="240px" delay="-8s" reverse={false}/>
          </div>

          <div className="ap-left-inner">
            <p className="ap-eyebrow">
              <span className="eyebrow-pill">✦ Batch 2026</span>
              Enrolment Open
            </p>
            <h1 className="ap-headline">
              <span className="h-line h-line-1">Learn</span>
              <span className="h-line h-line-2">Build</span>
              <span className="h-line h-line-3">Launch</span>
            </h1>
            <p className="ap-descriptor">
              Transform your career with structured learning,
              live mentors, and hiring partners who back you.
            </p>
            <div className="ap-stats">
              {[{num:"50K+",lbl:"Learners"},{num:"94%",lbl:"Placement"},{num:"120+",lbl:"Partners"}].map(s => (
                <div className="stat-item" key={s.lbl}>
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ap-ticker-zone"><Ticker/></div>
        </section>

        {/* RIGHT PANEL */}
        <section className="ap-right">
          <div className="ap-card">

            {/* ══════════════════════
                STEP: FORM
            ══════════════════════ */}
            {(step === "form" || step === "sending") && (
              <>
                {/* TABS */}
                <div className="ap-tabs">
                  {["login","signup"].map(m => (
                    <button
                      key={m}
                      className={`ap-tab ${mode === m ? "ap-tab--active" : ""}`}
                      onClick={() => switchMode(m)}
                      disabled={step === "sending"}
                    >
                      {m === "login" ? "Sign in" : "Create account"}
                    </button>
                  ))}
                  <span className="ap-tab-indicator"
                    style={{ transform: isLogin ? "translateX(0)" : "translateX(100%)" }}/>
                </div>

                <div className="ap-form-head">
                  <h2 className="ap-form-title">
                    {isLogin ? "Welcome\nback." : "Join\nus."}
                  </h2>
                  <span className="ap-form-no">{isLogin ? "01" : "02"}</span>
                </div>

                {/* Step indicator */}
                <div className="ap-step-indicator">
                  <div className="ap-step ap-step--active">
                    <span className="ap-step-num">1</span>
                    <span className="ap-step-lbl">Details</span>
                  </div>
                  <div className="ap-step-line"/>
                  <div className="ap-step">
                    <span className="ap-step-num">2</span>
                    <span className="ap-step-lbl">Verify Email</span>
                  </div>
                  <div className="ap-step-line"/>
                  <div className="ap-step">
                    <span className="ap-step-num">3</span>
                    <span className="ap-step-lbl">Access</span>
                  </div>
                </div>

                {formError && (
                  <div className="ap-alert ap-alert--error">⚠️ {formError}</div>
                )}

                <form className="ap-form" onSubmit={handleFormSubmit} key={`${mode}-${animKey}`}>
                  {fields.map((f, i) => (
                    <div
                      key={f.id}
                      className={`ap-field ${focused === f.id ? "ap-field--focused" : ""} ${f.value ? "ap-field--filled" : ""}`}
                      style={{ animationDelay: `${i * 55}ms` }}
                    >
                      <label className="ap-field-label" htmlFor={f.id}>
                        <span className="ap-field-icon">{f.icon}</span>
                        {f.label}
                      </label>
                      <input
                        id={f.id}
                        className="ap-field-input"
                        type={f.type}
                        placeholder={f.placeholder}
                        value={f.value}
                        onChange={e => { f.set(e.target.value); setFormError(""); }}
                        onFocus={() => setFocused(f.id)}
                        onBlur={() => setFocused(null)}
                        required
                        autoComplete="off"
                        disabled={step === "sending"}
                      />
                      <span className="ap-field-bar"/>
                    </div>
                  ))}

                  <button
                    type="submit"
                    className={`ap-submit ${step === "sending" ? "ap-submit--loading" : ""}`}
                    disabled={step === "sending"}
                  >
                    {step === "sending" ? (
                      <div className="ap-submit-sending">
                        <span className="ap-spinner"/>
                        <span>Sending OTP to {email}…</span>
                      </div>
                    ) : (
                      <>
                        <span className="ap-submit-text">
                          Continue — Get OTP
                        </span>
                        <span className="ap-submit-arrow">→</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="ap-switch">
                  {isLogin ? "New here?" : "Already enrolled?"}
                  <button type="button" onClick={() => switchMode(isLogin ? "signup" : "login")}>
                    {isLogin ? "Sign up free →" : "Sign in →"}
                  </button>
                </p>

                <div className="ap-trust">
                  <span className="trust-lock">🔒</span>
                  OTP sent to your real email · 256-bit encrypted
                </div>
              </>
            )}

            {/* ══════════════════════
                STEP: OTP
            ══════════════════════ */}
            {step === "otp" && (
              <div className={`ap-otp-section ${shaking ? "ap-otp--shake" : ""}`} key="otp-step">

                {/* Step indicator */}
                <div className="ap-step-indicator">
                  <div className="ap-step ap-step--done">
                    <span className="ap-step-num">✓</span>
                    <span className="ap-step-lbl">Details</span>
                  </div>
                  <div className="ap-step-line ap-step-line--done"/>
                  <div className="ap-step ap-step--active">
                    <span className="ap-step-num">2</span>
                    <span className="ap-step-lbl">Verify Email</span>
                  </div>
                  <div className="ap-step-line"/>
                  <div className="ap-step">
                    <span className="ap-step-num">3</span>
                    <span className="ap-step-lbl">Access</span>
                  </div>
                </div>

                {/* Back button */}
                <button className="ap-otp-back" onClick={() => { setStep("form"); setOtp(["","","","","",""]); setOtpError(""); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back
                </button>

                {/* Mail icon */}
                <div className="ap-otp-icon-wrap">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8c84a" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="22,7 12,13 2,7"/>
                  </svg>
                  <div className="ap-otp-icon-ring"/>
                </div>

                <h2 className="ap-otp-title">Check your inbox</h2>
                <p className="ap-otp-sub">
                  We sent a <strong>6-digit verification code</strong> to
                </p>
                <div className="ap-otp-email-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="22,7 12,13 2,7"/>
                  </svg>
                  {email}
                </div>

                {/* Progress dots */}
                <div className="ap-otp-progress">
                  {Array.from({length:6}).map((_,i) => (
                    <div key={i} className={`ap-otp-prog-dot ${i < otpFilled ? "ap-otp-prog-dot--filled" : ""}`}/>
                  ))}
                </div>

                {/* 6 boxes */}
                <div className="ap-otp-boxes">
                  {otp.map((digit, idx) => (
                    <OtpInput
                      key={idx}
                      value={digit}
                      filled={!!digit}
                      inputRef={el => otpRefs.current[idx] = el}
                      onChange={e => handleOtpChange(e.target.value, idx)}
                      onKeyDown={e => handleOtpKey(e, idx)}
                      onPaste={handleOtpPaste}
                    />
                  ))}
                </div>

                {otpError && (
                  <div className="ap-alert ap-alert--error" style={{ marginTop: 12 }}>
                    ⚠️ {otpError}
                  </div>
                )}

                {/* Verify button */}
                <button
                  className={`ap-otp-verify ${otpFilled === 6 && !verifying ? "ap-otp-verify--ready" : ""}`}
                  onClick={handleOtpVerify}
                  disabled={verifying || otpFilled < 6}
                >
                  {verifying ? (
                    <><span className="ap-spinner ap-spinner--dark"/> Verifying…</>
                  ) : (
                    <><span>Verify &amp; {isLogin ? "Sign In" : "Create Account"}</span><span>→</span></>
                  )}
                </button>

                {/* Timer + Resend */}
                <div className="ap-otp-resend-row">
                  {canResend ? (
                    <button className="ap-otp-resend-btn" onClick={handleResend}>
                      Resend OTP ↺
                    </button>
                  ) : (
                    <p className="ap-otp-timer">
                      Resend in <strong>{otpTimer}s</strong>
                      <span className="ap-otp-timer-ring">
                        <svg viewBox="0 0 28 28">
                          <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(232,200,74,0.15)" strokeWidth="2"/>
                          <circle cx="14" cy="14" r="11" fill="none" stroke="#e8c84a" strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 11}`}
                            strokeDashoffset={`${2 * Math.PI * 11 * (1 - otpTimer / 60)}`}
                            transform="rotate(-90 14 14)"
                            style={{ transition: "stroke-dashoffset 1s linear" }}
                          />
                        </svg>
                      </span>
                    </p>
                  )}
                </div>

                <div className="ap-trust" style={{ marginTop: 20 }}>
                  <span className="trust-lock">🔒</span>
                  Code expires in 5 minutes · Don't share it
                </div>
              </div>
            )}

            {/* ══════════════════════
                STEP: DONE
            ══════════════════════ */}
            {step === "done" && (
              <div className="ap-done-section">
                <div className="ap-done-ring">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
                    stroke="#e8c84a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div className="ap-done-ring-anim"/>
                </div>
                <h2 className="ap-done-title">
                  {isLogin ? "Welcome back!" : "Account created!"}
                </h2>
                <p className="ap-done-sub">Email verified successfully. Redirecting…</p>
                <div className="ap-done-bar">
                  <div className="ap-done-fill"/>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ap-footer">
        <span>© 2025 LV Learnify</span>
        <span className="ap-footer-div"/>
        <span>Privacy</span>
        <span className="ap-footer-div"/>
        <span>Terms</span>
      </footer>
    </div>
  );
};

export default AuthPage;