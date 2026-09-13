import type { Event } from "../types";

const daysFromNow = (n: number) =>
  new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_EVENTS: Event[] = [
  {
    _id: "evt-1",
    title: "Career Fair 2026",
    description:
      "The annual career fair connecting students and alumni with 30+ employers. Bring your CV — on-the-spot interviews available.",
    eventDate: daysFromNow(21),
    location: "Bulawayo Campus — Main Hall",
    organizer: { _id: "adm-1", name: "Dr. Sibusiso Moyo" },
    participants: ["std-1", "std-2", "std-3", "std-4", "std-6", "std-8", "std-10"],
    createdAt: daysAgo(15),
  },
  {
    _id: "evt-2",
    title: "Alumni Networking Night",
    description:
      "An evening of structured speed-networking across industry sectors. Open to final-year students and alumni.",
    eventDate: daysFromNow(12),
    location: "Bulawayo — Orange Grove Hotel",
    organizer: { _id: "alu-1", name: "Tinashe Dlamini" },
    participants: ["std-1", "std-5", "std-9"],
    createdAt: daysAgo(8),
  },
  {
    _id: "evt-3",
    title: "AI & Data Science Workshop",
    description:
      "Hands-on half-day workshop on Python and machine learning pipelines, led by alumni working in data.",
    eventDate: daysFromNow(7),
    location: "Harare Campus — Lab 3",
    organizer: { _id: "alu-2", name: "Nkosi Banda" },
    participants: ["std-2", "std-6", "std-10", "std-12"],
    createdAt: daysAgo(5),
  },
  {
    _id: "evt-4",
    title: "Fintech & Accounting Roundtable",
    description:
      "Panel discussion on the future of fintech with alumni from banking, audit and consulting.",
    eventDate: daysFromNow(30),
    location: "Virtual (Microsoft Teams)",
    organizer: { _id: "alu-4", name: "Chido Manyika" },
    participants: ["std-4", "std-9", "std-11"],
    createdAt: daysAgo(20),
  },
  {
    _id: "evt-5",
    title: "Git & GitHub Bootcamp",
    description:
      "Evening bootcamp covering version control, branching strategy and an introduction to open source contribution.",
    eventDate: daysFromNow(4),
    location: "Midlands Campus — Computer Lab",
    organizer: { _id: "alu-3", name: "Vimbai Ndlovu" },
    participants: ["std-3", "std-7", "std-8"],
    createdAt: daysAgo(2),
  },
  {
    _id: "evt-6",
    title: "Graduation Ceremony — Class of 2025",
    description:
      "Congregation for the 2025 graduating cohort. Alumni are invited to the after-party and golden-club networking mixer.",
    eventDate: daysFromNow(60),
    location: "Bulawayo Campus — Arena",
    organizer: { _id: "adm-1", name: "Dr. Sibusiso Moyo" },
    participants: ["alu-1", "alu-3", "alu-10"],
    createdAt: daysAgo(30),
  },
  {
    _id: "evt-7",
    title: "Startup Pitch Night",
    description:
      "Student teams pitch early-stage ventures to a panel of alumni investors. Prizes and follow-on mentorship on offer.",
    eventDate: daysFromNow(45),
    location: "Harare Campus — Innovation Hub",
    organizer: { _id: "alu-20", name: "Tafara Moyo" },
    participants: ["std-5", "std-11"],
    createdAt: daysAgo(10),
  },
  {
    _id: "evt-8",
    title: "Mentorship Kickoff Breakfast",
    description:
      "Introducing this semester's mentorship pairs. A relaxed breakfast to meet your alumni mentor in person.",
    eventDate: daysFromNow(2),
    location: "Bulawayo Campus — Cafeteria",
    organizer: { _id: "adm-1", name: "Dr. Sibusiso Moyo" },
    participants: ["std-1", "std-4", "std-12", "alu-1", "alu-2", "alu-3"],
    createdAt: daysAgo(4),
  },
];

export const MOCK_EVENT_PARTICIPANTS = {
  "evt-1": ["std-1", "std-2", "std-3", "std-4", "std-6", "std-8", "std-10"],
  "evt-2": ["std-1", "std-5", "std-9"],
  "evt-3": ["std-2", "std-6", "std-10", "std-12"],
};