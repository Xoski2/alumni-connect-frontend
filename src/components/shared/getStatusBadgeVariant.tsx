import type { BadgeProps } from "./Badge";

export function getStatusBadgeVariant(
  status?: string,
  fallback: BadgeProps["variant"] = "secondary",
): BadgeProps["variant"] {
  switch (status?.toLowerCase()) {
    case "approved":
    case "accepted":
    case "active":
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
    case "declined":
    case "inactive":
      return "danger";
    default:
      return fallback;
  }
}