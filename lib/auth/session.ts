import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function createSession(): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const supabase = createServerClient();

  // Clean up expired sessions
  await supabase.from("admin_sessions").delete().lt("expires_at", new Date().toISOString());

  // Create new session
  await supabase.from("admin_sessions").insert({
    token,
    expires_at: expiresAt.toISOString(),
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return false;

  const supabase = createServerClient();

  const { data } = await supabase
    .from("admin_sessions")
    .select("id")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();

  return !!data;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const supabase = createServerClient();
    await supabase.from("admin_sessions").delete().eq("token", token);
  }

  cookieStore.delete(SESSION_COOKIE);
}
