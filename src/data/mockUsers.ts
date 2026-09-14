import type { User } from "../types";
import type { DirectoryUser } from "../types";

/**
 * Deterministic mock user population for the alumni-connect frontend.
 * Backend is unavailable, so every screen renders from these records.
 * profilePhoto stays undefined on purpose — Avatar falls back to initials.
 */

type SeedAlumni = {
  program: string;
  gradYear: number;
  company: string;
  position: string;
  skills: string[];
  location: string;
};

const alumniSeeds: SeedAlumni[] = [
  { program: "BIT", gradYear: 2019, company: "Old Mutual", position: "Software Engineer", skills: ["JavaScript", "React", "Node.js"], location: "Lilongwe" },
  { program: "BCS", gradYear: 2020, company: "Econet Wireless", position: "Data Scientist", skills: ["Python", "Machine Learning", "SQL"], location: "Lilongwe" },
  { program: "BSE", gradYear: 2021, company: "Delta Corporation", position: "Full-Stack Developer", skills: ["TypeScript", "React", "AWS"], location: "Blantyre" },
  { program: "BAC", gradYear: 2018, company: "Deloitte", position: "Senior Auditor", skills: ["Auditing", "IFRS", "Taxation"], location: "Blantyre" },
  { program: "BFC", gradYear: 2020, company: "Standard Bank", position: "Financial Analyst", skills: ["Financial Modelling", "Risk", "Excel"], location: "Lilongwe" },
  { program: "BBA", gradYear: 2022, company: "Econet Wireless", position: "Product Manager", skills: ["Product Strategy", "Agile", "Marketing"], location: "Lilongwe" },
  { program: "BNE", gradYear: 2019, company: "Liquid Intelligent Technologies", position: "Network Engineer", skills: ["Cisco", "Routing", "Security"], location: "Blantyre" },
  { program: "BCL", gradYear: 2023, company: "Liquid Intelligent Technologies", position: "Cloud Architect", skills: ["AWS", "Kubernetes", "Terraform"], location: "Lilongwe" },
  { program: "BSC-MB", gradYear: 2021, company: "NMMZ", position: "Frontend Developer", skills: ["Vue", "Tailwind", "Docker"], location: "Virtual" },
  { program: "BSE", gradYear: 2020, company: "Steward Bank", position: "Backend Engineer", skills: ["Java", "Spring", "PostgreSQL"], location: "Lilongwe" },
  { program: "BIT", gradYear: 2022, company: "CBZ Holdings", position: "Systems Analyst", skills: ["SQL", "Business Analysis", "ERP"], location: "Lilongwe" },
  { program: "BMR", gradYear: 2019, company: "Unilever", position: "Brand Manager", skills: ["Branding", "Digital Marketing", "SEO"], location: "Blantyre" },
  { program: "BCY", gradYear: 2023, company: "Std Bank", position: "Security Analyst", skills: ["Pen Testing", "OWASP", "SIEM"], location: "Virtual" },
  { program: "BAC", gradYear: 2021, company: "E&Y", position: "Accountant", skills: ["CA", "Consolidation", "VAT"], location: "Lilongwe" },
  { program: "BMO", gradYear: 2022, company: "ZimbabweOnline", position: "Mobile Developer", skills: ["Flutter", "Firebase", "Dart"], location: "Blantyre" },
  { program: "BFC", gradYear: 2018, company: "Old Mutual", position: "Investment Analyst", skills: ["Portfolio", "Valuation", "Bloomberg"], location: "Lilongwe" },
  { program: "BCS", gradYear: 2022, company: "Delta Corporation", position: "Machine Learning Engineer", skills: ["TensorFlow", "Python", "MLOps"], location: "Blantyre" },
  { program: "BSE", gradYear: 2023, company: "Mukuru", position: "QA Engineer", skills: ["Selenium", "Testing", "CI/CD"], location: "Lilongwe" },
  { program: "BIT", gradYear: 2017, company: "NetOne", position: "IT Manager", skills: ["Leadership", "Infrastructure", "Vendor Management"], location: "Lilongwe" },
  { program: "BBA", gradYear: 2020, company: "SME Hub", position: "Founder", skills: ["Entrepreneurship", "Sales", "Strategy"], location: "Blantyre" },
  { program: "BCL", gradYear: 2021, company: "NCS Zambia", position: "DevOps Engineer", skills: ["Docker", "Jenkins", "AWS"], location: "Lilongwe" },
  { program: "BMR", gradYear: 2021, company: "Zimpapers", position: "Social Media Lead", skills: ["Content", "Analytics", "Paid Ads"], location: "Lilongwe" },
  { program: "BCS", gradYear: 2019, company: "University of Zimbabwe", position: "Lecturer", skills: ["Research", "Python", "Teaching"], location: "Lilongwe" },
  { program: "BAC", gradYear: 2020, company: "BDO Zimbabwe", position: "Tax Consultant", skills: ["Tax", "IFRS", "Advisory"], location: "Blantyre" },
];

const studentSeeds = [
  { program: "BIT", name: "Tapiwa Moyo", id: "BIT/24/BT/NE/011" },
  { program: "BCS", name: "Rudo Chikafu", id: "BCS/24/LL/NE/023" },
  { program: "BSE", name: "Farai Ndlovu", id: "BSE/25/MZ/PE/007" },
  { program: "BAC", name: "Nyaradzo Dube", id: "BAC/23/BT/NE/019" },
  { program: "BBA", name: "Simba Chirwa", id: "BBA/24/LL/NE/033" },
  { program: "BCL", name: "Tanaka Sibanda", id: "BCL/25/BT/DE/002" },
  { program: "BMO", name: "Melody Nyathi", id: "BMO/24/MZ/NE/014" },
  { program: "BCY", name: "Bongani Gumbo", id: "BCY/25/LL/PE/009" },
  { program: "BFC", name: "Chipo Maseko", id: "BFC/23/BT/NE/026" },
  { program: "BNE", name: "Anesu Chengeta", id: "BNE/25/MZ/NE/018" },
  { program: "BMR", name: "Kudzai Banda", id: "BMR/24/LL/NE/041" },
  { program: "BSC-MB", name: "Ropafadzo Marufu", id: "BSE/24/BT/NE/015" },
];

const firstNames = ["Tatenda", "Nyaradzo", "Farai", "Rudo", "Simba", "Chipo", "Tanaka", "Bongani", "Anesu", "Kudzai", "Mangaliso", "Thandeka", "Blessing", "Panashe", "Tariro", "Mthokozisi", "Ngoni", "Patience", "Tawanda", "Chenai"];
const lastNames = ["Moyo", "Ndlovu", "Chirwa", "Dube", "Sibanda", "Nyathi", "Gumbo", "Banda", "Chikafu", "Maseko", "Marufu", "Ncube", "Zulu", "Sithole", "Phiri", "Mpofu", "Khumalo", "Mudenda"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const MOCK_ALUMNI: DirectoryUser[] = alumniSeeds.map(
  (a, i): DirectoryUser => ({
    _id: `alu-${i + 1}`,
    name: `${pick(firstNames, i * 3 + 1)} ${pick(lastNames, i * 5 + 2)}`,
    email: `alumni${i + 1}@exploits.ac.zw`,
    graduationYear: String(a.gradYear),
    company: a.company,
    position: a.position,
    department: a.program.startsWith("B")
      ? departmentForProgramme(a.program)
      : undefined,
    program: a.program,
    location: a.location,
    role: "alumni",
    bio: `${a.position} with a background in ${a.program}. Passionate about mentoring the next generation of ${a.position.toLowerCase()}s.`,
    skills: a.skills,
  }),
);

function departmentForProgramme(program: string): string {
  switch (program) {
    case "BIT":
    case "BNE":
    case "BCL":
      return "Information Technology";
    case "BCS":
    case "BCY":
      return "Computer Science";
    case "BSE":
    case "BMO":
      return "Software Engineering";
    case "BBA":
    case "BMR":
      return "Business Management";
    case "BAC":
    case "BFC":
      return "Accounting & Finance";
    default:
      return "Information Technology";
  }
}

export const MOCK_STUDENTS: DirectoryUser[] = studentSeeds.map(
  (s, i): DirectoryUser => ({
    _id: `std-${i + 1}`,
    name: s.name,
    email: `student${i + 1}@exploits.ac.zw`,
    department: departmentForProgramme(s.program),
    program: s.program,
    role: "student",
    location: i % 2 === 0 ? "Blantyre" : "Lilongwe",
    bio: "Current student on a 4-year degree programme.",
    skills: ["Communication", "Teamwork", "Leadership"],
  }),
);

export const MOCK_PROFILES: Record<string, User> = {
  "alu-1": {
    _id: "alu-1",
    name: "Tinashe Dlamini",
    email: "alumni1@exploits.ac.zw",
    role: "alumni",
    phone: "+263 772 111 222",
    graduationYear: "2019",
    university: "Exploits University",
    company: "Old Mutual",
    position: "Software Engineer",
    skills: ["JavaScript", "React", "Node.js"],
    bio: "Software engineer at Old Mutual, mentoring students across can't-miss campus tech events.",
    department: "Information Technology",
    program: "BIT",
    registrationNumber: "BIT/19/BT/NE/004",
    interests: ["Mentorship", "Software", "Career growth"],
    isApproved: true,
    createdAt: "2024-01-15T09:00:00.000Z",
  },
};

export const MOCK_USERS: User[] = [
  ...alumniSeeds.map((a, i) => ({
    _id: `alu-${i + 1}`,
    name: `${pick(firstNames, i * 3 + 1)} ${pick(lastNames, i * 5 + 2)}`,
    email: `alumni${i + 1}@exploits.ac.zw`,
    role: "alumni" as const,
    phone: `+263 7${7 + (i % 3)} ${100 + i} ${200 + i}`,
    graduationYear: String(a.gradYear),
    university: "Exploits University",
    company: a.company,
    position: a.position,
    skills: a.skills,
    department: departmentForProgramme(a.program),
    program: a.program,
    registrationNumber: `${a.program}/${String(a.gradYear).slice(2)}/BT/NE/${String((i + 1) * 4).padStart(3, "0")}`,
    isApproved: true,
    createdAt: new Date(
      Date.now() - (i % 12) * 40 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  })),
  ...studentSeeds.map((s, i) => ({
    _id: `std-${i + 1}`,
    name: s.name,
    email: `student${i + 1}@exploits.ac.zw`,
    role: "student" as const,
    phone: `+263 7${7 + (i % 2)} 33${i} 44${i}`,
    university: "Exploits University",
    department: departmentForProgramme(s.program),
    program: s.program,
    registrationNumber: s.id,
    skills: ["Communication", "Teamwork", "Leadership"],
    isApproved: true,
    createdAt: new Date(
      Date.now() - (60 + i * 23) * 24 * 60 * 60 * 1000,
    ).toISOString(),
  })),
  {
    _id: "adm-1",
    name: "Dr. Sibusiso Moyo",
    email: "admin@exploits.ac.zw",
    role: "admin",
    phone: "+263 712 555 444",
    university: "Exploits University",
    department: "Administration",
    isApproved: true,
    createdAt: "2023-01-01T08:00:00.000Z",
  },
];

export const MOCK_PENDING_ALUMNI: User[] = [
  {
    _id: "alu-p1",
    name: "Lerato Mbhele",
    email: "lerato.mbhele@gmail.com",
    role: "alumni",
    graduationYear: "2018",
    university: "Exploits University",
    company: "First Capital Bank",
    position: "Credit Analyst",
    department: "Accounting & Finance",
    program: "BFC",
    registrationNumber: "BFC/18/BT/NE/088",
    skills: ["Credit", "Risk", "Excel"],
    isApproved: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "alu-p2",
    name: "Mthabisi Hove",
    email: "mthabisi.hove@gmail.com",
    role: "alumni",
    graduationYear: "2016",
    university: "Exploits University",
    company: "Ministry of ICT",
    position: "ICT Officer",
    department: "Information Technology",
    program: "BIT",
    registrationNumber: "BIT/16/BT/NE/101",
    skills: ["Networking", "Linux", "Support"],
    isApproved: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function createMockUser(payload: Record<string, string>): User {
  const count = MOCK_USERS.length + 1;
  return {
    _id: `new-${Date.now()}`,
    name: payload.name || "New Member",
    email: payload.email || `member${count}@exploits.ac.zw`,
    role: (payload.role as User["role"]) || "alumni",
    phone: payload.phone,
    graduationYear: payload.graduationYear,
    university: payload.university || "Exploits University",
    company: payload.company,
    position: payload.position,
    skills: payload.skills ? payload.skills.split(",") : [],
    department: payload.department,
    program: payload.program,
    registrationNumber: payload.registrationNumber,
    cvUrl: payload.cvUrl,
    isApproved: true,
    createdAt: new Date().toISOString(),
  };
}