"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function toggleFollow(targetUserId: string, targetUsername: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const existing = await prisma.follow.findUnique({
    where: { follower_id_following_id: { follower_id: user.id, following_id: targetUserId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.follow.delete({ where: { id: existing.id } }),
      prisma.user.update({ where: { id: user.id }, data: { following_count: { decrement: 1 } } }),
      prisma.user.update({ where: { id: targetUserId }, data: { followers_count: { decrement: 1 } } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.follow.create({ data: { follower_id: user.id, following_id: targetUserId } }),
      prisma.user.update({ where: { id: user.id }, data: { following_count: { increment: 1 } } }),
      prisma.user.update({ where: { id: targetUserId }, data: { followers_count: { increment: 1 } } }),
    ]);
  }

  revalidatePath(`/profile/${targetUsername}`);
}
