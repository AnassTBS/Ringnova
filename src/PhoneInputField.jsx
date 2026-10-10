import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  usePhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import { useI18n } from "./i18n";

function countryFlagEmoji(iso2) {
  return String.fromCodePoint(...iso2.toUpperCase().split("").map((letter) => 127397 + letter.charCodeAt(0)));
}

const countryFlagImages = {
  ma: "/images/flag-ma.svg",
  fr: "/images/flag-fr.svg",
  gb: "/images/flag-en.svg",
  de: "/images/flag-de.svg",
  es: "/images/flag-es.svg",
  it: "/images/flag-it.svg",
  be: "/images/flag-be.svg",
  nl: "/images/flag-nl.svg",
  us: "/images/flag-us.svg",
};

function CountryFlag({ iso2 }) {
  const src = countryFlagImages[iso2.toLowerCase()];
  return src
    ? <img src={src} alt="" aria-hidden="true" />
    : countryFlagEmoji(iso2);
}

/**
 * PhoneInputField
 * A custom international phone input with:
 * - Country flag dropdown
 * - Search filter for countries & dial codes
 * - Timezone-based country suggestion
 * - Clean Ringnova / modern form styling
 */
export function PhoneInputField({
  value,
  onChange,
  error,
  disabled = false,
  id = "phone",
  name = "phone",
  placeholder = "1 23 45 67 89",
  autoComplete = "tel-national",
}) {
  const { language, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [detectedCountry] = useState(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Casablanca")) return "ma";
      if (tz.includes("Paris")) return "fr";
      if (tz.includes("London")) return "gb";
      if (tz.includes("Berlin")) return "de";
      if (tz.includes("Madrid")) return "es";
      if (tz.includes("Rome")) return "it";
      if (tz.includes("Brussels")) return "be";
      if (tz.includes("Amsterdam")) return "nl";
      if (tz.includes("New_York") || tz.includes("Los_Angeles") || tz.includes("Chicago")) return "us";
    } catch {
      // Use France when timezone detection is unavailable.
    }
    return "fr";
  });
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const countryButtonRef = useRef(null);

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: detectedCountry,
      value: value || "",
      countries: defaultCountries,
      disableDialCodeAndPrefix: true,
      onChange: (data) => {
        onChange(data.inputValue.trim() ? data.phone : "");
      },
    });

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      const focusTimer = setTimeout(() => searchInputRef.current?.focus(), 40);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        clearTimeout(focusTimer);
      };
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Filter countries by search query
  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([language], { type: "region" });
    } catch {
      return null;
    }
  }, [language]);

  const countryName = (parsed) => {
    try {
      return regionNames?.of(parsed.iso2.toUpperCase()) || parsed.name;
    } catch {
      return parsed.name;
    }
  };

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return defaultCountries;
    const q = searchQuery.toLowerCase().trim();
    return defaultCountries.filter((c) => {
      const parsed = parseCountry(c);
      return (
        countryName(parsed).toLowerCase().includes(q) ||
        parsed.name.toLowerCase().includes(q) ||
        parsed.dialCode.includes(q.replace("+", "")) ||
        parsed.iso2.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, language]);

  const currentCountry = country?.name ? country : (country ? parseCountry(country) : null);
  const currentCountryName = currentCountry ? countryName(currentCountry) : "";

  const selectCountry = (iso2) => {
    setCountry(iso2);
    setIsOpen(false);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery("");
      countryButtonRef.current?.focus();
      return;
    }
    if (e.key === "Tab") {
      setIsOpen(false);
      setSearchQuery("");
      return;
    }
    if (!filteredCountries.length) return;

    let nextIndex = activeIndex;
    if (e.key === "ArrowDown") nextIndex = (activeIndex + 1) % filteredCountries.length;
    else if (e.key === "ArrowUp") nextIndex = (activeIndex - 1 + filteredCountries.length) % filteredCountries.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = filteredCountries.length - 1;
    else if (e.key === "Enter") {
      e.preventDefault();
      selectCountry(parseCountry(filteredCountries[activeIndex]).iso2);
      return;
    } else return;

    e.preventDefault();
    setActiveIndex(nextIndex);
    document.getElementById(`${id}-country-${parseCountry(filteredCountries[nextIndex]).iso2}`)
      ?.scrollIntoView({ block: "nearest" });
  };

  return (
    <div className="phone-field-wrap" ref={dropdownRef}>
      <div
        className={`phone-input-group ${error ? "is-invalid" : ""} ${
          isOpen ? "is-open" : ""
        } ${disabled ? "is-disabled" : ""}`}
      >
        {/* Country selector trigger button */}
        <button
          ref={countryButtonRef}
          type="button"
          className="phone-country-btn"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setSearchQuery("");
            const selectedIndex = filteredCountries.findIndex((item) => parseCountry(item).iso2 === country?.iso2);
            setActiveIndex(Math.max(selectedIndex, 0));
          }}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? `${id}-country-list` : undefined}
          aria-label={`${t("Select country or calling code")}${currentCountry ? ` (${t("currently")} ${currentCountryName})` : ""}`}
          title={currentCountryName || t("Select country or calling code")}
        >
          {currentCountry && (
            <span className="phone-flag-icon" aria-hidden="true">
              <CountryFlag iso2={currentCountry.iso2} />
            </span>
          )}
          <span className="phone-dial-code">+{currentCountry?.dialCode}</span>
          <svg
            className={`phone-chevron ${isOpen ? "is-rotated" : ""}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* National phone input */}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="tel"
          dir="ltr"
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={handlePhoneValueChange}
          className="phone-number-input"
          aria-invalid={!!error}
          autoComplete={autoComplete}
        />
      </div>

      {/* Floating country dropdown */}
      {isOpen && (
        <div className="phone-dropdown">
          <div className="phone-dropdown-search">
            <svg
              className="phone-search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchInputRef}
              id={`${id}-country-search`}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={t("Search country or code...")}
              className="phone-search-input"
              role="combobox"
              aria-label={t("Search countries by name or calling code")}
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={`${id}-country-list`}
              aria-activedescendant={
                filteredCountries.length
                  ? `${id}-country-${parseCountry(filteredCountries[activeIndex]).iso2}`
                  : undefined
              }
            />
          </div>

          <ul className="phone-dropdown-list" id={`${id}-country-list`} role="listbox" aria-label={t("Countries")}>
            {filteredCountries.length === 0 ? (
              <li className="phone-no-results" role="option" aria-disabled="true" aria-selected="false">
                {t("No countries found")}
              </li>
            ) : (
              filteredCountries.map((c) => {
                const parsed = parseCountry(c);
                const isSelected = parsed.iso2 === country?.iso2;
                return (
                  <li
                    key={parsed.iso2}
                    id={`${id}-country-${parsed.iso2}`}
                    role="option"
                    aria-selected={isSelected}
                    className={`phone-country-item ${isSelected ? "is-selected" : ""} ${filteredCountries[activeIndex] === c ? "is-active" : ""}`}
                    onMouseEnter={() => setActiveIndex(filteredCountries.indexOf(c))}
                    onClick={() => selectCountry(parsed.iso2)}
                  >
                    <span className="phone-country-flag" aria-hidden="true">
                      <CountryFlag iso2={parsed.iso2} />
                    </span>
                    <span className="phone-country-name">{countryName(parsed)}</span>
                    <span className="phone-country-code">+{parsed.dialCode}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
