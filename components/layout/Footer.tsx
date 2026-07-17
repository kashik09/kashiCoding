"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROOMS = [
  { href: "/", label: "home" },
  { href: "/skills", label: "skills" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact" },
] as const;

const SOCIAL = [
  { href: "https://github.com/kashik09", label: "github", external: true },
  { href: "/contact", label: "letter →", external: false },
] as const;

export function Footer() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <footer className="mt-12 border-t border-(--shadow) bg-bg-card px-6 py-8 font-mono text-xs text-whisper transition-colors">
      <div className="mx-auto grid max-w-240 grid-cols-2 gap-8 sm:grid-cols-4">
        {/* Brand Column */}
        <div className="col-span-2 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <LogoMark size={24} />
            <span className="font-serif text-sm italic text-ink">
              status207
            </span>
          </div>
          <div className="leading-relaxed">
            a portfolio adventure.
            <br />
            hosted somewhere between curiosity and caffeine ☕.
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
      <div className="mx-auto mt-8 flex max-w-240 items-center justify-between border-t border-(--shadow) pt-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose shadow-[0_0_0_3px_rgba(184,146,143,0.3)]" />
          <span>very busy, working on other projects</span>
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
      viewBox="0 0 512 512"
      aria-label="kashi"
    >
      <defs>
        <radialGradient id="centerFillFooter" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#f0d28f" />
          <stop offset="65%" stopColor="#d8b87a" />
          <stop offset="100%" stopColor="#b88a3e" />
        </radialGradient>
      </defs>
      <g transform="translate(256 270)">
        {/* petals */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              d="M 0 -30 C -42 -34, -82 -64, -82 -114 C -82 -158, -50 -190, -16 -198 C -10 -200, -6 -198, -4 -192 L -2 -184 L 0 -200 L 2 -184 L 4 -192 C 6 -198, 10 -200, 16 -198 C 50 -190, 82 -158, 82 -114 C 82 -64, 42 -34, 0 -30 Z"
              fill="#c89a92"
              stroke="#4a4238"
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </g>
        ))}
        {/* center */}
        <circle r="22" fill="url(#centerFillFooter)" stroke="#4a4238" strokeWidth="4" />
        <g fill="#4a4238">
          <circle cx="-7" cy="-5" r="1.8" />
          <circle cx="6" cy="-6" r="1.6" />
          <circle cx="8" cy="4" r="1.8" />
          <circle cx="-5" cy="7" r="1.6" />
          <circle cx="0" cy="0" r="1.8" />
        </g>
      </g>
    </svg>
  );
}

export default Footer;
