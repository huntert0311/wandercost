"use client";

import { useTransition } from "react";
import { toggleFollow } from "@/app/actions/follow";

interface FollowButtonProps {
  targetUserId: string;
  targetUsername: string;
  isFollowing: boolean;
}

export function FollowButton({ targetUserId, targetUsername, isFollowing }: FollowButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleFollow(targetUserId, targetUsername))}
      disabled={pending}
      className="rounded-lg px-5 py-2 text-sm font-medium transition disabled:opacity-60"
      style={
        isFollowing
          ? { border: "0.5px solid #d1d5db", color: "#374151", backgroundColor: "white" }
          : { backgroundColor: "#1D9E75", color: "white" }
      }
    >
      {pending ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
