import React, { useState } from "react";
import "./Footer.css";
import logo from "./assets/LDP Logo.png";

const links = {
  "Useful Links":    ["About Us", "Careers", "Blog", "FAQs", "Become Instructor", "Contact Us"],
  "Student Support": ["Help Center", "Live Chat", "Course Guide", "How It Works"],
  "Popular Courses": ["Web Development", "Python Programming", "React Development", "UI/UX Design", "Data Science", "Machine Learning"],
  "Categories":      ["Programming", "Design", "Business", "Technology", "Personal Dev"],
};

const socials = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3500);
  };

  return (
    <footer className="ft-root" id="contact">

      <div className="ft-mesh" />

      {/* ── TOP STRIP ── */}
      <div className="ft-top-strip">
        <div className="ft-strip-left">
          <span className="ft-strip-dot" />
          5,000+ students learning right now
        </div>
        <div className="ft-strip-right">
          {["🔒 Secure", "✅ Certified", "⚡ Instant Access"].map(t => (
            <span key={t} className="ft-strip-badge">{t}</span>
          ))}
        </div>
      </div>

      <div className="ft-inner">

        {/* ══ ROW 1 ══ */}
        <div className="ft-row1">

          {/* BRAND — big logo */}
          <div className="ft-brand">

            <img src={logo} alt="LV Learnify" className="ft-logo" />

            {/* ghosted tagline */}
            <span className="ft-brand-tagline">Knowledge · Unlocked</span>

            <p className="ft-brand-desc">
              LV Learnify is a modern e-learning platform designed to help
              students gain real-world skills through expert-led courses and
              hands-on practical projects.
            </p>

            <div className="ft-contact-chips">
              <a href="tel:+919696969696" className="ft-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.97-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +91 96969 69696
              </a>
              <a href="mailto:support@lvlearnify.com" className="ft-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                support@lvlearnify.com
              </a>
            </div>

            <div className="ft-socials">
              {socials.map(s => (
                <a key={s.name} href={s.href} className="ft-social-btn" aria-label={s.name}>
                  {s.icon}
                </a>
              ))}
            </div>

          </div>

          {/* NEWSLETTER */}
          <div className="ft-newsletter">
            <p className="ft-nl-eyebrow">Stay in the loop</p>
            <h3 className="ft-nl-title">Join LV Learnify</h3>
            <p className="ft-nl-desc">
              Get course updates, learning tips and new skill programmes
              delivered straight to your inbox.
            </p>

            <form className="ft-nl-form" onSubmit={handleSubscribe}>
              <div className="ft-nl-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={`ft-nl-btn ${subscribed ? "ft-nl-btn-ok" : ""}`}
              >
                {subscribed ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Subscribed!
                  </>
                ) : (
                  <>
                    Sign Up Free
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="ft-nl-note">No spam. Unsubscribe anytime.</p>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="ft-divider" />

        {/* ══ LINKS ROW ══ */}
        <div className="ft-links-row">
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="ft-col">
              <h4 className="ft-col-head">{heading}</h4>
              <ul className="ft-col-list">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="ft-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="ft-bottom">
          <p className="ft-copy">© 2025 LVLearnify.com. All rights reserved.</p>
          <div className="ft-bottom-links">
            <a href="#" className="ft-bottom-link">Terms & Conditions</a>
            <a href="#" className="ft-bottom-link">Privacy Notice</a>
            <a href="#" className="ft-bottom-link">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}