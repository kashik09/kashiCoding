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
      viewBox="0 0 32 32"
      fill="none"
      className="text-rose"
    >
      <path
        d="M16 28c0-8 6-14 6-14s-3 1-6 1-6-1-6-1 6 6 6 14z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M16 4c-4 6-8 10-8 16 0 4 3.5 8 8 8s8-4 8-8c0-6-4-10-8-16z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16 12v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 16c2-1 4-1 6 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Footer;
