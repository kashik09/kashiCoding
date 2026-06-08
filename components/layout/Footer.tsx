"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROOMS = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/shop", label: "shop" },
] as const;

const SOCIAL = [
  { href: "https://github.com/kashik09", label: "github", external: true },
  { href: "https://twitter.com/kashikweyu", label: "twitter", external: true },
  { href: "/contact", label: "letter →", external: false },
] as const;

export function Footer() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <footer className="mt-12 border-t border-[var(--shadow)] bg-bg-card px-6 py-8 font-mono text-xs text-whisper transition-colors">
      <div className="mx-auto grid max-w-[960px] grid-cols-2 gap-8 sm:grid-cols-4">
        {/* Brand Column */}
        <div className="col-span-2 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <LogoMark size={24} />
            <span className="font-serif text-sm italic text-ink">
              kashi.quest
            </span>
          </div>
          <div className="leading-relaxed">
            a portfolio adventure.
            <br />
            made cozily in kampala.
          </div>
        </div>

        {/* Rooms Column */}
        <div>
          <div className="mb-2 font-pixel text-[11px] uppercase tracking-widest text-rose">
            ROOMS
          </div>
          <div className="flex flex-col gap-1.5">
            {ROOMS.map((room) => (
              <Link
                key={room.href}
                href={room.href}
                className={`transition-colors hover:text-rose ${
                  isActive(room.href) ? "text-rose" : ""
                }`}
              >
                {room.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Find Me Column */}
        <div>
          <div className="mb-2 font-pixel text-[11px] uppercase tracking-widest text-rose">
            FIND ME
          </div>
          <div className="flex flex-col gap-1.5">
            {SOCIAL.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-rose"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-rose"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Status Row */}
      <div className="mx-auto mt-8 flex max-w-[960px] items-center justify-between border-t border-[var(--shadow)] pt-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-moss shadow-[0_0_0_3px_rgba(168,187,150,0.3)]" />
          <span>available for projects</span>
        </div>
        <div className="text-[11px] opacity-70">
          © {new Date().getFullYear()} kashi kweyu
        </div>
      </div>
    </footer>
  );
}

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      aria-label="kashi"
    >
      {/* wax seal with bumpy edges */}
      <path
        d="M100 10
           q14 4 28 -2 q-6 14 4 26
           q14 4 14 18 q0 14 -14 18
           q-10 12 -4 26 q-14 -6 -28 -2
           q-14 4 -28 2 q6 -14 -4 -26
           q-14 -4 -14 -18 q0 -14 14 -18
           q10 -12 4 -26 q14 6 28 2 z"
        fill="var(--rose)"
      />
      {/* kk monogram */}
      <text
        x="100"
        y="118"
        fontFamily="var(--font-pixel), sans-serif"
        fontSize="74"
        fontWeight="600"
        fill="var(--bg-linen)"
        textAnchor="middle"
        letterSpacing="-2"
      >
        kk
      </text>
      {/* cherry blossom petals */}
      <g transform="translate(146 150)" opacity="0.85">
        <ellipse cx="0" cy="-9" rx="6" ry="9" fill="var(--bg-linen)" transform="rotate(0)" />
        <ellipse cx="0" cy="-9" rx="6" ry="9" fill="var(--bg-linen)" transform="rotate(72)" />
        <ellipse cx="0" cy="-9" rx="6" ry="9" fill="var(--bg-linen)" transform="rotate(144)" />
        <ellipse cx="0" cy="-9" rx="6" ry="9" fill="var(--bg-linen)" transform="rotate(216)" />
        <ellipse cx="0" cy="-9" rx="6" ry="9" fill="var(--bg-linen)" transform="rotate(288)" />
        <circle r="3" fill="var(--honey)" />
      </g>
    </svg>
  );
}

export default Footer;
