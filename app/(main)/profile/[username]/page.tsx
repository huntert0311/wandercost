import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { FollowButton } from "@/components/profile/FollowButton";
import { PostsGrid } from "@/components/profile/PostsGrid";
import { formatNumber } from "@/lib/utils";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return {};
  return {
    title: `${user.username} — Wandercost`,
    description: user.bio ?? `Travel cost posts by ${user.username}`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const [profile, posts] = await Promise.all([
    prisma.user.findUnique({ where: { username } }),
    prisma.post.findMany({
      where: { user: { username } },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        photos: true,
        location_name: true,
        cost_per_day: true,
        likes_count: true,
        created_at: true,
        user_id: true,
        caption: true,
        destination_id: true,
        cost_stay: true,
        cost_food: true,
        cost_transport: true,
        cost_activities: true,
        cost_flight: true,
        cost_total: true,
        trip_days: true,
        travel_style: true,
        transport_mode: true,
        stay_type: true,
        comments_count: true,
        saves_count: true,
        feed_score: true,
        updated_at: true,
      },
    }),
  ]);

  if (!profile) notFound();

  const isOwnProfile = authUser?.id === profile.id;

  const isFollowing = authUser && !isOwnProfile
    ? !!(await prisma.follow.findUnique({
        where: { follower_id_following_id: { follower_id: authUser.id, following_id: profile.id } },
      }))
    : false;

  return (
    <main className="max-w-2xl mx-auto px-4 pb-16">
      {/* Header */}
      <div className="pt-8 pb-6 border-b" style={{ borderWidth: "0.5px" }}>
        <div className="flex items-start gap-6">
          <Avatar src={profile.avatar_url} username={profile.username} size={88} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-gray-900">{profile.username}</h1>
              {profile.verified && <VerifiedBadge size={18} />}
              <PlanBadge plan={profile.plan} />
            </div>

            {profile.bio && (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
            )}

            <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 flex-wrap">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {profile.location}
                </span>
              )}
              {profile.countries_visited > 0 && (
                <span className="flex items-center gap-1">
                  <Globe size={12} /> {profile.countries_visited} countries
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="text-center">
                <span className="font-semibold text-gray-900">{formatNumber(profile.posts_count)}</span>
                <span className="text-gray-400 ml-1">posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold text-gray-900">{formatNumber(profile.followers_count)}</span>
                <span className="text-gray-400 ml-1">followers</span>
              </div>
              <div className="text-center">
                <span className="font-semibold text-gray-900">{formatNumber(profile.following_count)}</span>
                <span className="text-gray-400 ml-1">following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          {isOwnProfile ? (
            <Link
              href="/settings"
              className="rounded-lg px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              style={{ border: "0.5px solid #d1d5db" }}
            >
              Edit profile
            </Link>
          ) : (
            <FollowButton
              targetUserId={profile.id}
              targetUsername={profile.username}
              isFollowing={isFollowing}
            />
          )}
        </div>
      </div>

      {/* Posts grid */}
      <div className="mt-4">
        <PostsGrid posts={posts} />
      </div>
    </main>
  );
}
