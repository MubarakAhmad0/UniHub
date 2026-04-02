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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  CalendarArrowDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
} from "lucide-react";
import { useState } from "react";

/* ── Mock data ────────────────────────────────────────────────────── */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8–20

const COURSE_COLORS: Record<string, string> = {
  "ARC 402": "bg-primary/15 border-l-2 border-primary text-primary",
  "MTH 301": "bg-blue-100/70 border-l-2 border-blue-400 text-blue-800",
  "HIS 215": "bg-emerald-100/70 border-l-2 border-emerald-500 text-emerald-800",
  "CS 105": "bg-orange-100/70 border-l-2 border-orange-400 text-orange-800",
};

type Session = {
  id: string;
  code: string;
  title: string;
  day: number; // 0=Mon
  startHour: number;
  endHour: number;
  room: string;
  building: string;
  lecturer: string;
  lecturerEmail: string;
};

const sessions: Session[] = [
  {
    id: "1",
    code: "ARC 402",
    title: "Urban Design Theory",
    day: 0,
    startHour: 9,
    endHour: 11,
    room: "Studio C",
    building: "Block 3",
    lecturer: "Prof. Julian Vane",
    lecturerEmail: "j.vane@univ.edu",
  },
  {
    id: "2",
    code: "CS 105",
    title: "Data Structures",
    day: 0,
    startHour: 14,
    endHour: 16,
    room: "Lab 4",
    building: "Computing Block",
    lecturer: "Prof. Sarah Chen",
    lecturerEmail: "s.chen@univ.edu",
  },
  {
    id: "3",
    code: "MTH 301",
    title: "Advanced Calculus II",
    day: 1,
    startHour: 10,
    endHour: 12,
    room: "Hall 9A",
    building: "Main Building",
    lecturer: "Prof. Elena Rossi",
    lecturerEmail: "e.rossi@univ.edu",
  },
  {
    id: "4",
    code: "ARC 402",
    title: "Urban Design Theory",
    day: 2,
    startHour: 9,
    endHour: 11,
    room: "Studio C",
    building: "Block 3",
    lecturer: "Prof. Julian Vane",
    lecturerEmail: "j.vane@univ.edu",
  },
  {
    id: "5",
    code: "HIS 215",
    title: "Renaissance Art History",
    day: 2,
    startHour: 14,
    endHour: 17,
    room: "LT 2",
    building: "Arts Block",
    lecturer: "Prof. Mark Sterling",
    lecturerEmail: "m.sterling@univ.edu",
  },
  {
    id: "6",
    code: "MTH 301",
    title: "Advanced Calculus II",
    day: 3,
    startHour: 10,
    endHour: 12,
    room: "Hall 9A",
    building: "Main Building",
    lecturer: "Prof. Elena Rossi",
    lecturerEmail: "e.rossi@univ.edu",
  },
  {
    id: "7",
    code: "CS 105",
    title: "Data Structures",
    day: 3,
    startHour: 14,
    endHour: 16,
    room: "Lab 4",
    building: "Computing Block",
    lecturer: "Prof. Sarah Chen",
    lecturerEmail: "s.chen@univ.edu",
  },
  {
    id: "8",
    code: "HIS 215",
    title: "Renaissance Art History",
    day: 4,
    startHour: 11,
    endHour: 13,
    room: "LT 2",
    building: "Arts Block",
    lecturer: "Prof. Mark Sterling",
    lecturerEmail: "m.sterling@univ.edu",
  },
];

const CELL_H = 56; // px per hour
const TODAY_IDX = 2; // Wednesday

export default function TimetablePage() {
  const [selected, setSelected] = useState<Session | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekLabel =
    weekOffset === 0
      ? "Mar 31 – Apr 6, 2026"
      : weekOffset === 1
        ? "Apr 7 – Apr 13, 2026"
        : "Mar 24 – Mar 30, 2026";

  const sessionsFor = (dayIdx: number) =>
    sessions.filter((s) => s.day === dayIdx);

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
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
              <BreadcrumbLink href="/dashboard/campus/timetable">
                Campus
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Timetable</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        {/* Page title */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Campus · Fall 2024
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((w) => w - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {weekLabel}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((w) => w + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(0)}
            >
              Today
            </Button>
            <Button size="sm" variant="outline">
              <CalendarArrowDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Grid */}
        <Card className="border-0 shadow-sm overflow-auto">
          <CardContent className="p-0">
            <div className="flex">
              {/* Time axis */}
              <div className="flex flex-col shrink-0 w-14 pt-10 border-r border-border/40">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="text-[11px] text-muted-foreground text-right pr-2 shrink-0"
                    style={{ height: CELL_H }}
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((day, dayIdx) => {
                const isToday = dayIdx === TODAY_IDX && weekOffset === 0;
                return (
                  <div
                    key={day}
                    className="flex-1 min-w-[120px] border-r border-border/40 last:border-r-0"
                  >
                    {/* Day header */}
                    <div
                      className={`h-10 flex flex-col items-center justify-center text-xs font-semibold uppercase tracking-wider ${isToday ? "bg-primary text-primary-foreground rounded-t" : "text-muted-foreground"}`}
                    >
                      {day}
                      {isToday && (
                        <span className="text-[9px] font-normal opacity-80">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Hour cells + sessions */}
                    <div
                      className="relative"
                      style={{ height: CELL_H * HOURS.length }}
                    >
                      {/* Hour grid lines */}
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          className="absolute w-full border-t border-border/25"
                          style={{ top: (h - 8) * CELL_H }}
                        />
                      ))}

                      {/* Current time line (today, ~14:45) */}
                      {isToday && (
                        <div
                          className="absolute w-full flex items-center z-10"
                          style={{ top: (14.75 - 8) * CELL_H }}
                        >
                          <span className="w-2 h-2 rounded-full bg-destructive shrink-0 -ml-1" />
                          <div className="flex-1 border-t border-destructive" />
                        </div>
                      )}

                      {/* Session blocks */}
                      {sessionsFor(dayIdx).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelected(s)}
                          className={`absolute left-1 right-1 rounded text-left p-1.5 text-[11px] cursor-pointer transition-opacity hover:opacity-80 ${COURSE_COLORS[s.code]}`}
                          style={{
                            top: (s.startHour - 8) * CELL_H + 2,
                            height: (s.endHour - s.startHour) * CELL_H - 4,
                          }}
                        >
                          <p className="font-bold leading-tight">{s.code}</p>
                          <p className="text-[10px] opacity-80 leading-tight truncate">
                            {s.title}
                          </p>
                          <p className="text-[10px] opacity-70 mt-0.5 truncate">
                            {s.room}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(COURSE_COLORS).map(([code, cls]) => (
            <span
              key={code}
              className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded ${cls}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {code}
            </span>
          ))}
        </div>
      </main>

      {/* Session detail sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-sm">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{selected.code}</Badge>
                  <Badge variant="outline">{DAYS[selected.day]}</Badge>
                </div>
                <SheetTitle className="text-lg leading-snug">
                  {selected.title}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Time
                  </p>
                  <p>
                    {String(selected.startHour).padStart(2, "0")}:00 –{" "}
                    {String(selected.endHour).padStart(2, "0")}:00
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Location
                  </p>
                  <p>
                    {selected.room}, {selected.building}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Lecturer
                  </p>
                  <p>{selected.lecturer}</p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/dashboard/campus/map?room=${selected.room}`}>
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Campus Map
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${selected.lecturerEmail}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email Lecturer
                    </a>
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
