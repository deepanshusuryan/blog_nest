"use client"
import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import "../styles/theme-switcher.css";

const themeOptions = [
  { name: "amber",  label: "Amber",  color: "#C8871A" },
  { name: "green",  label: "Green",  color: "#2E7D52" },
  { name: "blue",   label: "Blue",   color: "#2563EB" },
  { name: "pink",   label: "Pink",   color: "#C2185B" },
  { name: "white",  label: "Mono",   color: "#555555" },
  { name: "brown",  label: "Brown",  color: "#8B4513" },
];

export const ThemeSwitcher = () => {
  const { theme, changeTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = themeOptions.find((t) => t.name === theme);

  return (
    <div className="ts-wrap" ref={ref}>
      <button
        className={`ts-trigger${open ? " ts-trigger--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        title="Change theme"
      >
        {/* Palette icon */}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5"  cy="7.5"  r=".5" fill="currentColor"/>
          <circle cx="6.5"  cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
        {/* Active color dot */}
        <span className="ts-active-dot" style={{ background: current?.color }} />
      </button>

      {open && (
        <div className="ts-panel">
          <p className="ts-panel-label">Choose theme</p>
          <div className="ts-grid">
            {themeOptions.map((t) => (
              <button
                key={t.name}
                className={`ts-swatch${theme === t.name ? " ts-swatch--active" : ""}`}
                onClick={() => { changeTheme(t.name); setOpen(false); }}
                title={t.label}
              >
                <span className="ts-swatch-dot" style={{ background: t.color }} />
                <span className="ts-swatch-label">{t.label}</span>
                {theme === t.name && (
                  <svg className="ts-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};