"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth/use-auth";
import { Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AnnouncementCard,
  type Announcement,
} from "./_components/announcement-card";
import { ManageTab } from "./_components/manage-tab";
import { PostAnnouncementSheet } from "./_components/post-announcement-sheet";

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    date: "Apr 2, 2026",
    title: "Final Exam Schedule Released",
    body: "The final examination schedule for Fall 2024 has been published. Please review your individual exam slots on the Academic Calendar portal. Venue assignments will follow next week.",
    type: "system",
    priority: "high",
    read: false,
    author: "Registry Office",
    isPinned: true,
    status: "published",
    audience: "University-wide",
  },
  {
    id: 2,
    date: "Apr 1, 2026",
    title: "Urban Design Theory — Studio Brief Updated",
    body: "Professor Vane has updated the Week 11 studio brief for ARC 402. The revised scope reduces the site analysis section and expands the concept development deliverable. Refer to the course materials page for the updated brief PDF.",
    type: "faculty",
    priority: "normal",
    read: false,
    author: "Prof. Vane",
    isPinned: false,
    status: "published",
    courseCode: "ARC 402",
  },
  {
    id: 3,
    date: "Mar 29, 2026",
    title: "Library Extended Hours — Exam Period",
    body: "The university library will operate extended hours from Apr 15 through May 10. Monday–Friday: 07:00–24:00. Saturday–Sunday: 09:00–22:00.",
    type: "event",
    priority: "normal",
    read: true,
    author: "Library Services",
    isPinned: false,
    status: "published",
    audience: "University-wide",
  },
  {
    id: 4,
    date: "Mar 28, 2026",
    title: "Data Structures — Assignment 3 Deadline Extended",
    body: "Due to multiple students reporting issues with the Judge system, the deadline for CS 105 Assignment 3 has been extended by 48 hours to Friday, Apr 4 at 23:59.",
    type: "faculty",
    priority: "high",
    read: false,
    author: "Prof. Elena Rossi",
    isPinned: false,
    status: "published",
    courseCode: "CS 105",
  },
  {
    id: 5,
    date: "Mar 25, 2026",
    title: "Campus Wi-Fi Maintenance — Apr 5",
    body: "Scheduled maintenance on the campus wireless infrastructure will cause intermittent disruptions between 02:00–06:00 on Saturday, April 5. Wired connections will not be affected.",
    type: "system",
    priority: "normal",
    read: true,
    author: "IT Department",
    isPinned: false,
    status: "published",
    audience: "University-wide",
  },
  {
    id: 6,
    date: "Mar 22, 2026",
    title: "Student Research Symposium — Call for Abstracts",
    body: "The annual Student Research Symposium will be held on May 20–21. Submit a 250-word abstract via the portal by Apr 10 to present your work. All disciplines welcome.",
    type: "event",
    priority: "normal",
    read: true,
    author: "Research Office",
    isPinned: false,
    status: "published",
    audience: "University-wide",
  },
];

// ─── Mock "my" author name — replaced when real auth provides display name ────
const MY_AUTHOR_NAME = "Prof. Elena Rossi";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnnouncementsPage() {
  const { hasRole, isLoading } = useAuth();

  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");
  const canPost = isAdmin || isManager;

  const [items, setItems] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [readIds, setReadIds] = useState<Set<number>>(
    new Set(INITIAL_ANNOUNCEMENTS.filter((a) => a.read).map((a) => a.id)),
  );
  const [activeTab, setActiveTab] = useState("all");
  const [postOpen, setPostOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const toggleRead = (id: number) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = (item: Announcement) => {
    setItems((prev) => {
      const idx = prev.findIndex((a) => a.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.success("Announcement deleted.");
  };

  const handleTogglePin = (id: number) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a)),
    );
  };

  const handleArchive = (id: number) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "archived" } : a)),
    );
  };

  const openEdit = (item: Announcement) => {
    setEditingItem(item);
    setPostOpen(true);
  };

  const closeSheet = () => {
    setPostOpen(false);
    setEditingItem(null);
  };

  // Sort: pinned first, then by id descending
  const sorted = [...items].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.id - a.id;
  });

  const getFiltered = (tab: string) =>
    tab === "all" ? sorted : sorted.filter((a) => a.type === tab);

  const unreadCount = items.filter((a) => !readIds.has(a.id)).length;

  const TABS = ["all", "system", "faculty", "event"] as const;

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
              <BreadcrumbPage>Announcements</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Role-gated action button */}
        {!isLoading && canPost && (
          <div className="ml-auto">
            <Button
              size="sm"
              onClick={() => setPostOpen(true)}
              id="new-announcement-btn"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Announcement
            </Button>
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Academic Portal
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-sm text-muted-foreground">
              University-wide notices, faculty updates, and campus events.
            </p>
          </div>

          {/* Unread badge */}
          {unreadCount > 0 && (
            <Badge variant="secondary" className="shrink-0 mt-1">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="capitalize">
                {tab === "all"
                  ? "All"
                  : tab === "event"
                    ? "Events"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
            {/* Admin-only Manage tab */}
            {isAdmin && (
              <TabsTrigger value="manage" id="manage-tab-trigger">
                <Settings2 className="h-3.5 w-3.5 mr-1" />
                Manage
              </TabsTrigger>
            )}
          </TabsList>

          {/* Standard announcement tabs */}
          {TABS.map((tab) => {
            const list = getFiltered(tab);
            return (
              <TabsContent key={tab} value={tab} className="mt-6 space-y-3">
                {list.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No announcements in this category yet.
                  </p>
                ) : (
                  list.map((item) => (
                    <AnnouncementCard
                      key={item.id}
                      item={item}
                      isRead={readIds.has(item.id)}
                      onToggleRead={toggleRead}
                      isOwner={isManager && item.author === MY_AUTHOR_NAME}
                      canAdmin={isAdmin}
                      onEdit={() => openEdit(item)}
                      onDelete={() => handleDelete(item.id)}
                      onPin={() => {
                        handleTogglePin(item.id);
                        toast.success("Announcement pinned.");
                      }}
                      onUnpin={() => {
                        handleTogglePin(item.id);
                        toast.success("Announcement unpinned.");
                      }}
                      onArchive={() => handleArchive(item.id)}
                    />
                  ))
                )}
              </TabsContent>
            );
          })}

          {/* Admin Manage tab */}
          {isAdmin && (
            <TabsContent value="manage" className="mt-6">
              <ManageTab
                announcements={items}
                onEdit={openEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
                onArchive={handleArchive}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Post / Edit sheet */}
      {canPost && (
        <PostAnnouncementSheet
          open={postOpen}
          onClose={closeSheet}
          role={isAdmin ? "admin" : "manager"}
          editingItem={editingItem}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
