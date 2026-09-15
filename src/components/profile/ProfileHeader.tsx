import {
  Briefcase,
  Camera,
  GraduationCap,
  LinkedinIcon,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Plus,
  UserPlus,
  UserCheck,
  Clock3,
} from "lucide-react";
import type { PublicProfile, ConnectionStatus } from "../../types/profile";
import { Badge, InitialsAvatar } from "../shared";
import { timeAgo } from "../../lib/timeAgo";

interface ProfileHeaderProps {
  profile: PublicProfile;
  isOwn: boolean;
  connectionStatus: ConnectionStatus;
  onEditProfile: () => void;
  onAddSection: (field: "experience" | "achievements" | "skills") => void;
  onChangePhoto: (mode: "profile" | "cover") => void;
  onChangePassword?: () => void;
  onViewProfileSettings?: () => void;
  onToggleFollow?: () => void;
  onConnect?: () => void;
  onMessage: () => void;
  connectPending?: boolean;
  followersCount?: number;
  following?: boolean;
  followingBusy?: boolean;
}

export function ProfileHeader({
  profile,
  isOwn,
  connectionStatus,
  onEditProfile,
  onAddSection,
  onChangePhoto,
  onChangePassword,
  onMessage,
  onConnect,
  connectPending,
  followersCount,
  following,
  followingBusy,
  onToggleFollow,
}: ProfileHeaderProps) {
  const { user, headline, location, coverPhoto } = profile;
  const isStudent = profile.isStudent;

  const gradLabel = isStudent
    ? `Expected graduation: ${profile.graduationYear || "—"}`
    : `Graduated: ${profile.graduationYear || "—"}`;

  const connectBusy = connectPending;

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Cover */}
      <div className="relative h-44 w-full sm:h-56">
        {coverPhoto ? (
          <img src={coverPhoto} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full bg-gradient-to-br from-brand-primary via-brand-primary to-brand-primaryLight"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 25%, rgba(255,255,255,0.16) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(228,13,10,0.28) 0%, transparent 50%)",
            }}
          />
        )}
        {isOwn && (
          <button
            type="button"
            onClick={() => onChangePhoto("cover")}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            <Camera className="h-3.5 w-3.5" /> Edit cover
          </button>
        )}
      </div>

      {/* Identity */}
      <div className="relative px-5 pb-5">
        <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-card bg-brand-primary shadow-lg">
              <InitialsAvatar
                name={user.name}
                src={user.profilePhoto}
                className="h-full w-full text-3xl"
              />
            </div>
            <span className="absolute right-1 bottom-1 h-5 w-5 rounded-full border-2 border-card bg-emerald-500" />
            {isOwn && (
              <button
                type="button"
                onClick={() => onChangePhoto("profile")}
                className="absolute -top-1 right-0 rounded-full border border-border bg-background p-1.5 text-muted-foreground shadow-sm transition-colors hover:text-brand-primary"
                aria-label="Change profile photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {user.name}
              </h1>
              <Badge variant={isStudent ? "success" : "brand"}>
                {isStudent ? "Student" : "Alumni"}
              </Badge>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground/80">
              {headline}
            </p>

            {/* Academic + location chips */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-brand-primary" />
                {profile.programme || user.program || "Programme"} · {user.university || "Exploits University"}
              </span>
              {profile.department && (
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-brand-primary" />
                  {profile.department}
                </span>
              )}
              {profile.graduationYear && <span>{gradLabel}</span>}
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-red" />
                {location}
              </span>
            </div>

            {/* Engagement stats */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>
                <strong className="font-bold text-foreground">{profile.connectionsCount}</strong>{" "}
                connections
              </span>
              <span>
                <strong className="font-bold text-foreground">{followersCount ?? 0}</strong>{" "}
                followers
              </span>
              <span>
                <strong className="font-bold text-foreground">{profile.profileCompletion}%</strong>{" "}
                profile complete
              </span>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-brand-primary hover:underline"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" /> Website
                </a>
              )}
              {user.createdAt && (
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" /> Joined {timeAgo(user.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {isOwn ? (
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onEditProfile}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryLight sm:w-auto"
            >
              <Pencil className="h-4 w-4" /> Edit Profile
            </button>
            {onChangePassword && (
              <button
                type="button"
                onClick={onChangePassword}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto"
              >
                <Lock className="h-4 w-4" /> Change Password
              </button>
            )}
            <AddSectionButton
              label="Experience"
              onClick={() => onAddSection("experience")}
              className="flex-1 justify-center sm:flex-none"
            />
            <AddSectionButton
              label="Skills"
              onClick={() => onAddSection("skills")}
              className="flex-1 justify-center sm:flex-none"
            />
            <AddSectionButton
              label="Achievements"
              onClick={() => onAddSection("achievements")}
              className="flex-1 justify-center sm:flex-none"
            />
            <button
              type="button"
              onClick={onMessage}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto"
            >
              <Mail className="h-4 w-4" /> Share
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {connectionStatus === "accepted" ? (
              <button
                type="button"
                disabled
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 sm:w-auto"
              >
                <UserCheck className="h-4 w-4" /> Connected
              </button>
            ) : connectionStatus === "pending" ? (
              <button
                type="button"
                disabled
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-accent px-4 py-2 text-sm font-semibold text-muted-foreground sm:w-auto"
              >
                <Clock3 className="h-4 w-4" /> Request sent
              </button>
            ) : (
              <button
                type="button"
                onClick={onConnect}
                disabled={connectBusy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryLight disabled:opacity-60 sm:w-auto"
              >
                {connectBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Connect
              </button>
            )}
            <button
              type="button"
              onClick={onToggleFollow}
              disabled={followingBusy}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors sm:w-auto disabled:opacity-60 ${
                following
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-border text-foreground hover:bg-accent"
              }`}
            >
              {following ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {following ? "Following" : "Follow"}
            </button>
            <button
              type="button"
              onClick={onMessage}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" /> Message
            </button>
          </div>
        )}

        {/* About preview */}
        {user.bio && (
          <div className="mt-4 rounded-xl bg-muted/40 p-4 text-sm text-foreground/80">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              About
            </span>
            <p className="line-clamp-3 leading-relaxed">{user.bio}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function AddSectionButton({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3.5 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5 ${className}`}
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}