import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { PostCreateForm } from "@/components/posts/PostCreateForm";

export const metadata = { title: "New post — Wandercost" };

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-lg font-semibold text-gray-900 mb-6">Share a trip</h1>
      <PostCreateForm destinations={destinations} />
    </main>
  );
}
