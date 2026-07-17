import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from "@/lib/rate-limit";
import { getEmailDomain, getResendConfig } from "@/lib/resend";

export const runtime = "nodejs";

function getEnv(name: string) {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length ? v.trim() : null;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, "notify:send"),
      5,
      10 * 60 * 1000
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const body = await request.json().catch(() => null);

    const name = body?.name?.toString?.().trim?.() ?? "";
    const email = body?.email?.toString?.().trim?.() ?? "";
    const serviceType = body?.serviceType?.toString?.().trim?.() ?? "";
    const budget = body?.budget?.toString?.().trim?.() ?? "";
    const timeline = body?.timeline?.toString?.().trim?.() ?? "";
    const description = body?.description?.toString?.().trim?.() ?? "";

    // Minimal validation
    if (!name || !email || !serviceType || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1) Email notification (optional, never hard-fail the request)
    const notificationEmail = getEnv("NOTIFICATION_EMAIL");
    const resendConfig = getResendConfig();
    const resend = resendConfig.resend;
    const fromDomain = resendConfig.fromDomain;
    const toDomain = getEmailDomain(notificationEmail);

    console.log("Resend configured:", resendConfig.configured ? "yes" : "no");
    console.log("Resend from domain:", fromDomain ?? "unknown");
    console.log("Resend to domain:", toDomain ?? "unknown");

    let emailSent = false;
    let responseStatus = "skipped";

    if (resend && resendConfig.from && notificationEmail) {
      try {
        const { error } = await resend.emails.send({
          from: resendConfig.from,
          to: notificationEmail,
          replyTo: email,
          subject: `New Service Request: ${serviceType}`,
          html: `
            <h2>New Service Request from ${escapeHtml(name)}</h2>

            <h3>Contact Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${escapeHtml(name)}</li>
              <li><strong>Email:</strong> ${escapeHtml(email)}</li>
            </ul>

            <h3>Project Details:</h3>
            <ul>
              <li><strong>Service Type:</strong> ${escapeHtml(serviceType)}</li>
              <li><strong>Budget:</strong> ${escapeHtml(budget)}</li>
              <li><strong>Timeline:</strong> ${escapeHtml(timeline)}</li>
            </ul>

            <h3>Description:</h3>
            <p>${escapeHtml(description).replace(/\n/g, "<br />")}</p>

            <hr />
            <p style="color:#666;font-size:12px;">
              Submitted from your portfolio website. Reply to this email to contact ${escapeHtml(
                name
              )} directly.
            </p>
          `,
        });

        responseStatus = error ? "error" : "ok";
        emailSent = !error;
      } catch {
        responseStatus = "error";
      }
    }

    console.log("Resend response status:", responseStatus);

    // 2) WhatsApp deep-link (optional)
    const whatsappNumber = getEnv("WHATSAPP_NUMBER");
    const whatsappUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          `*New Service Request*\n\n*From:* ${name}\n*Email:* ${email}\n*Service:* ${serviceType}\n*Budget:* ${budget}\n*Timeline:* ${timeline}\n\n*Description:*\n${description}`
        )}`
      : null;

    return NextResponse.json({
      success: true,
      message: "Notification processed",
      whatsappUrl,
      emailSent,
    });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process notification" },
      { status: 500 }
    );
  }
}

// basic HTML escape to avoid someone injecting markup into your email
function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
