import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const COLORS = [
  "bg-brand-primary",
  "bg-brand-primaryLight",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-sky-600",
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export interface InitialsAvatarProps {
  name?: string;
  src?: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
}

export function InitialsAvatar({
  name = "",
  src,
  alt,
  className,
  fallbackClassName,
}: InitialsAvatarProps) {
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const color = COLORS[hash % COLORS.length];
  return (
    <Avatar className={cn("h-10 w-10", className)}>
      {src && <AvatarImage src={src} alt={alt ?? name} />}
      <AvatarFallback
        className={cn("text-sm font-semibold text-white", color, fallbackClassName)}
      >
        {initialsOf(name || "?")}
      </AvatarFallback>
    </Avatar>
  );
}