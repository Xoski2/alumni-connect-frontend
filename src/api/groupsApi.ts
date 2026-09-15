import type { Post } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast } from "./mockMode";
import { MOCK_GROUPS, type Group } from "../data/mockGroups";
import { MOCK_USERS } from "../data";

const MY_GROUPS = new Set<string>(["grp-1", "grp-3"]);

const daysAgo = (d: number) => new Date(Date.now() - d * 86400 * 1000).toISOString();

const GROUP_POSTS: Record<string, Post[]> = {
  "grp-1": [
    {
      _id: "gpost-1-1",
      author: { _id: "alu-1", name: "Tinashe Dlamini", role: "alumni", position: "Software Engineer", graduationYear: "2019" },
      category: "Job",
      text: "Two junior engineering roles just opened at Old Mutual. Happy to review CVs for anyone in this group — drop me a message.",
      likes: [],
      comments: [],
      createdAt: daysAgo(1),
    },
    {
      _id: "gpost-1-2",
      author: { _id: "std-1", name: "Tapiwa Moyo", role: "student", graduationYear: "2026" },
      category: "General",
      text: "Anyone grinding LeetCode together for interviews this semester? Thinking of a weekly pairing session on campus.",
      likes: [],
      comments: [],
      createdAt: daysAgo(2),
    },
  ],
  "grp-2": [
    {
      _id: "gpost-2-1",
      author: { _id: "adm-1", name: "Dr. Sibusiso Moyo", role: "admin" },
      category: "Event",
      text: "Career Fair 2026 is confirmed for the Blantyre Campus main hall — registration opens this week!",
      likes: [],
      comments: [],
      createdAt: daysAgo(3),
    },
  ],
  "grp-5": [
    {
      _id: "gpost-5-1",
      author: { _id: "alu-20", name: "Sihle Ncube", role: "alumni", position: "Founder", graduationYear: "2020" },
      category: "General",
      text: "Bootstrapped founder here — happy to share what I wish I'd known about pitching, funding and pricing. Ask away!",
      likes: [],
      comments: [],
      createdAt: daysAgo(4),
    },
  ],
  "grp-6": [
    {
      _id: "gpost-6-1",
      author: { _id: "alu-4", name: "Chido Manyika", role: "alumni", position: "Senior Auditor", graduationYear: "2018" },
      category: "Career Update",
      text: "We're recruiting graduate auditors for the 2026 intake. CV clinics held every Friday this month.",
      likes: [],
      comments: [],
      createdAt: daysAgo(2),
    },
  ],
};

export async function getGroupsApi(): Promise<Group[]> {
  if (MOCK_MODE) {
    await mockDelay();
    return MOCK_GROUPS;
  }
  try {
    const { data } = await api.get("/groups");
    return Array.isArray(data) ? data : (data.groups ?? []);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to fetch groups"));
  }
}

export async function toggleJoinGroupApi(
  id: string,
): Promise<{ joined: boolean; memberCount: number }> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const group = MOCK_GROUPS.find((g) => g._id === id);
    if (!group) throw new Error("Group not found");
    if (MY_GROUPS.has(id)) {
      MY_GROUPS.delete(id);
      group.memberCount = Math.max(0, group.memberCount - 1);
      return { joined: false, memberCount: group.memberCount };
    }
    MY_GROUPS.add(id);
    group.memberCount += 1;
    return { joined: true, memberCount: group.memberCount };
  }
  try {
    const { data } = await api.post<{ joined: boolean; memberCount: number }>(
      `/groups/${id}/toggle`,
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Could not update group membership"));
  }
}

export async function isInGroupApi(id: string): Promise<boolean> {
  return MOCK_MODE ? MY_GROUPS.has(id) : false;
}

export async function getGroupPostsApi(id: string): Promise<Post[]> {
  if (MOCK_MODE) {
    await mockDelayFast();
    return GROUP_POSTS[id] ?? [];
  }
  try {
    const { data } = await api.get<Post[]>(`/groups/${id}/posts`);
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load group posts"));
  }
}

export async function getGroupMemberNamesApi(id: string): Promise<string[]> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const group = MOCK_GROUPS.find((g) => g._id === id);
    const n = group?.memberCount ?? 0;
    if (n <= 0) return [];
    return MOCK_USERS.slice(0, Math.min(8, n)).map((u) => u.name);
  }
  try {
    const { data } = await api.get<string[]>(`/groups/${id}/members`);
    return data;
  } catch {
    return [];
  }
}