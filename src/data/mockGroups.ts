export interface Group {
  _id: string;
  name: string;
  emoji: string;
  category: "Programme" | "Campus" | "Year" | "Interest";
  description: string;
  memberCount: number;
  campus?: string;
  program?: string;
}

export const MOCK_GROUPS: Group[] = [
  {
    _id: "grp-1",
    name: "BIT & Software Engineering",
    emoji: "💻",
    category: "Programme",
    program: "BIT / BSE",
    description:
      "For current students and alumni of computing programmes to share code, career tips and job leads.",
    memberCount: 132,
  },
  {
    _id: "grp-2",
    name: "Blantyre Campus Community",
    emoji: "🏙️",
    category: "Campus",
    campus: "BT",
    description:
      "Everything happening at Blantyre Campus — events, study groups and city catch-ups.",
    memberCount: 248,
  },
  {
    _id: "grp-3",
    name: "Lilongwe Campus Community",
    emoji: "🌆",
    category: "Campus",
    campus: "LL",
    description:
      "Networking, announcements and socials for the Lilongwe Campus family.",
    memberCount: 301,
  },
  {
    _id: "grp-4",
    name: "Class of 2020",
    emoji: "🎓",
    category: "Year",
    description:
      "Reconnect with your graduating cohort — reunions, milestones and old friends.",
    memberCount: 87,
  },
  {
    _id: "grp-5",
    name: "Entrepreneurs & Startups",
    emoji: "🚀",
    category: "Interest",
    description:
      "Founders, co-founders and dreamers building businesses across Malawi.",
    memberCount: 76,
  },
  {
    _id: "grp-6",
    name: "Accounting & Finance Careers",
    emoji: "📊",
    category: "Interest",
    description:
      "Audit, banking, tax and FA careers — interview prep and study partners welcome.",
    memberCount: 119,
  },
  {
    _id: "grp-7",
    name: "International Alumni",
    emoji: "🌍",
    category: "Interest",
    description:
      "Graduates now working abroad — diaspora networking and mentorship home.",
    memberCount: 54,
  },
  {
    _id: "grp-8",
    name: "Mzuzu Campus Community",
    emoji: "⛰️",
    category: "Campus",
    campus: "MZ",
    description:
      "The Mzuzu crew — events, sports and study circles from the lake side.",
    memberCount: 96,
  },
];