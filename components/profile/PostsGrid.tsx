import Image from "next/image";
import Link from "next/link";
import type { Post } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

export function PostsGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        No trips posted yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="relative aspect-square bg-gray-100 overflow-hidden group"
        >
          {post.photos[0] ? (
            <Image
              src={post.photos[0]}
              alt={post.location_name}
              fill
              className="object-cover group-hover:opacity-90 transition"
              sizes="(max-width: 768px) 33vw, 250px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              No photo
            </div>
          )}
          {post.cost_per_day && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1 opacity-0 group-hover:opacity-100 transition">
              <p className="text-white text-xs font-medium">
                {formatCurrency(post.cost_per_day)}/day
              </p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
