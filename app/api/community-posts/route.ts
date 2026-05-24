import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Build the insert payload — cover both schema versions:
  //   migration 010 uses: text, type, club, author_name, author_initials
  //   schema_v2_extension uses: content, post_type, club_tag
  const insertData: Record<string, unknown> = {
    author_id: body.author_id ?? null,
    author_name: body.author_name ?? "Member",
    author_initials: body.author_initials ?? "?",
    // migration 010 column names
    text: body.text ?? "",
    type: body.type ?? "text",
    club: body.club ?? "General",
    // schema_v2_extension column names (ADD COLUMN IF NOT EXISTS makes these safe)
    content: body.text ?? "",
    post_type: body.type ?? "text",
    club_tag: body.club ?? "General",
    // file fields
    file_name: body.file_name ?? null,
    file_size: body.file_size ?? null,
    file_url: body.file_url ?? null,
  };

  // Create Supabase client — if we have a token use it for RLS, otherwise use anon
  const supabase = createClient(url, anon_key, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("community_posts")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    // Try a minimal fallback insert in case the table only has the basic schema_v2 columns
    // (e.g. migration 010/011 hasn't been run yet)
    if (
      error.message.includes("column") &&
      (error.message.includes("author_name") ||
        error.message.includes("author_initials") ||
        error.message.includes("post_type") ||
        error.message.includes("club_tag") ||
        error.message.includes("file_name"))
    ) {
      const minimalData: Record<string, unknown> = {
        author_id: body.author_id ?? null,
        content: body.text ?? "",
        text: body.text ?? "",
      };
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("community_posts")
        .insert(minimalData)
        .select()
        .single();

      if (fallbackError) {
        return NextResponse.json(
          { error: fallbackError.message, code: fallbackError.code },
          { status: 400 }
        );
      }
      return NextResponse.json({ data: fallbackData });
    }

    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 400 }
    );
  }

  return NextResponse.json({ data });
}
