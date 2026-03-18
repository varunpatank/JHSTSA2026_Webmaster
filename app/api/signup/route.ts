import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in environment",
  );
}

const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, grade, password, bio, phone_number, school, is_adult } = body ?? {};

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    const authRes = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          grade: grade || null,
          school: school || null,
          is_adult: !!is_adult,
          bio: bio || null,
          phone_number: phone_number || null,
        },
      },
    });

    if (authRes.error || !authRes.data.user) {
      return NextResponse.json(
        { error: authRes.error?.message || "Sign up failed." },
        { status: 400 },
      );
    }

    const userId = authRes.data.user.id;
    const profileRes = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          name,
          email,
          grade: grade || null,
          school: school || null,
          is_adult: !!is_adult,
          bio: bio || null,
          phone_number: phone_number || null,
        },
        { onConflict: "id" },
      )
      .select()
      .maybeSingle();

    if (profileRes.error) {
      return NextResponse.json(
        { error: profileRes.error.message || "Profile creation failed." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      user: authRes.data.user,
      session: authRes.data.session,
      profile: profileRes.data ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
