import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Plane } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

const STYLE_LABEL: Record<string, string> = {
  budget: "Budget", mid_range: "Mid-range", luxury: "Luxury", backpacker: "Backpacker",
};
const TRANSPORT_LABEL: Record<string, string> = {
  flight: "Flight", train: "Train", bus: "Bus", car: "Car", boat: "Boat", mixed: "Mixed",
};
const STAY_LABEL: Record<string, string> = {
  hostel: "Hostel", hotel: "Hotel", airbnb: "Airbnb", resort: "Resort", camping: "Camping", mixed: "Mixed",
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, avatar_url: true, verified: true, plan: true } },
      destination: true,
    },
  });

  if (!post) notFound();

  const costRows = [
    { label: "Per day", value: post.cost_per_day },
    { label: "Accommodation", value: post.cost_stay },
    { label: "Food & drink", value: post.cost_food },
    { label: "Local transport", value: post.cost_transport },
    { label: "Activities", value: post.cost_activities },
    { label: "Flights", value: post.cost_flight },
  ].filter((r) => r.value != null);

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/profile/${post.user.username}`}>
          <Avatar src={post.user.avatar_url} username={post.user.username} size={40} />
        </Link>
        <div>
          <Link
            href={`/profile/${post.user.username}`}
            className="flex items-center gap-1 font-medium text-gray-900 hover:underline text-sm"
          >
            {post.user.username}
            {post.user.verified && <VerifiedBadge size={14} />}
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin size={11} /> {post.location_name}
            {post.trip_days && <><Calendar size={11} /> {post.trip_days}d</>}
          </div>
        </div>
      </div>

      {/* Photos */}
      {post.photos.length > 0 && (
        <div className="rounded-xl overflow-hidden border mb-4" style={{ borderWidth: "0.5px" }}>
          <div className="relative aspect-square bg-gray-100">
            <Image
              src={post.photos[0]}
              alt={post.location_name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 600px"
              priority
            />
          </div>
          {post.photos.length > 1 && (
            <div className="grid grid-cols-3 border-t" style={{ borderWidth: "0.5px" }}>
              {post.photos.slice(1).map((url, i) => (
                <div key={i} className="relative aspect-square bg-gray-100">
                  <Image
                    src={url}
                    alt={`${post.location_name} ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cost strip */}
      {costRows.length > 0 && (
        <div className="border rounded-xl p-4 mb-4 bg-white" style={{ borderWidth: "0.5px" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cost breakdown</span>
            {post.cost_total && (
              <span className="text-base font-bold" style={{ color: "#1D9E75" }}>
                {formatCurrency(post.cost_total)} total
              </span>
            )}
          </div>
          <div className="space-y-2">
            {costRows.map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{row.label}</span>
                <span className="font-medium text-gray-900">{formatCurrency(row.value!)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t flex gap-4 text-xs text-gray-400" style={{ borderWidth: "0.5px" }}>
            {post.travel_style && <span>{STYLE_LABEL[post.travel_style]}</span>}
            {post.transport_mode && <span className="flex items-center gap-1"><Plane size={10} />{TRANSPORT_LABEL[post.transport_mode]}</span>}
            {post.stay_type && <span>{STAY_LABEL[post.stay_type]}</span>}
          </div>
        </div>
      )}

      {/* Caption */}
      <div className="mb-4">
        <p className="text-sm text-gray-900 leading-relaxed">
          <span className="font-semibold mr-1">{post.user.username}</span>
          {post.caption}
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-400">
        <span>{formatNumber(post.likes_count)} likes</span>
        <span>{formatNumber(post.comments_count)} comments</span>
      </div>
    </main>
  );
}
