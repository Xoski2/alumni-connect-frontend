import type { User } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast, mockIdentifiableUser } from "./mockMode";
import { MOCK_USERS } from "../data";

/**
 * Recommendations + skill endorsements (mock).
 * Recommendations are written by one member about another; endorsements are
 * lightweight likes on a profile's skills.
 */

export type RecommendationRelation =
  | "mentor"
  | "manager"
  | "colleague"
  | "mentee"
  | "peer";

export interface Recommendation {
  _id: string;
  from: {
    _id: string;
    name: string;
    role: string;
    position?: string;
  };
  relation: RecommendationRelation;
  text: string;
  createdAt: string;
}

export type SkillEndorsements = Record<string, number>;

/** Viewers' written recommendations, keyed by the profile they were written about. */
const WRITTEN: Record<string, Recommendation[]> = {};

/** In-memory endorsement extras keyed by `${userId}::${skill}`. */
const ENDORSE_EXTRAS = new Map<string, number>();

const RELATION_LABELS: Record<RecommendationRelation, string> = {
  mentor: "mentor",
  manager: "manager",
  colleague: "colleague",
  mentee: "mentee",
  peer: "peer",
};

const daysAgo = (d: number) => new Date(Date.now() - d * 86400 * 1000).toISOString();

function currentUserId(): string {
  return mockIdentifiableUser()._id;
}

function peerSnippets(userId: string): Array<{ id: string; role: string; position?: string }> {
  return MOCK_USERS.filter((u) => u._id !== userId && u.role !== "admin").map(
    (u) => ({ id: u._id, role: u.role, position: u.position }),
  );
}

function seededRecommendations(user: User): Recommendation[] {
  const peers = peerSnippets(user._id);
  const [a, b] = peers.length > 1 ? peers : [];
  const out: Recommendation[] = [];
  if (a) {
    const aUser = MOCK_USERS.find((u) => u._id === a.id)!;
    out.push({
      _id: `rec-${user._id}-1`,
      from: { _id: a.id, name: aUser.name, role: a.role, position: a.position },
      relation: user.role === "alumni" ? "colleague" : "mentor",
      text:
        user.role === "alumni"
          ? `I worked alongside ${user.name} at ${user.company ?? "a leading firm"} and was consistently impressed by their focus, reliability and how they lift the people around them. A genuine professional.`
          : `${user.name} is one of the standout students I've mentored — curious, hard-working and quick to apply feedback. They will go far in ${user.program ?? "their field"}.`,
      createdAt: daysAgo(12 + (user._id.length % 20)),
    });
  }
  if (b) {
    const bUser = MOCK_USERS.find((u) => u._id === b.id)!;
    out.push({
      _id: `rec-${user._id}-2`,
      from: { _id: b.id, name: bUser.name, role: b.role, position: b.position },
      relation: "peer",
      text: `I've seen ${user.name} lead initiatives and support their peers time and again. Honest, dependable and always willing to share knowledge.`,
      createdAt: daysAgo(40 + (user._id.length % 30)),
    });
  }
  return out;
}

function allRecommendations(user: User): Recommendation[] {
  const seeded = seededRecommendations(user);
  const extra = WRITTEN[user._id] ?? [];
  return [...extra, ...seeded];
}

export async function getRecommendationsApi(
  userId?: string,
): Promise<Recommendation[]> {
  const id = userId ?? currentUserId();
  if (MOCK_MODE) {
    await mockDelayFast();
    const user = MOCK_USERS.find((u) => u._id === id) ?? MOCK_USERS[0];
    return allRecommendations(user);
  }
  try {
    const { data } = await api.get<Recommendation[]>(
      userId ? `/users/${userId}/recommendations` : "/profile/recommendations",
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load recommendations"));
  }
}

export async function addRecommendationApi(
  targetUserId: string,
  payload: { relation: RecommendationRelation; text: string },
): Promise<Recommendation[]> {
  if (MOCK_MODE) {
    await mockDelay();
    const me = MOCK_USERS.find((u) => u._id === currentUserId());
    const rec: Recommendation = {
      _id: `rec-${Date.now()}`,
      from: {
        _id: me?._id ?? "alu-1",
        name: me?.name ?? "You",
        role: me?.role ?? "alumni",
        position: me?.position,
      },
      relation: payload.relation,
      text: payload.text,
      createdAt: new Date().toISOString(),
    };
    WRITTEN[targetUserId] = [rec, ...(WRITTEN[targetUserId] ?? [])];
    const user = MOCK_USERS.find((u) => u._id === targetUserId) ?? MOCK_USERS[0];
    return allRecommendations(user);
  }
  try {
    const { data } = await api.post<Recommendation[]>(
      `/users/${targetUserId}/recommendations`,
      payload,
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Could not submit recommendation"));
  }
}

/** Deterministic + in-memory endorsement counts for each of a user's skills. */
export async function getSkillEndorsementsApi(
  userId?: string,
): Promise<SkillEndorsements> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const id = userId ?? currentUserId();
    const user = MOCK_USERS.find((u) => u._id === id) ?? MOCK_USERS[0];
    const skills = user.skills ?? [];
    const out: SkillEndorsements = {};
    skills.forEach((s, i) => {
      out[s] = (2 + ((user._id.length + i * 3) % 9)) + (ENDORSE_EXTRAS.get(`${id}::${s}`) ?? 0);
    });
    return out;
  }
  try {
    const { data } = await api.get<SkillEndorsements>(
      userId ? `/users/${userId}/skill-endorsements` : "/profile/skill-endorsements",
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load endorsements"));
  }
}

export async function endorseSkillApi(
  targetUserId: string,
  skill: string,
): Promise<{ skill: string; count: number }> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const key = `${targetUserId}::${skill}`;
    const next = (ENDORSE_EXTRAS.get(key) ?? 0) + 1;
    ENDORSE_EXTRAS.set(key, next);
    const user = MOCK_USERS.find((u) => u._id === targetUserId) ?? MOCK_USERS[0];
    const idx = (user.skills ?? []).indexOf(skill);
    const base = idx >= 0 ? 2 + ((targetUserId.length + idx * 3) % 9) : 0;
    return { skill, count: base + next };
  }
  try {
    const { data } = await api.post<{ skill: string; count: number }>(
      `/users/${targetUserId}/endorse`,
      { skill },
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Could not endorse skill"));
  }
}

export { RELATION_LABELS };