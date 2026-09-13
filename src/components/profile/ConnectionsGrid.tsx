import { Link } from "react-router-dom";
import { MessageCircle, Users, UserX } from "lucide-react";
import type { ProfileConnectionPresence } from "../../types/profile";
import { InitialsAvatar } from "../shared";

interface ConnectionsGridProps {
  connections: ProfileConnectionPresence[];
  onMessage: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ConnectionsGrid({ connections, onMessage, onRemove }: ConnectionsGridProps) {
  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed py-10 text-center">
        <Users className="h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No connections yet.</p>
        <Link to="/alumni" className="mt-1 text-sm font-semibold text-brand-primary hover:underline">
          Browse the directory
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {connections.map((c) => (
        <div
          key={c._id}
          className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <Link to={`/profile/${c._id}`} className="shrink-0">
            <InitialsAvatar name={c.name} src={c.profilePhoto} className="h-12 w-12" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link to={`/profile/${c._id}`}>
              <p className="truncate text-sm font-bold text-foreground hover:text-brand-primary">
                {c.name}
              </p>
            </Link>
            <p className="truncate text-xs text-muted-foreground">{c.headline}</p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {[c.program ? `Class of ${c.graduationYear}` : c.graduationYear, `${c.mutual ?? 0} mutual`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onMessage(c._id)}
              className="inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
              title="Message"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Message
            </button>
            <button
              type="button"
              onClick={() => onRemove(c._id)}
              className="inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-brand-red"
              title="Remove connection"
            >
              <UserX className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}