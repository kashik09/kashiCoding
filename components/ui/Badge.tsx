// components/ui/Badge.tsx
import * as React from "react";

type BadgeVariant = "default" | "secondary" | "outline";

export function Badge({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
}) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border";

  const variants: Record<BadgeVariant, string> = {
    default:
      "bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--text)/1)] border-[rgb(var(--primary)/0.25)]",
    secondary:
      "bg-[rgb(var(--surface)/1)] text-[rgb(var(--text)/1)] border-[rgb(var(--border)/1)]",
    outline:
      "bg-transparent text-[rgb(var(--text)/1)] border-[rgb(var(--border)/1)]",
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}

export default Badge;
