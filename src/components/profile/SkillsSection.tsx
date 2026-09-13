import { useState } from "react";
import { Plus, Wrench, X } from "lucide-react";
import { updateProfileApi } from "../../api/userApi";
import { COMMON_SKILLS } from "../../data";
import type { User } from "../../types";
import type { PublicProfile } from "../../types/profile";
import { EmptyState } from "../shared";

interface SkillsSectionProps {
  profile: PublicProfile;
  isOwn: boolean;
  onProfileChanged?: (user: User) => void;
}

export function SkillsSection({ profile, isOwn, onProfileChanged }: SkillsSectionProps) {
  const [skills, setSkills] = useState<string[]>(profile.user.skills ?? []);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const commit = (next: string[]) => {
    setSkills(next);
    if (isOwn) {
      updateProfileApi({ skills: next })
        .then(onProfileChanged)
        .catch(() => setError("Could not save skills"));
    }
  };

  const add = async () => {
    const value = draft.trim();
    if (!value) return;
    if (skills.includes(value)) {
      setDraft("");
      setAdding(false);
      return;
    }
    commit([...skills, value]);
    setDraft("");
    setAdding(false);
  };

  const remove = (skill: string) => commit(skills.filter((s) => s !== skill));

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
          <Wrench className="h-4 w-4 text-brand-primary" /> Skills
        </h3>
        {isOwn && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5"
          >
            {adding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {adding ? "Close" : "Add Skill"}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {adding && isOwn && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void add();
            }}
            placeholder="Type a skill + Enter"
            className="h-9 w-56 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30"
          />
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SKILLS.filter((s) => !skills.includes(s))
              .slice(0, 8)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    commit([...skills, s]);
                    setAdding(false);
                  }}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-brand-primary/40 hover:text-brand-primary"
                >
                  + {s}
                </button>
              ))}
          </div>
        </div>
      )}

      {skills.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No skills yet"
          description="Add the skills that best describe what you do."
          compact
        />
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1.5 text-sm font-medium text-brand-primary"
            >
              {skill}
              {isOwn && (
                <button
                  type="button"
                  onClick={() => remove(skill)}
                  className="rounded-full text-brand-primary/60 transition-colors hover:text-brand-red"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}