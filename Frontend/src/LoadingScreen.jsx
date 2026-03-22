import React, { useEffect, useState, useRef, useCallback } from "react";
import "./LoadingScreen.css";

const WORDS  = ["Python", "AI", "React", "SQL", "Data", "Java", "Design"];
const FACTS  = [
  "50,000+ learners enrolled",
  "Industry-led curriculum",
  "Earn verified certificates",
  "Learn at your own pace",
];

/* tiny particle */
const Particle = ({ style, active }) => (
  <span className={`ls-p ${active ? "ls-p--go" : ""}`} style={style} />
);

const LoadingScreen = ({ onComplete }) => {
  const [progress,   setProgress]   = useState(0);
  const [phase,      setPhase]      = useState("in");
  const [wordIdx,    setWordIdx]     = useState(0);
  const [factIdx,    setFactIdx]     = useState(0);
  const [particles,  setParticles]  = useState([]);
  const [burstOn,    setBurstOn]    = useState(false);

  const prgRef  = useRef(null);
  const wordRef = useRef(null);
  const factRef = useRef(null);

  /* ── burst particles (spawned once at 100%) ── */
  const spawnBurst = useCallback(() => {
    const pts = Array.from({ length: 48 }, (_, i) => {
      const angle = (i / 48) * Math.PI * 2;
      const dist  = 60 + Math.random() * 340;
      const cols  = ["#F59E0B","#EF4444","#A855F7","#06B6D4","#10B981","#fff"];
      return {
        id: i,
        x:    Math.cos(angle) * dist,
        y:    Math.sin(angle) * dist,
        size: 2 + Math.random() * 4,
        col:  cols[i % cols.length],
        del:  Math.random() * 0.25,
        dur:  0.55 + Math.random() * 0.5,
      };
    });
    setParticles(pts);
    setBurstOn(true);
  }, []);

  /* ── progress — completes in ~1.6 s so total with exit = ~2 s ── */
  useEffect(() => {
    let pct = 0;
    prgRef.current = setInterval(() => {
      /* accelerate near start, decelerate near end for easing feel */
      const remaining = 100 - pct;
      const step = Math.max(0.8, remaining * 0.055 + Math.random() * 2.5);
      pct = Math.min(pct + step, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(prgRef.current);
        /* short hold → burst → fade out */
        setTimeout(() => spawnBurst(),    180);
        setTimeout(() => setPhase("out"), 500);
        setTimeout(() => {
          setPhase("done");
          onComplete?.();
        }, 950);
      }
    }, 28);   /* ~60 fps tick */
    return () => clearInterval(prgRef.current);
  }, [onComplete, spawnBurst]);

  /* ── word cycle ── */
  useEffect(() => {
    wordRef.current = setInterval(() => setWordIdx(p => (p + 1) % WORDS.length), 380);
    return () => clearInterval(wordRef.current);
  }, []);

  /* ── fact cycle ── */
  useEffect(() => {
    factRef.current = setInterval(() => setFactIdx(p => (p + 1) % FACTS.length), 900);
    return () => clearInterval(factRef.current);
  }, []);

  if (phase === "done") return null;

  const pct  = Math.round(progress);
  const circ = 2 * Math.PI * 72;   /* r=72 inner ring */
  const dash = circ * progress / 100;

  return (
    <div className={`ls-root ls-${phase}`} aria-label="Loading" role="status">

      {/* ── grain ── */}
      <svg className="ls-grain" aria-hidden="true">
        <filter id="lsgrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#lsgrain)" opacity="0.045"/>
      </svg>

      {/* ── ambient orbs ── */}
      <div className="ls-orbs" aria-hidden="true">
        <div className="ls-orb ls-orb-a"/>
        <div className="ls-orb ls-orb-b"/>
        <div className="ls-orb ls-orb-c"/>
      </div>

      {/* ── animated grid ── */}
      <div className="ls-grid" aria-hidden="true"/>

      {/* ── horizontal scan ── */}
      <div className="ls-scan" aria-hidden="true"/>

      {/* ── burst layer ── */}
      <div className="ls-burst" aria-hidden="true">
        {particles.map(p => (
          <Particle
            key={p.id}
            active={burstOn}
            style={{
              "--bx": `${p.x}px`, "--by": `${p.y}px`,
              width: `${p.size}px`, height: `${p.size}px`,
              background: p.col,
              "--bd": `${p.del}s`, "--bdur": `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════
          STAGE
      ══════════════════════════ */}
      <div className="ls-stage">

        {/* SVG rings */}
        <div className="ls-rings" aria-hidden="true">

          {/* outer decorative ring */}
          <svg className="ls-ring ls-ring-outer" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" fill="none"
              stroke="rgba(245,158,11,0.08)" strokeWidth="1"/>
            <circle cx="150" cy="150" r="140" fill="none"
              stroke="rgba(245,158,11,0.50)" strokeWidth="1"
              strokeDasharray="8 38" strokeLinecap="round"/>
          </svg>

          {/* mid ring — counter */}
          <svg className="ls-ring ls-ring-mid" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="112" fill="none"
              stroke="rgba(239,68,68,0.07)" strokeWidth="1"/>
            <circle cx="120" cy="120" r="112" fill="none"
              stroke="rgba(239,68,68,0.45)" strokeWidth="1"
              strokeDasharray="4 22" strokeLinecap="round"/>
          </svg>

          {/* inner progress ring */}
          <svg className="ls-ring ls-ring-prog" viewBox="0 0 160 160">
            {/* track */}
            <circle cx="80" cy="80" r="72" fill="none"
              stroke="rgba(255,255,255,0.055)" strokeWidth="2.5"/>
            {/* fill */}
            <circle cx="80" cy="80" r="72" fill="none"
              stroke="url(#pg)" strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              transform="rotate(-90 80 80)"
              style={{ transition: "stroke-dasharray 0.06s linear" }}
            />
            {/* glow dot at tip */}
            {progress > 2 && (
              <circle
                cx={80 + 72 * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)}
                cy={80 + 72 * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)}
                r="4" fill="#F59E0B"
                style={{ filter: "blur(2px)", opacity: 0.9 }}
              />
            )}
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#F59E0B"/>
                <stop offset="45%"  stopColor="#EF4444"/>
                <stop offset="100%" stopColor="#A855F7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* logo hex */}
        <div className="ls-logo" aria-hidden="true">
          <svg viewBox="0 0 80 80" fill="none" className="ls-logo-svg">
            <polygon points="40,3 73,21 73,59 40,77 7,59 7,21"
              fill="none" stroke="rgba(245,158,11,0.30)" strokeWidth="1"
              className="ls-hex"/>
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
              fill="url(#lg)" fontSize="22" fontFamily="Anton,sans-serif" letterSpacing="2">
              LV
            </text>
            <defs>
              <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B"/>
                <stop offset="100%" stopColor="#EF4444"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* brand letters */}
        <div className="ls-brand" aria-label="Learnify">
          {"Learnify".split("").map((ch, i) => (
            <span key={i} className="ls-ch" style={{ "--i": i }}>{ch}</span>
          ))}
        </div>

        {/* cycling word */}
        <div className="ls-word-wrap" aria-live="polite">
          {WORDS.map((w, i) => (
            <span key={w}
              className={`ls-word ${i === wordIdx ? "ls-word--on" : ""}`}
              aria-hidden={i !== wordIdx}>
              {w}
            </span>
          ))}
        </div>

        {/* big percentage */}
        <div className="ls-pct" aria-live="polite">
          <span className="ls-pct-n">{pct}</span>
          <span className="ls-pct-s">%</span>
        </div>

        {/* thin bar */}
        <div className="ls-bar">
          <div className="ls-bar-fill" style={{ width: `${progress}%` }}>
            <span className="ls-bar-tip"/>
          </div>
        </div>

        {/* fact */}
        <div className="ls-fact-wrap" aria-live="polite">
          {FACTS.map((f, i) => (
            <p key={f}
              className={`ls-fact ${i === factIdx ? "ls-fact--on" : ""}`}
              aria-hidden={i !== factIdx}>
              {f}
            </p>
          ))}
        </div>

        {/* dots */}
        <div className="ls-dots" aria-hidden="true">
          {[0,1,2,3,4].map(i => <span key={i} style={{ "--di": i }}/>)}
        </div>

      </div>

      {/* corner brackets */}
      {[["tl","#F59E0B"],["tr","#EF4444"],["bl","#A855F7"],["br","#06B6D4"]].map(([pos, col]) => (
        <div key={pos} className={`ls-corner ls-corner-${pos}`} aria-hidden="true">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path
              d={pos==="tl"?"M2 50V10Q2 2 10 2H50":
                 pos==="tr"?"M50 50V10Q50 2 42 2H2":
                 pos==="bl"?"M2 2V42Q2 50 10 50H50":
                            "M50 2V42Q50 50 42 50H2"}
              stroke={col} strokeOpacity="0.38" strokeWidth="1.5"
            />
            <circle
              cx={pos==="tl"||pos==="bl"?"2":"50"}
              cy={pos==="tl"||pos==="tr"?"50":"2"}
              r="3" fill={col} fillOpacity="0.65"
            />
          </svg>
        </div>
      ))}

      {/* status bar */}
      <div className="ls-statusbar" aria-hidden="true">
        <span className="ls-sb-left">
          <span className="ls-sb-dot"/>
          LEARNIFY
        </span>
        <span className="ls-sb-mid">
          {FACTS.map((f, i) => (
            <span key={f} className={`ls-sb-fact ${i === factIdx ? "ls-sb-fact--on" : ""}`}>{f}</span>
          ))}
        </span>
        <span className="ls-sb-right">{pct < 100 ? "LOADING" : "READY"}</span>
      </div>

    </div>
  );
};

export default LoadingScreen;