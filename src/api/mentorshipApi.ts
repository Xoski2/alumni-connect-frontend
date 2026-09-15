import type { DirectoryUser } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockIdentifiableUser } from "./mockMode";
import { MOCK_ALUMNI, MOCK_STUDENTS, MOCK_USERS } from "../data";

/**
 * Mentorship matching (mock): students are matched to alumni mentors by
 * department, programme and skills overlap. Scores are deterministic.
 */

export interface MentorMatch {
  mentor: DirectoryUser;
  matchScore: number;
  matchReasons: string[];
  availability: boolean;
  responseRate: string;
}

export interface MenteeMatch {
  student: DirectoryUser;
  matchScore: number;
  interests: string[];
  matchedOn: string[];
}

export interface MentorshipEndorsed {
  requestSent?: string[];
  offered?: string[];
}

const REQUEST_SENT = new Set<string>();
const OFFERED = new Set<string>();

function current(): { _id: string; role: string } {
  const { _id, role } = mockIdentifiableUser();
  const u = MOCK_USERS.find((x) => x._id === _id);
  return { _id, role: u?.role ?? role };
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function overlap(a: string[] = [], b: string[] = []): string[] {
  return a.filter((it) => b.includes(it));
}

function deptOf(u: { department?: string; program?: string }): string {
  return u.department ?? "";
}

export async function getMentorMatchesApi(): Promise<MentorMatch[]> {
  if (MOCK_MODE) {
    await mockDelay();
    const me = current();
    const meUser = MOCK_USERS.find((u) => u._id === me._id);
    const mentors = MOCK_ALUMNI.filter((a) => a._id !== me._id);

    const scored: MentorMatch[] = mentors
      .map((m) => {
        let score = 0;
        const reasons: string[] = [];
        if (deptOf(m) && deptOf(m) === deptOf(meUser ?? {})) {
          score += 35;
          reasons.push(`Same department — ${m.department}`);
        }
        if (m.program && m.program === meUser?.program) {
          score += 15;
          reasons.push("Completed your programme");
        }
        const skillOverlap = overlap(m.skills, meUser?.skills);
        if (skillOverlap.length > 0) {
          score += Math.min(skillOverlap.length * 10, 30);
          reasons.push(
            `Shares skills like ${skillOverlap.slice(0, 3).join(", ")}`,
          );
        }
        if (meUser?.interests?.length) {
          score += 6;
          reasons.push("Actively interested in mentorship");
        }
        const bonus = hash(m._id + me._id) % 14;
        score = Math.min(score + bonus, 98);
        return {
          mentor: m,
          matchScore: score,
          matchReasons: reasons,
          availability: bonus < 8,
          responseRate: `${80 + (hash(m._id) % 18)}%`,
        };
      })
      .filter((m) => m.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 9);
    return scored;
  }
  try {
    const { data } = await api.get<MentorMatch[]>("/mentors/matches");
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load mentor matches"));
  }
}

export async function getMenteeMatchesApi(): Promise<MenteeMatch[]> {
  if (MOCK_MODE) {
    await mockDelay();
    const meUser = MOCK_USERS.find((u) => u._id === current()._id);
    const students = MOCK_STUDENTS.filter((s) => s._id !== meUser?._id);
    const scored: MenteeMatch[] = students
      .map((s) => {
        let score = 0;
        const matchedOn: string[] = [];
        if (deptOf(s) === deptOf(meUser ?? {})) {
          score += 40;
          matchedOn.push(`Same department (${s.department})`);
        }
        if (s.program === meUser?.program) {
          score += 15;
          matchedOn.push("Same programme");
        }
        const skillOverlap = overlap(s.skills, meUser?.skills);
        if (skillOverlap.length > 0) {
          score += Math.min(skillOverlap.length * 8, 24);
          matchedOn.push(`Shares skills: ${skillOverlap.slice(0, 2).join(", ")}`);
        }
        score += hash(s._id) % 15;
        return {
          student: s,
          matchScore: Math.min(score, 96),
          interests: ["Career guidance", "Interview prep", "CV review"].filter(
            (_, i) => i < 1 + (score % 3),
          ),
          matchedOn,
        };
      })
      .filter((m) => m.matchScore >= 35)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 9);
    return scored;
  }
  try {
    const { data } = await api.get<MenteeMatch[]>("/mentors/mentees");
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load mentee matches"));
  }
}

export async function requestMentorshipApi(mentorId: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelay();
    REQUEST_SENT.add(mentorId);
    return;
  }
  try {
    await api.post("/mentors/request", { mentorId });
  } catch (e) {
    throw new Error(getErrorMessage(e, "Could not send mentorship request"));
  }
}

export async function offerMentorshipApi(studentId: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelay();
    OFFERED.add(studentId);
    return;
  }
  try {
    await api.post("/mentors/offer", { studentId });
  } catch (e) {
    throw new Error(getErrorMessage(e, "Could not send offer"));
  }
}

export async function getMentorshipStateApi(): Promise<MentorshipEndorsed> {
  return { requestSent: [...REQUEST_SENT], offered: [...OFFERED] };
}