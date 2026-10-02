import React from "react";
import { LANGUAGES, messages } from "./translations";

const LanguageContext = React.createContext(null);

export function useI18n() {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error("useI18n must be used within LanguageProvider.");
  return context;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = React.useState(() => {
    try {
      const saved = window.localStorage.getItem("ringnova-language");
      return LANGUAGES.some(({ code }) => code === saved) ? saved : "en";
    } catch {
      return "en";
    }
  });

  React.useLayoutEffect(() => {
    const selectedLanguage = LANGUAGES.find(({ code }) => code === language);
    document.documentElement.lang = selectedLanguage?.documentTag || "en";
    document.documentElement.dir = selectedLanguage?.direction || "ltr";
  }, [language]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem("ringnova-language", language);
    } catch {
      // Language selection remains available for the current session.
    }
  }, [language]);

  const t = React.useCallback((text) => messages[language]?.[text] || text, [language]);
  const value = React.useMemo(() => ({ language, setLanguage, t }), [language, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
