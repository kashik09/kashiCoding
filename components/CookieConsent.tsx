"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for smoother UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg animate-fade-in">
      <div className="rounded-card border border-[var(--shadow)] bg-bg-card p-5 shadow-[0_4px_20px_var(--shadow-mid)]">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          this site uses cookies to enhance your experience and remember your
          preferences.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={accept}
            className="rounded-btn bg-rose px-4 py-2 font-pixel text-xs text-bg-linen transition-all hover:-translate-y-0.5 hover:bg-rose-deep"
          >
            accept
          </button>
          <button
            onClick={decline}
            className="rounded-btn border border-[var(--shadow)] px-4 py-2 font-pixel text-xs text-whisper transition-colors hover:border-rose hover:text-rose"
          >
            decline
          </button>
        </div>
      </div>
    </div>
  );
}
