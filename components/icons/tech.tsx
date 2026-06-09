import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function TypeScriptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="4" fill="#3178c6" />
      <path
        d="M22.8 19.2c0-1.4-.9-2.1-2.6-2.6l-1-.4c-.9-.4-1.2-.6-1.2-1.1 0-.4.3-.8 1.1-.8.7 0 1.2.3 1.6.9l1.4-1c-.6-1-1.6-1.5-3-1.5-1.8 0-3 1.1-3 2.5 0 1.5.9 2.2 2.4 2.6l1.1.4c1 .4 1.3.7 1.3 1.2 0 .6-.5 1-1.4 1-.9 0-1.6-.5-2-1.2l-1.5.9c.6 1.2 1.8 2 3.5 2 2 0 3.3-1 3.3-2.9zM14 14h-2v8h-2v-8H8v-1.7h6V14z"
        fill="#fff"
      />
    </svg>
  );
}

export function JavaScriptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="4" fill="#f7df1e" />
      <path
        d="M9 22.4l1.8-1.1c.3.6.7 1 1.4 1 .7 0 1.1-.3 1.1-1.4v-7.6h2.2v7.7c0 2.3-1.3 3.3-3.3 3.3-1.7 0-2.8-.9-3.2-2zm7.6-.3l1.8-1c.4.7 1 1.2 2 1.2.8 0 1.4-.4 1.4-1 0-.7-.6-1-1.5-1.4l-.5-.2c-1.5-.6-2.5-1.4-2.5-3.1 0-1.5 1.2-2.7 3-2.7 1.3 0 2.2.5 2.9 1.6l-1.6 1c-.4-.6-.7-.9-1.3-.9-.6 0-1 .4-1 .9 0 .6.4.9 1.3 1.2l.5.2c1.8.8 2.8 1.5 2.8 3.3 0 1.9-1.5 2.9-3.5 2.9-2 0-3.2-.9-3.8-2z"
        fill="#000"
      />
    </svg>
  );
}

export function PythonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M15.9 3c-1.8 0-3.4.2-4.7.5-3.8.9-4.5 2.9-4.5 5.4v4h9v1.4H7.3c-2.6 0-4.9 1.6-5.6 4.6-.8 3.4-.8 5.6 0 9.2.6 2.7 2 4.6 4.6 4.6h3v-4.2c0-3 2.6-5.6 5.6-5.6h9c2.5 0 4.5-2.1 4.5-4.5v-8.5c0-2.4-2-4.2-4.5-4.6C22.3 3.2 17.7 3 15.9 3zm-4.9 3.2c.9 0 1.7.8 1.7 1.7 0 1-.8 1.7-1.7 1.7-1 0-1.7-.8-1.7-1.7 0-1 .8-1.7 1.7-1.7z"
        fill="#3776ab"
      />
      <path
        d="M25.3 14.3v4c0 3.1-2.7 5.8-5.6 5.8h-9c-2.4 0-4.5 2.1-4.5 4.5v8.5c0 2.4 1.9 3.8 4.5 4.5 3 .8 5.9.9 9 0 2.1-.6 4.5-1.9 4.5-4.5v-3.4h-9v-1.1h13.5c2.6 0 3.6-1.8 4.5-4.6.9-2.9.9-5.6 0-9.2-.6-2.6-1.9-4.5-4.5-4.5h-3.4zM21 28.5c1 0 1.7.7 1.7 1.7 0 .9-.8 1.7-1.7 1.7-1 0-1.7-.8-1.7-1.7 0-1 .8-1.7 1.7-1.7z"
        fill="#ffd43b"
      />
    </svg>
  );
}

export function ReactIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="2.5" fill="#61dafb" />
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#61dafb" strokeWidth="1.5" fill="none" />
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)" />
    </svg>
  );
}

export function NextJsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="14" fill="#000" />
      <path d="M13 10v12l8-12v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function TailwindIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M16 8c-4 0-6.5 2-7.5 6 1.5-2 3.2-2.7 5.2-2.2 1.2.3 2 1.1 2.9 2 1.5 1.5 3.3 3.2 7.1 3.2 4 0 6.5-2 7.5-6-1.5 2-3.2 2.7-5.2 2.2-1.2-.3-2-1.1-2.9-2-1.5-1.5-3.3-3.2-7.1-3.2zM8.5 17c-4 0-6.5 2-7.5 6 1.5-2 3.2-2.7 5.2-2.2 1.2.3 2 1.1 2.9 2 1.5 1.5 3.3 3.2 7.1 3.2 4 0 6.5-2 7.5-6-1.5 2-3.2 2.7-5.2 2.2-1.2-.3-2-1.1-2.9-2-1.5-1.5-3.3-3.2-7.1-3.2z"
        fill="#06b6d4"
      />
    </svg>
  );
}

export function NodeJsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M16 2.5L3 10v12l13 7.5L29 22V10L16 2.5z"
        fill="#339933"
      />
      <path
        d="M16 10v5l4.3 2.5v5L16 25l-4.3-2.5v-5L16 15v-5L11.7 12.5v5L16 20l4.3-2.5"
        fill="#fff"
      />
    </svg>
  );
}

export function PostgreSQLIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M16 3C9.4 3 4 8.4 4 15c0 5.5 3.7 10.1 8.7 11.5.5-.4 1.3-1.2 1.3-2.5v-2c-3.5.8-4.2-1.7-4.2-1.7-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.8-.3-5.8-1.4-5.8-6.3 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.6.1-3.3 0 0 1.1-.3 3.5 1.3 1-.3 2.1-.4 3.2-.4s2.2.1 3.2.4c2.4-1.6 3.5-1.3 3.5-1.3.7 1.7.3 3 .1 3.3.8.9 1.3 2 1.3 3.4 0 4.9-3 6-5.8 6.3.5.4.9 1.2.9 2.4v3.5c0 1.3.8 2.1 1.3 2.5C24.3 25.1 28 20.5 28 15c0-6.6-5.4-12-12-12z"
        fill="#4169e1"
      />
    </svg>
  );
}

export function PrismaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M26.2 24.5L17 3.5c-.4-.9-1.7-.9-2.1 0L5.8 24.5c-.3.7.2 1.5 1 1.5h8.7c.4 0 .7-.2.9-.5l2.6-5.3 3.5 7.1c.3.5.9.7 1.4.4l2.3-1.2c.6-.3.8-1 .5-1.5l-.5-.5zM16 14l-2 4h4l-2-4z"
        fill="#2d3748"
      />
    </svg>
  );
}

export function GitIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M29.5 14.9L17.1 2.5c-.8-.8-2-.8-2.8 0l-2.6 2.6 3.3 3.3c.8-.3 1.7-.1 2.3.5.6.6.8 1.5.5 2.3l3.2 3.2c.8-.3 1.7-.1 2.3.5.9.9.9 2.3 0 3.2-.9.9-2.3.9-3.2 0-.6-.6-.8-1.6-.4-2.4l-3-3v7.8c.2.1.4.3.6.5.9.9.9 2.3 0 3.2-.9.9-2.3.9-3.2 0-.9-.9-.9-2.3 0-3.2.3-.3.6-.5.9-.6v-7.9c-.3-.1-.6-.3-.9-.6-.7-.7-.8-1.6-.5-2.4l-3.2-3.2-8.5 8.5c-.8.8-.8 2 0 2.8L14.9 29.5c.8.8 2 .8 2.8 0L29.5 17.7c.8-.8.8-2 0-2.8z"
        fill="#f05032"
      />
    </svg>
  );
}

export function VercelIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path d="M16 4L30 28H2L16 4z" fill="currentColor" />
    </svg>
  );
}

export function SupabaseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M17.3 29.5c-.6.8-1.9.4-1.9-.6V17h11.4c1.1 0 1.7 1.3 1 2.1l-10.5 10.4z"
        fill="url(#supabase-a)"
      />
      <path
        d="M17.3 29.5c-.6.8-1.9.4-1.9-.6V17h11.4c1.1 0 1.7 1.3 1 2.1l-10.5 10.4z"
        fill="url(#supabase-b)"
        fillOpacity=".2"
      />
      <path
        d="M14.7 2.5c.6-.8 1.9-.4 1.9.6V15H5.2c-1.1 0-1.7-1.3-1-2.1L14.7 2.5z"
        fill="#3ecf8e"
      />
      <defs>
        <linearGradient id="supabase-a" x1="16.9" y1="19.2" x2="23.4" y2="24.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ecf8e" />
        </linearGradient>
        <linearGradient id="supabase-b" x1="12.1" y1="14.4" x2="17.3" y2="22.1" gradientUnits="userSpaceOnUse">
          <stop />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ClaudeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="6" fill="#d97757" />
      <path
        d="M21.7 12.2c-.4-1.4-1.5-2.5-3-2.9-2.1-.5-4.2.5-5.2 2.3-.3-.1-.7-.2-1-.2-2.2 0-4 1.8-4 4s1.8 4 4 4h.5c.7 1.5 2.3 2.6 4.1 2.6 1.6 0 3-.8 3.8-2 .2 0 .4.1.6.1 2 0 3.5-1.6 3.5-3.5 0-1.7-1.2-3.1-2.8-3.4h-.5z"
        fill="#fff"
      />
    </svg>
  );
}
