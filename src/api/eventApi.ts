import type { Event } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast } from "./mockMode";
import { MOCK_EVENTS } from "../data";

export async function getEventsApi(): Promise<Event[]> {
  if (MOCK_MODE) {
    await mockDelay();
    return [...MOCK_EVENTS];
  }
  try {
    const { data } = await api.get("/events");
    return Array.isArray(data) ? data : (data.events ?? []);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to fetch events"));
  }
}

export async function createEventApi(data: Partial<Event>): Promise<Event> {
  if (MOCK_MODE) {
    await mockDelay();
    const id = `evt-${Date.now()}`;
    const ev: Event = {
      _id: id,
      title: data.title ?? "New Event",
      description: data.description ?? "",
      eventDate: data.eventDate ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: data.location ?? "Blantyre Campus",
      organizer: {
        _id: data.organizer?._id ?? "adm-1",
        name: data.organizer?.name ?? "Dr. Sibusiso Moyo",
      },
      participants: [],
      createdAt: new Date().toISOString(),
    };
    MOCK_EVENTS.unshift(ev);
    return ev;
  }
  try {
    const { data: ev } = await api.post<Event>("/events", data);
    return ev;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to create event"));
  }
}

export async function deleteEventApi(id: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const idx = MOCK_EVENTS.findIndex((e) => e._id === id);
    if (idx >= 0) MOCK_EVENTS.splice(idx, 1);
    return;
  }
  try {
    await api.delete(`/admin/events/${id}`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to delete event"));
  }
}

export async function joinEventApi(id: string): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const ev = MOCK_EVENTS.find((e) => e._id === id);
    if (ev) {
      if (!ev.participants) ev.participants = [];
      if (!ev.participants.includes("alu-1")) ev.participants.push("alu-1");
    }
    return;
  }
  try {
    await api.post(`/events/${id}/join`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to join event"));
  }
}

// ── Participants details (admin) ──────────────────────────────────────────────
export interface EventParticipant {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  profilePhoto: string;
  graduationYear: string;
  university: string;
  company: string;
  position: string;
}

export interface EventParticipantsResponse {
  eventId: string;
  title: string;
  eventDate: string;
  location: string;
  total: number;
  participants: EventParticipant[];
}

const MOCK_PARTICIPANTS: EventParticipantsResponse[] = [
  {
    eventId: "evt-1",
    title: "Career Fair 2026",
    eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Blantyre Campus — Main Hall",
    total: 7,
    participants: [
      { _id: "std-1", name: "Tapiwa Moyo", email: "student1@exploits.ac.zw", role: "student", phone: "+263 773 111 222", profilePhoto: "", graduationYear: "2027", university: "Exploits University", company: "", position: "" },
      { _id: "std-2", name: "Rudo Chikafu", email: "student2@exploits.ac.zw", role: "student", phone: "+263 774 333 444", profilePhoto: "", graduationYear: "2027", university: "Exploits University", company: "", position: "" },
      { _id: "std-3", name: "Farai Ndlovu", email: "student3@exploits.ac.zw", role: "student", phone: "+263 775 555 666", profilePhoto: "", graduationYear: "2028", university: "Exploits University", company: "", position: "" },
      { _id: "std-4", name: "Nyaradzo Dube", email: "student4@exploits.ac.zw", role: "student", phone: "+263 776 777 888", profilePhoto: "", graduationYear: "2026", university: "Exploits University", company: "", position: "" },
    ],
  },
];

export async function getEventParticipantsApi(
  id: string,
): Promise<EventParticipantsResponse> {
  if (MOCK_MODE) {
    await mockDelay();
    const existing = MOCK_PARTICIPANTS.find((p) => p.eventId === id);
    if (existing) return existing;
    const ev = MOCK_EVENTS.find((e) => e._id === id);
    if (!ev) throw new Error("Event not found");
    return {
      eventId: ev._id,
      title: ev.title,
      eventDate: ev.eventDate,
      location: ev.location ?? "",
      total: ev.participants?.length ?? 0,
      participants: (ev.participants ?? []).map((pid, i) => ({
        _id: pid,
        name: `Participant ${i + 1}`,
        email: `${pid}@exploits.ac.zw`,
        role: pid.startsWith("alu") ? "alumni" : "student",
        phone: "",
        profilePhoto: "",
        graduationYear: pid.startsWith("alu") ? "2020" : "2026",
        university: "Exploits University",
        company: "",
        position: "",
      })),
    };
  }
  try {
    const { data } = await api.get<EventParticipantsResponse>(
      `/events/${id}/participants`,
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to fetch participants"));
  }
}