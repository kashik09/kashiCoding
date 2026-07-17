import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ contacts: data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, read, archived } = await request.json();

    const supabase = createServerClient();
    const updates: Record<string, boolean> = {};
    if (typeof read === "boolean") updates.read = read;
    if (typeof archived === "boolean") updates.archived = archived;

    const { error } = await supabase.from("contacts").update(updates).eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}
