import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Create prisma user record if this is first OAuth login
      const existing = await prisma.user.findUnique({ where: { id: data.user.id } });
      if (!existing) {
        const email = data.user.email!;
        const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
        let username = baseUsername;
        let i = 1;
        while (await prisma.user.findUnique({ where: { username } })) {
          username = `${baseUsername}${i++}`;
        }
        await prisma.user.create({
          data: {
            id: data.user.id,
            username,
            email,
            avatar_url: data.user.user_metadata?.avatar_url ?? null,
          },
        });
      }

      return NextResponse.redirect(`${origin}/feed`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
