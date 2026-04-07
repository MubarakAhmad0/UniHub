"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Megaphone,
  Pin,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

/* ── Types ─────────────────────────────────────────────────────────── */

type AnnouncementType = "system" | "faculty" | "event";
type FilterTab = "all" | AnnouncementType;

type Announcement = {
  id: number;
  date: string;
  isoDate: string;
  title: string;
  body: string;
  type: AnnouncementType;
  priority: "high" | "normal";
  read: boolean;
  pinned?: boolean;
};

/* ── Mock data ──────────────────────────────────────────────────────── */

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    date: "Apr 2, 2026",
    isoDate: "2026-04-02",
    title: "Final Exam Schedule Released",
    body: "The final examination schedule for Fall 2024 has been published. Please review your individual exam slots on the Academic Calendar portal. Venue assignments will follow next week. Students are reminded to check for any clashes and report them to the Academic Office immediately.",
    type: "system",
    priority: "high",
    read: false,
    pinned: true,
  },
  {
    id: 2,
    date: "Apr 1, 2026",
    isoDate: "2026-04-01",
    title: "Urban Design Theory — Studio Brief Updated",
    body: "Professor Vane has updated the Week 11 studio brief for ARC 402. The revised scope reduces the site analysis section and expands the concept development deliverable. Refer to the course materials page for the updated brief PDF. The submission deadline remains unchanged at Friday, Apr 11.",
    type: "faculty",
    priority: "normal",
    read: false,
    pinned: false,
  },
  {
    id: 3,
    date: "Mar 29, 2026",
    isoDate: "2026-03-29",
    title: "Library Extended Hours — Exam Period",
    body: "The university library will operate extended hours from Apr 15 through May 10. Monday–Friday: 07:00–24:00. Saturday–Sunday: 09:00–22:00. Silent study zones on floors 4–6 will be strictly enforced during this period.",
    type: "event",
    priority: "normal",
    read: true,
    pinned: false,
  },
  {
    id: 4,
    date: "Mar 28, 2026",
    isoDate: "2026-03-28",
    title: "Data Structures — Assignment 3 Deadline Extended",
    body: "Due to multiple students reporting issues with the Judge system, the deadline for CS 105 Assignment 3 has been extended by 48 hours to Friday, Apr 4 at 23:59. No further extensions will be granted. Contact your TA if you are still experiencing access issues.",
    type: "faculty",
    priority: "high",
    read: false,
    pinned: true,
  },
  {
    id: 5,
    date: "Mar 25, 2026",
    isoDate: "2026-03-25",
    title: "Campus Wi-Fi Maintenance — Apr 5",
    body: "Scheduled maintenance on the campus wireless infrastructure will cause intermittent disruptions between 02:00–06:00 on Saturday, April 5. Wired connections in labs and offices will not be affected. The IT helpdesk will be on standby from 08:00.",
    type: "system",
    priority: "normal",
    read: true,
    pinned: false,
  },
  {
    id: 6,
    date: "Mar 22, 2026",
    isoDate: "2026-03-22",
    title: "Student Research Symposium — Call for Abstracts",
    body: "The annual Student Research Symposium will be held on May 20–21. Submit a 250-word abstract via the portal by Apr 10 to present your work. All disciplines welcome. Selected presenters will receive recognition in the university's annual research digest.",
    type: "event",
    priority: "normal",
    read: true,
    pinned: false,
  },
  {
    id: 7,
    date: "Mar 18, 2026",
    isoDate: "2026-03-18",
    title: "New Student Counselling Drop-In Hours",
    body: "Student Wellness has added new drop-in counselling hours on Tuesdays and Thursdays from 14:00–17:00 at the Wellness Hub (Block D, Level 2). No appointment needed. All sessions are confidential.",
    type: "system",
    priority: "normal",
    read: true,
    pinned: false,
  },
];

/* ── Helpers ────────────────────────────────────────────────────────── */

function relativeTime(isoDate: string): string {
  const now = new Date();
  const then = new Date(isoDate);
  const diffDays = Math.floor(
    (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

const TYPE_CONFIG: Record<
  AnnouncementType,
  {
    label: string;
    borderColor: string;
    bgColor: string;
    iconBg: string;
    textColor: string;
    badgeClass: string;
    emoji: string;
  }
> = {
  system: {
    label: "System",
    borderColor: "border-l-rose-400",
    bgColor: "bg-rose-50/60 dark:bg-rose-950/30",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    textColor: "text-rose-600 dark:text-rose-400",
    badgeClass:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    emoji: "🔧",
  },
  faculty: {
    label: "Faculty",
    borderColor: "border-l-blue-400",
    bgColor: "bg-blue-50/60 dark:bg-blue-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    textColor: "text-blue-600 dark:text-blue-400",
    badgeClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    emoji: "👩‍🏫",
  },
  event: {
    label: "Event",
    borderColor: "border-l-emerald-400",
    bgColor: "bg-emerald-50/60 dark:bg-emerald-950/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    textColor: "text-emerald-600 dark:text-emerald-400",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    emoji: "🎉",
  },
};

/* ── Component ──────────────────────────────────────────────────────── */

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [alertDismissed, setAlertDismissed] = useState(false);

  /* ── Derived state ──────────────────────────────────────────────── */

  const unreadCount = items.filter((a) => !a.read).length;
  const highPriorityUnread = items.filter(
    (a) => !a.read && a.priority === "high",
  );
  const pinnedItems = items.filter((a) => a.pinned);

  const typeCounts: Record<AnnouncementType, number> = {
    system: items.filter((a) => a.type === "system").length,
    faculty: items.filter((a) => a.type === "faculty").length,
    event: items.filter((a) => a.type === "event").length,
  };

  const feedItems = items.filter((a) => {
    if (a.pinned) return false; // pinned shown separately
    const matchType = activeFilter === "all" || a.type === activeFilter;
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  /* ── Handlers ───────────────────────────────────────────────────── */

  const toggleRead = (id: number) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a)),
    );
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Sub-components ─────────────────────────────────────────────── */

  function AnnouncementCard({ item }: { item: Announcement }) {
    const isRead = item.read;
    const isExpanded = expandedIds.has(item.id);
    const cfg = TYPE_CONFIG[item.type];

    return (
      <div
        className={`
          relative rounded-xl border-l-4 ${cfg.borderColor}
          bg-card shadow-sm
          transition-all duration-200
          ${isRead ? "opacity-70" : ""}
          hover:shadow-md
          cursor-pointer
        `}
        onClick={() => toggleExpand(item.id)}
        id={`announcement-card-${item.id}`}
      >
        <div className="flex gap-4 p-5">
          {/* Source icon */}
          <div
            className={`shrink-0 h-9 w-9 rounded-lg ${cfg.iconBg} flex items-center justify-center text-base mt-0.5`}
          >
            {cfg.emoji}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Meta row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${cfg.badgeClass}`}
              >
                {cfg.label}
              </span>
              {item.priority === "high" && (
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded bg-rose-600 text-white">
                  Priority
                </span>
              )}
              <span className="text-[11px] text-muted-foreground ml-auto flex items-center gap-1.5">
                <span>{relativeTime(item.isoDate)}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{item.date}</span>
              </span>
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <h3
                className={`text-sm leading-snug ${isRead ? "font-normal text-muted-foreground" : "font-semibold text-foreground"}`}
              >
                {!isRead && (
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-2 mb-0.5 animate-pulse" />
                )}
                {item.title}
              </h3>
            </div>

            {/* Body — collapsed or expanded */}
            <p
              className={`text-sm text-muted-foreground leading-relaxed transition-all ${
                isExpanded ? "" : "line-clamp-2"
              }`}
            >
              {item.body}
            </p>

            {/* Actions row */}
            <div
              className="flex items-center justify-between pt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => toggleExpand(item.id)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    Read more
                  </>
                )}
              </button>

              <Button
                size="icon"
                variant={isRead ? "outline" : "ghost"}
                className={`h-7 w-7 shrink-0 transition-colors ${isRead ? "text-muted-foreground" : "text-blue-500 dark:text-blue-400 hover:text-blue-600"}`}
                onClick={() => toggleRead(item.id)}
                id={`read-toggle-${item.id}`}
                title={isRead ? "Mark as unread" : "Mark as read"}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <div className="flex flex-col min-h-svh bg-background">
      {/* ── Top bar ────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Announcements</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10 max-w-4xl w-full mx-auto space-y-8">
        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              General
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Announcements
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-7 min-w-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              University-wide notices, faculty updates, and campus events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 w-56 bg-background shadow-sm focus-visible:ring-1"
                placeholder="Search announcements…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="announcement-search"
              />
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 bg-background shadow-sm"
                onClick={markAllRead}
                id="mark-all-read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* ── Priority alert banner ────────────────────────────────── */}
        {!alertDismissed && highPriorityUnread.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 px-4 py-3 text-sm">
            <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="flex-1 text-amber-800 dark:text-amber-300 font-medium">
              You have{" "}
              <span className="font-bold">{highPriorityUnread.length}</span>{" "}
              high-priority{" "}
              {highPriorityUnread.length === 1
                ? "announcement"
                : "announcements"}{" "}
              requiring your attention.
            </p>
            <button
              onClick={() => setAlertDismissed(true)}
              className="text-amber-500 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              id="dismiss-alert"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Pinned section ──────────────────────────────────────── */}
        {(activeFilter === "all" ||
          pinnedItems.some((p) => p.type === activeFilter)) &&
          !search &&
          pinnedItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Pin className="h-3.5 w-3.5 text-amber-500" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Pinned
                </p>
              </div>
              {pinnedItems
                .filter(
                  (p) => activeFilter === "all" || p.type === activeFilter,
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`
                    relative rounded-xl border-l-4 border-l-amber-400 dark:border-l-amber-500
                    bg-amber-50/50 dark:bg-amber-950/20 shadow-sm
                    transition-all duration-200
                    hover:shadow-md
                    cursor-pointer
                  `}
                    onClick={() => toggleExpand(item.id)}
                    id={`pinned-card-${item.id}`}
                  >
                    <div className="flex gap-4 p-5">
                      <div
                        className={`shrink-0 h-9 w-9 rounded-lg ${TYPE_CONFIG[item.type].iconBg} flex items-center justify-center text-base mt-0.5`}
                      >
                        {TYPE_CONFIG[item.type].emoji}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${TYPE_CONFIG[item.type].badgeClass}`}
                          >
                            {TYPE_CONFIG[item.type].label}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
                            Pinned
                          </span>
                          {item.priority === "high" && (
                            <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded bg-rose-600 text-white">
                              Priority
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground ml-auto">
                            {relativeTime(item.isoDate)} · {item.date}
                          </span>
                        </div>
                        <h3
                          className={`text-sm leading-snug ${item.read ? "font-normal text-muted-foreground" : "font-semibold text-foreground"}`}
                        >
                          {!item.read && (
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-2 mb-0.5 animate-pulse" />
                          )}
                          {item.title}
                        </h3>
                        <p
                          className={`text-sm text-muted-foreground leading-relaxed ${expandedIds.has(item.id) ? "" : "line-clamp-2"}`}
                        >
                          {item.body}
                        </p>
                        <div
                          className="flex items-center justify-between pt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => toggleExpand(item.id)}
                          >
                            {expandedIds.has(item.id) ? (
                              <>
                                <ChevronUp className="h-3.5 w-3.5" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3.5 w-3.5" />
                                Read more
                              </>
                            )}
                          </button>
                          <Button
                            size="icon"
                            variant={item.read ? "outline" : "ghost"}
                            className={`h-7 w-7 shrink-0 transition-colors ${item.read ? "text-muted-foreground" : "text-blue-500 dark:text-blue-400"}`}
                            onClick={() => toggleRead(item.id)}
                            id={`pinned-read-toggle-${item.id}`}
                            title={
                              item.read ? "Mark as unread" : "Mark as read"
                            }
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

        {/* ── Filter pills + feed ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "All", count: items.length },
                { key: "system", label: "System", count: typeCounts.system },
                { key: "faculty", label: "Faculty", count: typeCounts.faculty },
                { key: "event", label: "Events", count: typeCounts.event },
              ] as { key: FilterTab; label: string; count: number }[]
            ).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all ${
                  activeFilter === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-muted-foreground hover:bg-muted/80 shadow-sm"
                }`}
                id={`filter-${key}`}
              >
                {label}{" "}
                <span
                  className={`${activeFilter === key ? "opacity-70" : "opacity-50"}`}
                >
                  ({count})
                </span>
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="space-y-3">
            {feedItems.length > 0 ? (
              feedItems.map((item) => (
                <AnnouncementCard key={item.id} item={item} />
              ))
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center text-3xl">
                  <Megaphone className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="font-semibold text-foreground">
                  No announcements found
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {search
                    ? `No results for "${search}". Try a different keyword.`
                    : "Nothing in this category yet. Check back later."}
                </p>
                {search && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
