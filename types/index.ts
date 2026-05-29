import type { User, Post, Comment, Destination, Plan, VerificationStatus } from "@prisma/client";

export type { User, Post, Comment, Destination, Plan, VerificationStatus };

export type PostWithUser = Post & {
  user: Pick<User, "id" | "username" | "avatar_url" | "verified" | "plan">;
  destination: Destination | null;
  _liked?: boolean;
  _saved?: boolean;
};

export type ProfileUser = User & {
  posts: Post[];
};
