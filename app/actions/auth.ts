"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SignupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Only letters, numbers, and underscores." })
    .trim(),
  email: z.string().email({ message: "Enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .trim(),
});

const LoginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1).trim(),
});

export type AuthState = {
  errors?: Record<string, string[]>;
  message?: string;
} | null;

export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = SignupSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { username, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { errors: { username: ["Username is already taken."] } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { message: error.message };
  }

  if (data.user) {
    await prisma.user.create({
      data: {
        id: data.user.id,
        username,
        email,
      },
    });
  }

  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { message: "Invalid email or password." };
  }

  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) redirect("/login?error=oauth");
  if (data.url) redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
