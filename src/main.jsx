import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./styles.css";

/* ─── Animation primitives & Brand Star ───────────────────────────────── */

const EASE = [0.2, 0.7, 0.2, 1];
const VP = { once: true, margin: "0px 0px -60px 0px" };

function RingnovaStar({ size = 20, className = "", style = {}, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={`ringnova-star ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 1.5C12 7.298 16.702 12 22.5 12C16.702 12 12 16.702 12 22.5C12 16.702 7.298 12 1.5 12C7.298 12 12 7.298 12 1.5Z" />
    </svg>
  );
}

function useCompactMotion() {
  const [isCompact, setIsCompact] = React.useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  );

  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setIsCompact(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isCompact;
}

function Reveal({ children, as = "div", className = "", style, delay = 0 }) {
  const reduced = useReducedMotion();
  const compact = useCompactMotion();
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const StaticTag = as;
    return <StaticTag className={className} style={style}>{children}</StaticTag>;
  }

  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y: compact ? 9 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: compact ? 0.42 : 0.52, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

function HeroEntrance({ children, as = "div", className = "", style }) {
  const reduced = useReducedMotion();
  const compact = useCompactMotion();
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const StaticTag = as;
    return <StaticTag className={className} style={style}>{children}</StaticTag>;
  }

  return (
    <Tag
      className={className}
      style={style}
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: compact ? 9 : 14 }}
      transition={{ duration: compact ? 0.42 : 0.58, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────────── */

const services = [
  {
    number: "01",
    title: "Customer support",
    description:
      "Thoughtful, responsive customer care that helps every interaction feel like a good one.",
    icon: "chat",
  },
  {
    number: "02",
    title: "Inbound & outbound calls",
    description:
      "A dependable extension of your team for the conversations your business needs to have.",
    icon: "phone",
  },
  {
    number: "03",
    title: "Lead generation",
    description:
      "Build meaningful connections with prospects and give your pipeline room to grow.",
    icon: "spark",
  },
  {
    number: "04",
    title: "Appointment setting",
    description:
      "Make it easier for the right people to get a conversation on the calendar.",
    icon: "calendar",
  },
  {
    number: "05",
    title: "Telemarketing",
    description:
      "Personal, professional outreach shaped around your audience and business goals.",
    icon: "wave",
  },
];

const serviceOptions = services.map(({ title }) => title);

/* ─── Icons ─────────────────────────────────────────────────────────────── */

function Icon({ name, size = 22, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className,
  };

  const paths = {
    chat: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5A7.5 7.5 0 1 1 20 11.5Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </>
    ),
    phone: (
      <path d="M7 3H5a2 2 0 0 0-2 2c.8 8.3 7.7 15.2 16 16a2 2 0 0 0 2-2v-2l-4.3-2-2.2 2.2a14 14 0 0 1-6.7-6.7L10 8.3 8 4Z" />
    ),
    spark: (
      <>
        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
      </>
    ),
    wave: (
      <>
        <path d="M3 12h2l2-7 4 14 3-11 2 7 2-3h3" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    arrowUp: <path d="M7 17 17 7M7 7h10v10" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

/* ─── Shared UI ─────────────────────────────────────────────────────────── */

function Brand({ light = false }) {
  return (
    <SmartNavLink
      to="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label="Ringnova home"
    >
      <span className="brand-mark-wrap">
        <img
          className="brand-mark"
          src={light ? "/ringnova-mark-light.png" : "/ringnova-mark.png"}
          alt=""
        />
        <RingnovaStar size={12} className="brand-star-flare" />
      </span>
      <img
        className="brand-wordmark"
        src={light ? "/ringnova-wordmark-light.png" : "/ringnova-wordmark.png"}
        alt=""
      />
    </SmartNavLink>
  );
}

function ArrowLink({ to, children, light = false, className = "" }) {
  return (
    <Link className={`arrow-link${light ? " arrow-link-light" : ""} ${className}`} to={to}>
      {children}
      <Icon name="arrow" size={17} />
    </Link>
  );
}

/* SmartNavLink — navigates normally to other pages;
   when already on the target page, smoothly scrolls to top instead.
   Accepts all standard Link props (className, aria-label, etc). */
function SmartNavLink({ to, onClick, children, ...rest }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
    if (location.pathname === to) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(to);
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const closeMenu = () => setMenuOpen(false);

  React.useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header className={`site-header${scrolled ? " header-scrolled" : ""}`}>
      <div className={`container header-inner${menuOpen ? " header-menu-open" : ""}`}>
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <div className="header-actions">
          <nav className="main-nav" id="primary-navigation" aria-label="Main navigation">
            <SmartNavLink to="/" onClick={closeMenu}>Home</SmartNavLink>
            <SmartNavLink to="/services" onClick={closeMenu}>Services</SmartNavLink>
            <SmartNavLink to="/about" onClick={closeMenu}>About us</SmartNavLink>
            <SmartNavLink to="/contact" onClick={closeMenu}>Contact</SmartNavLink>
          </nav>
          <SmartNavLink className="nav-cta" to="/contact" onClick={closeMenu}>
            Let's talk <Icon name="arrowUp" size={15} />
          </SmartNavLink>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Brand light />
            <p>Good conversations make<br />business better.</p>
          </div>
          <div className="footer-nav-group">
            <p className="footer-label">Explore</p>
            <Link to="/services">Our services</Link>
            <Link to="/about">About Ringnova</Link>
            <Link to="/contact">Get in touch</Link>
          </div>
          <div className="footer-nav-group">
            <p className="footer-label">Let's connect</p>
            <span>Serving businesses across Europe</span>
            <span>Team based in Morocco</span>
            <span>English · Français · العربية</span>
          </div>
          <a className="footer-top" href="#top" aria-label="Back to top">
            <Icon name="arrowUp" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ringnova. All rights reserved.</span>
          <Link to="/privacy">Privacy policy <span className="placeholder-tag">Placeholder</span></Link>
          <span>Made for better conversations.</span>
        </div>
      </div>
    </footer>
  );
}


function Eyebrow({ children, light = false }) {
  return (
    <p className={`eyebrow${light ? " eyebrow-light" : ""}`}>
      <span className="eyebrow-star-wrap">
        <RingnovaStar size={11} className="eyebrow-star" />
      </span>
      {children}
    </p>
  );
}

function ButtonLink({ to, children, variant = "primary" }) {
  return (
    <Link className={`button button-${variant}`} to={to}>
      {children}<Icon name="arrow" size={17} />
    </Link>
  );
}

/* ─── Service card (with per-card staggered reveal) ─── */

function ServiceCard({ service, compact = false, index = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className={`service-card${compact ? " service-card-compact" : ""}`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
    >
      <div className="service-card-top">
        <span className="service-icon"><Icon name={service.icon} /></span>
        <span className="service-number">{service.number}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      {!compact && <ArrowLink to="/services">Explore service</ArrowLink>}
    </motion.article>
  );
}

function HeroStarAura() {
  return (
    <div className="hero-star-aura" aria-hidden="true">
      <div className="hero-star-ring ring-1" />
      <div className="hero-star-ring ring-2" />
      <div className="hero-star-core">
        <RingnovaStar size={24} className="hero-star-pulse" />
      </div>
    </div>
  );
}

function HeroPhoto() {
  return (
    <div className="hero-visual">
      <img
        className="hero-image"
        src="/images/home-hero.webp"
        alt="A customer-support agent wearing a headset at her desk in a bright office"
      />
    </div>
  );
}

/* ─── Home ──────────────────────────────────────────────────────────────── */

function ServiceGrid({ services: list }) {
  return (
    <div className="service-grid">
      {list.map((service, idx) => (
        <ServiceCard key={service.number} service={service} index={idx} />
      ))}
    </div>
  );
}

function LanguageCards() {
  const cards = [
    { code: "EN", flag: "/images/flag-en.png", lang: "English", tagline: "Clear, confident conversations" },
    { code: "FR", flag: "/images/flag-fr.png", lang: "Français", tagline: "Une expérience attentionnée" },
    { code: "AR", flag: "/images/flag-ar.png", lang: "العربية", tagline: "تواصل إنساني ومميز" },
  ];

  return (
    <div className="language-cards">
      {cards.map((c) => (
        <div key={c.code} className="language-card">
          <span className="language-flag-badge">
            <img src={c.flag} alt={`${c.lang} flag`} className="language-flag-img" width={48} height={48} />
          </span>
          <div className="language-card-info">
            <strong>{c.lang}</strong>
            <small>{c.tagline}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroEntrance as="section" className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <HeroStarAura />
            <Eyebrow>YOUR PEOPLE-FIRST CALL CENTER PARTNER</Eyebrow>
            <h1>
              Every conversation is a chance to <em>grow.</em>
            </h1>
            <p className="hero-description">
              Flexible customer communication for ambitious businesses. We help you show up,
              follow through, and make every conversation count.
            </p>
            <div className="hero-actions">
              <ButtonLink to="/contact">Let's talk about your needs</ButtonLink>
              <ArrowLink to="/services">Explore our services</ArrowLink>
            </div>
            <div className="hero-proof">
              <span className="proof-avatars" aria-hidden="true"><i>R</i><i>N</i><i>+</i></span>
              <span>Thoughtful support.<br /><strong>Tailored to your team.</strong></span>
            </div>
          </div>
          <HeroPhoto />
        </div>
        <div className="container hero-bottom">
          <span>BUILT FOR YOUR NEXT CHAPTER</span>
          <div className="industry-list"><span>STARTUPS</span><i /><span>E-COMMERCE</span><i /><span>SAAS</span><i /><span>AGENCIES</span></div>
        </div>
      </HeroEntrance>

      {/* ── Intro ── */}
      <section className="intro-section section-pad">
        <Reveal className="container intro-grid">
          <div>
            <Eyebrow>MORE THAN A VOICE ON THE LINE</Eyebrow>
            <h2>Make room for the work <em>only you can do.</em></h2>
          </div>
          <div className="intro-text">
            <p>
              Growing a business means showing up for every customer, prospect, and opportunity.
              Ringnova gives you a responsive team to help make those conversations happen—without
              losing the personal touch.
            </p>
            <ArrowLink to="/about">Get to know Ringnova</ArrowLink>
          </div>
        </Reveal>
      </section>

      {/* ── Services ── */}
      <section className="services-section section-pad">
        <Reveal className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>WHAT WE CAN HELP WITH</Eyebrow>
              <h2>Good conversations.<br /><em>Better business.</em></h2>
            </div>
            <div className="section-heading-aside">
              <p>From the first hello to the next appointment, get flexible support built around your priorities.</p>
              <ArrowLink to="/services">See all services</ArrowLink>
            </div>
          </div>
          <ServiceGrid services={services.slice(0, 4)} />
        </Reveal>
      </section>

      {/* ── Approach ── */}
      <section className="approach-section">
        <Reveal className="container approach-grid">
          <div className="approach-visual">
            <div className="approach-photo">
              <img
                src="/images/home-team-portrait.webp"
                alt="A customer-support professional in a calm, bright workspace"
                loading="lazy"
              />
              <div className="photo-label">Made to fit your business</div>
            </div>
            <div className="floating-language" style={{ position: "absolute", right: 0, bottom: 4 }}>
              <Icon name="globe" size={19} /><span><strong>3 languages</strong><small>One connected team</small></span>
            </div>
          </div>
          <div className="approach-copy">
            <Eyebrow>A FLEXIBLE WAY FORWARD</Eyebrow>
            <h2>Your business isn't <em>one-size-fits-all.</em></h2>
            <p>So your customer communication shouldn't be either. We take time to understand how you work and shape a support approach around what your business actually needs.</p>
            <ul className="check-list">
              <li><span><Icon name="check" size={15} /></span> Responsive, reliable communication</li>
              <li><span><Icon name="check" size={15} /></span> English, French, and Arabic support</li>
              <li><span><Icon name="check" size={15} /></span> Flexible onboarding, tailored to you</li>
            </ul>
            <ButtonLink to="/about" variant="outline">How we work</ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* ── Languages ── */}
      <section className="languages-section">
        <Reveal className="container languages-inner">
          <div>
            <Eyebrow light>CONNECTION HAS NO BORDERS</Eyebrow>
            <h2>Speak their language.<br /><em>Make it personal.</em></h2>
          </div>
          <LanguageCards />
        </Reveal>
      </section>

      {/* ── CTA / Closing ── */}
      <section className="closing-section section-pad">
        <Reveal className="container closing-panel">
          <div className="closing-decoration"><span /><span /><span /></div>
          <div className="closing-content">
            <Eyebrow>LET'S START A CONVERSATION</Eyebrow>
            <h2>Ready for a little more <em>breathing room?</em></h2>
            <p>Tell us what your customers need. We'll talk through an approach that fits your business.</p>
            <ButtonLink to="/contact">Book a consultation</ButtonLink>
          </div>
          <div className="closing-aside">
            <Icon name="chat" size={27} /><span>It starts with<br /><strong>a hello.</strong></span><Icon name="arrowUp" size={19} />
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ─── PageHero (inner pages) ─────────────────────────────────────────── */

function PageHero({ eyebrow, title, description, graphic, graphicClass = "", heroClass = "" }) {
  return (
    <HeroEntrance as="section" className={`page-hero${graphic ? " page-hero-graphic" : ""} ${heroClass}`}>
      <div className="container page-hero-inner">
        <div>
          <p className="eyebrow"><span />{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {graphic && (
          <div className={`page-hero-side ${graphicClass}`}>
            {graphic}
          </div>
        )}
      </div>
    </HeroEntrance>
  );
}

/* ─── ServicePage ────────────────────────────────────────────────────── */

function ServiceRows({ services: list }) {
  return (
    <div className="service-list">
      {list.map((service) => (
        <article className="service-row" key={service.number}>
          <span className="service-row-number">{service.number}</span>
          <span className="service-row-icon"><Icon name={service.icon} /></span>
          <div><h3>{service.title}</h3><p>{service.description}</p></div>
          <Icon name="arrowUp" className="service-row-arrow" />
        </article>
      ))}
    </div>
  );
}

function ServicePage() {
  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title={<>The right support.<br /><em>When it matters.</em></>}
        description="Flexible customer communication for the moments that move your business forward. Start with what you need; we'll shape the rest together."
        graphicClass="service-photo-wrap"
        heroClass="service-page-hero"
        graphic={<img className="service-hero-photo" src="/images/services-hero.webp" alt="A support professional speaking with a customer in a bright team workspace" loading="lazy" />}
      />
      <section className="service-detail-section section-pad">
        <Reveal className="container">
          <div className="service-page-intro">
            <Eyebrow>HOW WE CAN HELP</Eyebrow>
            <h2>One thoughtful team.<br /><em>More ways to connect.</em></h2>
          </div>
          <ServiceRows services={services} />
          <div className="service-note">
            <span className="service-note-star"><RingnovaStar size={24} /></span>
            <p>Not sure what fits? That's what the first conversation is for. We'll listen, learn about your business, and explore what could work.</p>
            <ButtonLink to="/contact" variant="outline">Let's figure it out</ButtonLink>
          </div>
        </Reveal>
      </section>
      <section className="service-languages">
        <Reveal className="container service-languages-inner">
          <div>
            <Eyebrow>YOUR CUSTOMERS, YOUR LANGUAGES</Eyebrow>
            <h2>Connected across<br /><em>every conversation.</em></h2>
          </div>
          <p>Our Morocco-based team supports European businesses in English, French, and Arabic. We'll discuss your customers, communication needs, and a suitable approach together.</p>
        </Reveal>
      </section>
      <CTASection />
    </>
  );
}

/* ─── AboutPage ──────────────────────────────────────────────────────── */

function ValuesGrid() {
  const reduced = useReducedMotion();
  const values = [
    { num: "01", title: "Reliability", body: "Show up with care, follow through, and make dependable communication part of the experience." },
    { num: "02", title: "Responsiveness", body: "Stay attentive to your needs and keep communication open as your business evolves." },
    { num: "03", title: "Flexibility", body: "Build an approach around your priorities, not a pre-set package that doesn't fit." },
    { num: "04", title: "Connection", body: "Support conversations in English, French, and Arabic for customers across Europe." },
  ];

  return (
    <div className="values-grid">
      {values.map((v, idx) => (
        <motion.article
          key={v.num}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.42, delay: idx * 0.08, ease: EASE }}
        >
          <span>{v.num}</span>
          <div><h3>{v.title}</h3><p>{v.body}</p></div>
        </motion.article>
      ))}
    </div>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT RINGNOVA"
        title={<>Better business starts<br />with <em>being there.</em></>}
        description="We believe the conversations around your business deserve the same care and attention you put into building it."
        graphic={
          <div className="about-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <div className="about-mark-star"><RingnovaStar size={34} /></div>
          </div>
        }
      />
      <section className="about-story section-pad">
        <Reveal className="container about-story-grid">
          <div>
            <Eyebrow>OUR POINT OF VIEW</Eyebrow>
            <h2>Every interaction is a chance to <em>show you care.</em></h2>
          </div>
          <div className="about-story-copy">
            <p>Ringnova is a Morocco-based team helping growing businesses across Europe stay close to their customers and prospects. We bring a considered, human approach to customer support and business communication.</p>
            <p>We know no two businesses work the same way. That's why we start by listening—then shape a flexible way of working around your needs, your customers, and the conversations that matter to you.</p>
            <ArrowLink to="/contact">Start a conversation</ArrowLink>
          </div>
        </Reveal>
      </section>
      <section className="values-section">
        <Reveal className="container">
          <div className="values-heading">
            <Eyebrow>WHAT YOU CAN EXPECT</Eyebrow>
            <h2>A good partner makes<br /><em>things feel simpler.</em></h2>
          </div>
          <ValuesGrid />
        </Reveal>
      </section>
      <section className="about-team-section">
        <Reveal className="container about-team-grid">
          <div className="team-art">
            <img src="/images/about-team.webp" alt="Three colleagues collaborating in a bright workspace" loading="lazy" />
          </div>
          <div>
            <Eyebrow>A TEAM THAT STARTS BY LISTENING</Eyebrow>
            <h2>Thoughtful people.<br /><em>Work that fits.</em></h2>
            <p>Based in Morocco and working with businesses across Europe, our team brings a personal, multilingual approach to every partnership. We learn what matters to your business before shaping how we can help.</p>
            <p>From onboarding onward, we keep communication clear, responsive, and tailored to your needs.</p>
            <ButtonLink to="/contact" variant="outline">Meet your next partner</ButtonLink>
          </div>
        </Reveal>
      </section>
      <CTASection />
    </>
  );
}

/* ─── Contact Form (Confirmed Client Structure) ───────────────────────── */

function ContactForm() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobFunction: "",
    company: "",
    industry: "",
    country: "",
    service: "",
    source: "",
    message: "",
    consent: false,
  });

  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "Please enter your first name.";
    if (!formData.lastName.trim()) errs.lastName = "Please enter your last name.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Please enter a valid work email address.";
    }
    if (!formData.phone.trim()) errs.phone = "Please enter your phone number.";
    if (!formData.jobFunction) errs.jobFunction = "Please select your job function.";
    if (!formData.company.trim()) errs.company = "Please enter your company name.";
    if (!formData.industry) errs.industry = "Please select your industry.";
    if (!formData.country) errs.country = "Please select your country.";
    if (!formData.service) errs.service = "Please select the service you are interested in.";
    if (!formData.source) errs.source = "Please select how you heard about us.";
    if (!formData.message.trim()) errs.message = "Please briefly describe the challenge you want Ringnova to help with.";
    if (!formData.consent) errs.consent = "Please agree to the processing of personal data to proceed.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementsByName(firstKey)[0];
      if (el) el.focus();
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 550);
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobFunction: "",
      company: "",
      industry: "",
      country: "",
      service: "",
      source: "",
      message: "",
      consent: false,
    });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="form-success-card" role="status" aria-live="polite">
        <div className="form-success-star">
          <RingnovaStar size={36} />
        </div>
        <h3>Message sent successfully!</h3>
        <p className="form-success-lead">
          Thank you, <strong>{formData.firstName}</strong>. Your inquiry for <strong>{formData.company}</strong> regarding <strong>{formData.service}</strong> has been received by the Ringnova team.
        </p>
        <p className="form-success-sub">
          We will review your requirements and get back to you within 24–48 business hours at <em>{formData.email}</em> or {formData.phone}.
        </p>
        <button type="button" className="button button-outline form-reset-btn" onClick={handleReset}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {/* ── Section 1: Personal Information ── */}
      <fieldset className="form-section-group">
        <legend className="form-section-header">
          <span className="form-section-badge">01</span>
          <span className="form-section-title">Personal Information</span>
        </legend>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="firstName">
              First Name <span className="required-star">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="e.g. Sarah"
              value={formData.firstName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="lastName">
              Last Name <span className="required-star">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="e.g. Dubois"
              value={formData.lastName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="email">
              Work Email <span className="required-star">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="sarah.dubois@company.com"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="phone">
              Phone Number <span className="required-star">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+44 20 7946 0958"
              value={formData.phone}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
        </div>
      </fieldset>

      {/* ── Section 2: Professional Information ── */}
      <fieldset className="form-section-group">
        <legend className="form-section-header">
          <span className="form-section-badge">02</span>
          <span className="form-section-title">Professional Information</span>
        </legend>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="jobFunction">
              Job Function <span className="required-star">*</span>
            </label>
            <select
              id="jobFunction"
              name="jobFunction"
              value={formData.jobFunction}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.jobFunction}
            >
              <option value="" disabled>Select your role</option>
              <option value="Executive (CEO, Founder, MD)">Executive (CEO, Founder, MD)</option>
              <option value="Customer Experience & Support Leader">Customer Experience & Support Leader</option>
              <option value="Sales & Business Development">Sales & Business Development</option>
              <option value="Operations & Delivery">Operations & Delivery</option>
              <option value="Marketing & Digital">Marketing & Digital</option>
              <option value="Other role">Other role</option>
            </select>
            {errors.jobFunction && <span className="field-error">{errors.jobFunction}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="company">
              Company <span className="required-star">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Your company name"
              value={formData.company}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.company}
            />
            {errors.company && <span className="field-error">{errors.company}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="industry">
              Industry <span className="required-star">*</span>
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.industry}
            >
              <option value="" disabled>Select your industry</option>
              <option value="E-commerce & Retail">E-commerce & Retail</option>
              <option value="Software & SaaS">Software & SaaS</option>
              <option value="Professional Services & Agencies">Professional Services & Agencies</option>
              <option value="Banking, Finance & FinTech">Banking, Finance & FinTech</option>
              <option value="Healthcare & Wellness">Healthcare & Wellness</option>
              <option value="Logistics & Transportation">Logistics & Transportation</option>
              <option value="Telecommunications & Media">Telecommunications & Media</option>
              <option value="Other industry">Other industry</option>
            </select>
            {errors.industry && <span className="field-error">{errors.industry}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="country">
              Country <span className="required-star">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.country}
            >
              <option value="" disabled>Select your country</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Belgium">Belgium</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Spain">Spain</option>
              <option value="Italy">Italy</option>
              <option value="Morocco">Morocco</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Other European country">Other European country</option>
              <option value="International">International</option>
            </select>
            {errors.country && <span className="field-error">{errors.country}</span>}
          </div>
        </div>
      </fieldset>

      {/* ── Section 3: Your Project ── */}
      <fieldset className="form-section-group">
        <legend className="form-section-header">
          <span className="form-section-badge">03</span>
          <span className="form-section-title">Your Project</span>
        </legend>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="service">
              What service are you interested in? <span className="required-star">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.service}
            >
              <option value="" disabled>Select a service</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Full support / Multi-service">Full support / Multi-service</option>
              <option value="Other need">Other need</option>
            </select>
            {errors.service && <span className="field-error">{errors.service}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="source">
              How did you hear about us? <span className="required-star">*</span>
            </label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.source}
            >
              <option value="" disabled>Select an option</option>
              <option value="Search Engine (Google...)">Search Engine (Google...)</option>
              <option value="LinkedIn / Social Media">LinkedIn / Social Media</option>
              <option value="Referral / Professional Network">Referral / Professional Network</option>
              <option value="Event / Conference">Event / Conference</option>
              <option value="Press or Media">Press or Media</option>
              <option value="Other">Other</option>
            </select>
            {errors.source && <span className="field-error">{errors.source}</span>}
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="message">
            Briefly describe the challenge you want Ringnova to help you with... <span className="required-star">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Tell us about your needs, current communication channels (calls, chat, email), expected volumes, or key goals..."
            value={formData.message}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.message}
          />
          {errors.message && <span className="field-error">{errors.message}</span>}
        </div>
      </fieldset>

      {/* ── Consent ── */}
      <div className="form-consent-wrap">
        <label className="consent-label" htmlFor="consent">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            className="consent-checkbox"
            checked={formData.consent}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.consent}
          />
          <span>
            I agree to the processing of my personal data by Ringnova to respond to my inquiry, in accordance with the{" "}
            <Link to="/privacy">Privacy Policy</Link>. <span className="required-star">*</span>
          </span>
        </label>
        {errors.consent && <span className="field-error">{errors.consent}</span>}
      </div>

      {/* ── CTA Submit Button ── */}
      <div className="form-actions">
        <button
          className="button button-primary form-submit-btn"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "SEND MESSAGE"}
          <RingnovaStar size={16} className="btn-star-icon" />
        </button>
        <p className="form-privacy-note">
          Your details are strictly confidential and will never be shared with third parties.
        </p>
      </div>
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title={<>Tell us what's on<br />your <em>mind.</em></>}
        description="Looking for a more thoughtful way to support your customers or grow your outreach? We'd love to hear what you have in mind."
        graphic={
          <div className="contact-bubble" aria-hidden="true">
            <RingnovaStar size={30} className="contact-bubble-star" />
            <span>LET'S TALK</span>
            <Icon name="arrowUp" size={17} />
          </div>
        }
      />
      <section className="contact-section section-pad">
        <Reveal className="container contact-grid">
          <div className="contact-aside">
            <div className="contact-aside-copy">
              <Eyebrow>START WITH A HELLO</Eyebrow>
              <h2>A good fit starts with a <em>good conversation.</em></h2>
              <p>Share a little about your business and what you're looking for. We'll use it to understand what matters to you and explore next steps together.</p>
              <span className="contact-aside-foot">No pressure. Just a conversation.</span>
            </div>
            <div className="contact-aside-right">
              <div className="contact-facts">
                <div className="contact-lang-panel contact-fact-card">
                  <div className="contact-lang-flags">
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-ma.png" alt="Morocco flag" className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-eu.png" alt="European Union flag" className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                  </div>
                  <div className="contact-lang-info">
                    <strong>Based in Morocco</strong>
                    <small>Working with businesses across Europe</small>
                  </div>
                </div>
                <div className="contact-lang-panel contact-fact-card">
                  <div className="contact-lang-flags">
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/icon-listen.png" alt="Here to listen" className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                  </div>
                  <div className="contact-lang-info">
                    <strong>Here to listen</strong>
                    <small>Onboarding shaped around your needs</small>
                  </div>
                </div>
                <div className="contact-lang-panel contact-fact-card">
                  <div className="contact-lang-flags">
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-en.png" alt="English flag" className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-fr.png" alt="French flag" className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-ar.png" alt="Arabic flag" className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                  </div>
                  <div className="contact-lang-info">
                    <strong>Speak your language</strong>
                    <small>English, French, and Arabic support</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form-wrap">
            <div className="form-heading">
              <span><RingnovaStar size={13} className="form-heading-star" /> GET IN TOUCH</span>
              <strong>Tell us about your needs</strong>
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ─── Privacy ────────────────────────────────────────────────────────── */

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="PRIVACY"
        title={<>Privacy, with<br /><em>care.</em></>}
        description="This page is a placeholder and is not a complete privacy policy. Approved legal text must be added before the site is published."
      />
      <section className="privacy-section section-pad">
        <Reveal className="container privacy-content">
          <span className="placeholder-pill">POLICY PLACEHOLDER</span>
          <h2>Privacy policy to be supplied</h2>
          <p>This preview does not connect the consultation form to a backend or store submitted details. No analytics or advertising cookies have been added. These statements should be reviewed and replaced with Ringnova's approved privacy information before launch.</p>
          <p>The final policy should explain what information is collected, why it is used, where it is stored, how long it is retained, which providers process it, and how people can exercise their rights.</p>
          <ArrowLink to="/contact">Back to contact</ArrowLink>
        </Reveal>
      </section>
    </>
  );
}

/* ─── CTA Section ────────────────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="closing-section section-pad">
      <Reveal className="container closing-panel">
        <div className="closing-decoration"><span /><span /><span /></div>
        <div className="closing-content">
          <Eyebrow>LET'S START A CONVERSATION</Eyebrow>
          <h2>Let's find an approach that <em>fits.</em></h2>
          <p>Tell us what your business needs. We'll take it from there, together.</p>
          <ButtonLink to="/contact">Talk to Ringnova</ButtonLink>
        </div>
        <div className="closing-aside">
          <Icon name="chat" size={27} /><span>It starts with<br /><strong>a hello.</strong></span><Icon name="arrowUp" size={19} />
        </div>
      </Reveal>
    </section>
  );
}

/* ─── App with Smooth Page Transitions ───────────────────────────────── */

function AnimatedRoutes() {
  const location = useLocation();
  const reduced = useReducedMotion();

  React.useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="route-transition-wrap"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div id="top" />
      <Header />
      <main id="main">
        <AnimatedRoutes />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>,
);
