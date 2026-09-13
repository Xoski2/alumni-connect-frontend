import type { DirectoryUser, DirectoryFilters, FilterOptions } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay } from "./mockMode";
import { MOCK_ALUMNI, MOCK_STUDENTS, DEPARTMENTS } from "../data";

const SKILL_POOL = [
  "JavaScript", "React", "Python", "SQL", "Machine Learning", "TypeScript",
  "AWS", "Networking", "Auditing", "Financial Modelling", "Product Strategy",
  "Marketing", "Docker", "Testing", "Mobile", "Leadership",
];

function applyDirectoryFilters(
  users: DirectoryUser[],
  filters?: DirectoryFilters,
): DirectoryUser[] {
  let results = [...users];
  const dept = filters?.department?.toLowerCase();
  const skill = filters?.skills?.toLowerCase();
  const location = filters?.location?.toLowerCase();
  const search = filters?.search?.toLowerCase().trim();

  if (dept && dept !== "all") {
    results = results.filter((u) => u.department?.toLowerCase() === dept);
  }
  if (skill && skill !== "all") {
    results = results.filter((u) =>
      u.skills?.some((s) => s.toLowerCase() === skill),
    );
  }
  if (location && location !== "all") {
    results = results.filter((u) => u.location?.toLowerCase() === location);
  }
  if (search) {
    results = results.filter((u) =>
      [u.name, u.company, u.position, u.department, u.bio].some((f) =>
        (f ?? "").toLowerCase().includes(search),
      ),
    );
  }
  return results;
}

export async function getAlumniDirectoryApi(
  filters?: DirectoryFilters,
): Promise<{ success: boolean; count: number; alumni: DirectoryUser[] }> {
  if (MOCK_MODE) {
    await mockDelay();
    const alumni = applyDirectoryFilters(MOCK_ALUMNI, filters);
    return { success: true, count: alumni.length, alumni };
  }
  try {
    const params = new URLSearchParams();
    if (filters?.department && filters.department !== "all") {
      params.append("department", filters.department);
    }
    if (filters?.skills && filters.skills !== "all") {
      params.append("skills", filters.skills);
    }
    if (filters?.location && filters.location !== "all") {
      params.append("location", filters.location);
    }
    if (filters?.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }

    const url = `/directory/alumni${params.toString() ? `?${params.toString()}` : ""}`;
    const { data } = await api.get(url);
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load alumni"));
  }
}

export async function getStudentsDirectoryApi(
  filters?: DirectoryFilters,
): Promise<{ success: boolean; count: number; students: DirectoryUser[] }> {
  if (MOCK_MODE) {
    await mockDelay();
    const students = applyDirectoryFilters(MOCK_STUDENTS, filters);
    return { success: true, count: students.length, students };
  }
  try {
    const params = new URLSearchParams();
    if (filters?.department && filters.department !== "all") {
      params.append("department", filters.department);
    }
    if (filters?.skills && filters.skills !== "all") {
      params.append("skills", filters.skills);
    }
    if (filters?.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }

    const url = `/directory/students${params.toString() ? `?${params.toString()}` : ""}`;
    const { data } = await api.get(url);
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load students"));
  }
}

export async function getDirectoryFilterOptionsApi(): Promise<FilterOptions> {
  if (MOCK_MODE) {
    await mockDelay();
    return {
      departments: DEPARTMENTS.map((d) => d.name),
      skills: SKILL_POOL,
      locations: ["Harare", "Bulawayo", "Midlands", "Virtual"],
    };
  }
  try {
    const { data } = await api.get<{
      success: boolean;
      filters: FilterOptions;
    }>("/directory/filters");
    return data.filters;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load filter options"));
  }
}