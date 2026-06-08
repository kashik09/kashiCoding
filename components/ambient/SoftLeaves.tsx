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

export function SoftLeaves({ count = 6 }: { count?: number }) {
  const leaves = useMemo<Leaf[]>(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: -Math.random() * 22,
        duration: 18 + Math.random() * 16,
        color: Math.random() < 0.5 ? "var(--moss)" : "var(--rose)",
        rot: Math.random() * 360,
        scale: 0.7 + Math.random() * 0.6,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
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
