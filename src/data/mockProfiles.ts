import type { User } from "../types";
import type {
  ProfileAchievement,
  ProfileActivity,
  ProfileConnectionPresence,
  ProfileEducation,
  ProfileExperience,
  ProfileSuggestion,
  ProfileSuggestions,
} from "../types/profile";
import type { Post } from "../types";
import { parseStudentId } from "./departments";
import { MOCK_ALUMNI, MOCK_STUDENTS } from "./mockUsers";
import { MOCK_POSTS } from "./mockPosts";

/** Relative timestamps so mock content always looks live. */
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400 * 1000).toISOString();

const CURRENT_YEAR = new Date().getFullYear();

const ENTRY_TITLES: Record<string, string> = {
  BIT: "Junior Software Developer",
  BCS: "Junior Data Analyst",
  BSE: "Web Developer",
  BAC: "Audit Trainee",
  BFC: "Finance Officer",
  BBA: "Management Trainee",
  BNE: "Network Technician",
  BCL: "Cloud Support Engineer",
  BMO: "Mobile Developer",
  BCY: "Security Analyst",
  BMR: "Marketing Assistant",
  "BSC-MB": "Frontend Developer",
};

const ENTRY_COMPANIES = [
  "First Capital Bank",
  "NetOne",
  "ZimbabweOnline",
  "Mukuru",
  "Steward Bank",
  "Old Mutual",
  "Econet Wireless",
];

const COMMON_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "UI/UX Design",
  "Graphic Design",
  "Microsoft Office",
  "Database Management",
  "Python",
  "Public Speaking",
  "Project Management",
  "SQL",
  "Marketing",
  "Leadership",
  "Customer Care",
];

function campusFor(user: User): string {
  if (user.registrationNumber) {
    return parseStudentId(user.registrationNumber)?.campusName ?? "";
  }
  return "";
}

function sanitizeOrder<T extends { startDate?: string }>(items: Array<T | undefined>): T[] {
  return items
    .filter((x): x is T => Boolean(x))
    .sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""));
}

// ================= EXPERIENCE =================

export function buildProfileExperiences(user: User): ProfileExperience[] {
  const base: ProfileExperience[] = [];

  if (user.role === "alumni") {
    if (user.position && user.company) {
      base.push({
        _id: `exp-${user._id}-current`,
        title: user.position,
        company: user.company,
        employmentType: "Full-time",
        location: user.location || "Harare, Zimbabwe",
        startDate: `${Math.max(Number(user.graduationYear) || CURRENT_YEAR - 3, CURRENT_YEAR - 6)}-01`,
        current: true,
        description: `${user.position} role growing end-to-end impact at ${user.company}.`,
      });
    }
    base.push({
      _id: `exp-${user._id}-prev`,
      title: ENTRY_TITLES[user.program ?? ""] ?? "Graduate Trainee",
      company: ENTRY_COMPANIES[(user._id.length + (user.program?.length ?? 0)) % ENTRY_COMPANIES.length],
      employmentType: "Full-time",
      location: "Harare, Zimbabwe",
      startDate: `${Number(user.graduationYear) || CURRENT_YEAR - 5}-07`,
      endDate: `${(Number(user.graduationYear) || CURRENT_YEAR - 5) + 2}-12`,
      current: false,
      description: "Early-career role focused on building practical skills and delivering on real projects.",
    });
    base.push({
      _id: `exp-${user._id}-intern`,
      title: `${user.program ?? "BIT"} Intern`,
      company: ENTRY_COMPANIES[(user._id.length + 3) % ENTRY_COMPANIES.length],
      employmentType: "Internship",
      location: "Bulawayo, Zimbabwe",
      startDate: `${Math.max((Number(user.graduationYear) || CURRENT_YEAR) - 1, CURRENT_YEAR - 7)}-05`,
      endDate: `${Math.max((Number(user.graduationYear) || CURRENT_YEAR) - 1, CURRENT_YEAR - 7)}-08`,
      current: false,
      description: "3-month internship attachment required by the university curriculum.",
    });
  } else {
    base.push({
      _id: `exp-${user._id}-student`,
      title: `${user.program ?? "BIT"} Student`,
      company: "Exploits University",
      employmentType: "Full-time",
      location: campusFor(user) || "Bulawayo Campus",
      startDate: `${(Number(user.graduationYear) || CURRENT_YEAR + 4) - 4}-08`,
      current: true,
      description: `Pursuing a 4-year degree in ${user.department ?? "Information Technology"}.`,
    });
    base.push({
      _id: `exp-${user._id}-intern`,
      title: `${user.department ?? "IT"} Intern`,
      company: ENTRY_COMPANIES[(user._id.length + 2) % ENTRY_COMPANIES.length],
      employmentType: "Internship",
      location: "Harare, Zimbabwe",
      startDate: `${CURRENT_YEAR - 1}-05`,
      endDate: `${CURRENT_YEAR - 1}-08`,
      current: false,
      description: "Attachment programme with hands-on exposure to a professional team.",
    });
    base.push({
      _id: `exp-${user._id}-ambassador`,
      title: "Campus Ambassador",
      company: "Exploits University Student Guild",
      employmentType: "Part-time",
      location: campusFor(user) || "Bulawayo Campus",
      startDate: `${CURRENT_YEAR - 2}-02`,
      current: true,
      description: "Representing the faculty at open days and orientation, guiding new students.",
    });
  }
  return sanitizeOrder(base);
}

// ================= EDUCATION =================

export function buildProfileEducation(user: User): ProfileEducation[] {
  const entry = parseStudentId(user.registrationNumber ?? "");
  return [
    {
      _id: `edu-${user._id}`,
      institution: user.university || "Exploits University",
      programme: user.program
        ? `Bachelor of Science in ${user.program}`
        : "Bachelor of Science in Information Technology",
      department: user.department,
      campus: entry?.campusName ?? campusFor(user),
      startYear: String(entry?.entryYear ?? (Number(user.graduationYear) || CURRENT_YEAR) - 4),
      graduationYear: user.graduationYear,
      description:
        user.role === "alumni"
          ? "Completed a 4-year degree with a strong academic and professional network."
          : "Currently working towards a 4-year degree with focus on practical, industry-ready skills.",
    },
  ];
}

// ================= ACHIEVEMENTS =================

export function buildProfileAchievements(user: User): ProfileAchievement[] {
  const gradYear = Number(user.graduationYear) || CURRENT_YEAR;
  const list: ProfileAchievement[] = [
    {
      _id: `ach-${user._id}-1`,
      title: "Dean's List — Academic Excellence",
      description: "Recognised for outstanding academic performance during the programme.",
      date: `${gradYear - 1}-12`,
      organization: "Exploits University",
      icon: "award",
    },
  ];

  if (user.role === "alumni") {
    list.push({
      _id: `ach-${user._id}-2`,
      title: `${user.program ?? "BIT"} Certification`,
      description: `Professional certification aligned with the ${user.program ?? "BIT"} specialisation.`,
      date: `${gradYear}-05`,
      organization: "Exploits University",
      icon: "certificate",
    });
    list.push({
      _id: `ach-${user._id}-3`,
      title: "Alumni Mentor of the Year",
      description: "Volunteered mentorship to 40+ students through the Alumni Connect programme.",
      date: `${gradYear}-11`,
      organization: "Alumni Office",
      icon: "handshake",
    });
  } else {
    list.push({
      _id: `ach-${user._id}-4`,
      title: "University Innovation Hackathon — Finalist",
      description: "Built a student-focused prototype in a 48-hour team hackathon.",
      date: `${CURRENT_YEAR - 1}-09`,
      organization: "Innovation Hub",
      icon: "trophy",
    });
    list.push({
      _id: `ach-${user._id}-5`,
      title: "Student Leadership",
      description: "Served in a student leadership role, coordinating academic and social events.",
      date: `${CURRENT_YEAR - 2}-08`,
      organization: "Student Guild",
      icon: "users",
    });
  }
  return list;
}

// ================= TAGGED POSTS =================

/** Pre-seeded posts that mention @user.name. Live mentions are added by the
 *  post composer's tagging UI: getTaggedPostsApi also scans MOCK_POSTS. */
export function buildTaggedPosts(user: User): Post[] {
  const peers = user.role === "alumni" ? MOCK_STUDENTS : MOCK_ALUMNI;
  const named = peers.filter((p) => p._id !== user._id);
  if (named.length < 2) return [];

  const [a, b] = named;
  const tagged: Post[] = [
    {
      _id: `tag-${user._id}-1`,
      author: {
        _id: a._id,
        name: a.name,
        role: a.role,
        position: a.role === "alumni" ? a.position : undefined,
        graduationYear: a.graduationYear,
      },
      category: "Achievement",
      text: `Congratulations to @${user.name} for the outstanding work on the recent project — truly representing the best of Exploits University. Proud of what you're building.`,
      likes: ["alu-2", "alu-5", "std-2", "std-6"],
      comments: [
        {
          _id: `tagc-${user._id}-1`,
          userId: "alu-2",
          authorName: "Nkosi Banda",
          authorRole: "alumni",
          text: "Fully agree — great effort all round!",
          createdAt: hoursAgo(20),
        },
      ],
      createdAt: hoursAgo(26),
    },
    {
      _id: `tag-${user._id}-2`,
      author: {
        _id: b._id,
        name: b.name,
        role: b.role,
        position: b.role === "alumni" ? b.position : undefined,
        graduationYear: b.graduationYear,
      },
      category: "Career Update",
      text: `Shout out to @${user.name} for hosting the revision session — so many students came away with a clearer path. This is what community looks like.`,
      likes: ["std-3", "alu-9"],
      comments: [],
      createdAt: daysAgo(2),
    },
  ];
  return tagged;
}

// ================= ACTIVITY =================

export function buildProfileActivity(user: User): ProfileActivity[] {
  const gradYear = Number(user.graduationYear) || CURRENT_YEAR;
  const items: ProfileActivity[] = [
    {
      _id: `act-${user._id}-1`,
      type: "skill",
      title: "You added React.js to your skills",
      description: "Skills now include React, TypeScript and JavaScript.",
      timestamp: hoursAgo(2),
    },
  ];

  const ownPosts = MOCK_POSTS.filter((p) => p.author._id === user._id);
  if (ownPosts.length > 0) {
    items.unshift({
      _id: `act-${user._id}-2`,
      type: "post",
      title: "You created a post",
      description: ownPosts[0].text.slice(0, 80),
      timestamp: ownPosts[0].createdAt,
    });
  } else {
    items.push({
      _id: `act-${user._id}-2`,
      type: "profile",
      title: "You updated your profile",
      description: "Refreshed your professional headline and summary.",
      timestamp: daysAgo(1),
    });
  }

  items.push(
    {
      _id: `act-${user._id}-3`,
      type: "connection",
      title: user.role === "alumni" ? "You connected with Tapiwa Moyo" : "You connected with Thabo Mdluli",
      description: "New professional connection in your network.",
      timestamp: daysAgo(3),
    },
    {
      _id: `act-${user._id}-4`,
      type: "event",
      title: "You attended Alumni Networking Mixer",
      description: "Annual networking event at the Innovation Hub.",
      timestamp: daysAgo(7),
    },
    {
      _id: `act-${user._id}-5`,
      type: "experience",
      title: user.role === "alumni"
        ? `You updated your role at ${user.company ?? "your company"}`
        : "You added a campus role to your experience",
      timestamp: daysAgo(14),
    },
    {
      _id: `act-${user._id}-6`,
      type: "achievement",
      title: `You earned a Dean's List achievement (${gradYear - 1})`,
      timestamp: daysAgo(21),
    },
  );
  return items;
}

// ================= SUGGESTIONS =================

export function buildProfileSuggestions(user: User): ProfileSuggestions {
  const pool = user.role === "alumni" ? MOCK_ALUMNI : [...MOCK_ALUMNI, ...MOCK_STUDENTS];
  const others = pool.filter((p) => p._id !== user._id);

  const headlineForPeer = (p: { position?: string; company?: string; program?: string; role: string; graduationYear?: string }): string => {
    if (p.role === "alumni") {
      return p.position && p.company ? `${p.position} at ${p.company}` : "Alumni · Exploits University";
    }
    return `Student · ${p.program ?? "BIT"} · Class of ${p.graduationYear ?? "—"}`;
  };

  const peopleYouMayKnow: ProfileSuggestion[] = others.slice(0, 4).map((p) => ({
    _id: p._id,
    name: p.name,
    profilePhoto: undefined,
    headline: headlineForPeer(p),
    position: p.position,
    company: p.company,
    program: p.program,
    graduationYear: p.graduationYear,
    sharedConnections: 2 + (p._id.length % 5),
  }));

  const similar = others
    .filter((p) => p.department === user.department && p._id !== user._id)
    .slice(0, 3)
    .map((p) => ({
      _id: p._id,
      name: p.name,
      profilePhoto: undefined,
      headline: headlineForPeer(p),
      position: p.position,
      company: p.company,
      program: p.program,
      graduationYear: p.graduationYear,
      sharedConnections: 1 + (p.name.length % 4),
    }));

  return { peopleYouMayKnow, similarProfessionals: similar };
}

// ================= CONNECTIONS =================

export function buildProfileConnections(user: User): ProfileConnectionPresence[] {
  const pool = user.role === "alumni" ? MOCK_STUDENTS : MOCK_ALUMNI;
  return pool.slice(0, 6).map((p, i) => ({
    _id: p._id,
    name: p.name,
    profilePhoto: undefined,
    headline:
      p.role === "alumni"
        ? `${p.position ?? "Professional"} at ${p.company ?? "a leading firm"}`
        : `Student · ${p.program ?? "BIT"} · Class of ${p.graduationYear ?? "—"}`,
    program: p.program,
    graduationYear: p.graduationYear,
    company: p.company,
    position: p.position,
    mutual: 1 + (i % 6),
    since: daysAgo(10 + i * 12),
  }));
}

// ================= PROFILE COMPLETION =================

export function computeProfileCompletion(user: User): number {
  const checks: boolean[] = [
    Boolean(user.name),
    Boolean(user.profilePhoto),
    Boolean(user.bio),
    Boolean(user.headline || (user.role === "alumni" && user.position) || user.program),
    Boolean(user.program || user.registrationNumber),
    Boolean(user.graduationYear),
    Boolean(user.skills && user.skills.length > 0),
    Boolean(user.experiences && user.experiences.length > 0 || (user.role === "alumni" && user.position && user.company)),
    Boolean(user.coverPhoto),
    Boolean(user.location),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

// ================= HEADLINE / LOCATION HELPERS =================

export function headlineFor(user: User): string {
  if (user.headline) return user.headline;
  if (user.role === "alumni") {
    if (user.position && user.company) return `${user.position} at ${user.company}`;
    return `Alumni · Class of ${user.graduationYear ?? "—"}`;
  }
  if (user.program) return `Student · ${user.program} · ${user.department ?? "Exploits University"}`;
  return "Student at Exploits University";
}

export function locationFor(user: User): string {
  if (user.location) return user.location;
  const campus = campusFor(user);
  if (campus) return `${campus}, Zimbabwe`;
  return "Harare, Zimbabwe";
}

export { COMMON_SKILLS, CURRENT_YEAR };