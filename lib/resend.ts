import { Resend } from "resend";

const DEV_FROM_ADDRESS = "Portfolio Notifications <onboarding@resend.dev>";

function getEnv(name: string): string | null {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length ? value.trim() : null;
}

function extractEmail(address: string): string {
  const match = address.match(/<([^>]+)>/);
  return (match ? match[1] : address).trim();
}

export function getEmailDomain(address?: string | null): string | null {
  if (!address) return null;
  const email = extractEmail(address);
  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === email.length - 1) return null;
  return email.slice(atIndex + 1).toLowerCase();
}

export function getResendConfig() {
  const apiKey = getEnv("RESEND_API_KEY");
  const from =
    getEnv("RESEND_FROM") ||
    getEnv("EMAIL_FROM") ||
    (process.env.NODE_ENV !== "production" ? DEV_FROM_ADDRESS : null);
  const resend = apiKey ? new Resend(apiKey) : null;
  const fromDomain = getEmailDomain(from);

  return {
    resend,
    from,
    fromDomain,
    configured: Boolean(apiKey && from),
  };
}
