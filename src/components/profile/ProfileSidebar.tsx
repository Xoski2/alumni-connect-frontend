import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Users } from "lucide-react";
import type { ProfileSuggestion, ProfileSuggestions, PublicProfile } from "../../types/profile";
import { InitialsAvatar, Progress } from "../shared";

const COMPLETION_ITEMS = [
  { key: "identity", label: "Personal information" },
  { key: "education", label: "Education" },
  { key: "photo", label: "Profile photo" },
  { key: "experience", label: "Work experience" },
  { key: "skills", label: "Skills" },
] as const;

function completionStatus(profile: PublicProfile, key: string) {
  const { user } = profile;
  switch (key) {
    case "identity":
      return Boolean(user.name && user.email);
    case "education":
      return Boolean(profile.programme || user.university || profile.graduationYear || profile.department);
    case "photo":
      return Boolean(user.profilePhoto || profile.coverPhoto);
    case "experience":
      return Boolean((user.experiences?.length ?? 0) > 0 || (profile.isStudent ? true : Boolean(user.position && user.company)));
    case "skills":
      return Boolean((user.skills?.length ?? 0) > 0);
    default:
      return false;
  }
}

interface ProfileSidebarProps {
  profile: PublicProfile;
  suggestions: ProfileSuggestions;
  onAddSection: (field: "experience" | "achievements" | "skills") => void;
}

export function ProfileSidebar({ profile, suggestions, onAddSection }: ProfileSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Completion */}
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Profile completion</h3>
          <span className="text-sm font-bold text-brand-primary">{profile.profileCompletion}%</span>
        </div>
        <Progress
          value={profile.profileCompletion}
          className="mt-3"
        />
        <ul className="mt-3 space-y-2">
          {COMPLETION_ITEMS.map((item) => {
            const done = completionStatus(profile, item.key);
            return (
              <li key={item.key} className="flex items-center gap-2 text-xs text-foreground/80">
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                {item.label}
                {!done && item.key === "experience" && (
                  <button
                    type="button"
                    onClick={() => onAddSection("experience")}
                    className="ml-auto rounded-md px-1.5 py-0.5 font-semibold text-brand-primary hover:bg-brand-primary/5"
                  >
                    Add +
                  </button>
                )}
                {!done && item.key === "skills" && (
                  <button
                    type="button"
                    onClick={() => onAddSection("skills")}
                    className="ml-auto rounded-md px-1.5 py-0.5 font-semibold text-brand-primary hover:bg-brand-primary/5"
                  >
                    Add +
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* People you may know */}
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground">People you may know</h3>
        <div className="mt-3 space-y-3">
          {suggestions.peopleYouMayKnow.map((p) => (
            <SuggestionRow key={p._id} person={p} />
          ))}
        </div>
      </section>

      {/* Similar professionals */}
      {suggestions.similarProfessionals.length > 0 && (
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Users className="h-4 w-4 text-brand-primary" /> Similar professionals
          </h3>
          <div className="mt-3 space-y-3">
            {suggestions.similarProfessionals.map((p) => (
              <SuggestionRow key={p._id} person={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SuggestionRow({ person }: { person: ProfileSuggestion }) {
  return (
    <Link
      to={`/profile/${person._id}`}
      className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-accent"
    >
      <InitialsAvatar name={person.name} src={person.profilePhoto} className="h-10 w-10" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{person.name}</p>
        <p className="truncate text-xs text-muted-foreground">{person.headline}</p>
        {person.sharedConnections != null && (
          <p className="truncate text-[11px] text-muted-foreground">
            {person.sharedConnections} shared connection{person.sharedConnections === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </Link>
  );
}