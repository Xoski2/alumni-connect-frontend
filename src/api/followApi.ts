import type { ProfileConnectionPresence } from "../types/profile";
import type { User } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast, mockIdentifiableUser } from "./mockMode";
import { MOCK_USERS, headlineFor } from "../data";

/**
 * Mock follow system (LinkedIn-inspired but simpler than connections).
 * A follow is a lightweight one-way subscription used for feed filtering.
 */

/** Deterministic seeded follower lists (who follows whom). */
const SEED_FOLLOWERS: Record<string, string[]> = {
  "alu-1": ["alu-2", "alu-4", "std-1", "std-3", "std-6"],
  "alu-2": ["alu-1", "alu-5", "std-2"],
  "alu-3": ["alu-1", "alu-6", "std-5", "std-8"],
  "std-1": ["alu-1", "alu-2", "alu-7", "std-2"],
  "std-2": ["alu-3", "std-1"],
  "alu-5": ["std-1", "std-4", "std-9"],
  "alu-8": ["alu-1", "std-2", "std-5", "std-10"],
};

/** The viewer's own following list for the current session. */
const MY_FOLLOWING = new Set<string>(["alu-2", "alu-5", "alu-8"]);

function currentUserId(): string {
  return mockIdentifiableUser()._id;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function followersFor(userId: string): string[] {
  if (SEED_FOLLOWERS[userId]) return [...SEED_FOLLOWERS[userId]];
  const pool = MOCK_USERS.filter((u) => u._id !== userId && u.role !== "admin");
  const n = 2 + (hash(userId) % 4);
  return pool.slice(0, n).map((u) => u._id);
}

function toPresence(u: User): ProfileConnectionPresence {
  return {
    _id: u._id,
    name: u.name,
    profilePhoto: u.profilePhoto,
    headline: headlineFor(u),
    program: u.program,
    graduationYear: u.graduationYear,
    company: u.company,
    position: u.position,
    mutual: hash(u._id) % 6,
  };
}

function resolve(ids: string[]): ProfileConnectionPresence[] {
  return ids
    .map((id) => MOCK_USERS.find((u) => u._id === id))
    .filter((u): u is User => Boolean(u))
    .map(toPresence);
}

export async function getProfileFollowersApi(
  userId?: string,
): Promise<ProfileConnectionPresence[]> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const id = userId ?? currentUserId();
    return resolve(followersFor(id));
  }
  try {
    const { data } = await api.get<ProfileConnectionPresence[]>(
      userId ? `/users/${userId}/followers` : "/profile/followers",
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load followers"));
  }
}

export async function getFollowingApi(): Promise<ProfileConnectionPresence[]> {
  if (MOCK_MODE) {
    await mockDelayFast();
    return resolve([...MY_FOLLOWING]);
  }
  try {
    const { data } = await api.get<ProfileConnectionPresence[]>("/profile/following");
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load following"));
  }
}

export async function isFollowingApi(targetId: string): Promise<boolean> {
  if (MOCK_MODE) {
    return MY_FOLLOWING.has(targetId);
  }
  try {
    const { data } = await api.get<{ following: boolean }>(
      `/users/${targetId}/follow-status`,
    );
    return data.following;
  } catch {
    return false;
  }
}

/** Toggles follow state for the current viewer. Returns the new state. */
export async function toggleFollowApi(
  targetId: string,
): Promise<{ following: boolean }> {
  if (MOCK_MODE) {
    await mockDelay();
    if (MY_FOLLOWING.has(targetId)) MY_FOLLOWING.delete(targetId);
    else MY_FOLLOWING.add(targetId);
    return { following: MY_FOLLOWING.has(targetId) };
  }
  try {
    const { data } = await api.post<{ following: boolean }>(
      `/users/${targetId}/follow`,
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Could not update follow"));
  }
}

/** Ids the current viewer follows — used for feed filtering. */
export async function getFollowingIdsApi(): Promise<string[]> {
  if (MOCK_MODE) {
    await mockDelayFast();
    return [...MY_FOLLOWING];
  }
  try {
    const { data } = await api.get<{ following: string[] }>("/profile/following-ids");
    return data.following;
  } catch {
    return [];
  }
}