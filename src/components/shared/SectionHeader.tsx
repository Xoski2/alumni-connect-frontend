import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  icon: Icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        className,
      )}
    >
      <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
        {Icon && <Icon className="h-4 w-4 text-brand-primary" />}
        {title}
      </h3>
      {action}
    </div>
  );
}