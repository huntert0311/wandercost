export function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-label="Verified">
      <circle cx="8" cy="8" r="8" fill="#1D9BF0" />
      <path
        d="M5 8.5L7 10.5L11 6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
