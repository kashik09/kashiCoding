"use client";

import { useMemo } from "react";

interface Leaf {
  left: number;
  delay: number;
  duration: number;
  color: string;
  rot: number;
  scale: number;
}

// Small deterministic PRNG (mulberry32). Using a fixed seed means the server
// and client render identical leaf positions — no Math.random() in render, so
// no hydration mismatch and no impurity.
function makeRng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function SoftLeaves({ count = 6 }: { count?: number }) {
  const leaves = useMemo<Leaf[]>(() => {
    const rand = makeRng(count * 2654435761);
    return Array.from({ length: count }).map(() => ({
      left: rand() * 100,
      delay: -rand() * 22,
      duration: 18 + rand() * 16,
      color: rand() < 0.5 ? "var(--moss)" : "var(--rose)",
      rot: rand() * 360,
      scale: 0.7 + rand() * 0.6,
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {leaves.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${l.left}%`,
            opacity: 0.18,
            animation: `leaf-fall ${l.duration}s linear ${l.delay}s infinite`,
            transform: `scale(${l.scale}) rotate(${l.rot}deg)`,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={l.color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.8.5c0 7-5 14.8-10 16.54Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6" />
          </svg>
        </div>
      ))}
    </div>
  );
}
