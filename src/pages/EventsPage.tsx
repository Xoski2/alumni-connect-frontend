import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, CalendarClock } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import type { Event } from "../types";
import { getEventsApi, getMyUpcomingEventsApi, toggleRsvpApi } from "../api/eventApi";
import { Spinner } from "../components/shared";

function daysAway(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff < 0) return "";
  const days = Math.ceil(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 30) return `In ${days} days`;
  const months = Math.floor(days / 30);
  return `In ${months} month${months > 1 ? "s" : ""}`;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"All" | "Attending">("All");
  const [rsvpedIds, setRsvpedIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [allEvents, mine] = await Promise.all([
        getEventsApi(),
        getMyUpcomingEventsApi(),
      ]);
      setEvents(allEvents);
      setMyEvents(mine);
      setRsvpedIds(new Set(mine.map((e) => e._id)));
    } catch {
      setError("Could not load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const toggleRsvp = async (id: string) => {
    setBusyId(id);
    setSuccess("");
    try {
      const res = await toggleRsvpApi(id);
      setRsvpedIds((prev) => {
        const next = new Set(prev);
        if (res.rsvped) next.add(id);
        else next.delete(id);
        return next;
      });
      setEvents((prev) =>
        prev.map((e) =>
          e._id === id
            ? { ...e, participants: res.rsvped ? [...(e.participants ?? []), "__me__"] : (e.participants ?? []).filter((x) => x !== "__me__") }
            : e,
        ),
      );
      if (res.rsvped) setSuccess("You're attending this event!");
      void reload();
    } catch {
      setError("Could not update RSVP");
    }
    setBusyId(null);
  };

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || rsvpedIds.has(e._id)),
  );
  const upcoming = filtered.filter((e) => new Date(e.eventDate) >= new Date());
  const past = filtered.filter((e) => new Date(e.eventDate) < new Date());

  return (
    <PageContainer title="Events">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">University Events</h2>
          <p className="text-sm text-muted-foreground">
            {myEvents.length} event{myEvents.length !== 1 ? "s" : ""} you're attending
            {upcoming.length > 0 && ` · ${upcoming.length} upcoming`}
          </p>
        </div>
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          {(["All", "Attending"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setFilter(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === v
                  ? "bg-brand-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CalendarCheck className="h-4 w-4" />
          {success}
          <button onClick={() => setSuccess("")} className="ml-2 font-bold">
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-bold">
            ×
          </button>
        </div>
      )}

      {/* My Upcoming Events */}
      {myEvents.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Your upcoming events
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {myEvents.slice(0, 3).map((e) => {
              const away = daysAway(e.eventDate);
              return (
                <div
                  key={e._id}
                  className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white">
                    <CalendarClock className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {e.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.eventDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {away && (
                        <span className="ml-1 font-semibold text-brand-primary">
                          — {away}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Upcoming
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((e) => (
                  <EventCard
                    key={e._id}
                    event={e}
                    rsvped={rsvpedIds.has(e._id)}
                    busy={busyId === e._id}
                    onToggle={() => void toggleRsvp(e._id)}
                  />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Past Events
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {past.map((e) => (
                  <EventCard
                    key={e._id}
                    event={e}
                    rsvped={rsvpedIds.has(e._id)}
                    busy={busyId === e._id}
                    onToggle={() => void toggleRsvp(e._id)}
                  />
                ))}
              </div>
            </div>
          )}
          {filtered.length === 0 && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No events found.
            </p>
          )}
        </>
      )}
    </PageContainer>
  );
};

function EventCard({
  event,
  rsvped,
  busy,
  onToggle,
}: {
  event: Event;
  rsvped: boolean;
  busy: boolean;
  onToggle: () => void;
}) {
  const isPast = new Date(event.eventDate) < new Date();
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">
            {event.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Organized by {event.organizer?.name || "University"}
          </p>
        </div>
        <span
          className={`ml-2 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            isPast ? "bg-muted text-muted-foreground" : "bg-brand-primary/10 text-brand-primary"
          }`}
        >
          {isPast ? "Past" : "Upcoming"}
        </span>
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
        {event.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {new Date(event.eventDate).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        {event.location && (
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </span>
        )}
        {event.participants && (
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            </svg>
            {event.participants.length} registered
          </span>
        )}
      </div>

      {!isPast && (
        <button
          type="button"
          onClick={onToggle}
          disabled={busy}
          className={`w-full rounded-lg py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
            rsvped
              ? "border border-border bg-card text-foreground hover:bg-accent"
              : "bg-brand-primary text-white hover:bg-brand-primaryLight"
          }`}
        >
          {busy ? "..." : rsvped ? "Cancel RSVP" : "RSVP"}
        </button>
      )}
    </div>
  );
}

export default EventsPage;