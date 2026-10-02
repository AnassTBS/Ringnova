import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./styles.css";
import { PhoneInputField } from "./PhoneInputField";
import { LANGUAGES, pageMetadata } from "./translations";
import { LanguageProvider, useI18n } from "./i18n";

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
  const { t } = useI18n();
  return (
    <SmartNavLink
      to="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label={t("Ringnova home")}
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
  const { language, setLanguage, t } = useI18n();
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
          aria-label={t(menuOpen ? "Close navigation menu" : "Open navigation menu")}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <div className="header-actions">
          <nav className="main-nav" id="primary-navigation" aria-label={t("Main navigation")}>
            <SmartNavLink to="/" onClick={closeMenu}>{t("Home")}</SmartNavLink>
            <SmartNavLink to="/services" onClick={closeMenu}>{t("Services")}</SmartNavLink>
            <SmartNavLink to="/about" onClick={closeMenu}>{t("About us")}</SmartNavLink>
            <SmartNavLink to="/contact" onClick={closeMenu}>{t("Contact")}</SmartNavLink>
          </nav>
          <div className="header-tools">
            <LanguageSwitcher onSelect={closeMenu} />
            <SmartNavLink className="nav-cta" to="/contact" onClick={closeMenu}>
              {t("Let's talk")} <Icon name="arrowUp" size={15} />
            </SmartNavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function FlagIcon({ code }) {
  const flagMap = {
    en: "/images/flag-en.svg",
    fr: "/images/flag-fr.svg",
    es: "/images/flag-es.svg",
    de: "/images/flag-de.svg",
    ar: "/images/flag-sa.svg",
  };

  const src = flagMap[code] || "/images/flag-en.svg";

  return <img src={src} alt="" className="language-flag" aria-hidden="true" />;
}

function LanguageSwitcher({ onSelect }) {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const activeIndex = LANGUAGES.findIndex(({ code }) => code === language);

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const options = [...(rootRef.current?.querySelectorAll(".language-option") || [])];
        const focusedIndex = options.indexOf(document.activeElement);
        const currentIndex = focusedIndex < 0 ? activeIndex : focusedIndex;
        const next = (currentIndex + (event.key === "ArrowDown" ? 1 : LANGUAGES.length - 1)) % LANGUAGES.length;
        options[next]?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, isOpen]);

  return (
    <div className="language-switcher" ref={rootRef}>
      <button
        className="language-switcher-trigger"
        type="button"
        ref={triggerRef}
        aria-label={`${t("Language")}: ${language.toUpperCase()}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="language-switcher-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <FlagIcon code={language} />
        <svg className={`language-chevron${isOpen ? " is-open" : ""}`} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="m2 4.5 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="language-switcher-menu" id="language-switcher-menu" role="menu" aria-label={t("Language")}>
          {LANGUAGES.map(({ code }) => (
            <button
              className={`language-option${code === language ? " is-active" : ""}`}
              type="button"
              role="menuitemradio"
              aria-checked={code === language}
              key={code}
              onClick={() => {
                setLanguage(code);
                setIsOpen(false);
                onSelect();
              }}
            >
              <FlagIcon code={code} />
              <span>{code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Brand light />
            <p>{t("Good conversations make")}<br />{t("business better.")}</p>
          </div>
          <div className="footer-nav-group">
            <p className="footer-label">{t("Explore")}</p>
            <Link to="/services">{t("Our services")}</Link>
            <Link to="/about">{t("About Ringnova")}</Link>
            <Link to="/contact">{t("Get in touch")}</Link>
          </div>
          <div className="footer-nav-group">
            <p className="footer-label">{t("Let's connect")}</p>
            <span>{t("Serving businesses across Europe")}</span>
            <span>{t("Team based in Morocco")}</span>
            <span>{t("English · Français · العربية")}</span>
          </div>
          <a className="footer-top" href="#top" aria-label={t("Back to top")}>
            <Icon name="arrowUp" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ringnova. {t("All rights reserved.")}</span>
          <Link to="/privacy">{t("Privacy policy")} <span className="placeholder-tag">{t("Placeholder")}</span></Link>
          <span>{t("Made for better conversations.")}</span>
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

/* ─── Service card ─── */

function ServiceCard({ service, compact = false }) {
  const { t } = useI18n();
  return (
    <article
      className={`service-card${compact ? " service-card-compact" : ""}`}
    >
      <div className="service-card-top">
        <span className="service-icon"><Icon name={service.icon} /></span>
        <span className="service-number">{service.number}</span>
      </div>
      <h3>{t(service.title)}</h3>
      <p>{t(service.description)}</p>
      {!compact && <ArrowLink to="/services">{t("Explore service")}</ArrowLink>}
    </article>
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
  const { t } = useI18n();
  return (
    <div className="hero-visual">
      <img
        className="hero-image"
        src="/images/home-hero.webp"
        alt={t("A customer-support agent wearing a headset at her desk in a bright office")}
      />
    </div>
  );
}

/* ─── Home ──────────────────────────────────────────────────────────────── */

function ServiceGrid({ services: list }) {
  return (
    <div className="service-grid">
      {list.map((service) => (
        <ServiceCard key={service.number} service={service} />
      ))}
    </div>
  );
}

function LanguageCards() {
  const cards = [
    { code: "EN", flag: "/images/flag-en.svg", lang: "English", alt: "English flag", tagline: "Clear, confident conversations" },
    { code: "FR", flag: "/images/flag-fr.svg", lang: "Français", alt: "French flag", tagline: "Une expérience attentionnée" },
    { code: "AR", flag: "/images/flag-sa.svg", lang: "العربية", alt: "Saudi Arabia flag", tagline: "تواصل إنساني ومميز" },
  ];

  return (
    <div className="language-cards">
      {cards.map((c) => (
        <div key={c.code} className="language-card">
          <span className="language-flag-badge">
            <img src={c.flag} alt={c.alt} className="language-flag-img" width={48} height={48} />
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
  const { t } = useI18n();
  return (
    <>
      {/* ── Hero ── */}
      <HeroEntrance as="section" className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <HeroStarAura />
            <Eyebrow>{t("YOUR PEOPLE-FIRST CALL CENTER PARTNER")}</Eyebrow>
            <h1>
              {t("Every conversation is a chance to ")}<em>{t("grow.")}</em>
            </h1>
            <p className="hero-description">
              {t("Flexible customer communication for ambitious businesses. We help you show up, follow through, and make every conversation count.")}
            </p>
            <div className="hero-actions">
              <ButtonLink to="/contact">{t("Let's talk about your needs")}</ButtonLink>
              <ArrowLink to="/services">{t("Explore our services")}</ArrowLink>
            </div>
            <div className="hero-proof">
              <span className="proof-avatars" aria-hidden="true"><i>R</i><i>N</i><i>+</i></span>
              <span>{t("Thoughtful support.")}<br /><strong>{t("Tailored to your team.")}</strong></span>
            </div>
          </div>
          <HeroPhoto />
        </div>
        <div className="container hero-bottom">
          <span>{t("BUILT FOR YOUR NEXT CHAPTER")}</span>
          <div className="industry-list"><span>{t("STARTUPS")}</span><i /><span>{t("E-COMMERCE")}</span><i /><span>SAAS</span><i /><span>{t("AGENCIES")}</span></div>
        </div>
      </HeroEntrance>

      {/* ── Intro ── */}
      <section className="intro-section section-pad">
        <Reveal className="container intro-grid">
          <div>
            <Eyebrow>{t("MORE THAN A VOICE ON THE LINE")}</Eyebrow>
            <h2>{t("Make room for the work ")}<em>{t("only you can do.")}</em></h2>
          </div>
          <div className="intro-text">
            <p>
              {t("Growing a business means showing up for every customer, prospect, and opportunity. Ringnova gives you a responsive team to help make those conversations happen—without losing the personal touch.")}
            </p>
            <ArrowLink to="/about">{t("Get to know Ringnova")}</ArrowLink>
          </div>
        </Reveal>
      </section>

      {/* ── Services ── */}
      <section className="services-section section-pad">
        <Reveal className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("WHAT WE CAN HELP WITH")}</Eyebrow>
              <h2>{t("Good conversations.")}<br /><em>{t("Better business.")}</em></h2>
            </div>
            <div className="section-heading-aside">
              <p>{t("From the first hello to the next appointment, get flexible support built around your priorities.")}</p>
              <ArrowLink to="/services">{t("See all services")}</ArrowLink>
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
                alt={t("A customer-support professional in a calm, bright workspace")}
                loading="lazy"
              />
              <div className="photo-label">{t("Made to fit your business")}</div>
            </div>
            <div className="floating-language">
              <Icon name="globe" size={19} /><span><strong>{t("3 languages")}</strong><small>{t("One connected team")}</small></span>
            </div>
          </div>
          <div className="approach-copy">
            <Eyebrow>{t("A FLEXIBLE WAY FORWARD")}</Eyebrow>
            <h2>{t("Your business isn't ")}<em>{t("one-size-fits-all.")}</em></h2>
            <p>{t("So your customer communication shouldn't be either. We take time to understand how you work and shape a support approach around what your business actually needs.")}</p>
            <ul className="check-list">
              <li><span><Icon name="check" size={15} /></span> {t("Responsive, reliable communication")}</li>
              <li><span><Icon name="check" size={15} /></span> {t("English, French, and Arabic support")}</li>
              <li><span><Icon name="check" size={15} /></span> {t("Flexible onboarding, tailored to you")}</li>
            </ul>
            <ButtonLink to="/about" variant="outline">{t("How we work")}</ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* ── Languages ── */}
      <section className="languages-section">
        <Reveal className="container languages-inner">
          <div>
            <Eyebrow light>{t("CONNECTION HAS NO BORDERS")}</Eyebrow>
            <h2>{t("Speak their language.")}<br /><em>{t("Make it personal.")}</em></h2>
          </div>
          <LanguageCards />
        </Reveal>
      </section>

      {/* ── CTA / Closing ── */}
      <section className="closing-section section-pad">
        <Reveal className="container closing-panel">
          <div className="closing-decoration"><span /><span /><span /></div>
          <div className="closing-content">
            <Eyebrow>{t("LET'S START A CONVERSATION")}</Eyebrow>
            <h2>{t("Ready for a little more ")}<em>{t("breathing room?")}</em></h2>
            <p>{t("Tell us what your customers need. We'll talk through an approach that fits your business.")}</p>
            <ButtonLink to="/contact">{t("Book a consultation")}</ButtonLink>
          </div>
          <div className="closing-aside">
            <Icon name="chat" size={27} /><span>{t("It starts with")}<br /><strong>{t("a hello.")}</strong></span><Icon name="arrowUp" size={19} />
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ─── PageHero (inner pages) ─────────────────────────────────────────── */

function PageHero({ eyebrow, title, description, graphic, graphicClass = "", heroClass = "", background }) {
  return (
    <HeroEntrance as="section" className={`page-hero${graphic ? " page-hero-graphic" : ""} ${heroClass}`}>
      {background && <div className="page-hero-bg-layer">{background}</div>}
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
  const { t } = useI18n();
  return (
    <div className="service-list">
      {list.map((service) => (
        <article className="service-row" key={service.number}>
          <span className="service-row-number">{service.number}</span>
          <span className="service-row-icon"><Icon name={service.icon} /></span>
          <div><h3>{t(service.title)}</h3><p>{t(service.description)}</p></div>
          <Icon name="arrowUp" className="service-row-arrow" />
        </article>
      ))}
    </div>
  );
}

function ServicePage() {
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("OUR SERVICES")}
        title={<>{t("The right support.")}<br /><em>{t("When it matters.")}</em></>}
        description={t("Flexible customer communication for the moments that move your business forward. Start with what you need; we'll shape the rest together.")}
        graphicClass="service-photo-wrap"
        heroClass="service-page-hero"
        graphic={<img className="service-hero-photo" src="/images/services-hero.webp" alt={t("A support professional speaking with a customer in a bright team workspace")} loading="eager" fetchpriority="high" />}
      />
      <section className="service-detail-section section-pad">
        <Reveal className="container">
          <div className="service-page-intro">
            <Eyebrow>{t("HOW WE CAN HELP")}</Eyebrow>
            <h2>{t("One thoughtful team.")}<br /><em>{t("More ways to connect.")}</em></h2>
          </div>
          <ServiceRows services={services} />
          <div className="service-note">
            <span className="service-note-star"><RingnovaStar size={24} /></span>
            <p>{t("Not sure what fits? That's what the first conversation is for. We'll listen, learn about your business, and explore what could work.")}</p>
            <ButtonLink to="/contact" variant="outline">{t("Let's figure it out")}</ButtonLink>
          </div>
        </Reveal>
      </section>
      <section className="service-languages">
        <Reveal className="container service-languages-inner">
          <div>
            <Eyebrow>{t("YOUR CUSTOMERS, YOUR LANGUAGES")}</Eyebrow>
            <h2>{t("Connected across")}<br /><em>{t("every conversation.")}</em></h2>
          </div>
          <p>{t("Our Morocco-based team supports European businesses in English, French, and Arabic. We'll discuss your customers, communication needs, and a suitable approach together.")}</p>
        </Reveal>
      </section>
      <CTASection />
    </>
  );
}

/* ─── AboutPage ──────────────────────────────────────────────────────── */

function ValuesGrid() {
  const { t } = useI18n();
  const values = [
    { num: "01", title: "Reliability", body: "Show up with care, follow through, and make dependable communication part of the experience." },
    { num: "02", title: "Responsiveness", body: "Stay attentive to your needs and keep communication open as your business evolves." },
    { num: "03", title: "Flexibility", body: "Build an approach around your priorities, not a pre-set package that doesn't fit." },
    { num: "04", title: "Connection", body: "Support conversations in English, French, and Arabic for customers across Europe." },
  ];

  return (
    <div className="values-grid">
      {values.map((v) => (
        <article key={v.num}>
          <span>{v.num}</span>
          <div><h3>{t(v.title)}</h3><p>{t(v.body)}</p></div>
        </article>
      ))}
    </div>
  );
}

function AboutPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("ABOUT RINGNOVA")}
        title={<>{t("Better business starts")}<br />{t("with ")}<em>{t("being there.")}</em></>}
        description={t("We believe the conversations around your business deserve the same care and attention you put into building it.")}
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
            <Eyebrow>{t("OUR POINT OF VIEW")}</Eyebrow>
            <h2>{t("Every interaction is a chance to ")}<em>{t("show you care.")}</em></h2>
          </div>
          <div className="about-story-copy">
            <p>{t("Ringnova is a Morocco-based team helping growing businesses across Europe stay close to their customers and prospects. We bring a considered, human approach to customer support and business communication.")}</p>
            <p>{t("We know no two businesses work the same way. That's why we start by listening—then shape a flexible way of working around your needs, your customers, and the conversations that matter to you.")}</p>
            <ArrowLink to="/contact">{t("Start a conversation")}</ArrowLink>
          </div>
        </Reveal>
      </section>
      <section className="values-section">
        <Reveal className="container">
          <div className="values-heading">
            <Eyebrow>{t("WHAT YOU CAN EXPECT")}</Eyebrow>
            <h2>{t("A good partner makes")}<br /><em>{t("things feel simpler.")}</em></h2>
          </div>
          <ValuesGrid />
        </Reveal>
      </section>
      <section className="about-team-section">
        <Reveal className="container about-team-grid">
          <div className="team-art">
            <img src="/images/about-team.webp" alt={t("Three colleagues collaborating in a bright workspace")} loading="lazy" />
          </div>
          <div>
            <Eyebrow>{t("A TEAM THAT STARTS BY LISTENING")}</Eyebrow>
            <h2>{t("Thoughtful people.")}<br /><em>{t("Work that fits.")}</em></h2>
            <p>{t("Based in Morocco and working with businesses across Europe, our team brings a personal, multilingual approach to every partnership. We learn what matters to your business before shaping how we can help.")}</p>
            <p>{t("From onboarding onward, we keep communication clear, responsive, and tailored to your needs.")}</p>
            <ButtonLink to="/contact" variant="outline">{t("Meet your next partner")}</ButtonLink>
          </div>
        </Reveal>
      </section>
      <CTASection />
    </>
  );
}

/* ─── Contact Form (Confirmed Client Structure) ───────────────────────── */

function ContactForm() {
  const { t } = useI18n();
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
  const [whatsappUrl, setWhatsappUrl] = React.useState("");
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
    if (!formData.consent) errs.consent = "Please agree to share your details with WhatsApp to prepare your message.";
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

    const messageDetails = [
      ["First name", formData.firstName, false],
      ["Last name", formData.lastName, false],
      ["Work email", formData.email, false],
      ["Phone", formData.phone, false],
      ["Job function", formData.jobFunction, true],
      ["Company", formData.company, false],
      ["Industry", formData.industry, true],
      ["Country", formData.country, true],
      ["Service", formData.service, true],
      ["How they heard about us", formData.source, true],
      ["Message", formData.message, false],
    ]
      .filter(([, value]) => value.trim())
      .map(([label, value, translateValue]) => `${t(label)}: ${translateValue ? t(value.trim()) : value.trim()}`)
      .join("\n");
    const url = `https://wa.me/212605560310?text=${encodeURIComponent(`${t("Hello Ringnova,")}\n\n${messageDetails}`)}`;

    setWhatsappUrl(url);
    setSubmitted(true);
    window.open(url, "_blank", "noopener,noreferrer");
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
        <h3>{t("Your WhatsApp draft is ready")}</h3>
        <p className="form-success-lead">
          {t("Thanks,")} <strong>{formData.firstName}</strong>. {t("Review the details in WhatsApp and tap Send to contact Ringnova. Your message has not been sent yet.")}
        </p>
        <p className="form-success-sub">
          {t("If WhatsApp did not open automatically, use the button below.")}
        </p>
        <a className="button button-primary form-reset-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          {t("Continue to WhatsApp")}
        </a>
        <button type="button" className="button button-outline form-reset-btn" onClick={handleReset}>
          {t("Edit details")}
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
          <span className="form-section-title">{t("Personal Information")}</span>
        </legend>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="firstName">
              {t("First Name")} <span className="required-star">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder={t("e.g. Sarah")}
              value={formData.firstName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {errors.firstName && <span className="field-error" id="firstName-error">{t(errors.firstName)}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="lastName">
              {t("Last Name")} <span className="required-star">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder={t("e.g. Dubois")}
              value={formData.lastName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && <span className="field-error" id="lastName-error">{t(errors.lastName)}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="email">
              {t("Work Email")} <span className="required-star">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="sarah.dubois@company.com"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <span className="field-error" id="email-error">{t(errors.email)}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="phone">{t("Phone Number")}</label>
            <PhoneInputField
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
              placeholder="1 23 45 67 89"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Section 2: Professional Information ── */}
      <fieldset className="form-section-group">
        <legend className="form-section-header">
          <span className="form-section-badge">02</span>
          <span className="form-section-title">{t("Professional Information")}</span>
        </legend>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="jobFunction">{t("Job Function")}</label>
            <select
              id="jobFunction"
              name="jobFunction"
              value={formData.jobFunction}
              onChange={handleChange}
            >
              <option value="">{t("Select your role (optional)")}</option>
              <option value="Executive (CEO, Founder, MD)">{t("Executive (CEO, Founder, MD)")}</option>
              <option value="Customer Experience & Support Leader">{t("Customer Experience & Support Leader")}</option>
              <option value="Sales & Business Development">{t("Sales & Business Development")}</option>
              <option value="Operations & Delivery">{t("Operations & Delivery")}</option>
              <option value="Marketing & Digital">{t("Marketing & Digital")}</option>
              <option value="Other role">{t("Other role")}</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="company">{t("Company")}</label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder={t("Your company name")}
              value={formData.company}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="industry">{t("Industry")}</label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
            >
              <option value="">{t("Select your industry (optional)")}</option>
              <option value="E-commerce & Retail">{t("E-commerce & Retail")}</option>
              <option value="Software & SaaS">{t("Software & SaaS")}</option>
              <option value="Professional Services & Agencies">{t("Professional Services & Agencies")}</option>
              <option value="Banking, Finance & FinTech">{t("Banking, Finance & FinTech")}</option>
              <option value="Healthcare & Wellness">{t("Healthcare & Wellness")}</option>
              <option value="Logistics & Transportation">{t("Logistics & Transportation")}</option>
              <option value="Telecommunications & Media">{t("Telecommunications & Media")}</option>
              <option value="Other industry">{t("Other industry")}</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="country">{t("Country")}</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">{t("Select your country (optional)")}</option>
              <option value="United Kingdom">{t("United Kingdom")}</option>
              <option value="France">{t("France")}</option>
              <option value="Germany">{t("Germany")}</option>
              <option value="Belgium">{t("Belgium")}</option>
              <option value="Switzerland">{t("Switzerland")}</option>
              <option value="Netherlands">{t("Netherlands")}</option>
              <option value="Spain">{t("Spain")}</option>
              <option value="Italy">{t("Italy")}</option>
              <option value="Morocco">{t("Morocco")}</option>
              <option value="Luxembourg">{t("Luxembourg")}</option>
              <option value="Other European country">{t("Other European country")}</option>
              <option value="International">{t("International")}</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* ── Section 3: Your Project ── */}
      <fieldset className="form-section-group">
        <legend className="form-section-header">
          <span className="form-section-badge">03</span>
          <span className="form-section-title">{t("Your Project")}</span>
        </legend>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="service">{t("What service are you interested in?")}</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">{t("Select a service (optional)")}</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>{t(s)}</option>
              ))}
              <option value="Full support / Multi-service">{t("Full support / Multi-service")}</option>
              <option value="Other need">{t("Other need")}</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="source">{t("How did you hear about us?")}</label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="">{t("Select an option (optional)")}</option>
              <option value="Search Engine (Google...)">{t("Search Engine (Google...)")}</option>
              <option value="LinkedIn / Social Media">{t("LinkedIn / Social Media")}</option>
              <option value="Referral / Professional Network">{t("Referral / Professional Network")}</option>
              <option value="Event / Conference">{t("Event / Conference")}</option>
              <option value="Press or Media">{t("Press or Media")}</option>
              <option value="Other">{t("Other")}</option>
            </select>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="message">{t("Briefly describe the challenge you want Ringnova to help you with...")}</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder={t("Tell us about your needs, current communication channels (calls, chat, email), expected volumes, or key goals...")}
            value={formData.message}
            onChange={handleChange}
          />
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
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            {t("I agree that the details I provided will be shared with WhatsApp to prepare a message to Ringnova. I understand I must review and send it in WhatsApp. See the")}{" "}
            <Link to="/privacy">{t("Privacy Policy")}</Link>. <span className="required-star">*</span>
          </span>
        </label>
        {errors.consent && <span className="field-error" id="consent-error">{t(errors.consent)}</span>}
      </div>

      {/* ── CTA Submit Button ── */}
      <div className="form-actions">
        <button
          className="button button-primary form-submit-btn"
          type="submit"
        >
          {t("SEND MESSAGE")}
          <RingnovaStar size={16} className="btn-star-icon" />
        </button>
        <p className="form-privacy-note">
          {t("Selecting Send Message opens WhatsApp with the details you provided. You can review the draft before sending it.")}
        </p>
      </div>
    </form>
  );
}

function ContactHeroVideo() {
  const videoRef = React.useRef(null);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      video.pause();
      return;
    }

    const promise = video.play();
    if (promise !== undefined) {
      promise.catch(() => {});
    }
  }, [reducedMotion]);

  return (
    <div className="contact-hero-video-wrap" aria-hidden="true">
      <video
        ref={videoRef}
        className="contact-hero-video"
        src="/videos/map.mp4"
        poster="/images/contact-map-poster.webp"
        muted
        playsInline
        autoPlay={!reducedMotion}
        loop={false}
        preload={reducedMotion ? "none" : "auto"}
        onEnded={(e) => {
          e.currentTarget.pause();
        }}
      />
      <div className="contact-hero-scrim" />
    </div>
  );
}

function ContactPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("CONTACT")}
        title={<>{t("contactHeroFirst")}<br /><em>{t("contactHeroEmphasis")}</em></>}
        description={t("Looking for a more thoughtful way to support your customers or grow your outreach? We'd love to hear what you have in mind.")}
        heroClass="contact-page-hero"
        background={<ContactHeroVideo />}
      />
      <section className="contact-section section-pad">
        <Reveal className="container contact-grid">
          <div className="contact-aside">
            <div className="contact-aside-copy">
              <Eyebrow>{t("START WITH A HELLO")}</Eyebrow>
              <h2>{t("A good fit starts with a ")}<em>{t("good conversation.")}</em></h2>
              <p>{t("Share a little about your business and what you're looking for. We'll use it to understand what matters to you and explore next steps together.")}</p>
              <span className="contact-aside-foot">{t("No pressure. Just a conversation.")}</span>
            </div>
            <div className="contact-aside-right">
              <div className="contact-facts">
                <div className="contact-lang-panel contact-fact-card">
                  <div className="contact-lang-flags">
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/morocco.jpg" alt={t("Morocco flag")} className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-eu.svg" alt={t("European Union flag")} className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                  </div>
                  <div className="contact-lang-info">
                    <strong>{t("Based in Morocco")}</strong>
                    <small>{t("Working with businesses across Europe")}</small>
                  </div>
                </div>
                <div className="contact-lang-panel contact-fact-card">
                  <div className="contact-lang-flags">
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/icon-listen.png" alt={t("Here to listen")} className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                  </div>
                  <div className="contact-lang-info">
                    <strong>{t("Here to listen")}</strong>
                    <small>{t("Onboarding shaped around your needs")}</small>
                  </div>
                </div>
                <div className="contact-lang-panel contact-fact-card">
                  <div className="contact-lang-flags">
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-en.svg" alt={t("English flag")} className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-fr.svg" alt={t("French flag")} className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                    <span className="contact-lang-flag-wrap">
                      <img src="/images/flag-sa.svg" alt={t("Saudi Arabia flag")} className="contact-lang-flag-img" width={44} height={44} />
                    </span>
                  </div>
                  <div className="contact-lang-info">
                    <strong>{t("Speak your language")}</strong>
                    <small>{t("English, French, and Arabic support")}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form-wrap">
            <div className="form-heading">
              <span><RingnovaStar size={13} className="form-heading-star" /> {t("GET IN TOUCH")}</span>
              <strong>{t("Tell us about your needs")}</strong>
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
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("PRIVACY")}
        title={<>{t("privacyTitleFirst")}<br /><em>{t("privacyTitleEmphasis")}</em></>}
        description={t("This page is a placeholder and is not a complete privacy policy. Approved legal text must be added before the site is published.")}
      />
      <section className="privacy-section section-pad">
        <Reveal className="container privacy-content">
          <span className="placeholder-pill">{t("POLICY PLACEHOLDER")}</span>
          <h2>{t("Privacy policy to be supplied")}</h2>
          <p>{t("This page is a placeholder, not a complete privacy policy. When you select Send Message on the contact form, the details you provided are included in a WhatsApp draft addressed to Ringnova. WhatsApp receives those details when the draft opens; you must review and tap Send before Ringnova receives your message. The form does not submit to or store data on a Ringnova backend.")}</p>
          <p>{t("The phone field uses your browser's timezone to suggest a default calling code; this lookup runs in your browser and does not send your IP address to a geolocation provider. No analytics or advertising cookies have been added. These details must be reviewed and replaced with Ringnova's approved privacy information before publication.")}</p>
          <p>{t("The final policy should explain what information is collected, why it is used, where it is stored, how long it is retained, which providers process it, and how people can exercise their rights.")}</p>
          <ArrowLink to="/contact">{t("Back to contact")}</ArrowLink>
        </Reveal>
      </section>
    </>
  );
}

function NotFoundPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("PAGE NOT FOUND")}
        title={<>{t("This page went")}<br /><em>{t("off script.")}</em></>}
        description={t("The page may have moved, or the address may be incorrect.")}
      />
      <section className="privacy-section section-pad">
        <Reveal className="container privacy-content">
          <h2>{t("Let's get you back on track.")}</h2>
          <p>{t("Try the homepage or use the navigation to find what you need.")}</p>
          <ButtonLink to="/">{t("Back to home")}</ButtonLink>
        </Reveal>
      </section>
    </>
  );
}

/* ─── CTA Section ────────────────────────────────────────────────────── */

function CTASection() {
  const { t } = useI18n();
  return (
    <section className="closing-section section-pad">
      <Reveal className="container closing-panel">
        <div className="closing-decoration"><span /><span /><span /></div>
        <div className="closing-content">
          <Eyebrow>{t("LET'S START A CONVERSATION")}</Eyebrow>
          <h2>{t("Let's find an approach that ")}<em>{t("fits.")}</em></h2>
          <p>{t("Tell us what your business needs. We'll take it from there, together.")}</p>
          <ButtonLink to="/contact">{t("Talk to Ringnova")}</ButtonLink>
        </div>
        <div className="closing-aside">
          <Icon name="chat" size={27} /><span>{t("It starts with")}<br /><strong>{t("a hello.")}</strong></span><Icon name="arrowUp" size={19} />
        </div>
      </Reveal>
    </section>
  );
}

/* ─── App with Smooth Page Transitions ───────────────────────────────── */

function AnimatedRoutes() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const { language, t } = useI18n();

  React.useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const metadata = pageMetadata[language]?.[path] || pageMetadata.en[path];
    const description = document.querySelector('meta[name="description"]');
    let robots = document.querySelector('meta[name="robots"]');

    document.title = metadata?.[0] || t("PAGE NOT FOUND") + " | Ringnova";
    if (description) {
      description.content = metadata?.[1] || t("The page may have moved, or the address may be incorrect.");
    }

    if (!metadata && !robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    if (robots) {
      if (metadata) robots.remove();
      else robots.content = "noindex, follow";
    }
  }, [location.pathname, language, t]);

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function Layout() {
  const { t } = useI18n();
  return (
    <>
      <a className="skip-link" href="#main">{t("Skip to content")}</a>
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
    <LanguageProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LanguageProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>,
);
