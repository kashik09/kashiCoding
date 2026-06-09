"use client";

import { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { SoftLeaves } from "@/components/ambient/SoftLeaves";
import {
  MailIcon,
  GithubIcon,
  MapPinIcon,
  SendIcon,
  MailboxIcon,
} from "@/components/icons/misc";
import { ArrowRightIcon } from "@/components/icons";

const CONTACT_INFO = [
  {
    k: "email",
    v: "email",
    href: "mailto:email",
    icon: MailIcon,
  },
  {
    k: "github",
    v: "github.com/kashik09",
    href: "https://github.com/kashik09",
    icon: GithubIcon,
  },
  { k: "where", v: "kampala, uganda", href: null, icon: MapPinIcon },
];

export default function ContactPage() {
  const [msg, setMsg] = useState("");
  const [fromName, setFromName] = useState("");
  const [returnAddr, setReturnAddr] = useState("");
  const [step, setStep] = useState<"draft" | "envelope" | "sent" | "error">("draft");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const goToEnvelope = () => {
    if (!msg.trim()) return;
    setStep("envelope");
  };

  const sendLetter = async () => {
    if (!fromName.trim()) return;
    if (!turnstileToken) {
      setErrorMsg("Please complete the verification.");
      return;
    }
    setSending(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fromName,
          email: returnAddr,
          message: msg,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStep("error");
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }

      setStep("sent");
    } catch {
      setErrorMsg("Failed to send. Please try again.");
      setStep("error");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setMsg("");
    setFromName("");
    setReturnAddr("");
    setStep("draft");
    setErrorMsg("");
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  };

  return (
    <div className="relative min-h-screen">
      <SoftLeaves count={3} />

      <div className="animate-fade-in relative z-2 mx-auto max-w-270 px-[clamp(24px,4vw,48px)] pb-24 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-7">
          <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            @ contact
          </p>
          <h1 className="font-serif text-[clamp(34px,4.5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
            say hello
          </h1>
          <div className="mt-4 h-0.5 w-12.5 rounded-full bg-rose" />
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-[clamp(20px,3vw,36px)] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)]">
          {/* Left - Mailbox + Contact Cards */}
          <div className="flex flex-col rounded-card border border-(--shadow) bg-bg-card p-7.5 shadow-[0_2px_8px_var(--shadow)]">
            {/* Mailbox Illustration */}
            <div className="mb-4 text-center">
              <div className="animate-bob mx-auto flex h-33 w-33 items-center justify-center rounded-full bg-bg-linen shadow-[0_6px_18px_var(--shadow)]">
                <MailboxIcon className="h-18 w-18 text-rose-deep" />
              </div>
              <p className="mt-3.5 font-mono text-[13px] italic text-whisper">
                flag&apos;s up — drop a letter in.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="mt-auto flex flex-col gap-2.5">
              {CONTACT_INFO.map((c) => {
                const Icon = c.icon;
                const Wrapper = c.href ? "a" : "div";
                return (
                  <Wrapper
                    key={c.k}
                    href={c.href || undefined}
                    target={c.href ? "_blank" : undefined}
                    rel={c.href ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3.5 rounded-[10px] border border-(--shadow) bg-bg-linen px-4 py-3 shadow-[0_1px_4px_var(--shadow)] transition-transform hover:-translate-y-0.5"
                  >
                    <Icon className="h-5 w-5 text-rose-deep" />
                    <div className="min-w-0 flex-1">
                      <p className="font-pixel text-[11px] uppercase tracking-[0.14em] text-whisper">
                        {c.k}
                      </p>
                      <p className="truncate font-mono text-sm text-ink">
                        {c.v}
                      </p>
                    </div>
                    {c.href && (
                      <ArrowRightIcon className="h-3.5 w-3.5 text-whisper" />
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </div>

          {/* Right - Letter Writer */}
          <div className="rounded-card border border-(--shadow) bg-bg-card p-7.5 shadow-[0_4px_14px_var(--shadow)]">
            {step === "draft" && (
              <div className="animate-fade-in">
                <p className="mb-3.5 flex items-center gap-2 font-pixel text-xs uppercase tracking-[0.12em] text-rose">
                  <MailIcon className="h-4 w-4 text-rose-deep" />
                  write a letter
                </p>
                <p className="mb-4 font-mono text-sm leading-relaxed text-whisper">
                  scribble a note... i&apos;d love to hear from you
                </p>

                {/* Letter Paper */}
                <div className="relative rounded-[10px] border border-(--shadow) bg-bg-linen px-5.5 py-4.5">
                  <p className="mb-2.5 font-pixel text-[11px] uppercase tracking-[0.14em] text-whisper">
                    dear kashi,
                  </p>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="hi! i saw your portfolio and..."
                    className="min-h-56 w-full resize-none border-none bg-transparent font-mono text-[15px] leading-7 text-ink outline-none placeholder:text-whisper/50"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, var(--shadow-mid) 27px, var(--shadow-mid) 28px)",
                      backgroundSize: "100% 28px",
                      backgroundAttachment: "local",
                    }}
                  />
                  <div className="mt-1.5 flex justify-between font-mono text-[11px] text-whisper">
                    <span>{msg.length} chars</span>
                    <span className="italic">— a friend</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={goToEnvelope}
                    className="inline-flex items-center gap-2 rounded-btn bg-rose px-4 py-2.5 font-pixel text-sm text-bg-linen transition-all hover:-translate-y-0.5 hover:bg-rose-deep"
                  >
                    <SendIcon className="h-4 w-4" />
                    send letter
                  </button>
                  <button
                    type="button"
                    onClick={() => setMsg("")}
                    className="font-pixel text-sm text-whisper transition-colors hover:text-rose-deep"
                  >
                    clear
                  </button>
                </div>
              </div>
            )}

            {step === "envelope" && (
              <div className="animate-fade-in">
                <p className="mb-3.5 flex items-center gap-2 font-pixel text-xs uppercase tracking-[0.12em] text-rose">
                  <MailIcon className="h-4 w-4 text-rose-deep" />
                  address the letter
                </p>
                <p className="mb-4 font-mono text-sm leading-relaxed text-whisper">
                  almost there. who&apos;s it from?
                </p>

                {/* Envelope */}
                <div className="relative overflow-hidden rounded-[10px] border border-(--shadow) bg-bg-linen px-6.5 pb-6.5 pt-5.5 shadow-[0_4px_14px_var(--shadow)]">
                  {/* TO */}
                  <div className="mb-4">
                    <p className="mb-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-whisper">
                      to
                    </p>
                    <p className="font-mono text-base text-ink">
                      kashi kweyu
                      <span className="text-whisper"> · kampala, uganda</span>
                    </p>
                  </div>

                  {/* FROM */}
                  <div className="mb-3.5 max-w-[320px]">
                    <label>
                      <p className="mb-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-whisper">
                        from
                      </p>
                      <input
                        autoFocus
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                        placeholder="your name"
                        className="w-full border-b border-(--shadow-mid) bg-transparent py-1 font-mono text-[15px] text-ink outline-none placeholder:text-whisper/50"
                      />
                    </label>
                  </div>

                  {/* RETURN ADDRESS */}
                  <div className="max-w-[320px]">
                    <label>
                      <p className="mb-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-whisper">
                        return address{" "}
                        <span className="text-whisper/70 normal-case tracking-normal">
                          (email or @-handle, optional)
                        </span>
                      </p>
                      <input
                        value={returnAddr}
                        onChange={(e) => setReturnAddr(e.target.value)}
                        placeholder="so i can write back"
                        className="w-full border-b border-(--shadow-mid) bg-transparent py-1 font-mono text-sm text-ink outline-none placeholder:text-whisper/50"
                      />
                    </label>
                  </div>
                </div>

                {/* Letter Preview */}
                <div className="mt-3.5 overflow-hidden rounded-lg border border-dashed border-(--shadow-mid) bg-bg-card px-3.5 py-2.5 font-mono text-xs leading-relaxed text-whisper">
                  <span className="text-rose">letter</span>: &quot;
                  {msg.length > 90 ? msg.slice(0, 90) + "…" : msg}&quot;
                </div>

                {/* Turnstile CAPTCHA */}
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                  <div className="mt-4">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                      onSuccess={setTurnstileToken}
                      onError={() => setTurnstileToken(null)}
                      onExpire={() => setTurnstileToken(null)}
                      options={{ theme: "light", size: "flexible" }}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={sendLetter}
                    disabled={!turnstileToken && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    className="inline-flex items-center gap-2 rounded-btn bg-rose px-4 py-2.5 font-pixel text-sm text-bg-linen transition-all hover:-translate-y-0.5 hover:bg-rose-deep disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <SendIcon className="h-4 w-4" />
                    seal & send
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("draft")}
                    className="font-pixel text-sm text-whisper transition-colors hover:text-rose-deep"
                  >
                    ← back to letter
                  </button>
                </div>
              </div>
            )}

            {step === "sent" && (
              <div className="animate-fade-in flex min-h-100 flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-moss/20">
                  <MailIcon className="h-10 w-10 text-moss" />
                </div>
                <p className="font-serif text-2xl italic text-ink">
                  letter sent!
                </p>
                <p className="mt-2 max-w-xs font-mono text-sm text-whisper">
                  thanks for reaching out, {fromName}. i&apos;ll get back to you
                  soon.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-6 font-pixel text-sm text-rose transition-colors hover:text-rose-deep"
                >
                  write another letter
                </button>
              </div>
            )}

            {step === "error" && (
              <div className="animate-fade-in flex min-h-100 flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose/20">
                  <MailIcon className="h-10 w-10 text-rose" />
                </div>
                <p className="font-serif text-2xl italic text-ink">
                  oops...
                </p>
                <p className="mt-2 max-w-xs font-mono text-sm text-whisper">
                  {errorMsg || "something went wrong. please try again."}
                </p>
                <button
                  type="button"
                  onClick={() => setStep("envelope")}
                  className="mt-6 font-pixel text-sm text-rose transition-colors hover:text-rose-deep"
                >
                  try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
