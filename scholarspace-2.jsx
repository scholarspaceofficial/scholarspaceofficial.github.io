import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

// ── Google Fonts ──────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --blue:    #3B82F6;
      --blue-2:  #60A5FA;
      --bg:      #03070F;
      --bg-2:    #070E1A;
      --glass:   rgba(255,255,255,0.035);
      --glass-b: rgba(255,255,255,0.07);
      --teal:    #0EA5E9;
      --white:   #F1F5F9;
      --muted:   #64748B;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      overflow-x: hidden;
    }

    .syne { font-family: 'Syne', sans-serif; }

    /* Starfield canvas */
    #starfield { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

    /* Glass card */
    .glass-card {
      background: var(--glass);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    /* Blue glow text */
    .blue-text {
      background: linear-gradient(135deg, #3B82F6, #60A5FA);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Glow button */
    .glow-btn {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #3B82F6, #60A5FA);
      color: #04080F;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      letter-spacing: 0.02em;
      cursor: pointer;
      border: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .glow-btn::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      background: linear-gradient(135deg, #3B82F6, #60A5FA);
      filter: blur(18px);
      opacity: 0;
      transition: opacity 0.3s;
      z-index: -1;
    }
    .glow-btn:hover::after { opacity: 0.7; }
    .glow-btn:hover { transform: scale(1.04); box-shadow: 0 0 40px rgba(59,130,246,0.45); }

    /* Ghost button */
    .ghost-btn {
      background: transparent;
      border: 1px solid rgba(59,130,246,0.4);
      color: var(--blue);
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.25s;
    }
    .ghost-btn:hover {
      background: rgba(59,130,246,0.08);
      border-color: var(--blue);
      box-shadow: 0 0 24px rgba(59,130,246,0.2);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 2px; }

    /* Nebula blobs */
    .nebula {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;
    }

    /* Timeline line */
    .timeline-line {
      background: linear-gradient(180deg, transparent, #3B82F6 20%, #38BDF8 80%, transparent);
    }

    /* Orbit ring animation */
    @keyframes orbit-spin {
      from { transform: rotateX(70deg) rotateZ(0deg); }
      to   { transform: rotateX(70deg) rotateZ(360deg); }
    }
    .orbit-ring {
      animation: orbit-spin 6s linear infinite;
      transform-style: preserve-3d;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    .float { animation: float 4s ease-in-out infinite; }

    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .pulse-ring { animation: pulse-ring 2s ease-out infinite; }

    /* Mobile nav */
    @media (max-width: 640px) {
      .nav-links { display: none; }
    }
  `}</style>
);

// ── Starfield Canvas ──────────────────────────────────────────
function Starfield({ mousePos }) {
  const canvasRef = useRef(null);
  const starsRef  = useRef([]);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const COUNT = 260;
    starsRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      const px = mousePos.current.x / W - 0.5;
      const py = mousePos.current.y / H - 0.5;

      starsRef.current.forEach(s => {
        const twinkle = 0.5 + 0.5 * Math.sin(s.twinkle + t * s.speed * 4);
        ctx.beginPath();
        ctx.arc(
          s.x + px * s.r * 18,
          s.y + py * s.r * 18,
          s.r, 0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(241,245,249,${s.a * twinkle})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas id="starfield" ref={canvasRef} />;
}

// ── Magnetic Button ───────────────────────────────────────────
function MagneticBtn({ children, className = "", style = {}, onClick }) {
  const ref     = useRef(null);
  const x       = useSpring(0, { stiffness: 280, damping: 20 });
  const y       = useSpring(0, { stiffness: 280, damping: 20 });

  const onMove = (e) => {
    const r  = ref.current.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={{ x, y, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 clamp(1rem,4vw,3rem)",
        height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: scrolled ? "rgba(4,10,20,0.88)" : "rgba(4,10,20,0.4)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg,#3B82F6,#60A5FA)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: "#04080F",
        }}>SS</div>
        <span className="syne" style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
          Scholar<span className="blue-text">Space</span>
        </span>
      </div>

      {/* Right */}
      <MagneticBtn
        className="glow-btn"
        style={{ padding: "10px 22px", borderRadius: 40, fontSize: 13 }}
        onClick={() => window.open("https://www.instagram.com/scholarspace.official", "_blank")}
      >
        Secure Your GPA →
      </MagneticBtn>
    </motion.nav>
  );
}

// ── Constellation Visual ──────────────────────────────────────
function Constellation() {
  const nodes = [
    { x: 50, y: 50 }, { x: 20, y: 20 }, { x: 80, y: 25 },
    { x: 15, y: 70 }, { x: 85, y: 68 }, { x: 50, y: 90 },
    { x: 35, y: 38 }, { x: 65, y: 35 },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,6],[2,7],[6,7]];

  return (
    <div className="float" style={{
      width: "clamp(260px,40vw,420px)",
      height: "clamp(260px,40vw,420px)",
      position: "relative",
    }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6"/>
            <stop offset="100%" stopColor="#60A5FA"/>
          </radialGradient>
        </defs>

        {/* Edges */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(59,130,246,0.25)" strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            {i === 0 && (
              <motion.circle
                cx={n.x} cy={n.y} r={6}
                fill="rgba(59,130,246,0.12)"
                className="pulse-ring"
              />
            )}
            <motion.circle
              cx={n.x} cy={n.y}
              r={i === 0 ? 2.5 : 1.5}
              fill="url(#nodeGrad)"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            />
          </g>
        ))}
      </svg>

      {/* Outer orbit ring */}
      <div style={{
        position: "absolute", inset: "-12%",
        borderRadius: "50%",
        border: "1px solid rgba(59,130,246,0.15)",
        animation: "orbit-spin 12s linear infinite",
        transformStyle: "preserve-3d",
      }}>
        <div style={{
          position: "absolute", top: "6%", left: "50%",
          width: 7, height: 7, borderRadius: "50%",
          background: "linear-gradient(135deg,#3B82F6,#60A5FA)",
          transform: "translateX(-50%)",
          boxShadow: "0 0 12px #3B82F6",
        }} />
      </div>
    </div>
  );
}

// ── Reveal wrapper ────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 30 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Pillar Icons ──────────────────────────────────────────────
const PlanetIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <circle cx="21" cy="21" r="10" fill="url(#pg)" />
    <ellipse cx="21" cy="21" rx="19" ry="7" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.7" fill="none"/>
    <defs><radialGradient id="pg" cx="40%" cy="35%"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#60A5FA"/></radialGradient></defs>
  </svg>
);
const ShieldIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M21 4L6 10v12c0 8.8 6.4 17 15 19 8.6-2 15-10.2 15-19V10L21 4Z" fill="rgba(59,130,246,0.12)" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M14 21l5 5 9-9" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const TimerIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <circle cx="21" cy="23" r="14" stroke="#3B82F6" strokeWidth="1.5" fill="rgba(59,130,246,0.08)"/>
    <path d="M21 23V13" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
    <path d="M21 23l8 5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 4h10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M21 4v4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const InfinityIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M10 21c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="#3B82F6" strokeWidth="1.8" fill="none"/>
    <path d="M32 21c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8" stroke="#60A5FA" strokeWidth="1.8" fill="none"/>
    <circle cx="21" cy="21" r="2.5" fill="#3B82F6"/>
  </svg>
);

const pillars = [
  {
    icon: <PlanetIcon />,
    title: "Complete Assignment Care",
    desc: "Full top-to-bottom handling of your toughest coursework. We own every line—so you don't have to.",
    tag: "Total Coverage",
  },
  {
    icon: <ShieldIcon />,
    title: "100% Secure & Private",
    desc: "Complete confidentiality. Your identity is sealed in our vault—invisible to the universe.",
    tag: "Encrypted Vault",
  },
  {
    icon: <TimerIcon />,
    title: "Guaranteed Deadlines",
    desc: "Time dilation isn't real here. We beat your clock, every single time—zero exceptions.",
    tag: "On-Time, Always",
  },
  {
    icon: <InfinityIcon />,
    title: "Your Time Restored",
    desc: "Reclaim your weekends, your hobbies, and your sanity. Live your life, not your syllabus.",
    tag: "Peace Restored",
  },
];

// ── Pillar Card ───────────────────────────────────────────────
function PillarCard({ icon, title, desc, tag, index }) {
  return (
    <Reveal delay={index * 0.12}>
      <motion.div
        className="glass-card"
        whileHover={{ scale: 1.04, y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          borderRadius: 20, padding: "clamp(1.4rem,3vw,2rem)",
          cursor: "default", position: "relative", overflow: "hidden",
        }}
      >
        {/* Hover border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            background: "transparent",
            border: "1px solid rgba(59,130,246,0.55)",
            borderRadius: 20,
            boxShadow: "0 0 28px rgba(59,130,246,0.15) inset",
            pointerEvents: "none",
            position: "absolute", inset: 0,
          }}
        />

        {/* Tag */}
        <div style={{
          display: "inline-block", marginBottom: 20,
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.25)",
          color: "#3B82F6", fontSize: 11,
          padding: "4px 12px", borderRadius: 40,
          fontFamily: "'Syne',sans-serif", letterSpacing: "0.08em",
        }}>
          {tag}
        </div>

        {/* Icon */}
        <div className="float" style={{ marginBottom: 18 }}>{icon}</div>

        <h3 className="syne" style={{ fontSize: "clamp(1rem,2vw,1.15rem)", fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>
          {title}
        </h3>
        <p style={{ fontSize: "clamp(0.82rem,1.5vw,0.9rem)", color: "#94A3B8", lineHeight: 1.7 }}>
          {desc}
        </p>
      </motion.div>
    </Reveal>
  );
}

// ── Timeline Step ─────────────────────────────────────────────
const steps = [
  {
    num: "01", label: "Orbit Entry", sublabel: "Submit",
    desc: "Securely drop your assignment prompt and grading rubric into our DMs. Fast, encrypted, frictionless.",
    color: "#3B82F6",
  },
  {
    num: "02", label: "Deep Analysis", sublabel: "Deconstruct",
    desc: "Our specialist crew maps the technical parameters, rubric architecture, and optimal execution path.",
    color: "#38BDF8",
  },
  {
    num: "03", label: "Safe Landing", sublabel: "Deliver",
    desc: "Receive flawlessly executed work, right on time. No friction, no panic—just results.",
    color: "#E2E8F0",
  },
];

function TimelineStep({ step, index, total }) {
  return (
    <Reveal delay={index * 0.18}>
      <div style={{ display: "flex", gap: "clamp(1rem,3vw,2rem)", alignItems: "flex-start", position: "relative" }}>
        {/* Number column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: `radial-gradient(circle, ${step.color}22, transparent)`,
            border: `1.5px solid ${step.color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: step.color,
            boxShadow: `0 0 24px ${step.color}33`,
            position: "relative", zIndex: 1,
          }}>
            {step.num}
          </div>
          {index < total - 1 && (
            <div className="timeline-line" style={{ width: 2, height: "clamp(40px,6vw,60px)", marginTop: 4 }} />
          )}
        </div>

        {/* Content */}
        <div style={{ paddingTop: 10, paddingBottom: 32 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 10 }}>
            <span className="syne" style={{ fontSize: "clamp(1.1rem,2.5vw,1.35rem)", fontWeight: 700 }}>{step.label}</span>
            <span style={{
              fontSize: 11, color: step.color, fontFamily: "'Syne',sans-serif",
              background: `${step.color}15`, border: `1px solid ${step.color}30`,
              padding: "3px 10px", borderRadius: 30,
            }}>{step.sublabel}</span>
          </div>
          <p style={{ fontSize: "clamp(0.85rem,1.6vw,0.95rem)", color: "#94A3B8", lineHeight: 1.75, maxWidth: 480 }}>
            {step.desc}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

// ── University Data ───────────────────────────────────────────
const unis = [
  // USA
  {
    name: "MIT", abbr: "MIT", country: "🇺🇸", full: "Massachusetts Institute of Technology",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/200px-MIT_logo.svg.png",
  },
  {
    name: "Harvard", abbr: "HU", country: "🇺🇸", full: "Harvard University",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/200px-Harvard_University_logo.svg.png",
  },
  {
    name: "Stanford", abbr: "SU", country: "🇺🇸", full: "Stanford University",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/200px-Stanford_Cardinal_logo.svg.png",
  },
  {
    name: "Columbia", abbr: "CU", country: "🇺🇸", full: "Columbia University",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Columbia_University_shield.svg/150px-Columbia_University_shield.svg.png",
  },
  {
    name: "NYU", abbr: "NYU", country: "🇺🇸", full: "New York University",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/NYU_logo.svg/200px-NYU_logo.svg.png",
  },
  {
    name: "UCLA", abbr: "UCLA", country: "🇺🇸", full: "Univ. of California, LA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Bruins_wordmark.svg/200px-Bruins_wordmark.svg.png",
  },
  {
    name: "USC", abbr: "USC", country: "🇺🇸", full: "Univ. of Southern California",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/USC_Trojans_logo.svg/160px-USC_Trojans_logo.svg.png",
  },
  {
    name: "UT Austin", abbr: "UTA", country: "🇺🇸", full: "University of Texas at Austin",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Texas_Longhorns_logo.svg/150px-Texas_Longhorns_logo.svg.png",
  },
  // Australia
  {
    name: "U of Melbourne", abbr: "UoM", country: "🇦🇺", full: "University of Melbourne",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Unimelb_logo_zigzag.svg/200px-Unimelb_logo_zigzag.svg.png",
  },
  {
    name: "ANU", abbr: "ANU", country: "🇦🇺", full: "Australian National University",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/ANU_coat_of_arms.svg/150px-ANU_coat_of_arms.svg.png",
  },
  {
    name: "UNSW", abbr: "UNSW", country: "🇦🇺", full: "Univ. of New South Wales",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/UNSW_Sydney_logo.png/200px-UNSW_Sydney_logo.png",
  },
  {
    name: "U of Sydney", abbr: "USYD", country: "🇦🇺", full: "University of Sydney",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/25/University_of_Sydney_coat_of_arms.svg/150px-University_of_Sydney_coat_of_arms.svg.png",
  },
  {
    name: "Monash", abbr: "MU", country: "🇦🇺", full: "Monash University",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Monash_University_logo.svg/200px-Monash_University_logo.svg.png",
  },
  {
    name: "UQ", abbr: "UQ", country: "🇦🇺", full: "University of Queensland",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/University_of_Queensland_coat_of_arms.svg/150px-University_of_Queensland_coat_of_arms.svg.png",
  },
  {
    name: "UWA", abbr: "UWA", country: "🇦🇺", full: "University of Western Australia",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/University_of_Western_Australia_coat_of_arms.svg/150px-University_of_Western_Australia_coat_of_arms.svg.png",
  },
];

// Color accent per card for variety
const accentColors = [
  "#3B82F6","#60A5FA","#38BDF8","#818CF8","#6EE7B7",
  "#93C5FD","#7DD3FC","#A5B4FC","#5EEAD4","#BAE6FD",
  "#C7D2FE","#67E8F9","#4ADE80","#34D399","#22D3EE",
];

function UniMarquee() {
  // Duplicate for seamless loop
  const doubled = [...unis, ...unis];
  const [failedLogos, setFailedLogos] = useState(() => new Set());

  return (
    <section style={{ padding: "clamp(3rem,6vw,5.5rem) 0", overflow: "hidden", position: "relative" }}>
      {/* Section header */}
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "clamp(2rem,4vw,3rem)", padding: "0 clamp(1.5rem,4vw,3rem)" }}>
          <p style={{ fontSize: 12, color: "#3B82F6", fontFamily: "'Syne',sans-serif", letterSpacing: "0.18em", marginBottom: 12 }}>
            TRUSTED BY STUDENTS FROM
          </p>
          <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Top Universities Across{" "}
            <span className="blue-text">USA & Australia</span>
          </h2>
          <p style={{ fontSize: "clamp(0.85rem,1.5vw,0.95rem)", color: "#475569", marginTop: 14, maxWidth: 520, margin: "14px auto 0" }}>
            We've helped students from 15 of the world's most prestigious institutions
            secure their grades and reclaim their time.
          </p>
        </div>
      </Reveal>

      {/* Fade edges */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "clamp(40px,6vw,100px)",
        background: "linear-gradient(90deg, #03070F, transparent)",
        zIndex: 10, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "clamp(40px,6vw,100px)",
        background: "linear-gradient(270deg, #03070F, transparent)",
        zIndex: 10, pointerEvents: "none",
      }} />

      {/* Marquee track */}
      <div style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex",
          gap: "clamp(14px,2vw,24px)",
          animation: "marquee-scroll 38s linear infinite",
          width: "max-content",
        }}>
          {doubled.map((uni, i) => {
            const accent = accentColors[i % accentColors.length];
            const isAU = uni.country === "🇦🇺";
            const logoFailed = failedLogos.has(uni.logo);
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06, y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                style={{
                  flexShrink: 0,
                  width: "clamp(150px,18vw,200px)",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: 16,
                  padding: "clamp(14px,2vw,20px) clamp(12px,2vw,18px)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 10, cursor: "default",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
                  background: accent, borderRadius: "0 0 4px 4px", opacity: 0.7,
                }} />

                {/* Logo image */}
                <div style={{
                  width: 64, height: 64, borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 10, flexShrink: 0,
                }}>
                  {logoFailed ? (
                    <span
                      className="syne"
                      style={{
                        fontWeight: 800,
                        fontSize: 12,
                        color: accent,
                      }}
                    >
                      {uni.abbr}
                    </span>
                  ) : (
                    <img
                      src={uni.logo}
                      alt={uni.name + " logo"}
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1)",
                        opacity: 0.9,
                      }}
                      onError={() => {
                        setFailedLogos((current) => {
                          const next = new Set(current);
                          next.add(uni.logo);
                          return next;
                        });
                      }}
                    />
                  )}
                </div>

                {/* Name */}
                <div style={{ textAlign: "center" }}>
                  <div className="syne" style={{
                    fontSize: "clamp(0.7rem,1.2vw,0.82rem)", fontWeight: 700,
                    color: "#E2E8F0", lineHeight: 1.3,
                    marginBottom: 4,
                  }}>
                    {uni.name}
                  </div>
                  <div style={{ fontSize: "clamp(0.6rem,1vw,0.68rem)", color: "#475569", lineHeight: 1.4 }}>
                    {uni.full}
                  </div>
                </div>

                {/* Country flag + label */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: isAU ? "rgba(56,189,248,0.08)" : "rgba(59,130,246,0.08)",
                  border: `1px solid ${isAU ? "rgba(56,189,248,0.2)" : "rgba(59,130,246,0.2)"}`,
                  borderRadius: 20, padding: "3px 9px",
                }}>
                  <span style={{ fontSize: 12 }}>{uni.country}</span>
                  <span style={{
                    fontSize: 10, fontFamily: "'Syne',sans-serif", letterSpacing: "0.06em",
                    color: isAU ? "#38BDF8" : "#60A5FA",
                  }}>
                    {isAU ? "AUSTRALIA" : "USA"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Keyframe injected via style tag */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        div:has(> div[style*="marquee-scroll"]):hover > div[style*="marquee-scroll"] {
          animation-play-state: paused;
        }
      `}</style>

      {/* Stats strip */}
      <Reveal delay={0.2}>
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "clamp(1.5rem,4vw,4rem)", marginTop: "clamp(2rem,4vw,3.5rem)",
          padding: "0 clamp(1.5rem,4vw,3rem)",
        }}>
          {[
            ["15", "Elite Universities"],
            ["2", "Countries Covered"],
            ["500+", "Students Served"],
            ["#1", "For Discretion"],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div className="syne blue-text" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800 }}>{val}</div>
              <div style={{ fontSize: "clamp(0.72rem,1.2vw,0.8rem)", color: "#475569", marginTop: 4, letterSpacing: "0.06em" }}>{label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function ScholarSpace() {
  const mousePos = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  return (
    <div onMouseMove={onMouseMove} style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      <FontLoader />
      <Starfield mousePos={mousePos} />

      {/* Nebula blobs */}
      <div className="nebula" style={{ width: 600, height: 600, background: "rgba(59,130,246,0.08)", top: "-10%", left: "-15%", zIndex: 1 }} />
      <div className="nebula" style={{ width: 500, height: 500, background: "rgba(96,165,250,0.06)", top: "20%", right: "-15%", zIndex: 1 }} />
      <div className="nebula" style={{ width: 700, height: 700, background: "rgba(56,189,248,0.05)", top: "60%", left: "10%", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ── NAV ── */}
        <Nav />

        {/* ── HERO ── */}
        <section style={{
          minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "120px clamp(1.5rem,6vw,5rem) 80px",
          gap: "clamp(2rem,5vw,5rem)",
          flexWrap: "wrap",
        }}>
          {/* Left */}
          <div style={{ flex: "1 1 340px", maxWidth: 620 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
                background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
                padding: "6px 16px", borderRadius: 40,
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
              <span style={{ fontSize: 12, color: "#3B82F6", fontFamily: "'Syne',sans-serif", letterSpacing: "0.1em" }}>
                PREMIUM ACADEMIC CONSULTING
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="syne"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                fontSize: "clamp(2.6rem,6.5vw,5.2rem)",
                fontWeight: 800, lineHeight: 1.06,
                letterSpacing: "-0.03em", marginBottom: 28,
              }}
            >
              Your Academic<br />
              <span className="blue-text">Edge. Total</span><br />
              Relief.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              style={{
                fontSize: "clamp(0.95rem,1.8vw,1.1rem)", color: "#94A3B8",
                lineHeight: 1.8, marginBottom: 42, maxWidth: 520,
              }}
            >
              Stuck on complex assignments or running out of time? Let <strong style={{ color: "#CBD5E1" }}>ScholarSpace</strong> handle the heavy lifting and secure your GPA—so you can focus on the things that matter to you.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}
            >
              <MagneticBtn
                className="glow-btn"
                style={{ padding: "16px 38px", borderRadius: 50, fontSize: "clamp(0.9rem,1.5vw,1rem)" }}
                onClick={() => window.open("https://www.instagram.com/scholarspace.official", "_blank")}
              >
                Pass the Load →
              </MagneticBtn>

              <button
                className="ghost-btn"
                style={{ padding: "16px 28px", borderRadius: 50, fontSize: "clamp(0.85rem,1.5vw,0.95rem)" }}
              >
                How It Works
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              style={{ display: "flex", gap: 32, marginTop: 52, flexWrap: "wrap" }}
            >
              {[["98%","GPA Protection"],["24h","Turnaround"],["500+","Students Served"]].map(([n,l]) => (
                <div key={l}>
                  <div className="syne blue-text" style={{ fontSize: "clamp(1.3rem,2.5vw,1.7rem)", fontWeight: 800 }}>{n}</div>
                  <div style={{ fontSize: "clamp(0.72rem,1.2vw,0.8rem)", color: "#64748B", letterSpacing: "0.06em", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — constellation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}
          >
            <Constellation />
          </motion.div>
        </section>

        {/* ── PILLARS ── */}
        <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,5rem)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,4.5rem)" }}>
                <p style={{ fontSize: 12, color: "#3B82F6", fontFamily: "'Syne',sans-serif", letterSpacing: "0.18em", marginBottom: 14 }}>
                  MISSION CONTROL
                </p>
                <h2 className="syne" style={{ fontSize: "clamp(1.9rem,4.5vw,3.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Built Around <span className="blue-text">Your Needs</span>
                </h2>
              </div>
            </Reveal>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "clamp(1rem,2.5vw,1.5rem)",
            }}>
              {pillars.map((p, i) => <PillarCard key={i} {...p} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div style={{
          height: 1, maxWidth: 900, margin: "0 auto",
          background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.35),transparent)",
        }} />

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,5rem)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Reveal>
              <div style={{ marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
                <p style={{ fontSize: 12, color: "#3B82F6", fontFamily: "'Syne',sans-serif", letterSpacing: "0.18em", marginBottom: 14 }}>
                  LAUNCH SEQUENCE
                </p>
                <h2 className="syne" style={{ fontSize: "clamp(1.9rem,4.5vw,3.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  How It <span className="blue-text">Works</span>
                </h2>
                <p style={{ fontSize: "clamp(0.88rem,1.6vw,1rem)", color: "#64748B", marginTop: 14, maxWidth: 500, lineHeight: 1.7 }}>
                  Three precise steps from submission to solution. No complexity, no noise—just execution.
                </p>
              </div>
            </Reveal>

            {steps.map((s, i) => <TimelineStep key={i} step={s} index={i} total={steps.length} />)}
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,5rem)" }}>
          <Reveal>
            <div
              className="glass-card"
              style={{
                maxWidth: 860, margin: "0 auto",
                borderRadius: 28, padding: "clamp(2.5rem,5vw,4.5rem)",
                textAlign: "center", position: "relative", overflow: "hidden",
              }}
            >
              {/* Blue inner glow */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: "70%", height: "60%",
                background: "radial-gradient(ellipse,rgba(59,130,246,0.07),transparent)",
                pointerEvents: "none",
              }} />

              <p style={{ fontSize: 12, color: "#3B82F6", fontFamily: "'Syne',sans-serif", letterSpacing: "0.18em", marginBottom: 20 }}>
                READY TO LAUNCH?
              </p>
              <h2 className="syne" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.15 }}>
                Buy Back Your Time.<br /><span className="blue-text">Protect Your GPA.</span>
              </h2>
              <p style={{ fontSize: "clamp(0.88rem,1.6vw,1rem)", color: "#64748B", marginBottom: 38, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 38px" }}>
                Join hundreds of students who stopped sacrificing their personal lives for academic pressure.
              </p>
              <MagneticBtn
                className="glow-btn"
                style={{ padding: "18px 52px", borderRadius: 50, fontSize: "clamp(0.9rem,1.6vw,1.05rem)" }}
                onClick={() => window.open("https://www.instagram.com/scholarspace.official", "_blank")}
              >
                DM @scholarspace.official →
              </MagneticBtn>
            </div>
          </Reveal>
        </section>

        {/* ── UNI LOGOS MARQUEE ── */}
        <UniMarquee />

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(2rem,4vw,3rem) clamp(1.5rem,6vw,5rem)",
        }}>
          <div style={{
            maxWidth: 1100, margin: "0 auto",
            display: "flex", flexWrap: "wrap", gap: 24,
            alignItems: "center", justifyContent: "space-between",
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: "linear-gradient(135deg,#3B82F6,#60A5FA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 12, color: "#04080F",
                }}>SS</div>
                <span className="syne" style={{ fontWeight: 700, fontSize: 16 }}>
                  Scholar<span className="blue-text">Space</span>
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#475569" }}>
                DM <a href="https://instagram.com/scholarspace.official" target="_blank" rel="noopener noreferrer" style={{ color: "#3B82F6", textDecoration: "none" }}>@scholarspace.official</a> on Instagram to buy back your time.
              </p>
            </div>

            {/* Center */}
            <div style={{ textAlign: "center" }}>
              <a href="https://www.instagram.com/scholarspace.official" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#3B82F6", fontFamily: "'Syne',sans-serif", letterSpacing: "0.12em", textDecoration: "none", display: "block" }}>
                @scholarspace.official
              </a>
            </div>

            {/* Right */}
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#334155", marginBottom: 4 }}>© {new Date().getFullYear()} ScholarSpace. All rights reserved.</p>
              <a href="#" style={{ fontSize: 11, color: "#475569", textDecoration: "none" }}>Privacy Policy</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
