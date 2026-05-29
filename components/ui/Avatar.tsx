import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  username: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, username, size = 40, className }: AvatarProps) {
  const initials = username.slice(0, 2).toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={username}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn("rounded-full flex items-center justify-center text-white font-medium", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: "#1D9E75",
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}
