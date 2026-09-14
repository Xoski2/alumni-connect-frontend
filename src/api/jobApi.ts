import type { Job } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast } from "./mockMode";
import { MOCK_JOBS, MOCK_INDEPENDENT_JOBS } from "../data";

const ALL_JOBS = [...MOCK_JOBS, ...MOCK_INDEPENDENT_JOBS];

export async function getJobsApi(): Promise<Job[]> {
  if (MOCK_MODE) {
    await mockDelay();
    return ALL_JOBS;
  }
  try {
    const { data } = await api.get("/jobs");
    return Array.isArray(data) ? data : (data.jobs ?? []);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to fetch jobs"));
  }
}

export async function createJobApi(data: Partial<Job>): Promise<Job> {
  if (MOCK_MODE) {
    await mockDelay();
    const id = `job-${Date.now()}`;
    const newJob: Job = {
      _id: id,
      title: data.title ?? "New Job",
      company: data.company ?? "Exploits University",
      location: data.location ?? "Lilongwe",
      description: data.description ?? "",
      requirements: data.requirements ?? [],
      salary: data.salary,
      deadline: data.deadline,
      contactEmail: data.contactEmail,
      type: data.type,
      postedBy: {
        _id: data.postedBy?._id ?? "alu-1",
        name: data.postedBy?.name ?? "Tinashe Dlamini",
        profilePhoto: data.postedBy?.profilePhoto,
      },
      status: "pending",
      applicants: [],
      createdAt: new Date().toISOString(),
    };
    ALL_JOBS.unshift(newJob);
    MOCK_JOBS.unshift(newJob);
    return newJob;
  }
  try {
    const { data: job } = await api.post<Job>("/jobs", data);
    return job;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to create job"));
  }
}

export async function updateJobApi(
  id: string,
  data: Partial<Job>,
): Promise<Job> {
  if (MOCK_MODE) {
    await mockDelay();
    const idx = ALL_JOBS.findIndex((j) => j._id === id);
    if (idx < 0) throw new Error("Job not found");
    ALL_JOBS[idx] = { ...ALL_JOBS[idx], ...data };
    return ALL_JOBS[idx];
  }
  try {
    const { data: updatedJob } = await api.put<Job>(`/jobs/${id}`, data);
    return updatedJob;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to update job"));
  }
}

export async function deleteJobApi(id: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const idx = ALL_JOBS.findIndex((j) => j._id === id);
    if (idx >= 0) ALL_JOBS.splice(idx, 1);
    return;
  }
  try {
    await api.delete(`/jobs/${id}`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to delete job"));
  }
}

export async function approveJobApi(id: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const job = ALL_JOBS.find((j) => j._id === id);
    if (job) job.status = "approved";
    return;
  }
  try {
    await api.put(`/admin/approve-job/${id}`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to approve job"));
  }
}

export async function applyJobApi(id: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const job = ALL_JOBS.find((j) => j._id === id);
    if (job) {
      if (!job.applicants) job.applicants = [];
      if (!job.applicants.includes("alu-1")) job.applicants.push("alu-1");
    }
    return;
  }
  try {
    await api.post(`/jobs/${id}/apply`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to apply"));
  }
}

export interface JobStats {
  totalAvailable: number;
  applied: number;
  remaining: number;
}

export const getJobStatsApi = async (): Promise<JobStats> => {
  if (MOCK_MODE) {
    await mockDelayFast();
    const available = ALL_JOBS.filter((j) => j.status === "approved");
    const applied = available.filter(
      (j) => j.applicants?.includes("alu-1"),
    ).length;
    return {
      totalAvailable: available.length,
      applied,
      remaining: available.length - applied,
    };
  }
  const { data } = await api.get<{ success: boolean; stats: JobStats }>(
    "/jobs/stats",
  );
  return data.stats;
};