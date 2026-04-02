"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Check } from "lucide-react";
import { useState } from "react";

type AnnouncementType = "system" | "faculty" | "event";

const announcements: {
  id: number;
  date: string;
  title: string;
  body: string;
  type: AnnouncementType;
  priority: "high" | "normal";
  read: boolean;
}[] = [
  {
    id: 1,
    date: "Apr 2, 2026",
    title: "Final Exam Schedule Released",
    body: "The final examination schedule for Fall 2024 has been published. Please review your individual exam slots on the Academic Calendar portal. Venue assignments will follow next week.",
    type: "system",
    priority: "high",
    read: false,
  },
  {
    id: 2,
    date: "Apr 1, 2026",
    title: "Urban Design Theory — Studio Brief Updated",
    body: "Professor Vane has updated the Week 11 studio brief for ARC 402. The revised scope reduces the site analysis section and expands the concept development deliverable. Refer to the course materials page for the updated brief PDF.",
    type: "faculty",
    priority: "normal",
    read: false,
  },
  {
    id: 3,
    date: "Mar 29, 2026",
    title: "Library Extended Hours — Exam Period",
    body: "The university library will operate extended hours from Apr 15 through May 10. Monday–Friday: 07:00–24:00. Saturday–Sunday: 09:00–22:00.",
    type: "event",
    priority: "normal",
    read: true,
  },
  {
    id: 4,
    date: "Mar 28, 2026",
    title: "Data Structures — Assignment 3 Deadline Extended",
    body: "Due to multiple students reporting issues with the Judge system, the deadline for CS 105 Assignment 3 has been extended by 48 hours to Friday, Apr 4 at 23:59.",
    type: "faculty",
    priority: "high",
    read: false,
  },
  {
    id: 5,
    date: "Mar 25, 2026",
    title: "Campus Wi-Fi Maintenance — Apr 5",
    body: "Scheduled maintenance on the campus wireless infrastructure will cause intermittent disruptions between 02:00–06:00 on Saturday, April 5. Wired connections will not be affected.",
    type: "system",
    priority: "normal",
    read: true,
  },
  {
    id: 6,
    date: "Mar 22, 2026",
    title: "Student Research Symposium — Call for Abstracts",
    body: "The annual Student Research Symposium will be held on May 20–21. Submit a 250-word abstract via the portal by Apr 10 to present your work. All disciplines welcome.",
    type: "event",
    priority: "normal",
    read: true,
  },
];

const typeLabel: Record<AnnouncementType, string> = {
  system: "System",
  faculty: "Faculty",
  event: "Event",
};

const typeVariant: Record<
  AnnouncementType,
  "default" | "secondary" | "outline"
> = {
  system: "default",
  faculty: "secondary",
  event: "outline",
};

export default function AnnouncementsPage() {
  const [readIds, setReadIds] = useState<Set<number>>(
    new Set(announcements.filter((a) => a.read).map((a) => a.id)),
  );
  const [activeTab, setActiveTab] = useState("all");

  const toggleRead = (id: number) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered =
    activeTab === "all"
      ? announcements
      : announcements.filter((a) => a.type === activeTab);

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
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Academic Portal
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-sm text-muted-foreground">
            University-wide notices, faculty updates, and campus events.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
          </TabsList>

          {(["all", "system", "faculty", "event"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6 space-y-3">
              {(tab === "all"
                ? announcements
                : announcements.filter((a) => a.type === tab)
              ).map((item) => {
                const isRead = readIds.has(item.id);
                return (
                  <Card
                    key={item.id}
                    className={`shadow-sm border-0 transition-opacity ${isRead ? "opacity-60" : ""}`}
                  >
                    <CardHeader className="pb-2 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              {item.date}
                            </p>
                            <Badge
                              variant={typeVariant[item.type]}
                              className="text-xs"
                            >
                              {typeLabel[item.type]}
                            </Badge>
                            {item.priority === "high" && (
                              <Badge variant="destructive" className="text-xs">
                                Priority
                              </Badge>
                            )}
                          </div>
                          <h2
                            className={`text-sm font-semibold leading-snug ${isRead ? "font-normal" : ""}`}
                          >
                            {item.title}
                          </h2>
                        </div>
                        <Button
                          size="icon"
                          variant={isRead ? "outline" : "ghost"}
                          className="h-7 w-7 shrink-0"
                          onClick={() => toggleRead(item.id)}
                          id={`read-toggle-${item.id}`}
                          title={isRead ? "Mark unread" : "Mark as read"}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.body}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
