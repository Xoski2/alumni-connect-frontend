import type { Event } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast, mockIdentifiableUser } from "./mockMode";
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
    const me = mockIdentifiableUser()._id;
    if (ev) {
      if (!ev.participants) ev.participants = [];
      if (!ev.participants.includes(me)) ev.participants.push(me);
    }
    return;
  }
  try {
    await api.post(`/events/${id}/join`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to join event"));
  }
}

export interface RsvpState {
  rsvped: boolean;
  count: number;
}

/** Toggles RSVP for the current user and returns the new state. */
export async function toggleRsvpApi(id: string): Promise<RsvpState> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const ev = MOCK_EVENTS.find((e) => e._id === id);
    const me = mockIdentifiableUser()._id;
    if (!ev) return { rsvped: false, count: 0 };
    if (!ev.participants) ev.participants = [];
    const idx = ev.participants.indexOf(me);
    if (idx >= 0) {
      ev.participants.splice(idx, 1);
      return { rsvped: false, count: ev.participants.length };
    }
    ev.participants.push(me);
    return { rsvped: true, count: ev.participants.length };
  }
  try {
    const { data } = await api.post<RsvpState>(`/events/${id}/rsvp`);
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Could not update RSVP"));
  }
}

export async function isRsvpedApi(id: string): Promise<boolean> {
  if (MOCK_MODE) {
    const ev = MOCK_EVENTS.find((e) => e._id === id);
    const me = mockIdentifiableUser()._id;
    return ev?.participants?.includes(me) ?? false;
  }
  try {
    const { data } = await api.get<{ rsvped: boolean }>(`/events/${id}/rsvp-status`);
    return data.rsvped;
  } catch {
    return false;
  }
}

/** Upcoming events the current user is registered to attend. */
export async function getMyUpcomingEventsApi(): Promise<Event[]> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const me = mockIdentifiableUser()._id;
    const now = Date.now();
    return MOCK_EVENTS.filter(
      (e) =>
        e.participants?.includes(me) && new Date(e.eventDate).getTime() >= now,
    ).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }
  try {
    const { data } = await api.get("/events/mine");
    return Array.isArray(data) ? data : (data.events ?? []);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to load your events"));
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