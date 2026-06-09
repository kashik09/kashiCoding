"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { id: "skills", href: "/skills", label: "# skills" },
  { id: "blog", href: "/blog", label: "# blog" },
  { id: "contact", href: "/contact", label: "@ contact" },
] as const;

export function Header() {
  const pathname = usePathname();

  const getCurrent = () => {
    if (pathname === "/") return "home";
    const segment = pathname.split("/")[1];
    return segment || "home";
  };

  const current = getCurrent();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b border-(--shadow) bg-bg-card px-5 shadow-[0_1px_4px_var(--shadow)] transition-colors">
      {/* Logo + Stamp */}
      <div className="flex shrink-0 items-center gap-2.5">
        <Link
          href="/"
          className="flex items-center"
          aria-label="back to home"
        >
          <LogoMark size={28} />
        </Link>
        <div className="hidden rounded-md border border-(--shadow) bg-bg-linen px-2.5 py-1 font-stamp text-[10px] uppercase tracking-widest text-whisper sm:block">
          ◆ STATUS207 · v2
        </div>
      </div>

      {/* Nav Links */}
      <nav
        className="flex flex-1 items-center justify-center gap-2 overflow-hidden font-pixel text-sm sm:gap-3.5 md:gap-4"
        aria-label="primary navigation"
      >
        {/* Home link with cherry icon */}
        <Link
          href="/"
          className={`
            group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-1 py-1.5 transition-colors
            ${current === "home" ? "text-rose" : "text-whisper hover:text-rose-deep"}
          `}
        >
          {current === "home" && (
            <span className="h-1.5 w-1.5 rounded-full bg-honey" />
          )}
          <CherryIcon className="h-4 w-4" />
          <span className="hidden sm:inline">home</span>
        </Link>

        {NAV_ITEMS.map((item) => {
          const isActive = current === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-1 py-1.5 transition-colors
                ${isActive ? "text-rose" : "text-whisper hover:text-rose-deep"}
              `}
            >
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-honey" />
              )}
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.id}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}

function ThemeToggle() {
  const cycleTheme = () => {
    const html = document.documentElement;
    const current = html.dataset.theme || "morning";
    const next =
      current === "morning" ? "dusk" : current === "dusk" ? "cabin" : "morning";
    html.dataset.theme = next;
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="flex items-center gap-2 rounded-md border border-(--shadow) bg-bg-linen px-3 py-1.5 font-pixel text-xs text-whisper transition-colors hover:border-rose-deep hover:bg-rose hover:text-bg-linen"
      aria-label="cycle theme"
    >
      <SunIcon className="h-4 w-4" />
      <span className="hidden sm:inline">theme</span>
    </button>
  );
}

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      aria-label="kashi"
    >
      <defs>
        <radialGradient id="petalShade" cx="50%" cy="78%" r="80%">
          <stop offset="0%" stopColor="#a87a72" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#a87a72" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="centerFill" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#f0d28f" />
          <stop offset="65%" stopColor="#d8b87a" />
          <stop offset="100%" stopColor="#b88a3e" />
        </radialGradient>
        <symbol id="petal" overflow="visible">
          <path
            d="M 0 -30 C -42 -34, -82 -64, -82 -114 C -82 -158, -50 -190, -16 -198 C -10 -200, -6 -198, -4 -192 L -2 -184 L 0 -200 L 2 -184 L 4 -192 C 6 -198, 10 -200, 16 -198 C 50 -190, 82 -158, 82 -114 C 82 -64, 42 -34, 0 -30 Z"
            fill="#c89a92"
            stroke="#4a4238"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M 0 -30 C -42 -34, -82 -64, -82 -114 C -82 -158, -50 -190, -16 -198 C -10 -200, -6 -198, -4 -192 L -2 -184 L 0 -200 L 2 -184 L 4 -192 C 6 -198, 10 -200, 16 -198 C 50 -190, 82 -158, 82 -114 C 82 -64, 42 -34, 0 -30 Z"
            fill="url(#petalShade)"
          />
          <ellipse cx="-22" cy="-150" rx="14" ry="28" fill="#e5c4be" opacity="0.7" transform="rotate(-18 -22 -150)" />
        </symbol>
      </defs>
      <g transform="translate(256 270)">
        <g>
          <use href="#petal" transform="rotate(0)" />
          <use href="#petal" transform="rotate(72)" />
          <use href="#petal" transform="rotate(144)" />
          <use href="#petal" transform="rotate(216)" />
          <use href="#petal" transform="rotate(288)" />
        </g>
        <g stroke="#4a4238" strokeWidth="3.5" strokeLinecap="round">
          <line x1="0" y1="-6" x2="0" y2="-58" />
          <g transform="rotate(36)"><line x1="0" y1="-6" x2="0" y2="-48" /></g>
          <g transform="rotate(72)"><line x1="0" y1="-6" x2="0" y2="-58" /></g>
          <g transform="rotate(108)"><line x1="0" y1="-6" x2="0" y2="-48" /></g>
          <g transform="rotate(144)"><line x1="0" y1="-6" x2="0" y2="-58" /></g>
          <g transform="rotate(180)"><line x1="0" y1="-6" x2="0" y2="-58" /></g>
          <g transform="rotate(216)"><line x1="0" y1="-6" x2="0" y2="-48" /></g>
          <g transform="rotate(252)"><line x1="0" y1="-6" x2="0" y2="-58" /></g>
          <g transform="rotate(288)"><line x1="0" y1="-6" x2="0" y2="-48" /></g>
          <g transform="rotate(324)"><line x1="0" y1="-6" x2="0" y2="-58" /></g>
        </g>
        <g fill="#d8b87a" stroke="#4a4238" strokeWidth="1.8">
          <circle cx="0" cy="-60" r="4.5" />
          <g transform="rotate(36)"><circle cx="0" cy="-50" r="4" /></g>
          <g transform="rotate(72)"><circle cx="0" cy="-60" r="4.5" /></g>
          <g transform="rotate(108)"><circle cx="0" cy="-50" r="4" /></g>
          <g transform="rotate(144)"><circle cx="0" cy="-60" r="4.5" /></g>
          <g transform="rotate(180)"><circle cx="0" cy="-60" r="4.5" /></g>
          <g transform="rotate(216)"><circle cx="0" cy="-50" r="4" /></g>
          <g transform="rotate(252)"><circle cx="0" cy="-60" r="4.5" /></g>
          <g transform="rotate(288)"><circle cx="0" cy="-50" r="4" /></g>
          <g transform="rotate(324)"><circle cx="0" cy="-60" r="4.5" /></g>
        </g>
        <circle r="22" fill="url(#centerFill)" stroke="#4a4238" strokeWidth="4" />
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

function CherryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512">
      <defs>
        <radialGradient id="petalShadeSmall" cx="50%" cy="78%" r="80%">
          <stop offset="0%" stopColor="#a87a72" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#a87a72" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="centerFillSmall" cx="50%" cy="42%" r="55%">
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
        <circle r="22" fill="url(#centerFillSmall)" stroke="#4a4238" strokeWidth="4" />
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

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export default Header;
