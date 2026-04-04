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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/use-auth";
import {
  CalendarPlus,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Types ─────────────────────────────────────────────────────────────────── */

type RsvpStatus = "going" | "interested" | null;
type EventStatus = "published" | "cancelled" | "pending";

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
  submittedBy?: string; // for pending approval queue
};

/* ── Constants ──────────────────────────────────────────────────────────────── */

const CATEGORIES = ["All", "Academic", "Sports", "Career", "Cultural", "Club"];

const CATEGORY_COLOR: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-800",
  Sports: "bg-emerald-100 text-emerald-800",
  Career: "bg-primary/10 text-primary",
  Cultural: "bg-orange-100 text-orange-800",
  Club: "bg-purple-100 text-purple-800",
  University: "bg-muted text-muted-foreground",
};

const CATEGORY_EMOJI: Record<string, string> = {
  Sports: "🏆",
  Cultural: "🎭",
  Club: "🎨",
  Career: "💼",
  Academic: "📘",
};

/* ── Mock data ──────────────────────────────────────────────────────────────── */

const INITIAL_EVENTS: Event[] = [
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
  // Pending submissions (only visible to admin)
  {
    id: "e8",
    title: "Inter-Faculty Chess Tournament",
    category: "Club",
    organiser: "Chess Club",
    dateLabel: "TBD",
    venue: "Student Lounge",
    description: "Tournament pending admin approval.",
    capacity: 40,
    rsvpCount: 0,
    status: "pending",
    userRsvp: null,
    submittedBy: "Chess Club President",
  },
];

/* ── Sub-components ──────────────────────────────────────────────────────────── */

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

/* ── Create / Edit Event Sheet ───────────────────────────────────────────────── */

type EventFormProps = {
  open: boolean;
  onClose: () => void;
  role: "manager" | "admin";
  editingEvent?: Event | null;
  onSave: (event: Event) => void;
};

function EventFormSheet({
  open,
  onClose,
  role,
  editingEvent,
  onSave,
}: EventFormProps) {
  const isAdmin = role === "admin";

  const [title, setTitle] = useState(editingEvent?.title ?? "");
  const [category, setCategory] = useState(
    editingEvent?.category ?? "Academic",
  );
  const [organiser, setOrganiser] = useState(editingEvent?.organiser ?? "");
  const [dateLabel, setDateLabel] = useState(editingEvent?.dateLabel ?? "");
  const [venue, setVenue] = useState(editingEvent?.venue ?? "");
  const [description, setDescription] = useState(
    editingEvent?.description ?? "",
  );
  const [capacity, setCapacity] = useState(
    editingEvent?.capacity?.toString() ?? "",
  );
  const [featured, setFeatured] = useState(editingEvent?.isFeatured ?? false);

  const handleSubmit = () => {
    if (
      !title.trim() ||
      !organiser.trim() ||
      !dateLabel.trim() ||
      !venue.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const saved: Event = {
      id: editingEvent?.id ?? `e-${Date.now()}`,
      title,
      category,
      organiser,
      dateLabel,
      venue,
      description,
      capacity: capacity ? parseInt(capacity) : null,
      rsvpCount: editingEvent?.rsvpCount ?? 0,
      isFeatured: featured,
      // Manager posts go to pending; admin posts go straight to published
      status: isAdmin ? "published" : "pending",
      userRsvp: editingEvent?.userRsvp ?? null,
    };

    onSave(saved);

    if (!isAdmin) {
      toast.success("Event submitted for admin approval.");
    } else {
      toast.success(editingEvent ? "Event updated." : "Event published.");
    }
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {editingEvent
              ? "Edit Event"
              : isAdmin
                ? "Create Event"
                : "Submit Event"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ev-title">Title *</Label>
            <Input
              id="ev-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ev-category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="ev-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-capacity">
                Capacity{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="ev-capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-organiser">Organiser *</Label>
            <Input
              id="ev-organiser"
              value={organiser}
              onChange={(e) => setOrganiser(e.target.value)}
              placeholder="Club, office, or faculty name…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-date">Date & Time *</Label>
            <Input
              id="ev-date"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder='e.g. "Wed Apr 9 · 09:00–17:00"'
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-venue">Venue *</Label>
            <Input
              id="ev-venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Building, room, or location…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-desc">Description</Label>
            <Textarea
              id="ev-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this event about?"
              className="resize-none min-h-24"
            />
          </div>

          {/* Feature toggle — admin only */}
          {isAdmin && (
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Feature this event</p>
                <p className="text-xs text-muted-foreground">
                  Pinned at the top of the events feed
                </p>
              </div>
              <Switch
                id="ev-featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
            </div>
          )}

          {!isAdmin && (
            <p className="text-xs text-muted-foreground bg-muted/40 rounded px-3 py-2">
              Your event will appear as pending until an admin approves it.
            </p>
          )}
        </div>

        <SheetFooter className="mt-8 flex gap-2 flex-col sm:flex-row">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="w-full" onClick={handleSubmit}>
            {editingEvent
              ? "Save Changes"
              : isAdmin
                ? "Publish Event"
                : "Submit for Review"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function EventsPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");
  const canPost = isAdmin || isManager;

  const [eventsState, setEventsState] = useState<Event[]>(INITIAL_EVENTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // ── RSVP ──────────────────────────────────────────────────────────────────
  function toggleRsvp(id: string, val: RsvpStatus) {
    setEventsState((prev) =>
      prev.map((e) => (e.id === id ? { ...e, userRsvp: val } : e)),
    );
    if (detailEvent?.id === id)
      setDetailEvent((de) => (de ? { ...de, userRsvp: val } : de));
  }

  // ── Event management ───────────────────────────────────────────────────────
  const handleSave = (event: Event) => {
    setEventsState((prev) => {
      const idx = prev.findIndex((e) => e.id === event.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = event;
        return next;
      }
      return [...prev, event];
    });
  };

  const handleDelete = (id: string) => {
    setEventsState((prev) => prev.filter((e) => e.id !== id));
    if (detailEvent?.id === id) setDetailEvent(null);
    toast.success("Event removed.");
  };

  const handleFeatureToggle = (id: string) => {
    setEventsState((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isFeatured: !e.isFeatured } : e)),
    );
    toast.success("Featured status updated.");
  };

  const handleCancel = (id: string) => {
    setEventsState((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "cancelled" } : e)),
    );
    toast.success("Event cancelled.");
  };

  const handleApprove = (id: string) => {
    setEventsState((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "published" } : e)),
    );
    toast.success("Event approved and published.");
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  // ── Derived lists ──────────────────────────────────────────────────────────
  const published = eventsState.filter((e) => e.status === "published");
  const featured = published.filter((e) => e.isFeatured);
  const filtered = published.filter(
    (e) =>
      (activeCategory === "All" || e.category === activeCategory) &&
      !e.isFeatured,
  );
  const myEvents = published.filter((e) => e.userRsvp);
  const pending = eventsState.filter((e) => e.status === "pending");

  return (
    <div className="flex flex-col min-h-svh">
      {/* ── Header ── */}
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

        {/* Role-gated: manager/admin "Create Event" button */}
        {canPost && (
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => {
              setEditingEvent(null);
              setFormOpen(true);
            }}
            id="create-event-btn"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isAdmin ? "Create Event" : "Submit Event"}
          </Button>
        )}
      </header>

      {/* ── Main ── */}
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
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
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
              {/* Admin-only approval queue tab */}
              {isAdmin && (
                <TabsTrigger
                  value="pending"
                  className="text-xs"
                  id="pending-events-tab"
                >
                  Pending{" "}
                  {pending.length > 0 && (
                    <span className="ml-1 bg-destructive text-destructive-foreground rounded-full px-1.5 text-[10px]">
                      {pending.length}
                    </span>
                  )}
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* ── All Events tab ── */}
          <TabsContent value="all" className="space-y-6 mt-4">
            {/* Featured events */}
            {featured.map((e) => (
              <Card
                key={e.id}
                className="border-0 shadow-sm bg-card overflow-hidden cursor-pointer hover:shadow transition-shadow group"
                onClick={() => setDetailEvent(e)}
              >
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-4xl">
                      {CATEGORY_EMOJI[e.category] ?? "🎪"}
                    </span>
                  </div>
                  <div className="p-5 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <div className="flex gap-2">
                        <Badge className="text-[10px] bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${CATEGORY_COLOR[e.category]}`}
                        >
                          {e.category}
                        </span>
                      </div>
                      {/* Admin event controls */}
                      {isAdmin && (
                        <div onClick={(ev) => ev.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                id={`event-menu-${e.id}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => openEdit(e)}>
                                <Pencil className="h-3.5 w-3.5 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleFeatureToggle(e.id)}
                              >
                                <Star className="h-3.5 w-3.5 mr-2" />
                                Unfeature
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancel(e.id)}
                              >
                                <X className="h-3.5 w-3.5 mr-2" />
                                Cancel Event
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(e.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
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

            {/* Event grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((e) => (
                <Card
                  key={e.id}
                  className="border-0 shadow-sm bg-card cursor-pointer hover:shadow transition-shadow group"
                  onClick={() => setDetailEvent(e)}
                >
                  <div className="h-24 bg-gradient-to-br from-muted/60 to-muted/20 flex items-center justify-center rounded-t-md relative">
                    <span className="text-3xl">
                      {CATEGORY_EMOJI[e.category] ?? "📘"}
                    </span>
                    {/* Admin quick controls */}
                    {isAdmin && (
                      <div
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-6 w-6 shadow"
                              id={`event-grid-menu-${e.id}`}
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => openEdit(e)}>
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleFeatureToggle(e.id)}
                            >
                              <Star className="h-3.5 w-3.5 mr-2" />
                              Feature
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancel(e.id)}
                            >
                              <X className="h-3.5 w-3.5 mr-2" />
                              Cancel Event
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(e.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
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

          {/* ── My Events tab ── */}
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
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      <CalendarPlus className="h-3.5 w-3.5 mr-1" />
                      Add to Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ── Admin: Pending Approval tab ── */}
          {isAdmin && (
            <TabsContent value="pending" className="mt-4 space-y-3">
              {pending.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No pending event submissions.
                </p>
              )}
              {pending.map((e) => (
                <Card key={e.id} className="border-0 shadow-sm">
                  <CardContent className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-[10px]">
                            Pending Review
                          </Badge>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${CATEGORY_COLOR[e.category]}`}
                          >
                            {e.category}
                          </span>
                        </div>
                        <p className="font-semibold text-sm">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.dateLabel} · {e.venue}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted by: {e.submittedBy ?? e.organiser}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {e.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="text-xs"
                          onClick={() => handleApprove(e.id)}
                          id={`approve-event-${e.id}`}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-destructive hover:text-destructive"
                          onClick={() => handleDelete(e.id)}
                          id={`reject-event-${e.id}`}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* ── Event Detail Sheet ── */}
      <Sheet open={!!detailEvent} onOpenChange={() => setDetailEvent(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {detailEvent && (
            <>
              <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-md mb-4">
                <span className="text-5xl">
                  {CATEGORY_EMOJI[detailEvent.category] ?? "📘"}
                </span>
              </div>
              <SheetHeader>
                <div className="flex gap-2 flex-wrap mb-2 items-center justify-between">
                  <div className="flex gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${CATEGORY_COLOR[detailEvent.category]}`}
                    >
                      {detailEvent.category}
                    </span>
                    {detailEvent.isFeatured && (
                      <Badge className="text-[10px]">Featured</Badge>
                    )}
                  </div>
                  {/* Admin actions in detail sheet */}
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          id={`detail-menu-${detailEvent.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => {
                            openEdit(detailEvent);
                            setDetailEvent(null);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleFeatureToggle(detailEvent.id);
                            setDetailEvent((d) =>
                              d ? { ...d, isFeatured: !d.isFeatured } : d,
                            );
                          }}
                        >
                          <Star className="h-3.5 w-3.5 mr-2" />
                          {detailEvent.isFeatured ? "Unfeature" : "Feature"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleCancel(detailEvent.id);
                            setDetailEvent(null);
                          }}
                        >
                          <X className="h-3.5 w-3.5 mr-2" />
                          Cancel Event
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            handleDelete(detailEvent.id);
                            setDetailEvent(null);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* ── Create / Edit Event Sheet ── */}
      {canPost && (
        <EventFormSheet
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingEvent(null);
          }}
          role={isAdmin ? "admin" : "manager"}
          editingEvent={editingEvent}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
