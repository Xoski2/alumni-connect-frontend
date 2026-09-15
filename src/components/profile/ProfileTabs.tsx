import {
  Award,
  Briefcase,
  Clock,
  GraduationCap,
  Info,
  PenSquare,
  Tag,
  Users,
  UserPlus,
  Wrench,
} from "lucide-react";

export type ProfileTabId =
  | "about"
  | "posts"
  | "tagged"
  | "activity"
  | "experience"
  | "education"
  | "skills"
  | "achievements"
  | "connections"
  | "followers";

interface TabDef {
  id: ProfileTabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabDef[] = [
  { id: "about", label: "About", icon: <Info className="h-4 w-4" /> },
  { id: "posts", label: "Posts", icon: <PenSquare className="h-4 w-4" /> },
  { id: "tagged", label: "Tagged", icon: <Tag className="h-4 w-4" /> },
  { id: "activity", label: "Activity", icon: <Clock className="h-4 w-4" /> },
  { id: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "skills", label: "Skills", icon: <Wrench className="h-4 w-4" /> },
  { id: "achievements", label: "Achievements", icon: <Award className="h-4 w-4" /> },
  { id: "connections", label: "Connections", icon: <Users className="h-4 w-4" /> },
  { id: "followers", label: "Followers", icon: <UserPlus className="h-4 w-4" /> },
];

interface ProfileTabsProps {
  active: ProfileTabId;
  onChange: (tab: ProfileTabId) => void;
  counts?: Partial<Record<ProfileTabId, number>>;
}

/**
 * Horizontally scrollable profile navigation bar.
 * Scrolls naturally on mobile, fits nicely on desktop.
 */
export function ProfileTabs({ active, onChange, counts }: ProfileTabsProps) {
  return (
    <nav
      aria-label="Profile sections"
      className="sticky top-14 z-20 -mx-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur sm:static sm:mx-0 sm:rounded-xl sm:border sm:px-0 sm:shadow-sm"
    >
      <div className="flex items-center gap-1 overflow-x-auto py-1.5 [scrollbar-width:none] md:px-2 [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const activeTab = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                activeTab
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              {counts?.[tab.id] != null && counts[tab.id]! > 0 && (
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                    activeTab
                      ? "bg-white/20 text-white"
                      : "bg-brand-primary/10 text-brand-primary"
                  }`}
                >
                  {counts[tab.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}