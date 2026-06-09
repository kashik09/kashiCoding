"use client";

import { useEffect, useState, useCallback } from "react";
import { SoftLeaves } from "@/components/ambient/SoftLeaves";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleStart = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!showSplash) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleStart();
      }
    };

    const handleClick = () => handleStart();

    window.addEventListener("keydown", handleKey);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("click", handleClick);
    };
  }, [showSplash, handleStart]);

  // Show main content
  if (!showSplash) {
    return <>{children}</>;
  }

  // Splash screen
  return (
    <div
      className={`fixed inset-0 z-200 flex items-center justify-center bg-bg-page transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <SoftLeaves count={5} />

      <div className="relative z-10 max-w-[760px] px-8 text-center">
        {/* Overline */}
        <p className="mb-6 font-pixel text-[13px] uppercase tracking-[0.18em] text-whisper">
          ◆ a portfolio adventure ◆
        </p>

        {/* Title */}
        <h1 className="font-serif text-[clamp(60px,11vw,132px)] font-medium italic leading-none tracking-[-0.03em] text-ink">
          status<span className="not-italic text-rose">.</span>207
        </h1>

        {/* Rule */}
        <div className="mx-auto my-8 h-0.5 w-20 rounded-full bg-rose" />

        {/* Tagline */}
        <p className="mx-auto max-w-[520px] font-mono text-[17px] leading-relaxed text-whisper">
          a cozy, slightly gamified portfolio.
          <br />
          made with care by <span className="text-ink">kashi kweyu</span>.
        </p>

        {/* Start Button */}
        <div className="mt-14">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStart();
            }}
            className="inline-flex items-center gap-2 rounded-pill bg-rose px-7 py-4 font-pixel text-base text-bg-linen shadow-[0_4px_20px_var(--shadow-mid)] transition-all hover:-translate-y-0.5 hover:bg-rose-deep"
          >
            press
            <span className="rounded bg-bg-linen/20 px-2 py-0.5 font-mono text-sm">
              SPACE
            </span>
            to begin
          </button>
        </div>
      </div>

      {/* Footer hint */}
      <p className="absolute bottom-6 left-0 right-0 z-10 text-center font-mono text-xs text-whisper">
        sound on · ♥ <span className="text-rose">made warmly</span>
      </p>
    </div>
  );
}
