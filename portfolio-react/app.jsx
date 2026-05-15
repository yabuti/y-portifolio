const { useState, useEffect, useRef } = React;

// ── DATA ──────────────────────────────────────────────────────────────────────
const HARD_SKILLS = [
  { name: "Social Media Management", pct: 95, icon: "📱" },
  { name: "Strategy Development",    pct: 87, icon: "📊" },
  { name: "Community Manager",       pct: 80, icon: "🤝" },
  { name: "Content Planning",        pct: 73, icon: "📝" },
  { name: "Digital Marketing",       pct: 73, icon: "🎯" },
];

const SOFT_SKILLS = [
  { name: "Team Working",            pct: 90, icon: "👥" },
  { name: "Time Management",         pct: 90, icon: "⏰" },
  { name: "Communication",           pct: 85, icon: "💬" },
  { name: "Problem Solving",         pct: 85, icon: "🧩" },
  { name: "Planning & Organization", pct: 80, icon: "🗂️" },
];

const SERVICES = [
  { icon: "📱", title: "Social Media Marketing",        desc: "Full-cycle social media management — from strategy to execution — that grows your brand presence and engagement." },
  { icon: "📋", title: "Marketing Strategy Planning",   desc: "Tailored marketing strategies designed around your business goals, audience, and competitive landscape." },
  { icon: "🌐", title: "Digital Marketing",             desc: "End-to-end digital marketing solutions that drive traffic, leads, and measurable results online." },
  { icon: "📣", title: "Facebook & Instagram Ads",      desc: "Targeted paid ad campaigns on Meta platforms that maximize reach and return on ad spend." },
  { icon: "💡", title: "Marketing Consultation",        desc: "Expert guidance to help you navigate the ever-changing digital marketing landscape with confidence." },
  { icon: "🤝", title: "Community Building",            desc: "Building and nurturing engaged online communities that turn followers into loyal brand advocates." },
];

const CONTACT = [
  { icon: "📞", label: "Phone",    value: "0967033544 / 0915840037" },
  { icon: "✉️", label: "Email",    value: "yeabsiraterefe21@gmail.com" },
  { icon: "✈️", label: "Telegram", value: "@yeabbt21" },
  { icon: "📍", label: "Location", value: "Addis Ababa, Jemo 1" },
];

// ── HOOKS ─────────────────────────────────────────────────────────────────────
function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

// Typewriter hook
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx(c => c - 1);
      }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx]);
  return display;
}

// Animated counter hook
function useCounter(target, duration = 1500, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target]);
  return count;
}

// Mouse glow hook
function useMouseGlow() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  useEffect(() => {
    const handler = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const count = 55;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      // draw faint lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }} />;
}

// ── CIRCLE SKILL ──────────────────────────────────────────────────────────────
function CircleSkill({ name, pct, icon, animate, delay = 0 }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = animate ? circ - (pct / 100) * circ : circ;
  const count = useCounter(pct, 1400, animate);

  return (
    <div className="circle-skill" style={{ animationDelay: `${delay}ms` }}>
      <div className="circle-wrap">
        <svg viewBox="0 0 90 90">
          <circle className="circle-bg" cx="45" cy="45" r={r} />
          <circle
            className="circle-fill"
            cx="45" cy="45" r={r}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: `stroke-dashoffset 1.4s ${delay}ms cubic-bezier(0.4,0,0.2,1)` }}
          />
        </svg>
        <div className="circle-pct">{animate ? count : 0}%</div>
      </div>
      <div className="circle-label">{icon} {name}</div>
    </div>
  );
}

// ── BAR SKILL ─────────────────────────────────────────────────────────────────
function BarSkill({ name, pct, icon, animate, delay = 0 }) {
  return (
    <div className="bar-skill">
      <div className="bar-skill-header">
        <span className="bar-skill-name">{icon} {name}</span>
        <span className="bar-skill-pct">{pct}%</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{
          width: animate ? `${pct}%` : "0%",
          transition: `width 1.4s ${delay}ms cubic-bezier(0.4,0,0.2,1)`
        }} />
      </div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const links = ["About", "Education", "Skills", "Services", "Contact"];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ['home', 'about', 'education', 'skills', 'services', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(sections[i]); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
      <a className="nav-brand" href="#home">YT Portfolio</a>
      <ul className={`nav-links${open ? " open" : ""}`}>
        {links.map(l => (
          <li key={l}>
            <a
              href={`#${l.toLowerCase()}`}
              className={active === l.toLowerCase() ? 'nav-active' : ''}
              onClick={() => setOpen(false)}
            >{l}</a>
          </li>
        ))}
      </ul>
      <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
        <span style={{ transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
        <span style={{ opacity: open ? 0 : 1 }} />
        <span style={{ transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
      </button>
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const typed = useTypewriter(
    ["Social Media Marketer", "Content Strategist", "Digital Marketer", "Community Builder"],
    75, 2000
  );
  const mouse = useMouseGlow();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section id="home" className="hero">
      <Particles />
      <div className="hero-bg" />
      <div className="hero-grid-lines" />

      {/* cursor glow */}
      <div className="cursor-glow" style={{ left: mouse.x, top: mouse.y }} />

      <div className="hero-content">
        <div>
          <p className={`hero-eyebrow fade-up${loaded ? ' in' : ''}`} style={{ transitionDelay: '0.1s' }}>
            <span className="typed-text">{typed}</span>
            <span className="cursor-blink">|</span>
          </p>
          <h1 className={`hero-name fade-up${loaded ? ' in' : ''}`} style={{ transitionDelay: '0.25s' }}>
            Yeabsira<br /><span>Terefe</span>
          </h1>
          <p className={`hero-title fade-up${loaded ? ' in' : ''}`} style={{ transitionDelay: '0.4s' }}>
            Certified Social Media Marketing Professional
          </p>
          <p className={`hero-desc fade-up${loaded ? ' in' : ''}`} style={{ transitionDelay: '0.55s' }}>
            I help brands connect with their audience and drive growth through
            tailored social media strategies and engaging content.
          </p>
          <div className={`hero-actions fade-up${loaded ? ' in' : ''}`} style={{ transitionDelay: '0.7s' }}>
            <a className="btn btn-gold btn-pulse" href="#contact">Let's Work Together</a>
            <a className="btn btn-outline" href="#services">View Services</a>
          </div>
        </div>

        <div className={`hero-card fade-left${loaded ? ' in' : ''}`} style={{ transitionDelay: '0.5s' }}>
          <p className="hero-card-label">At a Glance</p>
          {[
            { icon: "🎓", title: "Certified Marketer", sub: "Khilx Academy — 2025" },
            { icon: "📍", title: "Based in",           sub: "Addis Ababa, Ethiopia" },
            { icon: "🎯", title: "Specialization",     sub: "Social Media & Digital Marketing" },
            { icon: "💼", title: "Services",           sub: "Strategy · Ads · Consultation" },
          ].map((s, i) => (
            <div className="hero-stat" key={s.title} style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
              <div className="hero-stat-icon icon-bounce">{s.icon}</div>
              <div className="hero-stat-text">
                <strong>{s.title}</strong>
                <span>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-dot" />
      </div>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <section id="about" className="section section-dark-2">
      <div className="container">
        <p className={`section-tag fade-up${visible ? ' in' : ''}`}>About Me</p>
        <h2 className={`section-title section-title-dark fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.1s' }}>
          Passionate About Building<br />Meaningful Connections
        </h2>
        <div className={`gold-divider fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.2s' }} />

        <div ref={ref} className="about-grid">
          <div className={`about-text fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.3s' }}>
            <p>
              I am certified in Social Media Marketing from <strong style={{color:"var(--gold)"}}>Khilx Academy</strong> with
              a passion for creating engaging content and building meaningful online communities.
            </p>
            <p>
              As I developed my marketing knowledge, understanding the core of digital marketing
              came naturally. I continuously upgrade my skills to stay ahead in this fast-changing
              industry — because great marketing never stands still.
            </p>
            <p>
              I help brands connect with their audience and drive real growth through tailored
              social media strategies that are both creative and data-informed.
            </p>
            <div className="about-highlight">
              <p>"Marketing is no longer about the stuff you make, but about the stories you tell."</p>
            </div>
          </div>

          <div className="about-badges">
            {[
              { icon: "🎯", title: "Strategic Thinker",  desc: "I craft strategies that align with your brand voice and business objectives." },
              { icon: "✍️", title: "Content Creator",    desc: "Engaging, platform-native content that resonates with your target audience." },
              { icon: "📈", title: "Growth Focused",     desc: "Every action is tied to measurable outcomes — followers, reach, and conversions." },
              { icon: "🤝", title: "Community Builder",  desc: "Turning passive followers into active, loyal brand advocates." },
            ].map((b, i) => (
              <div
                className={`about-badge fade-left${visible ? ' in' : ''}`}
                key={b.title}
                style={{ transitionDelay: `${0.3 + i * 0.12}s` }}
              >
                <span className="about-badge-icon">{b.icon}</span>
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── EDUCATION ─────────────────────────────────────────────────────────────────
function Education() {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <section id="education" className="section section-dark">
      <div className="container">
        <p className={`section-tag fade-up${visible ? ' in' : ''}`}>Education</p>
        <h2 className={`section-title section-title-dark fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.1s' }}>
          Educational Background
        </h2>
        <div className={`gold-divider fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.2s' }} />

        <div ref={ref} className={`fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.3s' }}>
          <div className="edu-card">
            <span className="edu-year">2025</span>
            <h3>Social Media Marketing Certification</h3>
            <p className="edu-source">📚 Khilx Academy</p>
            <p>
              Completed a comprehensive Social Media Marketing certification program, gaining
              deep expertise in modern digital marketing practices, platform algorithms, and
              audience engagement strategies.
            </p>
            <p>
              The program also covered how to continuously update marketing knowledge and
              skills in this fast-changing industry — ensuring long-term professional relevance.
            </p>
            <div className="edu-skills-gained">
              {["Sales", "Marketing", "Negotiation", "Communication", "Content Strategy",
                "Analytics", "Brand Building", "Audience Research"].map((s, i) => (
                <span
                  className={`edu-skill-tag tag-pop${visible ? ' in' : ''}`}
                  key={s}
                  style={{ transitionDelay: `${0.4 + i * 0.07}s` }}
                >{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SKILLS ────────────────────────────────────────────────────────────────────
function Skills() {
  const ref = useRef(null);
  const visible = useInView(ref, 0.1);

  return (
    <section id="skills" className="section section-cream">
      <div className="container">
        <p className={`section-tag fade-up${visible ? ' in' : ''}`} style={{color:"var(--gold-dark)"}}>Skills</p>
        <h2 className={`section-title section-title-light fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.1s' }}>
          Personal Skills Assessment
        </h2>
        <div className={`gold-divider fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.2s' }} />
        <p className={`section-subtitle section-subtitle-light fade-up${visible ? ' in' : ''}`}
          style={{ marginBottom:"2.5rem", transitionDelay: '0.25s' }}>
          Skills measured based on hands-on exposure, coursework, and real-world application.
        </p>

        <div ref={ref} className="skills-grid">
          {/* Hard Skills — circles */}
          <div className={`fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.3s' }}>
            <p className="skills-group-title">🛠️ Hard Skills</p>
            <div className="circles-grid">
              {HARD_SKILLS.map((s, i) => (
                <CircleSkill key={s.name} {...s} animate={visible} delay={i * 150} />
              ))}
            </div>
          </div>

          {/* Soft Skills — bars */}
          <div className={`fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.4s' }}>
            <p className="skills-group-title">💡 Soft Skills</p>
            {SOFT_SKILLS.map((s, i) => (
              <BarSkill key={s.name} {...s} animate={visible} delay={i * 120} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SERVICES ──────────────────────────────────────────────────────────────────
function Services() {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <section id="services" className="section section-dark-2">
      <div className="container">
        <p className={`section-tag fade-up${visible ? ' in' : ''}`}>What I Offer</p>
        <h2 className={`section-title section-title-dark fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.1s' }}>
          Services I Provide
        </h2>
        <div className={`gold-divider fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.2s' }} />
        <p className={`section-subtitle section-subtitle-dark fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.25s' }}>
          From strategy to execution — everything you need to grow your brand online.
        </p>

        <div ref={ref} className="services-grid">
          {SERVICES.map((s, i) => (
            <div
              className={`service-card fade-up${visible ? ' in' : ''}`}
              key={s.title}
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
            >
              <span className="service-icon icon-float">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <section id="contact" className="section section-cream-2">
      <div className="container">
        <p className={`section-tag fade-up${visible ? ' in' : ''}`} style={{color:"var(--gold-dark)"}}>Contact</p>
        <h2 className={`section-title section-title-light fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.1s' }}>
          Let's Work Together
        </h2>
        <div className={`gold-divider fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.2s' }} />
        <p className={`section-subtitle section-subtitle-light fade-up${visible ? ' in' : ''}`} style={{ transitionDelay: '0.25s' }}>
          Ready to grow your brand? Reach out and let's build something great together.
        </p>

        <div ref={ref} className="contact-grid">
          <div className="contact-info-list">
            {CONTACT.map((c, i) => (
              <div
                className={`contact-item fade-left${visible ? ' in' : ''}`}
                key={c.label}
                style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
              >
                <div className="contact-item-icon">{c.icon}</div>
                <div className="contact-item-body">
                  <strong>{c.label}</strong>
                  <span>{c.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={`contact-cta fade-left${visible ? ' in' : ''}`} style={{ transitionDelay: '0.5s' }}>
            <h3>Ready to Elevate Your Brand?</h3>
            <p>
              Whether you need a full social media strategy, ad campaigns, or just a
              consultation — I'm here to help your business grow online.
            </p>
            <div className="contact-cta-links">
              <a className="cta-link" href="mailto:yeabsiraterefe21@gmail.com">
                <span className="cta-link-icon">✉️</span>
                yeabsiraterefe21@gmail.com
              </a>
              <a className="cta-link" href="tel:+251967033544">
                <span className="cta-link-icon">📞</span>
                0967033544 / 0915840037
              </a>
              <a className="cta-link" href="https://t.me/yeabbt21" target="_blank" rel="noopener">
                <span className="cta-link-icon">✈️</span>
                Telegram: @yeabbt21
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <p className="footer-name">Yeabsira Terefe</p>
      <p className="footer-sub">Social Media Marketer · Addis Ababa, Ethiopia</p>
      <div className="footer-links">
        {["About","Education","Skills","Services","Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
        ))}
      </div>
      <p className="footer-copy">© 2025 Yeabsira Terefe. All rights reserved.</p>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Education />
      <Skills />
      <Services />
      <Contact />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
