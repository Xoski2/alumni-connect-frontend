import { Link } from "react-router-dom";
import { UserPlus, UserCheck, Users } from "lucide-react";
import type { ProfileConnectionPresence } from "../../types/profile";
import { InitialsAvatar } from "../shared";

interface FollowersSectionProps {
  followers: ProfileConnectionPresence[];
  followingIds: Set<string>;
  onToggleFollow: (id: string) => void;
}

export function FollowersSection({
  followers,
  followingIds,
  onToggleFollow,
}: FollowersSectionProps) {
  if (followers.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed py-10 text-center">
        <Users className="h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No followers yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Share your profile to start growing your community.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {followers.map((f) => {
        const following = followingIds.has(f._id);
        return (
          <div
            key={f._id}
            className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <Link to={`/profile/${f._id}`} className="shrink-0">
              <InitialsAvatar name={f.name} src={f.profilePhoto} className="h-12 w-12" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link to={`/profile/${f._id}`}>
                <p className="truncate text-sm font-bold text-foreground hover:text-brand-primary">
                  {f.name}
                </p>
              </Link>
              <p className="truncate text-xs text-muted-foreground">{f.headline}</p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {f.position ? `${f.position} · ` : ""}
                {f.graduationYear ? `Class of ${f.graduationYear} · ` : ""}
                {`${f.mutual ?? 0} mutual`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleFollow(f._id)}
              className={`inline-flex shrink-0 items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                following
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-brand-primary text-white hover:bg-brand-primaryLight"
              }`}
            >
              {following ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
              {following ? "Following" : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
}