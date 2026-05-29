// Feed ranking algorithm
// Score = (likes×1) + (comments×2) + (saves×3) + recency_decay + verified_boost + plan_boost + following_bonus

export function calculateFeedScore({
  likes_count,
  comments_count,
  saves_count,
  created_at,
  is_verified,
  is_explorer_or_pro,
  is_following,
}: {
  likes_count: number;
  comments_count: number;
  saves_count: number;
  created_at: Date;
  is_verified: boolean;
  is_explorer_or_pro: boolean;
  is_following: boolean;
}): number {
  const engagement = likes_count * 1.0 + comments_count * 2.0 + saves_count * 3.0;

  const hours_old = (Date.now() - created_at.getTime()) / (1000 * 60 * 60);
  const recency_decay = Math.max(0, 100 - hours_old * 0.5);

  let score = engagement + recency_decay;

  if (is_verified) score *= 1.5;
  if (is_explorer_or_pro) score *= 2.0;
  if (is_following) score *= 1.3;

  return score;
}
