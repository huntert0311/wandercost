"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Plan } from "@prisma/client";

const FREE_POSTS_PER_MONTH = 3;

const PostSchema = z.object({
  caption: z.string().min(1).max(2200),
  location_name: z.string().min(1).max(200),
  destination_id: z.string().optional(),
  photos: z.array(z.string().url()).min(1).max(4),
  cost_per_day: z.coerce.number().positive().optional(),
  cost_stay: z.coerce.number().positive().optional(),
  cost_food: z.coerce.number().positive().optional(),
  cost_transport: z.coerce.number().positive().optional(),
  cost_activities: z.coerce.number().positive().optional(),
  cost_flight: z.coerce.number().positive().optional(),
  cost_total: z.coerce.number().positive().optional(),
  trip_days: z.coerce.number().int().positive().optional(),
  travel_style: z.enum(["budget", "mid_range", "luxury", "backpacker"]).optional(),
  transport_mode: z.enum(["flight", "train", "bus", "car", "boat", "mixed"]).optional(),
  stay_type: z.enum(["hostel", "hotel", "airbnb", "resort", "camping", "mixed"]).optional(),
});

export type PostState = { errors?: Record<string, string[]>; message?: string } | null;

export async function createPost(_prevState: PostState, formData: FormData): Promise<PostState> {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return { message: "Not authenticated." };

  const user = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (!user) return { message: "User not found." };

  // Enforce free tier monthly post limit
  if (user.plan === Plan.free) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyCount = await prisma.post.count({
      where: { user_id: user.id, created_at: { gte: startOfMonth } },
    });
    if (monthlyCount >= FREE_POSTS_PER_MONTH) {
      return { message: `Free plan is limited to ${FREE_POSTS_PER_MONTH} posts per month. Upgrade to Explorer for unlimited posts.` };
    }
  }

  const photosRaw = formData.getAll("photos") as string[];

  const parsed = PostSchema.safeParse({
    caption: formData.get("caption"),
    location_name: formData.get("location_name"),
    destination_id: formData.get("destination_id") || undefined,
    photos: photosRaw.filter(Boolean),
    cost_per_day: formData.get("cost_per_day") || undefined,
    cost_stay: formData.get("cost_stay") || undefined,
    cost_food: formData.get("cost_food") || undefined,
    cost_transport: formData.get("cost_transport") || undefined,
    cost_activities: formData.get("cost_activities") || undefined,
    cost_flight: formData.get("cost_flight") || undefined,
    cost_total: formData.get("cost_total") || undefined,
    trip_days: formData.get("trip_days") || undefined,
    travel_style: formData.get("travel_style") || undefined,
    transport_mode: formData.get("transport_mode") || undefined,
    stay_type: formData.get("stay_type") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { destination_id, ...rest } = parsed.data;

  const post = await prisma.$transaction(async (tx) => {
    const newPost = await tx.post.create({
      data: {
        ...rest,
        user_id: user.id,
        destination_id: destination_id ?? null,
      },
    });
    await tx.user.update({
      where: { id: user.id },
      data: { posts_count: { increment: 1 } },
    });
    if (destination_id) {
      await tx.destination.update({
        where: { id: destination_id },
        data: { posts_count: { increment: 1 } },
      });
    }
    return newPost;
  });

  revalidatePath("/feed");
  revalidatePath(`/profile/${user.username}`);
  redirect(`/post/${post.id}`);
}
