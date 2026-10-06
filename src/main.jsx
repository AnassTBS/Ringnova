import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./styles.css";
import { LANGUAGES, pageMetadata } from "./translations";
import { LanguageProvider, useI18n } from "./i18n";
import { careersContacts, jobs, proposedCareersContent, verifiedCareersContent } from "./careersData";

const PhoneInputField = React.lazy(() =>
  import("./PhoneInputField").then((module) => ({ default: module.PhoneInputField })),
);

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
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    arrowUp: <path d="M7 17 17 7M7 7h10v10" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function ServiceIllustration({ type }) {
  const common = {
    className: "service-illustration-art",
    viewBox: "0 0 64 64",
    fill: "none",
    "aria-hidden": true,
  };

  const scenes = {
    chat: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <path d="M13 20.5A13.5 13.5 0 0 1 26.5 7h15A13.5 13.5 0 0 1 55 20.5v5A13.5 13.5 0 0 1 41.5 39H29l-9 6v-8.2A13.4 13.4 0 0 1 13 25.5v-5Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 23h.1M32 23h.1M40 23h.1" stroke="#164F43" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M37 43.5A9.5 9.5 0 0 1 46.5 34h4A9.5 9.5 0 0 1 60 43.5v1A9.5 9.5 0 0 1 50.5 54H45l-6 4v-6a9.4 9.4 0 0 1-2-7.5Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m49 39 .9 2.2 2.1.8-2.1.8L49 46l-.9-2.2-2.1-.8 2.1-.8L49 39Z" fill="#A5C96A" />
      </>
    ),
    phone: (
      <>
        <circle cx="32" cy="32" r="29" fill="#F2F0E4" />
        <path d="M17 25a15 15 0 0 1 30 0" stroke="#164F43" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M16 24h5v15h-5a4 4 0 0 1-4-4v-7a4 4 0 0 1 4-4ZM48 24h-5v15h5a4 4 0 0 0 4-4v-7a4 4 0 0 0-4-4Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <path d="M45 40a11 11 0 0 1-11 10h-3" stroke="#164F43" strokeWidth="2" strokeLinecap="round" />
        <rect x="26" y="47" width="8" height="6" rx="3" fill="#D4EF72" />
        <path d="M22 17a12 12 0 0 1 20 0" stroke="#A5C96A" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    spark: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <circle cx="27" cy="23" r="8" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" />
        <path d="M12 51a15 15 0 0 1 30 0v3H12v-3Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="48" cy="20" r="9" fill="#D4EF72" />
        <path d="M48 15v10M43 20h10M47 19h2v2h-2z" stroke="#164F43" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m46 37 2 2 4-5" stroke="#164F43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    calendar: (
      <>
        <circle cx="32" cy="32" r="29" fill="#F2F0E4" />
        <rect x="14" y="14" width="36" height="38" rx="6" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" />
        <path d="M23 11v9M41 11v9M14 25h36" stroke="#164F43" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M23 33h5v5h-5z" fill="#D9EEE2" />
        <path d="m34 35 3 3 6-7" stroke="#164F43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 43h5" stroke="#A5C96A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="49" cy="47" r="8" fill="#D4EF72" />
        <path d="m46 47 2 2 4-4" stroke="#164F43" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    wave: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <path d="M18 23a19 19 0 0 1 28 0M23 29a12 12 0 0 1 18 0" stroke="#A5C96A" strokeWidth="2" strokeLinecap="round" />
        <path d="m23 34 7-4 5 5 7-4" stroke="#164F43" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 42.5V40a14 14 0 0 1 28 0v2.5" stroke="#164F43" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="15" y="40" width="7" height="12" rx="3.5" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" />
        <rect x="42" y="40" width="7" height="12" rx="3.5" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" />
        <path d="M42 52a10 10 0 0 1-10 8h-2" stroke="#164F43" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    languages: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <path d="M15 18.5A8.5 8.5 0 0 1 23.5 10h15a8.5 8.5 0 0 1 0 17h-7l-6 4v-5A8.5 8.5 0 0 1 15 18.5Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <path d="M26 18.5h.1M31 18.5h.1M36 18.5h.1" stroke="#164F43" strokeWidth="3" strokeLinecap="round" />
        <path d="M31 39.5A8.5 8.5 0 0 1 39.5 31h7a8.5 8.5 0 0 1 0 17h-4l-6 4v-5.5a8.5 8.5 0 0 1-5.5-7Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="40" cy="39.5" r="1" fill="#A5C96A" />
        <circle cx="44" cy="39.5" r="1" fill="#A5C96A" />
      </>
    ),
    trust: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <path d="m32 11 17 6v13c0 11-7.2 19.1-17 23-9.8-3.9-17-12-17-23V17l17-6Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m23.5 31.5 5.5 5.5 11.5-12" stroke="#164F43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="48" cy="17" r="7" fill="#D4EF72" />
        <path d="m48 13 .9 2.1 2.1.9-2.1.9L48 20l-.9-2.1-2.1-.9 2.1-.9L48 13Z" fill="#164F43" />
      </>
    ),
    reliability: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <path d="m32 11 17 6v13c0 11-7.2 19.1-17 23-9.8-3.9-17-12-17-23V17l17-6Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m23.5 31.5 5.5 5.5 11.5-12" stroke="#164F43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="48" cy="17" r="7" fill="#D4EF72" />
      </>
    ),
    responsiveness: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <path d="M12 20.5A12.5 12.5 0 0 1 24.5 8h17A12.5 12.5 0 0 1 54 20.5v3A12.5 12.5 0 0 1 41.5 36H28l-9 6v-8.1A12.4 12.4 0 0 1 12 23.5v-3Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 22h.1M32 22h.1M40 22h.1" stroke="#164F43" strokeWidth="3.5" strokeLinecap="round" />
        <path d="m47 42 1.3 3.2 3.2 1.3-3.2 1.3L47 51l-1.3-3.2-3.2-1.3 3.2-1.3L47 42Z" fill="#A5C96A" />
      </>
    ),
    flexibility: (
      <>
        <circle cx="32" cy="32" r="29" fill="#F2F0E4" />
        <rect x="14" y="15" width="36" height="34" rx="7" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" />
        <path d="M22 25h20M22 39h20" stroke="#A5C96A" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="29" cy="25" r="4" fill="#D4EF72" stroke="#164F43" strokeWidth="2" />
        <circle cx="37" cy="39" r="4" fill="#D9EEE2" stroke="#164F43" strokeWidth="2" />
        <path d="m47 13 .9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" fill="#164F43" />
      </>
    ),
    connection: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <path d="M9 21.5A10.5 10.5 0 0 1 19.5 11h16A10.5 10.5 0 0 1 46 21.5v2A10.5 10.5 0 0 1 35.5 34H23l-8 5v-7.2A10.4 10.4 0 0 1 9 23.5v-2Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 45a8 8 0 0 1 8-8h12a8 8 0 0 1 0 16h-8l-6 4v-6a8 8 0 0 1-6-6Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="20" cy="22" r="1.5" fill="#A5C96A" />
        <circle cx="27" cy="22" r="1.5" fill="#A5C96A" />
        <circle cx="34" cy="22" r="1.5" fill="#A5C96A" />
      </>
    ),
    location: (
      <>
        <circle cx="32" cy="32" r="29" fill="#F2F0E4" />
        <path d="M32 53s16-15.1 16-29a16 16 0 1 0-32 0c0 13.9 16 29 16 29Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="32" cy="24" r="7" fill="#D9EEE2" stroke="#164F43" strokeWidth="2" />
        <path d="m32 19 1.2 3h3l-2.4 1.7.9 3-2.7-1.8-2.7 1.8.9-3-2.4-1.7h3L32 19Z" fill="#A5C96A" />
      </>
    ),
    europe: (
      <>
        <circle cx="32" cy="32" r="29" fill="#EAF2E8" />
        <circle cx="31" cy="31" r="18" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" />
        <path d="M13 31h36M31 13a29 29 0 0 1 0 36M31 13a29 29 0 0 0 0 36" stroke="#A5C96A" strokeWidth="1.7" />
        <path d="M45 39a8 8 0 0 1 8 8c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 8-8Z" fill="#D4EF72" stroke="#164F43" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="45" cy="47" r="2.3" fill="#164F43" />
      </>
    ),
  };

  return <svg {...common}>{scenes[type]}</svg>;
}

function CareerAreaIcon({ type }) {
  const line = { fill: "none", stroke: "#164F43", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const scenes = {
    "customer-experience": (
      <>
        <path d="M8 10a6 6 0 0 1 6-6h9a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6h-7l-5 3v-5a6 6 0 0 1-3-5Z" {...line} />
        <path d="M13 10h.1m5 0h.1m5 0h.1" {...line} strokeWidth="2.8" />
        <path d="M22 22h5m-2.5-2.5V25" {...line} stroke="#90B85C" />
      </>
    ),
    sales: (
      <>
        <path d="M7 26h26" {...line} />
        <path d="M10 23v-6h5v6m4 0V12h5v11m4 0V7h5v16" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m9 13 7-4 5 1 8-6m-1 0h3v3" {...line} stroke="#90B85C" />
      </>
    ),
    telemarketing: (
      <>
        <path d="M8 19v-3a12 12 0 0 1 24 0v3" {...line} />
        <path d="M9 16h4v9h-3a3 3 0 0 1-3-3v-3a3 3 0 0 1 2-3Zm22 0h-4v9h3a3 3 0 0 0 3-3v-3a3 3 0 0 0-2-3Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M27 25a7 7 0 0 1-7 6h-2" {...line} />
        <rect x="16" y="29" width="5" height="3" rx="1.5" fill="#D4EF72" stroke="#164F43" strokeWidth="1.4" />
      </>
    ),
    "lead-generation": (
      <>
        <path d="M7 8h26l-10 11v7l-6 4V19L7 8Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M27 25v5m-2.5-2.5h5m-1-15 .8 1.8 1.7.7-1.7.7-.8 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" {...line} stroke="#90B85C" />
      </>
    ),
    "appointment-setting": (
      <>
        <rect x="7" y="9" width="26" height="23" rx="4" fill="#FFFEFA" stroke="#164F43" strokeWidth="1.8" />
        <path d="M13 6v6m14-6v6M7 16h26" {...line} />
        <path d="m14 23 3 3 6-6" {...line} stroke="#90B85C" strokeWidth="2.2" />
      </>
    ),
    operations: (
      <>
        <circle cx="20" cy="20" r="11" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.8" />
        <circle cx="20" cy="20" r="4" fill="#FFFEFA" stroke="#164F43" strokeWidth="1.7" />
        <path d="M20 6v4m0 20v4M6 20h4m20 0h4M10 10l3 3m14 14 3 3m0-20-3 3m-14 14-3 3" {...line} />
        <path d="m18 20 1.5 1.5L23 18" {...line} stroke="#90B85C" />
      </>
    ),
    "back-office": (
      <>
        <path d="M7 12h11l3 3h12v14H7V12Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 9h10l3 3m-9 8h13m-13 4h9" {...line} />
        <path d="M25 18h5" {...line} stroke="#90B85C" />
      </>
    ),
    "corporate-support": (
      <>
        <path d="M7 14 20 6l13 8M10 14v16m7-16v16m6-16v16m7-16v16M7 30h26" {...line} />
        <path d="M5 33h30" {...line} stroke="#90B85C" strokeWidth="2.2" />
        <circle cx="20" cy="11" r="1.4" fill="#D4EF72" />
      </>
    ),
  };

  return (
    <svg className="careers-area-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#EDF3E7" />
      {scenes[type]}
    </svg>
  );
}

function CareerQualityIcon({ type }) {
  const line = { fill: "none", stroke: "#164F43", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const scenes = {
    communication: (
      <>
        <path d="M8 12.5A8.5 8.5 0 0 1 16.5 4h8A8.5 8.5 0 0 1 33 12.5v2a8.5 8.5 0 0 1-8.5 8.5h-7l-6 4v-6.1A8.4 8.4 0 0 1 8 14.5v-2Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M15 13h.1m5 0h.1m5 0h.1" stroke="#164F43" strokeWidth="3" strokeLinecap="round" />
        <path d="m28 26 1.1 2.5 2.5 1.1-2.5 1.1L28 33l-1.1-2.3-2.5-1.1 2.5-1.1L28 26Z" fill="#A5C96A" />
      </>
    ),
    "customer-mindset": (
      <>
        <path d="M20 29S7 21.2 7 12.5a6.4 6.4 0 0 1 11.6-3.8A6.4 6.4 0 0 1 30 12.5C30 21.2 20 29 20 29Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="m17 17 2.2 2.2 4.8-5" {...line} strokeWidth="2" />
        <circle cx="30" cy="9" r="5" fill="#D4EF72" />
        <path d="m30 6.5.7 1.7 1.8.7-1.8.7-.7 1.9-.7-1.9-1.8-.7 1.8-.7.7-1.7Z" fill="#164F43" />
      </>
    ),
    reliability: (
      <>
        <path d="m20 7 12 4v8c0 7-5 12-12 15-7-3-12-8-12-15v-8l12-4Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" strokeLinejoin="round" />
        <path d="m13.5 19.5 4.2 4.2 9-10" {...line} strokeWidth="2.7" />
        <circle cx="31" cy="10" r="5" fill="#D4EF72" />
      </>
    ),
    curiosity: (
      <>
        <circle cx="17" cy="17" r="10" fill="#FFFEFA" stroke="#164F43" strokeWidth="2" />
        <path d="m24.5 24.5 7 7" {...line} strokeWidth="3" />
        <path d="M17 11v7m-3.5-3.5h7" {...line} stroke="#A5C96A" strokeWidth="2" />
        <circle cx="29" cy="9" r="4" fill="#D4EF72" />
      </>
    ),
    teamwork: (
      <>
        <circle cx="20" cy="13" r="5" fill="#FFFEFA" stroke="#164F43" strokeWidth="1.8" />
        <circle cx="9.5" cy="16" r="4" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.7" />
        <circle cx="30.5" cy="16" r="4" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.7" />
        <path d="M10 31a10 10 0 0 1 20 0v2H10v-2Z" fill="#D9EEE2" stroke="#164F43" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4.5 30a6 6 0 0 1 6-6m25 6a6 6 0 0 0-6-6" {...line} />
        <path d="M18 24h4" {...line} stroke="#A5C96A" strokeWidth="2.4" />
      </>
    ),
    adaptability: (
      <>
        <path d="M29 13a11 11 0 0 0-18-3l-3 3m0 0V8m0 5h5M11 27a11 11 0 0 0 18 3l3-3m0 0v5m0-5h-5" {...line} strokeWidth="2.2" />
        <circle cx="20" cy="20" r="5" fill="#FFFEFA" stroke="#164F43" strokeWidth="1.7" />
        <path d="m20 16 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" fill="#A5C96A" />
      </>
    ),
    learning: (
      <>
        <path d="M20 12c-4-3-8-4-13-3v20c5-1 9 0 13 3 4-3 8-4 13-3V9c-5-1-9 0-13 3Z" fill="#FFFEFA" stroke="#164F43" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M20 12v20m-9-15 5 1m-5 4 5 1m8-6 5-1m-5 5 5-1" {...line} stroke="#A5C96A" strokeWidth="1.7" />
      </>
    ),
  };

  return (
    <svg className="careers-quality-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#EAF2E8" />
      {scenes[type]}
    </svg>
  );
}

function WhatsAppLogo({ size = 21 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.888-9.884 2.64.001 5.12 1.03 6.988 2.899a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.438 9.883-9.886 9.883m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 0 5.495 0 12.05a11.98 11.98 0 0 0 1.634 6.034L.001 24l6.056-1.589a12.05 12.05 0 0 0 5.99 1.526h.005c6.554 0 12.05-5.495 12.05-12.05a11.98 11.98 0 0 0-3.638-8.399Z" />
    </svg>
  );
}

/* ─── Shared UI ─────────────────────────────────────────────────────────── */

function Brand({ light = false }) {
  const { t } = useI18n();
  return (
    <SmartNavLink
      to="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label={t("Rangnova home")}
    >
      <span className="brand-mark-wrap">
        <img
          className="brand-mark"
          src={light ? "/rangnova-mark-light.webp" : "/rangnova-mark.webp"}
          alt=""
        />
        <RingnovaStar size={12} className="brand-star-flare" />
      </span>
      <span className="brand-wordmark" aria-hidden="true">
        <span>Rang</span><span className="brand-wordmark-accent">nova</span>
      </span>
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
function SmartNavLink({ to, onClick, children, className = "", ...rest }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainNavLink = className.split(" ").includes("main-nav-link");
  const isActive = to === "/"
    ? location.pathname === "/"
    : location.pathname === to || (to === "/careers" && location.pathname.startsWith("/careers/"));

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
    <Link
      to={to}
      onClick={handleClick}
      className={`${className}${isMainNavLink && isActive ? " is-active" : ""}`}
      aria-current={isMainNavLink && isActive ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { language, setLanguage, t } = useI18n();
  const menuToggleRef = React.useRef(null);
  const closeMenu = () => setMenuOpen(false);

  React.useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !event.target.closest?.(".language-switcher")) {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleLanguageSelect = () => {
    closeMenu();
    if (window.matchMedia("(max-width: 700px)").matches) {
      menuToggleRef.current?.focus();
    }
  };

  return (
    <header className={`site-header${scrolled ? " header-scrolled" : ""}`}>
      <div className={`container header-inner${menuOpen ? " header-menu-open" : ""}`}>
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          ref={menuToggleRef}
          aria-label={t(menuOpen ? "Close navigation menu" : "Open navigation menu")}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <div className="header-actions">
          <nav className="main-nav" id="primary-navigation" aria-label={t("Main navigation")}>
            <SmartNavLink className="main-nav-link" to="/" onClick={closeMenu}>{t("Home")}</SmartNavLink>
            <SmartNavLink className="main-nav-link" to="/services" onClick={closeMenu}>{t("Services")}</SmartNavLink>
            <SmartNavLink className="main-nav-link" to="/about" onClick={closeMenu}>{t("About us")}</SmartNavLink>
            <SmartNavLink className="main-nav-link" to="/careers" onClick={closeMenu}>{t("Careers")}</SmartNavLink>
            <SmartNavLink className="main-nav-link" to="/contact" onClick={closeMenu}>{t("Contact")}</SmartNavLink>
          </nav>
          <div className="header-tools">
            <LanguageSwitcher onSelect={handleLanguageSelect} />
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
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
        event.preventDefault();
        const options = [...(rootRef.current?.querySelectorAll(".language-option") || [])];
        const focusedIndex = options.indexOf(document.activeElement);
        const currentIndex = focusedIndex < 0 ? activeIndex : focusedIndex;
        const next = event.key === "Home"
          ? 0
          : event.key === "End"
            ? LANGUAGES.length - 1
            : (currentIndex + (event.key === "ArrowDown" ? 1 : LANGUAGES.length - 1)) % LANGUAGES.length;
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
        aria-controls={isOpen ? "language-switcher-menu" : undefined}
        onClick={() => {
          const nextIsOpen = !isOpen;
          setIsOpen(nextIsOpen);
          if (nextIsOpen) {
            requestAnimationFrame(() => {
              rootRef.current?.querySelector('[aria-checked="true"]')?.focus();
            });
          }
        }}
      >
        <FlagIcon code={language} />
        <svg className={`language-chevron${isOpen ? " is-open" : ""}`} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="m2 4.5 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="language-switcher-menu" id="language-switcher-menu" role="menu" aria-label={t("Language")}>
          {LANGUAGES.map(({ code, name }) => (
            <button
              className={`language-option${code === language ? " is-active" : ""}`}
              type="button"
              role="menuitemradio"
              aria-label={name}
              aria-checked={code === language}
              key={code}
              onClick={() => {
                setLanguage(code);
                setIsOpen(false);
                triggerRef.current?.focus();
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
            <Link to="/about">{t("About Rangnova")}</Link>
            <Link to="/careers">{t("Careers")}</Link>
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
          <span>© {new Date().getFullYear()} Rangnova. {t("All rights reserved.")}</span>
          <Link to="/privacy">{t("Privacy policy")}</Link>
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
        <span className="service-icon"><ServiceIllustration type={service.icon} /></span>
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

function BrandOrbit() {
  return (
    <div className="about-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <div className="about-mark-star"><RingnovaStar size={34} /></div>
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
        alt={t("A smiling customer-support professional wearing a headset")}
        loading="eager"
        fetchpriority="high"
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
              <span className="proof-avatars" aria-hidden="true">
                <span className="proof-avatar proof-avatar-primary" />
                <span className="proof-avatar proof-avatar-teammate" />
                <span className="proof-avatar proof-avatar-colleague" />
                <i>+</i>
              </span>
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
              {t("Growing a business means showing up for every customer, prospect, and opportunity. Rangnova gives you a responsive team to help make those conversations happen—without losing the personal touch.")}
            </p>
            <ArrowLink to="/about">{t("Get to know Rangnova")}</ArrowLink>
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
              <span className="decorative-illustration floating-language-art"><ServiceIllustration type="languages" /></span><span><strong>{t("3 languages")}</strong><small>{t("One connected team")}</small></span>
            </div>
          </div>
          <div className="approach-copy">
            <Eyebrow>{t("A FLEXIBLE WAY FORWARD")}</Eyebrow>
            <h2>{t("Your business isn't ")}<em>{t("one-size-fits-all.")}</em></h2>
            <p>{t("So your customer communication shouldn't be either. We take time to understand how you work and shape a support approach around what your business actually needs.")}</p>
            <ul className="check-list">
              <li><span className="decorative-illustration check-list-illustration"><ServiceIllustration type="trust" /></span> {t("Responsive, reliable communication")}</li>
              <li><span className="decorative-illustration check-list-illustration"><ServiceIllustration type="trust" /></span> {t("English, French, and Arabic support")}</li>
              <li><span className="decorative-illustration check-list-illustration"><ServiceIllustration type="trust" /></span> {t("Flexible onboarding, tailored to you")}</li>
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
            <span className="decorative-illustration closing-aside-art"><ServiceIllustration type="chat" /></span><span>{t("It starts with")}<br /><strong>{t("a hello.")}</strong></span><Icon name="arrowUp" size={19} />
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
          <Eyebrow>{eyebrow}</Eyebrow>
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
          <span className="service-row-icon"><ServiceIllustration type={service.icon} /></span>
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
        graphic={<img className="service-hero-photo" src="/images/services-hero.webp" alt={t("Customer support colleagues wearing headsets at work")} loading="eager" fetchpriority="high" />}
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
    { num: "01", title: "Reliability", body: "Show up with care, follow through, and make dependable communication part of the experience.", illustration: "reliability" },
    { num: "02", title: "Responsiveness", body: "Stay attentive to your needs and keep communication open as your business evolves.", illustration: "responsiveness" },
    { num: "03", title: "Flexibility", body: "Build an approach around your priorities, not a pre-set package that doesn't fit.", illustration: "flexibility" },
    { num: "04", title: "Connection", body: "Support conversations in English, French, and Arabic for customers across Europe.", illustration: "connection" },
  ];

  return (
    <div className="values-grid">
      {values.map((v) => (
        <article key={v.num}>
          <div className="values-card-top">
            <span className="values-card-art"><ServiceIllustration type={v.illustration} /></span>
            <span className="values-card-number">{v.num}</span>
          </div>
          <div className="values-card-copy"><h3>{t(v.title)}</h3><p>{t(v.body)}</p></div>
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
        eyebrow={t("ABOUT RANGNOVA")}
        title={<>{t("Better business starts")}<br />{t("with ")}<em>{t("being there.")}</em></>}
        description={t("We believe the conversations around your business deserve the same care and attention you put into building it.")}
        graphicClass="about-hero-photo-wrap"
        graphic={<img className="about-hero-photo" src="/images/about-hero.webp" alt={t("A customer-support headset and workstation ready for a conversation")} loading="eager" fetchpriority="high" />}
      />
      <section className="about-story section-pad">
        <Reveal className="container about-story-grid">
          <div>
            <Eyebrow>{t("OUR POINT OF VIEW")}</Eyebrow>
            <h2>{t("Every interaction is a chance to ")}<em>{t("show you care.")}</em></h2>
          </div>
          <div className="about-story-copy">
            <p>{t("Rangnova is a Morocco-based team helping growing businesses across Europe stay close to their customers and prospects. We bring a considered, human approach to customer support and business communication.")}</p>
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
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
    if (!formData.consent) errs.consent = "Please agree to submit your inquiry to Rangnova.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementsByName(firstKey)[0];
      if (el) el.focus();
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success !== true) {
        setSubmitError("We couldn’t send your inquiry right now. Please try again.");
        return;
      }

      setSubmitted(true);
      setSubmitError("");
    } catch {
      setSubmitError("We couldn’t send your inquiry right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    setSubmitError("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="form-success-card" role="status">
        <div className="form-success-star">
          <RingnovaStar size={36} />
        </div>
        <h3>{t("Your inquiry has been sent")}</h3>
        <p className="form-success-lead">
          {t("Thanks,")} <strong>{formData.firstName}</strong>. {t("Your inquiry has been submitted successfully and our team will be in touch soon.")}
        </p>
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
              {t("First Name")} <span className="required-star" aria-hidden="true">*</span>
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
              {t("Last Name")} <span className="required-star" aria-hidden="true">*</span>
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
              {t("Work Email")} <span className="required-star" aria-hidden="true">*</span>
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
            <React.Suspense
              fallback={
                <div className="phone-input-group">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    dir="ltr"
                    placeholder="1 23 45 67 89"
                    value={formData.phone}
                    onChange={handleChange}
                    className="phone-number-input"
                  />
                </div>
              }
            >
              <PhoneInputField
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                placeholder="1 23 45 67 89"
              />
            </React.Suspense>
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
          <label htmlFor="message">{t("Briefly describe the challenge you want Rangnova to help you with...")}</label>
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
        <div className="consent-label">
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
            <label htmlFor="consent">
              {t("I agree that the details I provided will be sent to Rangnova so the team can respond to my inquiry. See the")}
            </label>{" "}
            <Link to="/privacy">{t("Privacy Policy")}</Link>.             <span className="required-star" aria-hidden="true">*</span>
          </span>
        </div>
        {errors.consent && <span className="field-error" id="consent-error">{t(errors.consent)}</span>}
      </div>

      {/* ── CTA Submit Button ── */}
      <div className="form-actions">
        <button
          className="button button-primary form-submit-btn"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("Sending...") : t("SEND EMAIL")}
          <RingnovaStar size={16} className="btn-star-icon" />
        </button>
        {submitError && (
          <p className="field-error" role="alert">
            {t(submitError)}
          </p>
        )}
        <p className="form-privacy-note">
          {t("Selecting Send Email sends your inquiry directly to ringnovasales@gmail.com. Our team will review it and get back to you.")}
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
                      <img src="/images/morocco.webp" alt={t("Morocco flag")} className="contact-lang-flag-img" width={44} height={44} />
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
                      <img src="/images/icon-listen.webp" alt={t("Here to listen")} className="contact-lang-flag-img" width={44} height={44} />
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
  const sections = [
    ["privacy.infoTitle", "privacy.infoBody"],
    ["privacy.purposeTitle", "privacy.purposeBody"],
    ["privacy.deliveryTitle", "privacy.deliveryBody"],
    ["privacy.technicalTitle", "privacy.technicalBody"],
    ["privacy.providersTitle", "privacy.providersBody"],
    ["privacy.retentionTitle", "privacy.retentionBody"],
    ["privacy.rightsTitle", "privacy.rightsBody"],
    ["privacy.changesTitle", "privacy.changesBody"],
  ];
  return (
    <>
      <PageHero
        eyebrow={t("PRIVACY")}
        title={<>{t("privacyTitleFirst")}<br /><em>{t("privacyTitleEmphasis")}</em></>}
        description={t("privacy.pageDescription")}
        graphic={<BrandOrbit />}
      />
      <section className="privacy-section section-pad">
        <Reveal className="container privacy-content">
          <h2>{t("Privacy Policy")}</h2>
          <p>{t("privacy.introBody")}</p>
          {sections.map(([title, body]) => (
            <section key={title} aria-labelledby={title}>
              <h3 id={title}>{t(title)}</h3>
              <p>{t(body)}</p>
            </section>
          ))}
          <ArrowLink to="/contact">{t("privacy.contactLink")}</ArrowLink>
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
        graphic={<BrandOrbit />}
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

function CareersHero() {
  const { t } = useI18n();
  return (
    <HeroEntrance as="section" className="careers-hero">
      <div className="container careers-hero-inner">
        <div className="careers-hero-copy">
          <Eyebrow>{t("careers.hero.eyebrow")}</Eyebrow>
          <h1>{t("careers.hero.headline")}</h1>
          <p>{t("careers.hero.body")}</p>
          <div className="careers-hero-actions">
            <a className="button button-primary" href="#careers-positions">
              {t("careers.hero.positions")}<Icon name="arrow" size={17} />
            </a>
            <a className="arrow-link" href="#careers-recruitment">
              {t("careers.hero.future")}<Icon name="arrow" size={17} />
            </a>
          </div>
        </div>
        <div className="careers-hero-art">
          <img
            className="careers-hero-photo"
            src="/images/about-team.webp"
            alt={t("Three colleagues collaborating in a bright workspace")}
            loading="eager"
            fetchpriority="high"
          />
          <div className="careers-hero-photo-shade" aria-hidden="true" />
          <div className="careers-hero-photo-stamp" aria-hidden="true">
            <RingnovaStar size={22} />
            <span>RANGNOVA</span>
          </div>
          <span className="careers-hero-art-caption">{t("careers.hero.artCaption")}</span>
        </div>
      </div>
      <div className="careers-hero-edge" />
    </HeroEntrance>
  );
}

function WhyRingnovaSection() {
  const { t } = useI18n();
  const illustrations = ["location", "europe", "languages"];
  return (
    <section className="careers-why section-pad">
      <Reveal className="container careers-why-grid">
        <div className="careers-why-heading">
          <Eyebrow>{t("careers.why.eyebrow")}</Eyebrow>
          <h2>{t("careers.why.title")}</h2>
        </div>
        <div className="careers-why-copy">
          <p>{t("careers.why.body")}</p>
          <ul className="careers-facts">
            {verifiedCareersContent.employerFacts.map((fact, index) => (
              <li key={fact.id}>
                <span className="careers-fact-art" aria-hidden="true">
                  <ServiceIllustration type={illustrations[index]} />
                </span>
                <strong>{t(fact.textKey)}</strong>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

function CareerAreasSection() {
  const { t } = useI18n();
  return (
    <section className="careers-areas section-pad">
      <Reveal className="container">
        <div className="careers-section-intro careers-areas-intro">
          <div>
            <Eyebrow>{t("careers.areas.eyebrow")}</Eyebrow>
            <h2>{t("careers.areas.title")}</h2>
          </div>
          <p>{t("careers.areas.body")}</p>
        </div>
        <ul className="careers-area-list">
          {verifiedCareersContent.careerAreas.map((area) => (
            <li key={area.id}>
              <CareerAreaIcon type={area.id} />
              <strong>{t(area.textKey)}</strong>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function CareersOpenPositions() {
  const { t, language } = useI18n();
  const publishedJobs = React.useMemo(
    () => jobs.filter((job) => job.status === "published"),
    [],
  );
  const [filters, setFilters] = React.useState({
    keyword: "",
    locationKey: "",
    departmentKey: "",
    languageKey: "",
    employmentTypeKey: "",
  });

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };
  const resetFilters = () => {
    setFilters({
      keyword: "",
      locationKey: "",
      departmentKey: "",
      languageKey: "",
      employmentTypeKey: "",
    });
  };
  const optionsFor = (key) => [...new Set(
    publishedJobs.flatMap((job) => (key === "languageKeys" ? (job[key] || []) : [job[key]]).filter(Boolean)),
  )];

  const filteredJobs = React.useMemo(() => {
    const normalizedKeyword = filters.keyword.trim().toLocaleLowerCase(language);
    return publishedJobs.filter((job) => {
      const text = [
        job.titleKey,
        job.overviewKey,
        job.departmentKey,
        job.locationKey,
        job.employmentTypeKey,
        ...(job.languageKeys || []),
      ].filter(Boolean).map((key) => t(key).toLocaleLowerCase(language)).join(" ");
      return (!normalizedKeyword || text.includes(normalizedKeyword))
        && (!filters.locationKey || job.locationKey === filters.locationKey)
        && (!filters.departmentKey || job.departmentKey === filters.departmentKey)
        && (!filters.languageKey || (job.languageKeys || []).includes(filters.languageKey))
        && (!filters.employmentTypeKey || job.employmentTypeKey === filters.employmentTypeKey);
    });
  }, [filters, language, publishedJobs, t]);

  return (
    <section className="careers-positions section-pad" id="careers-positions" aria-labelledby="careers-positions-title">
      <Reveal className="container">
        <div className="careers-positions-heading">
          <div>
            <Eyebrow>{t("careers.positions.eyebrow")}</Eyebrow>
            <h2 id="careers-positions-title">{t("careers.positions.title")}</h2>
          </div>
          {publishedJobs.length > 0 && (
            <p className="careers-positions-count" aria-live="polite">{filteredJobs.length}</p>
          )}
        </div>
        {publishedJobs.length === 0 ? (
          <div className="careers-empty-state">
            <span className="careers-empty-star" aria-hidden="true"><RingnovaStar size={23} /></span>
            <div>
              <p>{t("careers.positions.empty")}</p>
              <a className="arrow-link" href="#careers-recruitment">
                {t("careers.positions.join")}<Icon name="arrow" size={17} />
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="careers-job-filters" role="search" aria-label={t("careers.positions.title")}>
              <div className="form-field careers-job-search">
                <label htmlFor="careers-keyword">{t("careers.positions.keyword")}</label>
                <input
                  id="careers-keyword"
                  type="search"
                  placeholder={t("careers.positions.keywordPlaceholder")}
                  value={filters.keyword}
                  onChange={(event) => updateFilter("keyword", event.target.value)}
                />
              </div>
              {[
                ["locationKey", "locationKey", "careers.positions.location"],
                ["departmentKey", "departmentKey", "careers.positions.department"],
                ["languageKey", "languageKeys", "careers.positions.language"],
                ["employmentTypeKey", "employmentTypeKey", "careers.positions.employmentType"],
              ].map(([filterName, dataKey, labelKey]) => (
                <div className="form-field" key={filterName}>
                  <label htmlFor={`careers-${filterName}`}>{t(labelKey)}</label>
                  <select
                    id={`careers-${filterName}`}
                    value={filters[filterName]}
                    onChange={(event) => updateFilter(filterName, event.target.value)}
                  >
                    <option value="">{t("careers.positions.any")}</option>
                    {optionsFor(dataKey).map((key) => (
                      <option key={key} value={key}>{t(key)}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button className="careers-reset-filters" type="button" onClick={resetFilters}>
                {t("careers.positions.reset")}
              </button>
            </div>
            {filteredJobs.length === 0 ? (
              <p className="careers-job-no-match" role="status">{t("careers.positions.noMatch")}</p>
            ) : (
              <div className="careers-job-list">
                {filteredJobs.map((job) => (
                  <article className="careers-job-card" key={job.slug}>
                    <div>
                      <h3><Link to={`/careers/${job.slug}`}>{t(job.titleKey)}</Link></h3>
                      <p>{t(job.overviewKey)}</p>
                      <ul className="careers-job-metadata">
                        {[
                          ["locationKey", "careers.positions.location"],
                          ["departmentKey", "careers.positions.department"],
                          ["employmentTypeKey", "careers.positions.employmentType"],
                        ].filter(([key]) => job[key]).map(([key, label]) => (
                          <li key={key}><span>{t(label)}:</span> {t(job[key])}</li>
                        ))}
                        {(job.languageKeys || []).length > 0 && (
                          <li key="languages"><span>{t("careers.positions.language")}:</span> {job.languageKeys.map((key) => t(key)).join(", ")}</li>
                        )}
                      </ul>
                    </div>
                    <Link className="arrow-link" to={`/careers/${job.slug}`}>
                      {t("careers.positions.viewRole")}<Icon name="arrow" size={17} />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </Reveal>
    </section>
  );
}

function CandidateQualitiesSection() {
  const { t } = useI18n();
  return (
    <section className="careers-qualities section-pad">
      <Reveal className="container careers-qualities-inner">
        <div className="careers-qualities-heading">
          <Eyebrow>{t("careers.qualities.eyebrow")}</Eyebrow>
          <h2>{t("careers.qualities.title")}</h2>
          <p>{t("careers.qualities.body")}</p>
        </div>
        <ul className="careers-quality-list">
          {verifiedCareersContent.candidateQualities.map((quality) => (
            <li key={quality.id}>
              <CareerQualityIcon type={quality.id} />
              {t(quality.textKey)}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function GrowthSection() {
  const { t } = useI18n();
  return (
    <section className="careers-growth section-pad">
      <Reveal className="container careers-growth-inner">
        <Eyebrow light>{t("careers.growth.eyebrow")}</Eyebrow>
        <h2>{t("careers.growth.title")}</h2>
        <p>{t("careers.growth.body")}</p>
      </Reveal>
    </section>
  );
}

function LifeAtRingnovaSection() {
  const { t } = useI18n();
  return (
    <section className="careers-life section-pad">
      <Reveal className="container careers-life-inner">
        <div className="careers-life-copy">
          <Eyebrow>{t("careers.life.eyebrow")}</Eyebrow>
          <h2>{t("careers.life.title")}</h2>
          <p>{t("careers.life.body")}</p>
        </div>
        <div className="careers-life-art">
          <div className="careers-life-photo-frame">
            <img
              className="careers-life-photo"
              src="/images/home-team-portrait.webp"
              alt={t("A customer-support professional in a calm, bright workspace")}
              loading="lazy"
            />
          </div>
          <div className="careers-life-photo-accent" aria-hidden="true" />
          <div className="careers-life-art-note">
            <RingnovaStar size={27} />
            <span>{t("careers.life.visual")}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function HiringProcessSection() {
  const { t } = useI18n();
  return (
    <section className="careers-hiring section-pad">
      <Reveal className="container">
        <div className="careers-hiring-heading">
          <div>
            <Eyebrow>{t("careers.hiring.eyebrow")}</Eyebrow>
            <h2>{t("careers.hiring.title")}</h2>
          </div>
          <p>{t("careers.hiring.note")}</p>
        </div>
        <ol className="careers-hiring-steps">
          {proposedCareersContent.recruitmentSteps.map((step, index) => (
            <li key={step.id}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <strong>{t(step.textKey)}</strong>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

function RecruitmentCTASection() {
  const { t } = useI18n();
  const applicationHref = `mailto:${careersContacts.applicationEmail}?subject=${encodeURIComponent("Spontaneous Application – Rangnova")}`;
  return (
    <section className="careers-recruitment section-pad" id="careers-recruitment" aria-labelledby="careers-recruitment-title">
      <Reveal className="container careers-recruitment-panel">
        <div className="careers-recruitment-mark" aria-hidden="true"><RingnovaStar size={36} /></div>
        <div className="careers-recruitment-copy">
          <Eyebrow light>{t("careers.recruitment.eyebrow")}</Eyebrow>
          <h2 id="careers-recruitment-title">{t("careers.recruitment.title")}</h2>
          <p>{t("careers.recruitment.body")}</p>
          <ol className="careers-application-steps">
            {["open", "cv", "letter", "send"].map((step) => (
              <li key={step}>{t(`careers.recruitment.step.${step}`)}</li>
            ))}
          </ol>
          <a className="button button-outline careers-recruitment-link" href={applicationHref} target="_blank" rel="noopener noreferrer">
            {t("careers.recruitment.sendApplication")}<Icon name="arrow" size={17} />
          </a>
          <p className="careers-recruitment-email">
            {t("careers.recruitment.emailFallback")}{" "}
            <a href={applicationHref} target="_blank" rel="noopener noreferrer">{careersContacts.applicationEmail}</a>
          </p>
        </div>
        <div className="careers-recruitment-decoration" aria-hidden="true"><span /><span /><span /></div>
      </Reveal>
    </section>
  );
}

function CareersFAQ() {
  const { t } = useI18n();
  const [openId, setOpenId] = React.useState(null);
  return (
    <section className="careers-faq-section section-pad">
      <Reveal className="container careers-faq-inner">
        <div className="careers-faq-heading">
          <Eyebrow>{t("careers.faq.eyebrow")}</Eyebrow>
          <h2>{t("careers.faq.title")}</h2>
        </div>
        <div className="careers-faq-list">
          {verifiedCareersContent.faq.map((item, index) => {
            const isOpen = openId === item.id;
            const answerId = `careers-faq-answer-${item.id}`;
            return (
              <div className={`careers-faq-item${isOpen ? " is-open" : ""}`} key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span className="careers-faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span>{t(item.questionKey)}</span>
                  <span className="careers-faq-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                <div className="careers-faq-answer" id={answerId} hidden={!isOpen}>
                  <p>{t(item.answerKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function RecruitmentSafetySection() {
  const { t } = useI18n();
  return (
    <section className="careers-safety">
      <div className="container careers-safety-inner">
        <span className="careers-safety-icon decorative-illustration" aria-hidden="true"><ServiceIllustration type="trust" /></span>
        <div>
          <h2>{t("careers.safety.title")}</h2>
          <p>{t("careers.safety.body")}</p>
        </div>
      </div>
    </section>
  );
}

function CareersFinalCTA() {
  const { t } = useI18n();
  return (
    <section className="careers-final section-pad">
      <Reveal className="container careers-final-inner">
        <div>
          <Eyebrow light>{t("careers.final.eyebrow")}</Eyebrow>
          <h2>{t("careers.final.title")}</h2>
        </div>
        <div className="careers-final-actions">
          <a className="button button-primary" href="#careers-positions">
            {t("careers.final.positions")}<Icon name="arrow" size={17} />
          </a>
          <a className="button button-outline" href="#careers-recruitment">
            {t("careers.final.future")}<Icon name="arrow" size={17} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function CareersPage() {
  return (
    <div className="careers-page">
      <CareersHero />
      <WhyRingnovaSection />
      <CareerAreasSection />
      <CareersOpenPositions />
      <CandidateQualitiesSection />
      <GrowthSection />
      <LifeAtRingnovaSection />
      <HiringProcessSection />
      <RecruitmentCTASection />
      <CareersFAQ />
      <RecruitmentSafetySection />
      <CareersFinalCTA />
    </div>
  );
}

function CareersJobDetailPage() {
  const { jobSlug } = useParams();
  const { t } = useI18n();
  const job = jobs.find((item) => item.slug === jobSlug && item.status === "published");
  if (!job) return <NotFoundPage />;

  const detailSections = [
    ["overviewKey", "careers.job.overview", job.overviewKey ? [job.overviewKey] : []],
    ["responsibilities", "careers.job.responsibilities", job.responsibilities || []],
    ["requirements", "careers.job.requirements", job.requirements || []],
    ["benefitKeys", "careers.job.benefits", job.benefitKeys || []],
    ["recruitmentProcessKeys", "careers.job.process", job.recruitmentProcessKeys || []],
  ].filter(([, , content]) => content.length > 0);

  return (
    <>
      <PageHero
        eyebrow={t("careers.positions.eyebrow")}
        title={t(job.titleKey)}
        description={t(job.overviewKey)}
      />
      <section className="careers-job-detail section-pad">
        <div className="container">
          <ul className="careers-job-metadata careers-job-detail-metadata">
            {[
              ["locationKey", "careers.positions.location"],
              ["departmentKey", "careers.positions.department"],
              ["employmentTypeKey", "careers.positions.employmentType"],
            ].filter(([key]) => job[key]).map(([key, label]) => (
              <li key={key}><span>{t(label)}:</span> {t(job[key])}</li>
            ))}
            {(job.languageKeys || []).length > 0 && (
              <li key="languages"><span>{t("careers.positions.language")}:</span> {job.languageKeys.map((key) => t(key)).join(", ")}</li>
            )}
          </ul>
          {detailSections.map(([key, headingKey, content]) => (
            <section className="careers-job-detail-section" key={key}>
              <h2>{t(headingKey)}</h2>
              {key === "overviewKey" ? (
                <p>{t(content[0])}</p>
              ) : (
                <ul>{content.map((item) => <li key={item}>{t(item)}</li>)}</ul>
              )}
            </section>
          ))}
          <div className="careers-job-apply">
            <div className="careers-job-contact-actions">
              {careersContacts.emailApplicationsEnabled && careersContacts.applicationEmail ? (
                <>
                  <a
                    className="button button-primary"
                    href={`mailto:${careersContacts.applicationEmail}?subject=${encodeURIComponent(`${t("careers.job.emailSubjectPrefix")}: ${t(job.titleKey)}`)}&body=${encodeURIComponent(`${t("careers.job.emailGreeting")}\n\n${t("careers.job.emailBodyIntro")} ${t(job.titleKey)}.\n\n${t("careers.job.emailBodyOutro")}`)}`}
                  >
                    {t("careers.job.applyEmail")}<Icon name="arrow" size={17} />
                  </a>
                  <p className="careers-job-email-note">
                    {t("careers.job.emailInstruction")}{" "}
                    <a href={`mailto:${careersContacts.applicationEmail}`}>{careersContacts.applicationEmail}</a>
                  </p>
                </>
              ) : (
                <p>{t("careers.job.applicationUnavailable")}</p>
              )}
              {careersContacts.whatsappNumber && (
                <a
                  className="arrow-link"
                  href={`https://wa.me/${careersContacts.whatsappNumber}?text=${encodeURIComponent(`${t("careers.job.whatsAppMessage")} ${t(job.titleKey)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("careers.job.askWhatsApp")}<Icon name="arrow" size={17} />
                </a>
              )}
            </div>
            <Link className="arrow-link" to="/careers">{t("Careers")}<Icon name="arrow" size={17} /></Link>
          </div>
        </div>
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
          <ButtonLink to="/contact">{t("Talk to Rangnova")}</ButtonLink>
        </div>
        <div className="closing-aside">
          <span className="decorative-illustration closing-aside-art"><ServiceIllustration type="chat" /></span><span>{t("It starts with")}<br /><strong>{t("a hello.")}</strong></span><Icon name="arrowUp" size={19} />
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
    const jobSlug = path.startsWith("/careers/") ? path.slice("/careers/".length) : "";
    const job = jobSlug ? jobs.find((item) => item.slug === jobSlug && item.status === "published") : null;
    const metadata = pageMetadata[language]?.[path]
      || pageMetadata.en[path]
      || (job ? [t(job.titleKey), t(job.overviewKey)] : undefined);
    const description = document.querySelector('meta[name="description"]');
    let robots = document.querySelector('meta[name="robots"]');

    // Set title and description
    document.title = metadata?.[0] || t("PAGE NOT FOUND") + " | Rangnova";
    if (description) {
      description.content = metadata?.[1] || t("The page may have moved, or the address may be incorrect.");
    }

    // Set Open Graph meta tags
    const setOrCreateMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    if (metadata) {
      const title = metadata[0];
      const desc = metadata[1];
      const pageUrl = `https://rangnova.com${path === "/" ? "" : path}`;

      setOrCreateMeta("og:title", title, true);
      setOrCreateMeta("og:description", desc, true);
      setOrCreateMeta("og:type", "website", true);
      setOrCreateMeta("og:url", pageUrl, true);
      setOrCreateMeta("og:image", "https://rangnova.com/rangnova-mark.webp", true);
      setOrCreateMeta("twitter:title", title);
      setOrCreateMeta("twitter:description", desc);
      setOrCreateMeta("twitter:card", "summary_large_image");
      setOrCreateMeta("twitter:image", "https://rangnova.com/rangnova-mark.webp");

      // Set canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = pageUrl;
    }

    // Handle robots meta tag for non-indexed pages
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
    <AnimatePresence mode="wait" initial={location.pathname === "/"}>
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
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:jobSlug" element={<CareersJobDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AmbientStars() {
  const [particles] = React.useState(() =>
    Array.from({ length: 22 }, (_, index) => {
      const duration = 20 + Math.random() * 26;
      return {
        id: index,
        left: `${Math.random() * 100}%`,
        size: `${2 + Math.random() * 3}px`,
        duration: `${duration}s`,
        delay: `${-Math.random() * duration}s`,
        opacity: 0.28 + Math.random() * 0.35,
        drift: `${Math.random() * 36 - 18}px`,
        rotation: `${Math.random() * 90 - 45}deg`,
        sparkle: Math.random() > 0.55,
      };
    }),
  );

  return (
    <div className="ambient-stars" aria-hidden="true">
      {particles.map((particle) => (
        <span
          className={`ambient-star${particle.sparkle ? " is-sparkle" : ""}`}
          key={particle.id}
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDuration: particle.duration,
            animationDelay: particle.delay,
            "--particle-opacity": particle.opacity,
            "--particle-drift": particle.drift,
            "--particle-rotation": particle.rotation,
          }}
        />
      ))}
    </div>
  );
}

function Layout() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const showWhatsAppWidget = pathname === "/contact" || pathname.startsWith("/careers");
  const whatsappContactUrl = `https://wa.me/${careersContacts.whatsappNumber}`;
  return (
    <>
      <AmbientStars />
      <a className="skip-link" href="#main">{t("Skip to content")}</a>
      <div id="top" />
      <Header />
      <main id="main">
        <AnimatedRoutes />
      </main>
      <Footer />
      {showWhatsAppWidget && (
        <a
          className="whatsapp-float"
          href={whatsappContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("Chat with us on WhatsApp")}
        >
          <span className="whatsapp-float-icon"><WhatsAppLogo size={22} /></span>
          <span className="whatsapp-float-label" aria-hidden="true">{t("Chat with us on WhatsApp")}</span>
        </a>
      )}
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
