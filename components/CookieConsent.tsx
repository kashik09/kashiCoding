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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/50 backdrop-blur-sm animate-fade-in">
      <div className="mx-4 max-w-md rounded-card border border-(--shadow) bg-bg-card p-6 shadow-[0_8px_32px_var(--shadow-mid)]">
        <p className="mb-4 text-center font-mono text-sm leading-relaxed text-ink">
          this site uses cookies to enhance your experience and remember your
          preferences.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={accept}
            className="rounded-btn bg-rose px-5 py-2.5 font-pixel text-xs text-bg-linen transition-all hover:-translate-y-0.5 hover:bg-rose-deep"
          >
            accept
          </button>
          <button
            onClick={decline}
            className="rounded-btn border border-(--shadow) px-5 py-2.5 font-pixel text-xs text-whisper transition-colors hover:border-rose hover:text-rose"
          >
            decline
          </button>
        </div>
      </div>
    </div>
  );
}
