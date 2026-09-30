import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  usePhoneInput,
  defaultCountries,
  parseCountry,
  FlagImage,
} from "react-international-phone";

/**
 * PhoneInputField
 * A custom international phone input with:
 * - Country flag dropdown
 * - Search filter for countries & dial codes
 * - Auto-detection via timezone + IP API
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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [detectedCountry, setDetectedCountry] = useState("fr"); // Default to France for European visitors
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Auto-detect country
  useEffect(() => {
    let isMounted = true;

    // 1. Instant heuristic from browser timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Casablanca")) setDetectedCountry("ma");
      else if (tz.includes("Paris")) setDetectedCountry("fr");
      else if (tz.includes("London")) setDetectedCountry("gb");
      else if (tz.includes("Berlin")) setDetectedCountry("de");
      else if (tz.includes("Madrid")) setDetectedCountry("es");
      else if (tz.includes("Rome")) setDetectedCountry("it");
      else if (tz.includes("Brussels")) setDetectedCountry("be");
      else if (tz.includes("Amsterdam")) setDetectedCountry("nl");
      else if (tz.includes("New_York") || tz.includes("Los_Angeles") || tz.includes("Chicago")) setDetectedCountry("us");
    } catch {
      // ignore
    }

    // 2. IP Geo API for high accuracy
    fetch("https://ipapi.co/json/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.country_code) {
          setDetectedCountry(data.country_code.toLowerCase());
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: detectedCountry,
      value: value || "",
      countries: defaultCountries,
      disableDialCodeAndPrefix: true,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  // Update country if detectedCountry resolves and user hasn't typed anything yet
  useEffect(() => {
    if (!value && detectedCountry) {
      setCountry(detectedCountry);
    }
  }, [detectedCountry, setCountry, value]);

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
      setTimeout(() => searchInputRef.current?.focus(), 40);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Filter countries by search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return defaultCountries;
    const q = searchQuery.toLowerCase().trim();
    return defaultCountries.filter((c) => {
      const parsed = parseCountry(c);
      return (
        parsed.name.toLowerCase().includes(q) ||
        parsed.dialCode.includes(q.replace("+", "")) ||
        parsed.iso2.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const currentCountry = country?.name ? country : (country ? parseCountry(country) : null);

  return (
    <div className="phone-field-wrap" ref={dropdownRef}>
      <div
        className={`phone-input-group ${error ? "is-invalid" : ""} ${
          isOpen ? "is-open" : ""
        } ${disabled ? "is-disabled" : ""}`}
      >
        {/* Country selector trigger button */}
        <button
          type="button"
          className="phone-country-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          title={currentCountry ? currentCountry.name : "Select country"}
        >
          {currentCountry && (
            <span className="phone-flag-icon">
              <FlagImage iso2={currentCountry.iso2} size="18px" />
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
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={handlePhoneValueChange}
          className="phone-number-input"
          aria-required="true"
          aria-invalid={!!error}
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
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or code..."
              className="phone-search-input"
            />
          </div>

          <ul className="phone-dropdown-list" role="listbox">
            {filteredCountries.length === 0 ? (
              <li className="phone-no-results">No countries found</li>
            ) : (
              filteredCountries.map((c) => {
                const parsed = parseCountry(c);
                const isSelected = parsed.iso2 === country?.iso2;
                return (
                  <li
                    key={parsed.iso2}
                    role="option"
                    aria-selected={isSelected}
                    className={`phone-country-item ${isSelected ? "is-selected" : ""}`}
                    onClick={() => {
                      setCountry(parsed.iso2);
                      setIsOpen(false);
                      setSearchQuery("");
                      inputRef.current?.focus();
                    }}
                  >
                    <span className="phone-country-flag">
                      <FlagImage iso2={parsed.iso2} size="18px" />
                    </span>
                    <span className="phone-country-name">{parsed.name}</span>
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
