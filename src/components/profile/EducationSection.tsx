import { GraduationCap, MapPin } from "lucide-react";
import type { ProfileEducation } from "../../types/profile";

export function EducationSection({ education }: { education: ProfileEducation[] }) {
  if (education.length === 0) return null;

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
        <GraduationCap className="h-4 w-4 text-brand-primary" /> Education
      </h3>
      <div className="mt-4 space-y-4">
        {education.map((edu) => (
          <div key={edu._id} className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-primaryLight text-sm font-bold text-white">
              {edu.institution
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{edu.institution}</p>
              <p className="text-sm text-foreground/85">{edu.programme}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {[edu.department, edu.campus ? `${edu.campus}, Malawi` : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <GraduationCap className="h-3 w-3" />
                {edu.startYear ? `${edu.startYear} – ` : ""}
                {edu.graduationYear ? `Class of ${edu.graduationYear}` : "Present"}
                {edu.campus && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {edu.campus}
                  </span>
                )}
              </p>
              {edu.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}