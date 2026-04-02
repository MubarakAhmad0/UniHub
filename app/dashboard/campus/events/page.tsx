"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, MapPin, Star } from "lucide-react";
import { useState } from "react";

/* ── Mock data ────────────────────────────────────────────────────── */

type RsvpStatus = "going" | "interested" | null;
type EventStatus = "published" | "cancelled";

type Event = {
  id: string;
  title: string;
  category: string;
  organiser: string;
  dateLabel: string;
  venue: string;
  description: string;
  capacity: number | null;
  rsvpCount: number;
  isFeatured?: boolean;
  status: EventStatus;
  userRsvp: RsvpStatus;
};

const CATEGORIES = ["All", "Academic", "Sports", "Career", "Cultural", "Club"];

const CATEGORY_COLOR: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-800",
  Sports: "bg-emerald-100 text-emerald-800",
  Career: "bg-primary/10 text-primary",
  Cultural: "bg-orange-100 text-orange-800",
  Club: "bg-purple-100 text-purple-800",
  University: "bg-muted text-muted-foreground",
};

const events: Event[] = [
  {
    id: "e1",
    title: "Career Fair 2026",
    category: "Career",
    organiser: "Career Development Office",
    dateLabel: "Wed Apr 9 · 09:00–17:00",
    venue: "Main Hall, Student Centre",
    description:
      "Connect with 60+ employers from engineering, tech, finance, and creative industries. Bring your CV and dress professionally.",
    capacity: null,
    rsvpCount: 142,
    isFeatured: true,
    status: "published",
    userRsvp: "going",
  },
  {
    id: "e2",
    title: "Research Symposium",
    category: "Academic",
    organiser: "Faculty of Engineering",
    dateLabel: "Mon Apr 7 · 14:00–17:00",
    venue: "Lecture Theatre 1",
    description:
      "Annual showcase of final-year research projects across all engineering disciplines.",
    capacity: 150,
    rsvpCount: 87,
    status: "published",
    userRsvp: "interested",
  },
  {
    id: "e3",
    title: "Basketball Intercollege Cup",
    category: "Sports",
    organiser: "Sports Council",
    dateLabel: "Sat Apr 12 · All Day",
    venue: "Sports Complex",
    description:
      "Intercollege basketball tournament — come cheer for your faculty team!",
    capacity: null,
    rsvpCount: 203,
    status: "published",
    userRsvp: "going",
  },
  {
    id: "e4",
    title: "Cultural Night: East Meets West",
    category: "Cultural",
    organiser: "Cultural Society",
    dateLabel: "Fri Apr 11 · 19:00–22:00",
    venue: "Main Auditorium",
    description:
      "An evening of traditional and modern performances celebrating the diversity of our campus community.",
    capacity: 200,
    rsvpCount: 162,
    status: "published",
    userRsvp: null,
  },
  {
    id: "e5",
    title: "Club Fair 2026",
    category: "Club",
    organiser: "Student Affairs",
    dateLabel: "Thu Apr 10 · 11:00–14:00",
    venue: "Central Plaza",
    description:
      "Discover student clubs and societies, meet committee members, and sign up for activities.",
    capacity: null,
    rsvpCount: 78,
    status: "published",
    userRsvp: "interested",
  },
  {
    id: "e6",
    title: "Machine Learning Workshop",
    category: "Academic",
    organiser: "Robotics & AI Club",
    dateLabel: "Tue Apr 8 · 15:00–17:00",
    venue: "Lab 4, Computing Block",
    description: "Hands-on intro to ML with Python. Bring your laptop.",
    capacity: 30,
    rsvpCount: 30,
    status: "published",
    userRsvp: null,
  },
  {
    id: "e7",
    title: "Photography Walk",
    category: "Club",
    organiser: "Photography Society",
    dateLabel: "Sun Apr 13 · 08:00–10:00",
    venue: "Meet at Main Gate",
    description:
      "Leisurely campus walk with a focus on documentary and street photography.",
    capacity: 25,
    rsvpCount: 11,
    status: "published",
    userRsvp: null,
  },
];

function RsvpButton({
  event,
  onToggle,
}: {
  event: Event;
  onToggle: (id: string, val: RsvpStatus) => void;
}) {
  const isFull =
    event.capacity !== null &&
    event.rsvpCount >= event.capacity &&
    event.userRsvp !== "going";
  if (isFull)
    return (
      <Button size="sm" variant="outline" disabled className="text-xs">
        Event Full
      </Button>
    );
  if (event.userRsvp === "going")
    return (
      <Button
        size="sm"
        onClick={() => onToggle(event.id, null)}
        className="text-xs"
      >
        Going ✓
      </Button>
    );
  if (event.userRsvp === "interested")
    return (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onToggle(event.id, null)}
        className="text-xs"
      >
        Interested ★
      </Button>
    );
  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        onClick={() => onToggle(event.id, "going")}
        className="text-xs"
      >
        Going
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onToggle(event.id, "interested")}
        className="text-xs"
      >
        <Star className="h-3 w-3" />
      </Button>
    </div>
  );
}

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [eventsState, setEventsState] = useState(events);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);

  function toggleRsvp(id: string, val: RsvpStatus) {
    setEventsState((prev) =>
      prev.map((e) => (e.id === id ? { ...e, userRsvp: val } : e)),
    );
    if (detailEvent?.id === id)
      setDetailEvent((de) => (de ? { ...de, userRsvp: val } : de));
  }

  const featured = eventsState.filter((e) => e.isFeatured);
  const filtered = eventsState.filter(
    (e) =>
      (activeCategory === "All" || e.category === activeCategory) &&
      !e.isFeatured,
  );
  const myEvents = eventsState.filter((e) => e.userRsvp);

  return (
    <div className="flex flex-col min-h-svh">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Campus Events</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Campus · Upcoming
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Campus Events</h1>
            <p className="text-sm text-muted-foreground">
              Discover events, RSVP, and add them to your calendar.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Submit Event
          </Button>
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs">
                All Events
              </TabsTrigger>
              <TabsTrigger value="my" className="text-xs">
                My Events ({myEvents.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-6 mt-4">
            {/* Featured */}
            {featured.map((e) => (
              <Card
                key={e.id}
                className="border-0 shadow-sm bg-card overflow-hidden cursor-pointer hover:shadow transition-shadow"
                onClick={() => setDetailEvent(e)}
              >
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-4xl">🎪</span>
                  </div>
                  <div className="p-5 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="text-[10px] bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${CATEGORY_COLOR[e.category]}`}
                      >
                        {e.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold">{e.title}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{e.dateLabel}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {e.venue}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {e.description}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {e.rsvpCount} going
                      </span>
                      <RsvpButton event={e} onToggle={toggleRsvp} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((e) => (
                <Card
                  key={e.id}
                  className="border-0 shadow-sm bg-card cursor-pointer hover:shadow transition-shadow"
                  onClick={() => setDetailEvent(e)}
                >
                  <div className="h-24 bg-gradient-to-br from-muted/60 to-muted/20 flex items-center justify-center rounded-t-md">
                    <span className="text-3xl">
                      {e.category === "Sports"
                        ? "🏆"
                        : e.category === "Cultural"
                          ? "🎭"
                          : e.category === "Club"
                            ? "🎨"
                            : "📘"}
                    </span>
                  </div>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex gap-2 items-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${CATEGORY_COLOR[e.category]}`}
                      >
                        {e.category}
                      </span>
                      {e.capacity !== null && e.rsvpCount >= e.capacity && (
                        <Badge variant="destructive" className="text-[10px]">
                          Full
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-sm leading-snug mt-1">
                      {e.title}
                    </p>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>{e.dateLabel}</p>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {e.venue}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {e.rsvpCount} going
                      </span>
                      <div onClick={(ev) => ev.stopPropagation()}>
                        <RsvpButton event={e} onToggle={toggleRsvp} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my" className="space-y-3 mt-4">
            {myEvents.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {"No events RSVP'd yet."}
              </p>
            )}
            {myEvents.map((e) => (
              <Card
                key={e.id}
                className="border-0 shadow-sm bg-card cursor-pointer hover:shadow transition-shadow"
                onClick={() => setDetailEvent(e)}
              >
                <CardContent className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.dateLabel} · {e.venue}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={e.userRsvp === "going" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {e.userRsvp === "going" ? "Going" : "Interested"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={(ev) => {
                        ev.stopPropagation();
                      }}
                    >
                      <CalendarPlus className="h-3.5 w-3.5 mr-1" />
                      Add to Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Event detail sheet */}
      <Sheet open={!!detailEvent} onOpenChange={() => setDetailEvent(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {detailEvent && (
            <>
              <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-md mb-4">
                <span className="text-5xl">
                  {detailEvent.category === "Sports"
                    ? "🏆"
                    : detailEvent.category === "Cultural"
                      ? "🎭"
                      : "📘"}
                </span>
              </div>
              <SheetHeader>
                <div className="flex gap-2 flex-wrap mb-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${CATEGORY_COLOR[detailEvent.category]}`}
                  >
                    {detailEvent.category}
                  </span>
                  {detailEvent.isFeatured && (
                    <Badge className="text-[10px]">Featured</Badge>
                  )}
                </div>
                <SheetTitle className="text-xl">{detailEvent.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Date & Time
                    </p>
                    <p>{detailEvent.dateLabel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Venue
                    </p>
                    <p>{detailEvent.venue}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Organiser
                    </p>
                    <p>{detailEvent.organiser}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Attending
                    </p>
                    <p>
                      {detailEvent.rsvpCount}
                      {detailEvent.capacity ? ` / ${detailEvent.capacity}` : ""}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {detailEvent.description}
                </p>
                <div className="flex gap-2 pt-2">
                  <div className="flex-1">
                    <RsvpButton event={detailEvent} onToggle={toggleRsvp} />
                  </div>
                  <Button variant="outline" size="sm">
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
