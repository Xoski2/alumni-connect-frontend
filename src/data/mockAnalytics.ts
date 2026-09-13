import type { DashboardStats } from "../api/userApi";
import { DEPARTMENTS, ENTRY_YEARS, GRADUATION_YEARS } from "./departments";

/**
 * Deterministic analytics datasets for the admin dashboard & analytics page.
 * No randomness — every call returns stable numbers so charts look consistent.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  users: {
    total: 1841,
    students: 1280,
    alumni: 548,
    pendingAlumni: 6,
    admins: 7,
  },
  mentorship: {
    total: 216,
    pending: 31,
    completed: 152,
    active: 33,
  },
  jobs: {
    total: 64,
    active: 42,
    pending: 5,
  },
  events: {
    total: 28,
    upcoming: 9,
  },
  charts: {
    departmentDistribution: DEPARTMENTS.map((d, i) => ({
      _id: d.name,
      count: [312, 388, 297, 254, 340][i % 5] + i * 13,
    })),
    monthlyRegistrations: MONTHS.map((month, i) => ({
      month,
      registrations: 60 + Math.round(52 * Math.sin(i / 1.6) + i * 9 + 14),
    })),
    mentorshipByDepartment: DEPARTMENTS.map((d, i) => ({
      _id: d.name,
      count: [48, 61, 39, 33, 35][i % 5],
    })),
    userGrowth: (() => {
      const out: DashboardStats["charts"]["userGrowth"] = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
        const iso = date.toISOString().slice(0, 10);
        out.push({
          _id: { date: iso, role: "student" },
          count: 24 + Math.round(18 * Math.sin(i / 1.4)) + i,
        });
        out.push({
          _id: { date: iso, role: "alumni" },
          count: 10 + Math.round(6 * Math.cos(i / 2)) + i,
        });
      }
      return out.reverse();
    })(),
  },
};

export interface AnalyticsFilters {
  from?: string;
  to?: string;
  userType?: "all" | "student" | "alumni";
  department?: string;
  programme?: string;
  entryYear?: number | "all";
  graduationYear?: number | "all";
  campus?: string;
  entryType?: string;
}

export interface AnalyticsDataset {
  studentsVsAlumni: Array<{ name: string; value: number }>;
  newRegistrations: Array<{ month: string; students: number; alumni: number }>;
  activeUsers: Array<{ month: string; count: number }>;
  alumniByDepartment: Array<{ name: string; count: number }>;
  usersByProgramme: Array<{ name: string; count: number }>;
  graduationDistribution: Array<{ name: string; count: number }>;
  campusDistribution: Array<{ name: string; value: number }>;
  engagement: {
    posts: number;
    likes: number;
    comments: number;
    connections: number;
    eventParticipants: number;
    mentorship: number;
  };
  engagementTrend: Array<{ month: string; posts: number; connections: number; mentorships: number }>;
  career: {
    jobsPosted: number;
    applications: number;
    savedJobs: number;
    pendingJobs: number;
    hires: number;
  };
  applicationsByJob: Array<{ name: string; value: number }>;
}

const W = (base: number, i: number, variance = 0.18) =>
  Math.max(4, Math.round(base * (1 + Math.sin(i * 1.3 + base) * variance)));

export function getAnalyticsDataset(filters: AnalyticsFilters = {}): AnalyticsDataset {
  const { department, userType, graduationYear } = filters;

  let deptSlice = DEPARTMENTS;
  if (department && department !== "all") {
    deptSlice = deptSlice.filter((d) => d.name === department);
  }
  const universalCount = (base: number, i: number) =>
    W(Math.round(base * (deptSlice.length / DEPARTMENTS.length + 0.6)), i) + i * 4;

  const gradSlice =
    graduationYear && graduationYear !== "all"
      ? new Set([graduationYear])
      : new Set(GRADUATION_YEARS);

  return {
    studentsVsAlumni: [
      { name: "Students", value: 639 + universalCount(641, 1) },
      { name: "Alumni", value: 274 + universalCount(274, 3) },
    ],
    newRegistrations: MONTHS.map((month, i) => ({
      month,
      students: W(34, i) + universalCount(12, i),
      alumni: W(16, i + 2) + universalCount(7, i),
    })),
    activeUsers: MONTHS.map((month, i) => ({
      month,
      count: W(290, i) + universalCount(60, i),
    })),
    alumniByDepartment: DEPARTMENTS.map((d, i) => ({
      name: d.name,
      count: universalCount(74, i) + (department && department !== "all" && d.name !== department ? 0 : 20),
    })).filter((d) => d.count > 0),
    usersByProgramme: deptSlice.flatMap((d) => {
      const progs = d.programs ?? [];
      return progs.map((_p, i) => ({
        name: d.name,
        count: universalCount(80, i + d.name.length),
      }));
    }),
    graduationDistribution: GRADUATION_YEARS.filter((y) => gradSlice.has(y)).map((y, i) => ({
      name: String(y),
      count: universalCount(48, i + y),
    })),
    campusDistribution: [
      { name: "Bulawayo", value: 380 + universalCount(300, 1) },
      { name: "Harare", value: 240 + universalCount(180, 2) },
      { name: "Midlands", value: 98 + universalCount(80, 3) },
    ],
    engagement: {
      posts: 42 + universalCount(20, 1),
      likes: 486 + universalCount(420, 2),
      comments: 158 + universalCount(140, 3),
      connections: 90 + universalCount(80, 4),
      eventParticipants: 34 + universalCount(30, 5),
      mentorship: 27 + universalCount(22, 6),
    },
    engagementTrend: MONTHS.map((month, i) => ({
      month,
      posts: W(28, i),
      connections: W(54, i + 1),
      mentorships: W(14, i + 3),
    })),
    career: {
      jobsPosted: 28 + universalCount(20, 1),
      applications: 141 + universalCount(120, 2),
      savedJobs: 63 + universalCount(50, 3),
      pendingJobs: 4 + iif(userType === "alumni", 2),
      hires: 9 + universalCount(6, 4),
    },
    applicationsByJob: [
      { name: "Software Engineer", value: 34 },
      { name: "Data Intern", value: 27 },
      { name: "Cloud Support", value: 22 },
      { name: "Graduate Auditor", value: 19 },
      { name: "Flutter Dev", value: 15 },
      { name: "Marketing Intern", value: 13 },
      { name: "QA Engineer", value: 11 },
    ],
  };
}

function iif(cond: boolean, v: number): number {
  return cond ? v : 0;
}

export const ANALYTICS_FILTER_OPTIONS = {
  campuses: ["Bulawayo", "Harare", "Midlands"],
  entryTypes: ["National Entry", "Parallel Entry", "Distance Learning"],
  entryYears: ENTRY_YEARS,
  graduationYears: GRADUATION_YEARS,
};