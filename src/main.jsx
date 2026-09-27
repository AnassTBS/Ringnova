import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import "./styles.css";

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

function Brand({ light = false }) {
  return (
    <Link
      className={`brand${light ? " brand-light" : ""}`}
      to="/"
      aria-label="Ringnova home"
    >
      <img
        src={light ? "/ringnova-logo-light.png" : "/ringnova-logo.png"}
        alt=""
      />
    </Link>
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
            <Link to="/services" onClick={closeMenu}>Services</Link>
            <Link to="/about" onClick={closeMenu}>About us</Link>
            <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </nav>
          <Link className="nav-cta" to="/contact" onClick={closeMenu}>
            Let’s talk <Icon name="arrowUp" size={15} />
          </Link>
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
            <p className="footer-label">Let’s connect</p>
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

function Layout({ children }) {
  const location = useLocation();

  React.useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const sections = document.querySelectorAll("#main [data-scroll-reveal]");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    sections.forEach((section) => section.classList.add("scroll-reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div id="top" />
      <Header />
      <main id="main">
        <div key={location.pathname} className="route-transition">{children}</div>
      </main>
      <Footer />
    </>
  );
}

function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow${light ? " eyebrow-light" : ""}`}><span />{children}</p>;
}

function ButtonLink({ to, children, variant = "primary" }) {
  return (
    <Link className={`button button-${variant}`} to={to}>
      {children}<Icon name="arrow" size={17} />
    </Link>
  );
}

function ServiceCard({ service, compact = false }) {
  return (
    <article className={`service-card${compact ? " service-card-compact" : ""}`}>
      <div className="service-card-top">
        <span className="service-icon"><Icon name={service.icon} /></span>
        <span className="service-number">{service.number}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      {!compact && <ArrowLink to="/services">Explore service</ArrowLink>}
    </article>
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

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <Eyebrow>YOUR PEOPLE-FIRST CALL CENTER PARTNER</Eyebrow>
            <h1>Every conversation is a chance to <em>grow.</em></h1>
            <p className="hero-description">
              Flexible customer communication for ambitious businesses. We help you show up,
              follow through, and make every conversation count.
            </p>
            <div className="hero-actions">
              <ButtonLink to="/contact">Let’s talk about your needs</ButtonLink>
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
      </section>

      <section className="intro-section section-pad" data-scroll-reveal>
        <div className="container intro-grid">
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
        </div>
      </section>

      <section className="services-section section-pad" data-scroll-reveal>
        <div className="container">
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
          <div className="service-grid">
            {services.slice(0, 4).map((service) => <ServiceCard key={service.number} service={service} />)}
          </div>
        </div>
      </section>

      <section className="approach-section" data-scroll-reveal>
        <div className="container approach-grid">
          <div className="approach-visual">
            <div className="approach-photo">
              <img
                src="/images/home-team-portrait.webp"
                alt="A customer-support professional in a calm, bright workspace"
                loading="lazy"
              />
              <div className="photo-label">Made to fit your business</div>
            </div>
            <div className="floating-language"><Icon name="globe" size={19} /><span><strong>3 languages</strong><small>One connected team</small></span></div>
          </div>
          <div className="approach-copy">
            <Eyebrow>A FLEXIBLE WAY FORWARD</Eyebrow>
            <h2>Your business isn’t <em>one-size-fits-all.</em></h2>
            <p>So your customer communication shouldn’t be either. We take time to understand how you work and shape a support approach around what your business actually needs.</p>
            <ul className="check-list">
              <li><span><Icon name="check" size={15} /></span> Responsive, reliable communication</li>
              <li><span><Icon name="check" size={15} /></span> English, French, and Arabic support</li>
              <li><span><Icon name="check" size={15} /></span> Flexible onboarding, tailored to you</li>
            </ul>
            <ButtonLink to="/about" variant="outline">How we work</ButtonLink>
          </div>
        </div>
      </section>

      <section className="languages-section" data-scroll-reveal>
        <div className="container languages-inner">
          <div><Eyebrow light>CONNECTION HAS NO BORDERS</Eyebrow><h2>Speak their language.<br /><em>Make it personal.</em></h2></div>
          <div className="language-cards">
            <div><span>EN</span><strong>English</strong><small>Clear, confident conversations</small></div>
            <div><span>FR</span><strong>Français</strong><small>Une expérience attentionnée</small></div>
            <div><span>ع</span><strong>العربية</strong><small>تواصل إنساني ومميز</small></div>
          </div>
        </div>
      </section>

      <section className="closing-section section-pad" data-scroll-reveal>
        <div className="container closing-panel">
          <div className="closing-decoration"><span /><span /><span /></div>
          <div className="closing-content">
            <Eyebrow>LET’S START A CONVERSATION</Eyebrow>
            <h2>Ready for a little more <em>breathing room?</em></h2>
            <p>Tell us what your customers need. We’ll talk through an approach that fits your business.</p>
            <ButtonLink to="/contact">Book a consultation</ButtonLink>
          </div>
          <div className="closing-aside"><Icon name="chat" size={27} /><span>It starts with<br /><strong>a hello.</strong></span><Icon name="arrowUp" size={19} /></div>
        </div>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, description, graphic, graphicClass = "", heroClass = "" }) {
  return (
    <section className={`page-hero${graphic ? " page-hero-graphic" : ""} ${heroClass}`}>
      <div className="container page-hero-inner">
        <div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p></div>
        {graphic && <div className={`page-hero-side ${graphicClass}`}>{graphic}</div>}
      </div>
    </section>
  );
}

function ServicePage() {
  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title={<>The right support.<br /><em>When it matters.</em></>}
        description="Flexible customer communication for the moments that move your business forward. Start with what you need; we’ll shape the rest together."
        graphicClass="service-photo-wrap"
        heroClass="service-page-hero"
        graphic={<img className="service-hero-photo" src="/images/services-hero.webp" alt="A support professional speaking with a customer in a bright team workspace" loading="lazy" />}
      />
      <section className="service-detail-section section-pad" data-scroll-reveal>
        <div className="container">
          <div className="service-page-intro"><Eyebrow>HOW WE CAN HELP</Eyebrow><h2>One thoughtful team.<br /><em>More ways to connect.</em></h2></div>
          <div className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.number}>
                <span className="service-row-number">{service.number}</span>
                <span className="service-row-icon"><Icon name={service.icon} /></span>
                <div><h3>{service.title}</h3><p>{service.description}</p></div>
                <Icon name="arrowUp" className="service-row-arrow" />
              </article>
            ))}
          </div>
          <div className="service-note"><span>✳</span><p>Not sure what fits? That’s what the first conversation is for. We’ll listen, learn about your business, and explore what could work.</p><ButtonLink to="/contact" variant="outline">Let’s figure it out</ButtonLink></div>
        </div>
      </section>
      <section className="service-languages" data-scroll-reveal>
        <div className="container service-languages-inner"><div><Eyebrow>YOUR CUSTOMERS, YOUR LANGUAGES</Eyebrow><h2>Connected across<br /><em>every conversation.</em></h2></div><p>Our Morocco-based team supports European businesses in English, French, and Arabic. We’ll discuss your customers, communication needs, and a suitable approach together.</p></div>
      </section>
      <CTASection />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT RINGNOVA"
        title={<>Better business starts<br />with <em>being there.</em></>}
        description="We believe the conversations around your business deserve the same care and attention you put into building it."
        graphic={<div className="about-mark"><span /><span /><span /><b>RN</b></div>}
      />
      <section className="about-story section-pad" data-scroll-reveal>
        <div className="container about-story-grid">
          <div><Eyebrow>OUR POINT OF VIEW</Eyebrow><h2>Every interaction is a chance to <em>show you care.</em></h2></div>
          <div className="about-story-copy"><p>Ringnova is a Morocco-based team helping growing businesses across Europe stay close to their customers and prospects. We bring a considered, human approach to customer support and business communication.</p><p>We know no two businesses work the same way. That’s why we start by listening—then shape a flexible way of working around your needs, your customers, and the conversations that matter to you.</p><ArrowLink to="/contact">Start a conversation</ArrowLink></div>
        </div>
      </section>
      <section className="values-section" data-scroll-reveal>
        <div className="container">
          <div className="values-heading"><Eyebrow>WHAT YOU CAN EXPECT</Eyebrow><h2>A good partner makes<br /><em>things feel simpler.</em></h2></div>
          <div className="values-grid">
            <article><span>01</span><div><h3>Reliability</h3><p>Show up with care, follow through, and make dependable communication part of the experience.</p></div></article>
            <article><span>02</span><div><h3>Responsiveness</h3><p>Stay attentive to your needs and keep communication open as your business evolves.</p></div></article>
            <article><span>03</span><div><h3>Flexibility</h3><p>Build an approach around your priorities, not a pre-set package that doesn’t fit.</p></div></article>
            <article><span>04</span><div><h3>Connection</h3><p>Support conversations in English, French, and Arabic for customers across Europe.</p></div></article>
          </div>
        </div>
      </section>
      <section className="about-team-section" data-scroll-reveal>
        <div className="container about-team-grid">
          <div className="team-art"><img src="/images/about-team.webp" alt="Three colleagues collaborating in a bright workspace" loading="lazy" /></div>
          <div><Eyebrow>A TEAM THAT STARTS BY LISTENING</Eyebrow><h2>Thoughtful people.<br /><em>Work that fits.</em></h2><p>Based in Morocco and working with businesses across Europe, our team brings a personal, multilingual approach to every partnership. We learn what matters to your business before shaping how we can help.</p><p>From onboarding onward, we keep communication clear, responsive, and tailored to your needs.</p><ButtonLink to="/contact" variant="outline">Meet your next partner</ButtonLink></div>
        </div>
      </section>
      <CTASection />
    </>
  );
}

function RequestForm() {
  const [notice, setNotice] = React.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice("This form isn’t connected yet, so your details have not been sent. Please check back soon.");
  };

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Your name<input name="name" autoComplete="name" placeholder="Alex Morgan" required /></label>
        <label>Work email<input name="email" type="email" autoComplete="email" placeholder="alex@company.com" required /></label>
      </div>
      <label>Company<input name="company" autoComplete="organization" placeholder="Your company name" required /></label>
      <label>What can we help with?
        <select name="service" defaultValue="" required>
          <option value="" disabled>Select a service</option>
          {serviceOptions.map((service) => <option key={service}>{service}</option>)}
          <option>Something else</option>
        </select>
      </label>
      <label>A little about what you need<textarea name="message" rows="4" placeholder="Tell us about your business and what you’re looking for…" required /></label>
      <button className="button button-primary form-submit" type="submit">Request a consultation <Icon name="arrow" size={17} /></button>
      {notice && <p className="form-notice" role="status">{notice}</p>}
      <p className="form-privacy">Your details won’t be stored or sent through this preview form. Read our <Link to="/privacy">privacy policy placeholder</Link>.</p>
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title={<>Tell us what’s on<br />your <em>mind.</em></>}
        description="Looking for a more thoughtful way to support your customers or grow your outreach? We’d love to hear what you have in mind."
        graphic={<div className="contact-bubble"><Icon name="chat" size={35} /><span>LET’S TALK</span><b>↗</b></div>}
      />
      <section className="contact-section section-pad" data-scroll-reveal>
        <div className="container contact-grid">
          <div className="contact-aside">
            <Eyebrow>START WITH A HELLO</Eyebrow>
            <h2>A good fit starts with a <em>good conversation.</em></h2>
            <p>Share a little about your business and what you’re looking for. We’ll use it to understand what matters to you and explore next steps together.</p>
            <div className="contact-facts">
              <div><span className="contact-fact-icon"><Icon name="globe" size={19} /></span><span><strong>Based in Morocco</strong><small>Working with businesses across Europe</small></span></div>
              <div><span className="contact-fact-icon"><Icon name="chat" size={19} /></span><span><strong>Here to listen</strong><small>Onboarding shaped around your needs</small></span></div>
              <div><span className="contact-fact-icon contact-fact-languages"><span className="fact-language">EN · FR · ع</span></span><span><strong>Speak your language</strong><small>English, French, and Arabic support</small></span></div>
            </div>
            <span className="contact-aside-foot">No pressure. Just a conversation.</span>
          </div>
          <div className="contact-form-wrap">
            <div className="form-heading"><span>01 <i /> 02</span><strong>Tell us a little about yourself</strong></div>
            <RequestForm />
          </div>
        </div>
      </section>
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="PRIVACY"
        title={<>Privacy, with<br /><em>care.</em></>}
        description="This page is a placeholder and is not a complete privacy policy. Approved legal text must be added before the site is published."
      />
      <section className="privacy-section section-pad" data-scroll-reveal>
        <div className="container privacy-content">
          <span className="placeholder-pill">POLICY PLACEHOLDER</span>
          <h2>Privacy policy to be supplied</h2>
          <p>This preview does not connect the consultation form to a backend or store submitted details. No analytics or advertising cookies have been added. These statements should be reviewed and replaced with Ringnova’s approved privacy information before launch.</p>
          <p>The final policy should explain what information is collected, why it is used, where it is stored, how long it is retained, which providers process it, and how people can exercise their rights.</p>
          <ArrowLink to="/contact">Back to contact</ArrowLink>
        </div>
      </section>
    </>
  );
}

function CTASection() {
  return (
    <section className="closing-section section-pad" data-scroll-reveal>
      <div className="container closing-panel">
        <div className="closing-decoration"><span /><span /><span /></div>
        <div className="closing-content"><Eyebrow>LET’S START A CONVERSATION</Eyebrow><h2>Let’s find an approach that <em>fits.</em></h2><p>Tell us what your business needs. We’ll take it from there, together.</p><ButtonLink to="/contact">Talk to Ringnova</ButtonLink></div>
        <div className="closing-aside"><Icon name="chat" size={27} /><span>It starts with<br /><strong>a hello.</strong></span><Icon name="arrowUp" size={19} /></div>
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>,
);
