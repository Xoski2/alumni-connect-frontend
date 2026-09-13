import type { AlumniConnectionsResponse, StudentConnectionRow } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast } from "./mockMode";
import { MOCK_ALUMNI, MOCK_STUDENTS } from "../data";

const MOCK_STUDENT_CONNECTIONS: StudentConnectionRow[] = [
  {
    _id: "conn-s1",
    status: "pending",
    alumni: MOCK_ALUMNI[0],
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "conn-s2",
    status: "accepted",
    alumni: MOCK_ALUMNI[1],
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "conn-s3",
    status: "accepted",
    alumni: MOCK_ALUMNI[2],
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_ALUMNI_CONNECTIONS: AlumniConnectionsResponse = {
  pending: [
    {
      _id: "conn-a1",
      status: "pending",
      student: MOCK_STUDENTS[0],
      createdAt: new Date().toISOString(),
    },
    {
      _id: "conn-a2",
      status: "pending",
      student: MOCK_STUDENTS[3],
      createdAt: new Date().toISOString(),
    },
  ],
  accepted: [
    {
      _id: "conn-a3",
      status: "accepted",
      student: MOCK_STUDENTS[1],
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "conn-a4",
      status: "accepted",
      student: MOCK_STUDENTS[2],
      updatedAt: new Date().toISOString(),
    },
  ],
};

export async function requestConnectionApi(
  alumniId: string,
): Promise<StudentConnectionRow> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const alumni = MOCK_ALUMNI.find((a) => a._id === alumniId) ?? MOCK_ALUMNI[0];
    const row: StudentConnectionRow = {
      _id: `conn-${Date.now()}`,
      status: "pending",
      alumni,
      updatedAt: new Date().toISOString(),
    };
    MOCK_STUDENT_CONNECTIONS.unshift(row);
    return row;
  }
  try {
    const { data } = await api.post<StudentConnectionRow>(
      "/connections/request",
      {
        alumniId,
      },
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Could not send request"));
  }
}

export async function getStudentConnectionsApi(): Promise<
  StudentConnectionRow[]
> {
  if (MOCK_MODE) {
    await mockDelay();
    return [...MOCK_STUDENT_CONNECTIONS];
  }
  try {
    const { data } = await api.get("/connections/student");
    return Array.isArray(data) ? data : (data.connections ?? data.data ?? []);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load connections"));
  }
}

export async function getAlumniConnectionsApi(): Promise<AlumniConnectionsResponse> {
  if (MOCK_MODE) {
    await mockDelay();
    return {
      pending: [...MOCK_ALUMNI_CONNECTIONS.pending],
      accepted: [...MOCK_ALUMNI_CONNECTIONS.accepted],
    };
  }
  try {
    const { data } = await api.get<AlumniConnectionsResponse>(
      "/connections/alumni",
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load requests"));
  }
}

export async function acceptConnectionApi(id: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const idx = MOCK_ALUMNI_CONNECTIONS.pending.findIndex((r) => r._id === id);
    if (idx >= 0) {
      const [row] = MOCK_ALUMNI_CONNECTIONS.pending.splice(idx, 1);
      MOCK_ALUMNI_CONNECTIONS.accepted.push({ ...row, status: "accepted" });
    }
    return;
  }
  try {
    await api.put(`/connections/${id}/accept`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to accept"));
  }
}

export async function rejectConnectionApi(id: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const idx = MOCK_ALUMNI_CONNECTIONS.pending.findIndex((r) => r._id === id);
    if (idx >= 0) MOCK_ALUMNI_CONNECTIONS.pending.splice(idx, 1);
    return;
  }
  try {
    await api.delete(`/connections/${id}`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to decline"));
  }
}

export async function cancelConnectionApi(id: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const idx = MOCK_STUDENT_CONNECTIONS.findIndex((r) => r._id === id);
    if (idx >= 0) MOCK_STUDENT_CONNECTIONS.splice(idx, 1);
    return;
  }
  try {
    await api.delete(`/connections/${id}`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to cancel"));
  }
}