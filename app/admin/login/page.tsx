"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex min-h-screen items-center justify-center bg-bg-page px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            admin
          </p>
          <h1 className="font-serif text-[clamp(24px,4vw,32px)] font-medium italic leading-[1.1] text-ink">
            sign in
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-pixel text-xs uppercase tracking-wider text-whisper"
            >
              password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-btn border border-(--shadow) bg-bg-linen px-4 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-rose"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="font-mono text-sm text-rose">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-btn bg-rose px-4 py-3 font-pixel text-sm text-bg-linen transition-all hover:-translate-y-0.5 hover:bg-rose-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "signing in..." : "sign in"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="font-pixel text-sm text-whisper transition-colors hover:text-rose"
          >
            ← back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
