"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { id: "projects", href: "/projects", label: "[ projects ]" },
  { id: "about", href: "/about", label: "<about/>" },
  { id: "skills", href: "/skills", label: "# skills" },
  { id: "blog", href: "/blog", label: "# blog" },
  { id: "shop", href: "/shop", label: "$ shop" },
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
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b border-[var(--shadow)] bg-bg-card px-5 shadow-[0_1px_4px_var(--shadow)] transition-colors">
      {/* Logo + Stamp */}
      <div className="flex shrink-0 items-center gap-2.5">
        <Link
          href="/"
          className="flex items-center"
          aria-label="back to home"
        >
          <LogoMark size={28} />
        </Link>
        <div className="hidden rounded-md border border-[var(--shadow)] bg-bg-linen px-2.5 py-1 font-stamp text-[10px] uppercase tracking-widest text-whisper sm:block">
          ◆ KASHI.QUEST · v2
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
      className="flex items-center gap-2 rounded-md border border-[var(--shadow)] bg-bg-linen px-3 py-1.5 font-pixel text-xs text-whisper transition-colors hover:border-rose-deep hover:bg-rose hover:text-bg-linen"
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
      viewBox="0 0 32 32"
      fill="none"
      className="text-rose transition-colors hover:text-rose-deep"
    >
      {/* Simple leaf/sprout mark */}
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

function CherryIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M16 28c0-8 6-14 6-14s-3 1-6 1-6-1-6-1 6 6 6 14z"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="none"
      />
      <path d="M16 4c-4 6-8 10-8 16 0 4 3.5 8 8 8s8-4 8-8c0-6-4-10-8-16z" fill="none" />
      <path d="M16 12v12" />
      <path d="M13 16c2-1 4-1 6 0" strokeWidth="1.5" />
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
