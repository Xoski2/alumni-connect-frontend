import {
  Briefcase,
  Building2,
  Compass,
  Globe,
  GraduationCap,
  LinkedinIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Target,
  TrendingUp,
} from "lucide-react";
import type { PublicProfile } from "../../types/profile";

interface ProfileAboutProps {
  profile: PublicProfile;
  isOwn: boolean;
  onEdit?: () => void;
}

export function ProfileAbout({ profile, isOwn, onEdit }: ProfileAboutProps) {
  const { user } = profile;
  const isStudent = profile.isStudent;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <SectionTitle
          title="About"
          onEdit={isOwn ? onEdit : undefined}
        />
        {user.bio ? (
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground/85">
            {user.bio}
          </p>
        ) : (
          <p className="mt-2 italic text-muted-foreground">
            No summary added yet.
          </p>
        )}
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <SectionTitle title="Contact information" onEdit={isOwn ? onEdit : undefined} />
        <ul className="mt-2 space-y-2.5 text-sm text-foreground/85">
          {user.email && (
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" /> {user.email}
            </li>
          )}
          {user.phone && (
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" /> {user.phone}
            </li>
          )}
          <li className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" /> {profile.location}
          </li>
          {user.website && (
            <li className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="text-brand-primary hover:underline"
              >
                {user.website}
              </a>
            </li>
          )}
          <li className="flex items-center gap-2.5">
            <LinkedinIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">LinkedIn / professional links</span>
          </li>
        </ul>
      </section>

      {/* Professional info */}
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <SectionTitle
          title={isStudent ? "Career interests" : "Professional information"}
          onEdit={isOwn ? onEdit : undefined}
        />
        {isStudent ? (
          <ul className="mt-2 space-y-2.5 text-sm text-foreground/85">
            <li className="flex items-start gap-2.5">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>
                <span className="font-semibold">Career interests:</span>{" "}
                {user.interests?.join(", ") || "Software development, data & innovation"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>
                <span className="font-semibold">Career goals:</span>{" "}
                {user.careerGoals || "Secure a graduate role aligned with my programme."}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>
                <span className="font-semibold">Expected graduation:</span>{" "}
                {profile.graduationYear || "—"}
              </span>
            </li>
          </ul>
        ) : (
          <ul className="mt-2 space-y-2.5 text-sm text-foreground/85">
            <li className="flex items-start gap-2.5">
              <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>
                <span className="font-semibold">Current role:</span>{" "}
                {user.position || "—"} at {user.company || "—"}
              </span>
            </li>
            {user.industry && (
              <li className="flex items-start gap-2.5">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                <span>
                  <span className="font-semibold">Industry:</span> {user.industry}
                </span>
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>
                <span className="font-semibold">Years of experience:</span>{" "}
                {user.yearsOfExperience
                  ? `${user.yearsOfExperience} years`
                  : "Entry level / early career"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Compass className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>
                <span className="font-semibold">Areas of expertise:</span>{" "}
                {user.skills?.slice(0, 4).join(", ") || "—"}
              </span>
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}

function SectionTitle({
  title,
  onEdit,
}: {
  title: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      )}
    </div>
  );
}