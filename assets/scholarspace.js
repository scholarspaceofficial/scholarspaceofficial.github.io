import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FontLoader = () => _jsx("style", {
  children: `
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
  `
});
function Starfield({
  mousePos
}) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const rafRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const COUNT = 260;
    starsRef.current = Array.from({
      length: COUNT
    }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2
    }));
    const resize = () => {
      W = canvas.width = window.innerWidth;
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
        ctx.arc(s.x + px * s.r * 18, s.y + py * s.r * 18, s.r, 0, Math.PI * 2);
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
  return _jsx("canvas", {
    id: "starfield",
    ref: canvasRef
  });
}
function MagneticBtn({
  children,
  className = "",
  style = {},
  onClick
}) {
  const ref = useRef(null);
  const x = useSpring(0, {
    stiffness: 280,
    damping: 20
  });
  const y = useSpring(0, {
    stiffness: 280,
    damping: 20
  });
  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  return _jsx(motion.button, {
    ref: ref,
    style: {
      x,
      y,
      ...style
    },
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick: onClick,
    className: className,
    whileTap: {
      scale: 0.96
    },
    children: children
  });
}
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return _jsxs(motion.nav, {
    initial: {
      y: -80,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      duration: 0.7,
      ease: "easeOut"
    },
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: "0 clamp(1rem,4vw,3rem)",
      height: 68,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      background: scrolled ? "rgba(4,10,20,0.88)" : "rgba(4,10,20,0.4)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition: "background 0.4s, border-color 0.4s"
    },
    children: [_jsxs("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      },
      children: [_jsx("img", {
        src: "/assets/scholarspace-logo.svg",
        alt: "ScholarSpace",
        style: {
          width: 36,
          height: 36
        }
      }), _jsxs("span", {
        className: "syne",
        style: {
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "-0.01em"
        },
        children: ["Scholar", _jsx("span", {
          className: "blue-text",
          children: "Space"
        })]
      })]
    }), _jsx(MagneticBtn, {
      className: "glow-btn",
      style: {
        padding: "10px 22px",
        borderRadius: 40,
        fontSize: 13
      },
      onClick: () => window.open("https://www.instagram.com/scholarspace.official", "_blank"),
      children: "Secure Your GPA \u2192"
    })]
  });
}
function Constellation() {
  const nodes = [{
    x: 50,
    y: 50
  }, {
    x: 20,
    y: 20
  }, {
    x: 80,
    y: 25
  }, {
    x: 15,
    y: 70
  }, {
    x: 85,
    y: 68
  }, {
    x: 50,
    y: 90
  }, {
    x: 35,
    y: 38
  }, {
    x: 65,
    y: 35
  }];
  const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [2, 7], [6, 7]];
  return _jsxs("div", {
    className: "float",
    style: {
      width: "clamp(260px,40vw,420px)",
      height: "clamp(260px,40vw,420px)",
      position: "relative"
    },
    children: [_jsxs("svg", {
      viewBox: "0 0 100 100",
      style: {
        width: "100%",
        height: "100%",
        overflow: "visible"
      },
      children: [_jsxs("defs", {
        children: [_jsxs("filter", {
          id: "glow",
          children: [_jsx("feGaussianBlur", {
            stdDeviation: "1.5",
            result: "blur"
          }), _jsxs("feMerge", {
            children: [_jsx("feMergeNode", {
              in: "blur"
            }), _jsx("feMergeNode", {
              in: "SourceGraphic"
            })]
          })]
        }), _jsxs("radialGradient", {
          id: "nodeGrad",
          cx: "50%",
          cy: "50%",
          r: "50%",
          children: [_jsx("stop", {
            offset: "0%",
            stopColor: "#3B82F6"
          }), _jsx("stop", {
            offset: "100%",
            stopColor: "#60A5FA"
          })]
        })]
      }), edges.map(([a, b], i) => _jsx(motion.line, {
        x1: nodes[a].x,
        y1: nodes[a].y,
        x2: nodes[b].x,
        y2: nodes[b].y,
        stroke: "rgba(59,130,246,0.25)",
        strokeWidth: "0.4",
        initial: {
          pathLength: 0,
          opacity: 0
        },
        animate: {
          pathLength: 1,
          opacity: 1
        },
        transition: {
          duration: 1.5,
          delay: i * 0.15,
          ease: "easeOut"
        }
      }, i)), nodes.map((n, i) => _jsxs("g", {
        children: [i === 0 && _jsx(motion.circle, {
          cx: n.x,
          cy: n.y,
          r: 6,
          fill: "rgba(59,130,246,0.12)",
          className: "pulse-ring"
        }), _jsx(motion.circle, {
          cx: n.x,
          cy: n.y,
          r: i === 0 ? 2.5 : 1.5,
          fill: "url(#nodeGrad)",
          filter: "url(#glow)",
          initial: {
            scale: 0,
            opacity: 0
          },
          animate: {
            scale: 1,
            opacity: 1
          },
          transition: {
            duration: 0.5,
            delay: 0.5 + i * 0.1
          }
        })]
      }, i))]
    }), _jsx("div", {
      style: {
        position: "absolute",
        inset: "-12%",
        borderRadius: "50%",
        border: "1px solid rgba(59,130,246,0.15)",
        animation: "orbit-spin 12s linear infinite",
        transformStyle: "preserve-3d"
      },
      children: _jsx("div", {
        style: {
          position: "absolute",
          top: "6%",
          left: "50%",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#3B82F6,#60A5FA)",
          transform: "translateX(-50%)",
          boxShadow: "0 0 12px #3B82F6"
        }
      })
    })]
  });
}
function Reveal({
  children,
  delay = 0,
  y = 30
}) {
  return _jsx(motion.div, {
    initial: {
      opacity: 0,
      y
    },
    whileInView: {
      opacity: 1,
      y: 0
    },
    viewport: {
      once: true,
      margin: "-80px"
    },
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1]
    },
    children: children
  });
}
const PlanetIcon = () => _jsxs("svg", {
  width: "42",
  height: "42",
  viewBox: "0 0 42 42",
  fill: "none",
  children: [_jsx("circle", {
    cx: "21",
    cy: "21",
    r: "10",
    fill: "url(#pg)"
  }), _jsx("ellipse", {
    cx: "21",
    cy: "21",
    rx: "19",
    ry: "7",
    stroke: "#3B82F6",
    strokeWidth: "1.5",
    strokeOpacity: "0.7",
    fill: "none"
  }), _jsx("defs", {
    children: _jsxs("radialGradient", {
      id: "pg",
      cx: "40%",
      cy: "35%",
      children: [_jsx("stop", {
        stopColor: "#3B82F6"
      }), _jsx("stop", {
        offset: "1",
        stopColor: "#60A5FA"
      })]
    })
  })]
});
const ShieldIcon = () => _jsxs("svg", {
  width: "42",
  height: "42",
  viewBox: "0 0 42 42",
  fill: "none",
  children: [_jsx("path", {
    d: "M21 4L6 10v12c0 8.8 6.4 17 15 19 8.6-2 15-10.2 15-19V10L21 4Z",
    fill: "rgba(59,130,246,0.12)",
    stroke: "#3B82F6",
    strokeWidth: "1.5"
  }), _jsx("path", {
    d: "M14 21l5 5 9-9",
    stroke: "#3B82F6",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })]
});
const TimerIcon = () => _jsxs("svg", {
  width: "42",
  height: "42",
  viewBox: "0 0 42 42",
  fill: "none",
  children: [_jsx("circle", {
    cx: "21",
    cy: "23",
    r: "14",
    stroke: "#3B82F6",
    strokeWidth: "1.5",
    fill: "rgba(59,130,246,0.08)"
  }), _jsx("path", {
    d: "M21 23V13",
    stroke: "#60A5FA",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), _jsx("path", {
    d: "M21 23l8 5",
    stroke: "#3B82F6",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), _jsx("path", {
    d: "M16 4h10",
    stroke: "#3B82F6",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }), _jsx("path", {
    d: "M21 4v4",
    stroke: "#3B82F6",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  })]
});
const InfinityIcon = () => _jsxs("svg", {
  width: "42",
  height: "42",
  viewBox: "0 0 42 42",
  fill: "none",
  children: [_jsx("path", {
    d: "M10 21c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8",
    stroke: "#3B82F6",
    strokeWidth: "1.8",
    fill: "none"
  }), _jsx("path", {
    d: "M32 21c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8",
    stroke: "#60A5FA",
    strokeWidth: "1.8",
    fill: "none"
  }), _jsx("circle", {
    cx: "21",
    cy: "21",
    r: "2.5",
    fill: "#3B82F6"
  })]
});
const pillars = [{
  icon: _jsx(PlanetIcon, {}),
  title: "Complete Assignment Care",
  desc: "Full top-to-bottom handling of your toughest coursework. We own every line—so you don't have to.",
  tag: "Total Coverage"
}, {
  icon: _jsx(ShieldIcon, {}),
  title: "100% Secure & Private",
  desc: "Complete confidentiality. Your identity is sealed in our vault—invisible to the universe.",
  tag: "Encrypted Vault"
}, {
  icon: _jsx(TimerIcon, {}),
  title: "Guaranteed Deadlines",
  desc: "Time dilation isn't real here. We beat your clock, every single time—zero exceptions.",
  tag: "On-Time, Always"
}, {
  icon: _jsx(InfinityIcon, {}),
  title: "Your Time Restored",
  desc: "Reclaim your weekends, your hobbies, and your sanity. Live your life, not your syllabus.",
  tag: "Peace Restored"
}];
function PillarCard({
  icon,
  title,
  desc,
  tag,
  index
}) {
  return _jsx(Reveal, {
    delay: index * 0.12,
    children: _jsxs(motion.div, {
      className: "glass-card",
      whileHover: {
        scale: 1.04,
        y: -6
      },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 22
      },
      style: {
        borderRadius: 20,
        padding: "clamp(1.4rem,3vw,2rem)",
        cursor: "default",
        position: "relative",
        overflow: "hidden"
      },
      children: [_jsx(motion.div, {
        className: "absolute inset-0 rounded-2xl",
        initial: {
          opacity: 0
        },
        whileHover: {
          opacity: 1
        },
        style: {
          background: "transparent",
          border: "1px solid rgba(59,130,246,0.55)",
          borderRadius: 20,
          boxShadow: "0 0 28px rgba(59,130,246,0.15) inset",
          pointerEvents: "none",
          position: "absolute",
          inset: 0
        }
      }), _jsx("div", {
        style: {
          display: "inline-block",
          marginBottom: 20,
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.25)",
          color: "#3B82F6",
          fontSize: 11,
          padding: "4px 12px",
          borderRadius: 40,
          fontFamily: "'Syne',sans-serif",
          letterSpacing: "0.08em"
        },
        children: tag
      }), _jsx("div", {
        className: "float",
        style: {
          marginBottom: 18
        },
        children: icon
      }), _jsx("h3", {
        className: "syne",
        style: {
          fontSize: "clamp(1rem,2vw,1.15rem)",
          fontWeight: 700,
          marginBottom: 10,
          lineHeight: 1.3
        },
        children: title
      }), _jsx("p", {
        style: {
          fontSize: "clamp(0.82rem,1.5vw,0.9rem)",
          color: "#94A3B8",
          lineHeight: 1.7
        },
        children: desc
      })]
    })
  });
}
const steps = [{
  num: "01",
  label: "Orbit Entry",
  sublabel: "Submit",
  desc: "Securely drop your assignment prompt and grading rubric into our DMs. Fast, encrypted, frictionless.",
  color: "#3B82F6"
}, {
  num: "02",
  label: "Deep Analysis",
  sublabel: "Deconstruct",
  desc: "Our specialist crew maps the technical parameters, rubric architecture, and optimal execution path.",
  color: "#38BDF8"
}, {
  num: "03",
  label: "Safe Landing",
  sublabel: "Deliver",
  desc: "Receive flawlessly executed work, right on time. No friction, no panic—just results.",
  color: "#E2E8F0"
}];
function TimelineStep({
  step,
  index,
  total
}) {
  return _jsx(Reveal, {
    delay: index * 0.18,
    children: _jsxs("div", {
      style: {
        display: "flex",
        gap: "clamp(1rem,3vw,2rem)",
        alignItems: "flex-start",
        position: "relative"
      },
      children: [_jsxs("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0
        },
        children: [_jsx("div", {
          style: {
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${step.color}22, transparent)`,
            border: `1.5px solid ${step.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: 16,
            color: step.color,
            boxShadow: `0 0 24px ${step.color}33`,
            position: "relative",
            zIndex: 1
          },
          children: step.num
        }), index < total - 1 && _jsx("div", {
          className: "timeline-line",
          style: {
            width: 2,
            height: "clamp(40px,6vw,60px)",
            marginTop: 4
          }
        })]
      }), _jsxs("div", {
        style: {
          paddingTop: 10,
          paddingBottom: 32
        },
        children: [_jsxs("div", {
          style: {
            display: "flex",
            gap: 10,
            alignItems: "baseline",
            flexWrap: "wrap",
            marginBottom: 10
          },
          children: [_jsx("span", {
            className: "syne",
            style: {
              fontSize: "clamp(1.1rem,2.5vw,1.35rem)",
              fontWeight: 700
            },
            children: step.label
          }), _jsx("span", {
            style: {
              fontSize: 11,
              color: step.color,
              fontFamily: "'Syne',sans-serif",
              background: `${step.color}15`,
              border: `1px solid ${step.color}30`,
              padding: "3px 10px",
              borderRadius: 30
            },
            children: step.sublabel
          })]
        }), _jsx("p", {
          style: {
            fontSize: "clamp(0.85rem,1.6vw,0.95rem)",
            color: "#94A3B8",
            lineHeight: 1.75,
            maxWidth: 480
          },
          children: step.desc
        })]
      })]
    })
  });
}
const unis = [{
  name: "MIT",
  country: "🇺🇸",
  full: "Massachusetts Inst. of Technology",
  logo: "/assets/logos/mit.png"
}, {
  name: "Harvard",
  country: "🇺🇸",
  full: "Harvard University",
  logo: "/assets/logos/harvard.png"
}, {
  name: "Stanford",
  country: "🇺🇸",
  full: "Stanford University",
  logo: "/assets/logos/stanford.png"
}, {
  name: "Columbia",
  country: "🇺🇸",
  full: "Columbia University",
  logo: "/assets/logos/columbia.png"
}, {
  name: "NYU",
  country: "🇺🇸",
  full: "New York University",
  logo: "/assets/logos/nyu.png"
}, {
  name: "UCLA",
  country: "🇺🇸",
  full: "Univ. of California, LA",
  logo: "/assets/logos/ucla.png"
}, {
  name: "USC",
  country: "🇺🇸",
  full: "Univ. of Southern California",
  logo: "/assets/logos/usc.png"
}, {
  name: "UT Austin",
  country: "🇺🇸",
  full: "University of Texas at Austin",
  logo: "/assets/logos/ut-austin.png"
}, {
  name: "U of Michigan",
  country: "🇺🇸",
  full: "University of Michigan",
  logo: "/assets/logos/umich.png"
}, {
  name: "Georgia Tech",
  country: "🇺🇸",
  full: "Georgia Institute of Technology",
  logo: "/assets/logos/gatech.png"
}, {
  name: "Oxford",
  country: "🇬🇧",
  full: "University of Oxford",
  logo: "/assets/logos/oxford.png"
}, {
  name: "Cambridge",
  country: "🇬🇧",
  full: "University of Cambridge",
  logo: "/assets/logos/cambridge.png"
}, {
  name: "Imperial",
  country: "🇬🇧",
  full: "Imperial College London",
  logo: "/assets/logos/imperial.png"
}, {
  name: "UCL",
  country: "🇬🇧",
  full: "University College London",
  logo: "/assets/logos/ucl.png"
}, {
  name: "Manchester",
  country: "🇬🇧",
  full: "University of Manchester",
  logo: "/assets/logos/manchester.png"
}, {
  name: "Melbourne",
  country: "🇦🇺",
  full: "University of Melbourne",
  logo: "/assets/logos/umelbourne.png"
}, {
  name: "ANU",
  country: "🇦🇺",
  full: "Australian National University",
  logo: "/assets/logos/anu.png"
}, {
  name: "UNSW",
  country: "🇦🇺",
  full: "Univ. of New South Wales",
  logo: "/assets/logos/unsw.png"
}, {
  name: "U of Sydney",
  country: "🇦🇺",
  full: "University of Sydney",
  logo: "/assets/logos/usyd.png"
}, {
  name: "Monash",
  country: "🇦🇺",
  full: "Monash University",
  logo: "/assets/logos/monash.png"
}, {
  name: "UQ",
  country: "🇦🇺",
  full: "University of Queensland",
  logo: "/assets/logos/uq.png"
}, {
  name: "UWA",
  country: "🇦🇺",
  full: "Univ. of Western Australia",
  logo: "/assets/logos/uwa.png"
}, {
  name: "U of Toronto",
  country: "🇨🇦",
  full: "University of Toronto",
  logo: "/assets/logos/utoronto.png"
}, {
  name: "UBC",
  country: "🇨🇦",
  full: "Univ. of British Columbia",
  logo: "/assets/logos/ubc.png"
}, {
  name: "McGill",
  country: "🇨🇦",
  full: "McGill University",
  logo: "/assets/logos/mcgill.png"
}, {
  name: "NUS",
  country: "🇸🇬",
  full: "National Univ. of Singapore",
  logo: "/assets/logos/nus.png"
}, {
  name: "NTU",
  country: "🇸🇬",
  full: "Nanyang Technological University",
  logo: "/assets/logos/ntu.png"
}, {
  name: "HKU",
  country: "🇭🇰",
  full: "University of Hong Kong",
  logo: "/assets/logos/hku.png"
}, {
  name: "IIT Bombay",
  country: "🇮🇳",
  full: "Indian Inst. of Technology Bombay",
  logo: "/assets/logos/iitbombay.png"
}, {
  name: "Delhi Univ",
  country: "🇮🇳",
  full: "University of Delhi",
  logo: "/assets/logos/delhi.png"
}];
const accentColors = ["#3B82F6", "#60A5FA", "#38BDF8", "#818CF8", "#6EE7B7", "#93C5FD", "#7DD3FC", "#A5B4FC", "#5EEAD4", "#BAE6FD", "#C7D2FE", "#67E8F9", "#4ADE80", "#34D399", "#22D3EE"];
function UniMarquee() {
  const doubled = [...unis, ...unis];
  const [failedLogos, setFailedLogos] = useState(() => new Set());
  return _jsxs("section", {
    style: {
      padding: "clamp(3rem,6vw,5.5rem) 0",
      overflow: "hidden",
      position: "relative"
    },
    children: [_jsx(Reveal, {
      children: _jsxs("div", {
        style: {
          textAlign: "center",
          marginBottom: "clamp(2rem,4vw,3rem)",
          padding: "0 clamp(1.5rem,4vw,3rem)"
        },
        children: [_jsx("p", {
          style: {
            fontSize: 12,
            color: "#3B82F6",
            fontFamily: "'Syne',sans-serif",
            letterSpacing: "0.18em",
            marginBottom: 12
          },
          children: "TRUSTED BY STUDENTS FROM"
        }), _jsxs("h2", {
          className: "syne",
          style: {
            fontSize: "clamp(1.6rem,3.5vw,2.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.15
          },
          children: ["Top Universities Across", " ", _jsx("span", {
            className: "blue-text",
            children: "7 Countries Worldwide"
          })]
        }), _jsx("p", {
          style: {
            fontSize: "clamp(0.85rem,1.5vw,0.95rem)",
            color: "#475569",
            marginTop: 14,
            maxWidth: 520,
            margin: "14px auto 0"
          },
          children: "We've helped students from 30 of the world's most prestigious institutions secure their grades and reclaim their time."
        })]
      })
    }), _jsx("div", {
      style: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "clamp(40px,6vw,100px)",
        background: "linear-gradient(90deg, #03070F, transparent)",
        zIndex: 10,
        pointerEvents: "none"
      }
    }), _jsx("div", {
      style: {
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "clamp(40px,6vw,100px)",
        background: "linear-gradient(270deg, #03070F, transparent)",
        zIndex: 10,
        pointerEvents: "none"
      }
    }), _jsx("div", {
      style: {
        overflow: "hidden"
      },
      children: _jsx("div", {
        style: {
          display: "flex",
          gap: "clamp(14px,2vw,24px)",
          animation: "marquee-scroll 38s linear infinite",
          width: "max-content"
        },
        children: doubled.map((uni, i) => {
          const accent = accentColors[i % accentColors.length];
          const isAU = uni.country === "🇦🇺";
          const logoFailed = failedLogos.has(uni.logo);
          return _jsxs(motion.div, {
            whileHover: {
              scale: 1.06,
              y: -4
            },
            transition: {
              type: "spring",
              stiffness: 320,
              damping: 22
            },
            style: {
              flexShrink: 0,
              width: "clamp(150px,18vw,200px)",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid rgba(255,255,255,0.07)`,
              borderRadius: 16,
              padding: "clamp(14px,2vw,20px) clamp(12px,2vw,18px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              cursor: "default",
              position: "relative",
              overflow: "hidden"
            },
            children: [_jsx("div", {
              style: {
                position: "absolute",
                top: 0,
                left: "15%",
                right: "15%",
                height: 2,
                background: accent,
                borderRadius: "0 0 4px 4px",
                opacity: 0.7
              }
            }), _jsx("div", {
              style: {
                width: 64,
                height: 64,
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid rgba(255,255,255,0.1)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                flexShrink: 0
              },
              children: logoFailed ? _jsx("span", {
                className: "syne",
                style: {
                  fontWeight: 800,
                  fontSize: 12,
                  color: accent
                },
                children: uni.abbr
              }) : _jsx("img", {
                src: uni.logo,
                alt: uni.name + " logo",
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: 1
                },
                onError: () => {
                  setFailedLogos(current => {
                    const next = new Set(current);
                    next.add(uni.logo);
                    return next;
                  });
                }
              })
            }), _jsxs("div", {
              style: {
                textAlign: "center"
              },
              children: [_jsx("div", {
                className: "syne",
                style: {
                  fontSize: "clamp(0.7rem,1.2vw,0.82rem)",
                  fontWeight: 700,
                  color: "#E2E8F0",
                  lineHeight: 1.3,
                  marginBottom: 4
                },
                children: uni.name
              }), _jsx("div", {
                style: {
                  fontSize: "clamp(0.6rem,1vw,0.68rem)",
                  color: "#475569",
                  lineHeight: 1.4
                },
                children: uni.full
              })]
            }), _jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: isAU ? "rgba(56,189,248,0.08)" : "rgba(59,130,246,0.08)",
                border: `1px solid ${isAU ? "rgba(56,189,248,0.2)" : "rgba(59,130,246,0.2)"}`,
                borderRadius: 20,
                padding: "3px 9px"
              },
              children: [_jsx("span", {
                style: {
                  fontSize: 12
                },
                children: uni.country
              }), _jsx("span", {
                style: {
                  fontSize: 10,
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: "0.06em",
                  color: isAU ? "#38BDF8" : "#60A5FA"
                },
                children: isAU ? "AUSTRALIA" : "USA"
              })]
            })]
          }, i);
        })
      })
    }), _jsx("style", {
      children: `
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        div:has(> div[style*="marquee-scroll"]):hover > div[style*="marquee-scroll"] {
          animation-play-state: paused;
        }
      `
    }), _jsx(Reveal, {
      delay: 0.2,
      children: _jsx("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "clamp(1.5rem,4vw,4rem)",
          marginTop: "clamp(2rem,4vw,3.5rem)",
          padding: "0 clamp(1.5rem,4vw,3rem)"
        },
        children: [["30", "Elite Universities"], ["7", "Countries Covered"], ["500+", "Students Served"], ["#1", "For Discretion"]].map(([val, label]) => _jsxs("div", {
          style: {
            textAlign: "center"
          },
          children: [_jsx("div", {
            className: "syne blue-text",
            style: {
              fontSize: "clamp(1.5rem,3vw,2.2rem)",
              fontWeight: 800
            },
            children: val
          }), _jsx("div", {
            style: {
              fontSize: "clamp(0.72rem,1.2vw,0.8rem)",
              color: "#475569",
              marginTop: 4,
              letterSpacing: "0.06em"
            },
            children: label
          })]
        }, label))
      })
    })]
  });
}
export default function ScholarSpace() {
  const mousePos = useRef({
    x: 0,
    y: 0
  });
  const onMouseMove = useCallback(e => {
    mousePos.current = {
      x: e.clientX,
      y: e.clientY
    };
  }, []);
  return _jsxs("div", {
    onMouseMove: onMouseMove,
    style: {
      position: "relative",
      minHeight: "100vh",
      overflowX: "hidden"
    },
    children: [_jsx(FontLoader, {}), _jsx(Starfield, {
      mousePos: mousePos
    }), _jsx("div", {
      className: "nebula",
      style: {
        width: 600,
        height: 600,
        background: "rgba(59,130,246,0.08)",
        top: "-10%",
        left: "-15%",
        zIndex: 1
      }
    }), _jsx("div", {
      className: "nebula",
      style: {
        width: 500,
        height: 500,
        background: "rgba(96,165,250,0.06)",
        top: "20%",
        right: "-15%",
        zIndex: 1
      }
    }), _jsx("div", {
      className: "nebula",
      style: {
        width: 700,
        height: 700,
        background: "rgba(56,189,248,0.05)",
        top: "60%",
        left: "10%",
        zIndex: 1
      }
    }), _jsxs("div", {
      style: {
        position: "relative",
        zIndex: 2
      },
      children: [_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: -20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        transition: {
          duration: 0.5
        },
        style: {
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "linear-gradient(90deg, #052e16 0%, #14532d 50%, #052e16 100%)",
          borderBottom: "1px solid rgba(34,197,94,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "11px 24px"
        },
        children: [_jsxs("svg", {
          width: "18",
          height: "18",
          viewBox: "0 0 18 18",
          fill: "none",
          children: [_jsx("circle", {
            cx: "9",
            cy: "9",
            r: "8.5",
            stroke: "#22C55E",
            strokeWidth: "1.2"
          }), _jsx("path", {
            d: "M5 9l3 3 5-6",
            stroke: "#22C55E",
            strokeWidth: "1.8",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          })]
        }), _jsx("span", {
          style: {
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
            color: "#86efac",
            letterSpacing: "0.02em"
          },
          children: "No upfront payment required"
        }), _jsx("span", {
          style: {
            width: 1,
            height: 14,
            background: "rgba(34,197,94,0.3)",
            display: "inline-block"
          }
        }), _jsx("span", {
          style: {
            fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)",
            color: "#4ade80",
            letterSpacing: "0.01em"
          },
          children: "Pay only when you're 100% satisfied with your result"
        })]
      }), _jsx(Nav, {}), _jsxs("section", {
        style: {
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px clamp(1.5rem,6vw,5rem) 80px",
          gap: "clamp(2rem,5vw,5rem)",
          flexWrap: "wrap"
        },
        children: [_jsxs("div", {
          style: {
            flex: "1 1 340px",
            maxWidth: 620
          },
          children: [_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 20
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              duration: 0.6
            },
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.2)",
              padding: "6px 16px",
              borderRadius: 40
            },
            children: [_jsx("div", {
              style: {
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#3B82F6",
                boxShadow: "0 0 8px #3B82F6"
              }
            }), _jsx("span", {
              style: {
                fontSize: 12,
                color: "#3B82F6",
                fontFamily: "'Syne',sans-serif",
                letterSpacing: "0.1em"
              },
              children: "PREMIUM ACADEMIC CONSULTING"
            })]
          }), _jsxs(motion.h1, {
            className: "syne",
            initial: {
              opacity: 0,
              y: 30
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              duration: 0.8,
              delay: 0.1
            },
            style: {
              fontSize: "clamp(2.6rem,6.5vw,5.2rem)",
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              marginBottom: 28
            },
            children: ["Your Academic", _jsx("br", {}), _jsx("span", {
              className: "blue-text",
              children: "Edge. Total"
            }), _jsx("br", {}), "Relief."]
          }), _jsxs(motion.p, {
            initial: {
              opacity: 0,
              y: 20
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              duration: 0.7,
              delay: 0.25
            },
            style: {
              fontSize: "clamp(0.95rem,1.8vw,1.1rem)",
              color: "#94A3B8",
              lineHeight: 1.8,
              marginBottom: 42,
              maxWidth: 520
            },
            children: ["Stuck on complex assignments or running out of time? Let ", _jsx("strong", {
              style: {
                color: "#CBD5E1"
              },
              children: "ScholarSpace"
            }), " handle the heavy lifting and secure your GPA\u2014so you can focus on the things that matter to you."]
          }), _jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 20
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              duration: 0.7,
              delay: 0.38
            },
            style: {
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center"
            },
            children: [_jsx(MagneticBtn, {
              className: "glow-btn",
              style: {
                padding: "16px 38px",
                borderRadius: 50,
                fontSize: "clamp(0.9rem,1.5vw,1rem)"
              },
              onClick: () => window.open("https://www.instagram.com/scholarspace.official", "_blank"),
              children: "Pass the Load \u2192"
            }), _jsx("button", {
              className: "ghost-btn",
              style: {
                padding: "16px 28px",
                borderRadius: 50,
                fontSize: "clamp(0.85rem,1.5vw,0.95rem)"
              },
              children: "How It Works"
            })]
          }), _jsx(motion.div, {
            initial: {
              opacity: 0
            },
            animate: {
              opacity: 1
            },
            transition: {
              duration: 0.8,
              delay: 0.55
            },
            style: {
              display: "flex",
              gap: 32,
              marginTop: 52,
              flexWrap: "wrap"
            },
            children: [["98%", "GPA Protection"], ["24h", "Turnaround"], ["500+", "Students Served"]].map(([n, l]) => _jsxs("div", {
              children: [_jsx("div", {
                className: "syne blue-text",
                style: {
                  fontSize: "clamp(1.3rem,2.5vw,1.7rem)",
                  fontWeight: 800
                },
                children: n
              }), _jsx("div", {
                style: {
                  fontSize: "clamp(0.72rem,1.2vw,0.8rem)",
                  color: "#64748B",
                  letterSpacing: "0.06em",
                  marginTop: 2
                },
                children: l
              })]
            }, l))
          })]
        }), _jsx(motion.div, {
          initial: {
            opacity: 0,
            scale: 0.85
          },
          animate: {
            opacity: 1,
            scale: 1
          },
          transition: {
            duration: 1,
            delay: 0.3
          },
          style: {
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "center"
          },
          children: _jsx(Constellation, {})
        })]
      }), _jsx("section", {
        style: {
          padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,5rem)"
        },
        children: _jsxs("div", {
          style: {
            maxWidth: 1100,
            margin: "0 auto"
          },
          children: [_jsx(Reveal, {
            children: _jsxs("div", {
              style: {
                textAlign: "center",
                marginBottom: "clamp(2.5rem,5vw,4.5rem)"
              },
              children: [_jsx("p", {
                style: {
                  fontSize: 12,
                  color: "#3B82F6",
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: "0.18em",
                  marginBottom: 14
                },
                children: "MISSION CONTROL"
              }), _jsxs("h2", {
                className: "syne",
                style: {
                  fontSize: "clamp(1.9rem,4.5vw,3.2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em"
                },
                children: ["Built Around ", _jsx("span", {
                  className: "blue-text",
                  children: "Your Needs"
                })]
              })]
            })
          }), _jsx("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "clamp(1rem,2.5vw,1.5rem)"
            },
            children: pillars.map((p, i) => _jsx(PillarCard, {
              ...p,
              index: i
            }, i))
          })]
        })
      }), _jsx("div", {
        style: {
          height: 1,
          maxWidth: 900,
          margin: "0 auto",
          background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.35),transparent)"
        }
      }), _jsx("section", {
        style: {
          padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,5rem)"
        },
        children: _jsxs("div", {
          style: {
            maxWidth: 760,
            margin: "0 auto"
          },
          children: [_jsx(Reveal, {
            children: _jsxs("div", {
              style: {
                marginBottom: "clamp(2.5rem,5vw,4rem)"
              },
              children: [_jsx("p", {
                style: {
                  fontSize: 12,
                  color: "#3B82F6",
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: "0.18em",
                  marginBottom: 14
                },
                children: "LAUNCH SEQUENCE"
              }), _jsxs("h2", {
                className: "syne",
                style: {
                  fontSize: "clamp(1.9rem,4.5vw,3.2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em"
                },
                children: ["How It ", _jsx("span", {
                  className: "blue-text",
                  children: "Works"
                })]
              }), _jsx("p", {
                style: {
                  fontSize: "clamp(0.88rem,1.6vw,1rem)",
                  color: "#64748B",
                  marginTop: 14,
                  maxWidth: 500,
                  lineHeight: 1.7
                },
                children: "Three precise steps from submission to solution. No complexity, no noise\u2014just execution."
              })]
            })
          }), steps.map((s, i) => _jsx(TimelineStep, {
            step: s,
            index: i,
            total: steps.length
          }, i))]
        })
      }), _jsx("section", {
        style: {
          padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,5rem)"
        },
        children: _jsx(Reveal, {
          children: _jsxs("div", {
            className: "glass-card",
            style: {
              maxWidth: 860,
              margin: "0 auto",
              borderRadius: 28,
              padding: "clamp(2.5rem,5vw,4.5rem)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            },
            children: [_jsx("div", {
              style: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "70%",
                height: "60%",
                background: "radial-gradient(ellipse,rgba(59,130,246,0.07),transparent)",
                pointerEvents: "none"
              }
            }), _jsx("p", {
              style: {
                fontSize: 12,
                color: "#3B82F6",
                fontFamily: "'Syne',sans-serif",
                letterSpacing: "0.18em",
                marginBottom: 20
              },
              children: "READY TO LAUNCH?"
            }), _jsxs("h2", {
              className: "syne",
              style: {
                fontSize: "clamp(1.8rem,4vw,3rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 18,
                lineHeight: 1.15
              },
              children: ["Buy Back Your Time.", _jsx("br", {}), _jsx("span", {
                className: "blue-text",
                children: "Protect Your GPA."
              })]
            }), _jsx("p", {
              style: {
                fontSize: "clamp(0.88rem,1.6vw,1rem)",
                color: "#64748B",
                marginBottom: 38,
                lineHeight: 1.7,
                maxWidth: 500,
                margin: "0 auto 38px"
              },
              children: "Join hundreds of students who stopped sacrificing their personal lives for academic pressure."
            }), _jsx(MagneticBtn, {
              className: "glow-btn",
              style: {
                padding: "18px 52px",
                borderRadius: 50,
                fontSize: "clamp(0.9rem,1.6vw,1.05rem)"
              },
              onClick: () => window.open("https://www.instagram.com/scholarspace.official", "_blank"),
              children: "DM @scholarspace.official \u2192"
            })]
          })
        })
      }), _jsx(UniMarquee, {}), _jsx("footer", {
        style: {
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(2rem,4vw,3rem) clamp(1.5rem,6vw,5rem)"
        },
        children: _jsxs("div", {
          style: {
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            justifyContent: "space-between"
          },
          children: [_jsxs("div", {
            children: [_jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8
              },
              children: [_jsx("img", {
                src: "/assets/scholarspace-logo.svg",
                alt: "ScholarSpace",
                style: {
                  width: 30,
                  height: 30
                }
              }), _jsxs("span", {
                className: "syne",
                style: {
                  fontWeight: 700,
                  fontSize: 16
                },
                children: ["Scholar", _jsx("span", {
                  className: "blue-text",
                  children: "Space"
                })]
              })]
            }), _jsxs("p", {
              style: {
                fontSize: 12,
                color: "#475569"
              },
              children: ["DM ", _jsx("a", {
                href: "https://instagram.com/scholarspace.official",
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  color: "#3B82F6",
                  textDecoration: "none"
                },
                children: "@scholarspace.official"
              }), " on Instagram to buy back your time."]
            })]
          }), _jsx("div", {
            style: {
              textAlign: "center"
            },
            children: _jsx("a", {
              href: "https://www.instagram.com/scholarspace.official",
              target: "_blank",
              rel: "noopener noreferrer",
              style: {
                fontSize: 12,
                color: "#3B82F6",
                fontFamily: "'Syne',sans-serif",
                letterSpacing: "0.12em",
                textDecoration: "none",
                display: "block"
              },
              children: "@scholarspace.official"
            })
          }), _jsxs("div", {
            style: {
              textAlign: "right"
            },
            children: [_jsxs("p", {
              style: {
                fontSize: 11,
                color: "#334155",
                marginBottom: 4
              },
              children: ["\xA9 ", new Date().getFullYear(), " ScholarSpace. All rights reserved."]
            }), _jsx("a", {
              href: "#",
              style: {
                fontSize: 11,
                color: "#475569",
                textDecoration: "none"
              },
              children: "Privacy Policy"
            })]
          })]
        })
      })]
    })]
  });
}