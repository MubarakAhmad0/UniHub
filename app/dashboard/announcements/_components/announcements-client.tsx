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
import { AnnouncementCard, type Announcement } from "./announcement-card";
import { ManageTab } from "./manage-tab";
import { PostAnnouncementSheet } from "./post-announcement-sheet";
import {
  deleteAnnouncement,
  togglePinAnnouncement,
  updateAnnouncement,
} from "../_lib/actions";

const MY_AUTHOR_NAME = "Prof. Elena Rossi";

interface AnnouncementsClientProps {
  initialData: {
    id: number;
    title: string;
    body: string;
    type: "SYSTEM" | "FACULTY" | "EVENT";
    priority: "LOW" | "NORMAL" | "HIGH";
    read: boolean;
    author: string;
    isPinned: boolean | null;
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    audience?: string | null;
    courseCode?: string | null;
    date: string;
  }[];
}

export function AnnouncementsClient({ initialData }: AnnouncementsClientProps) {
  const { hasRole, isLoading } = useAuth();

  const isAdmin = hasRole("admin");
  const canPost = isAdmin || hasRole("lecturer");

  const [items, setItems] = useState<Announcement[]>(
    initialData.map((a) => ({
      ...a,
      type: (a.type?.toLowerCase() || "system") as
        | "system"
        | "faculty"
        | "event",
      priority: (a.priority?.toLowerCase() || "normal") as "high" | "normal",
      status: (a.status?.toLowerCase() || "published") as
        | "published"
        | "scheduled"
        | "archived",
    })),
  );
  const [readIds, setReadIds] = useState<Set<number>>(
    new Set(initialData.filter((a) => a.read).map((a) => a.id)),
  );
  const [activeTab, setActiveTab] = useState("all");
  const [postOpen, setPostOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  const toggleRead = (id: number) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async (item: Announcement) => {
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

  const handleDelete = async (id: number) => {
    await deleteAnnouncement(id);
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.success("Announcement deleted.");
  };

  const handleTogglePin = async (id: number) => {
    await togglePinAnnouncement(id);
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a)),
    );
  };

  const handleArchive = async (id: number) => {
    await updateAnnouncement(id, { status: "ARCHIVED" });
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
            {isAdmin && (
              <TabsTrigger value="manage" id="manage-tab-trigger">
                <Settings2 className="h-3.5 w-3.5 mr-1" />
                Manage
              </TabsTrigger>
            )}
          </TabsList>

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
                      isOwner={
                        hasRole("lecturer") && item.author === MY_AUTHOR_NAME
                      }
                      canAdmin={isAdmin}
                      onEdit={() => openEdit(item)}
                      onDelete={() => handleDelete(item.id)}
                      onPin={() => handleTogglePin(item.id)}
                      onUnpin={() => handleTogglePin(item.id)}
                      onArchive={() => handleArchive(item.id)}
                    />
                  ))
                )}
              </TabsContent>
            );
          })}

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

      {canPost && (
        <PostAnnouncementSheet
          open={postOpen}
          onClose={closeSheet}
          role={isAdmin ? "admin" : "lecturer"}
          editingItem={editingItem}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
