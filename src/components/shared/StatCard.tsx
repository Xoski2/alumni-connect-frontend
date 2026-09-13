import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  trend?: number;
  trendLabel?: string;
  accent?: "brand" | "red" | "green" | "amber" | "indigo" | "slate";
  loading?: boolean;
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  brand: "bg-brand-primary text-white",
  red: "bg-brand-red text-white",
  green: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
  indigo: "bg-indigo-500 text-white",
  slate: "bg-slate-600 text-white",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  trendLabel,
  accent = "brand",
  loading,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden p-5 transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <div className="mt-2 h-7 w-16 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
          )}
          {trend !== undefined && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <span
                className={cn(
                  "font-semibold",
                  trend >= 0 ? "text-emerald-600" : "text-red-600",
                )}
              >
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
              {trendLabel ?? "vs last month"}
            </p>
          )}
          {hint && !loading && (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              accentMap[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
}