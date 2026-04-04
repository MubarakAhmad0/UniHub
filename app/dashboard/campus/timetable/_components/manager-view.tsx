"use client";

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  CalendarArrowDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const CELL_H = 56;
const TODAY_IDX = 2;

type TeachingSlot = {
  id: string;
  courseCode: string;
  courseName: string;
  day: number;
  startHour: number;
  endHour: number;
  room: string;
  enrolledCount: number;
  type: "class";
};

type OfficeHourSlot = {
  id: string;
  day: number;
  startHour: number;
  endHour: number;
  room: string;
  type: "office";
};

type CalSlot = TeachingSlot | OfficeHourSlot;

const INITIAL_TEACHING: TeachingSlot[] = [
  {
    id: "t1",
    courseCode: "MTH 301",
    courseName: "Advanced Calculus II",
    day: 0,
    startHour: 10,
    endHour: 12,
    room: "Block A, LT1",
    enrolledCount: 32,
    type: "class",
  },
  {
    id: "t2",
    courseCode: "MTH 301",
    courseName: "Advanced Calculus II",
    day: 2,
    startHour: 14,
    endHour: 16,
    room: "Block A, LT1",
    enrolledCount: 32,
    type: "class",
  },
  {
    id: "t3",
    courseCode: "CS 105",
    courseName: "Data Structures",
    day: 1,
    startHour: 9,
    endHour: 11,
    room: "Lab 4, CS Block",
    enrolledCount: 28,
    type: "class",
  },
];

const INITIAL_OFFICE: OfficeHourSlot[] = [
  {
    id: "o1",
    day: 3,
    startHour: 14,
    endHour: 16,
    room: "Block B, Room 203",
    type: "office",
  },
];

const WEEK_LABELS: Record<number, string> = {
  "-1": "Mar 24–30, 2026",
  0: "Mar 31–Apr 6, 2026",
  1: "Apr 7–13, 2026",
};

export function ManagerTimetableView() {
  const [teaching, setTeaching] = useState<TeachingSlot[]>(INITIAL_TEACHING);
  const [officeHours, setOfficeHours] =
    useState<OfficeHourSlot[]>(INITIAL_OFFICE);
  const [weekOffset, setWeekOffset] = useState(0);
  const [ohOpen, setOhOpen] = useState(false);

  // Office hours form
  const [ohDay, setOhDay] = useState("Thursday");
  const [ohStart, setOhStart] = useState("14:00");
  const [ohEnd, setOhEnd] = useState("16:00");
  const [ohRoom, setOhRoom] = useState("");
  const [ohType, setOhType] = useState<"one-time" | "recurring">("recurring");

  const weekLabel = WEEK_LABELS[weekOffset] ?? `Week ${weekOffset}`;

  const allSlots: CalSlot[] = [...teaching, ...officeHours];

  const addOfficeHours = () => {
    if (!ohRoom.trim()) {
      toast.error("Room is required.");
      return;
    }
    const dayIdx = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ].indexOf(ohDay);
    const startH = parseInt(ohStart.split(":")[0]);
    const endH = parseInt(ohEnd.split(":")[0]);
    setOfficeHours((prev) => [
      ...prev,
      {
        id: `o-${Date.now()}`,
        day: dayIdx,
        startHour: startH,
        endHour: endH,
        room: ohRoom,
        type: "office",
      },
    ]);
    toast.success(`Office hours added (${ohType}).`);
    setOhOpen(false);
    setOhRoom("");
  };

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
              <BreadcrumbPage>Teaching Schedule</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOhOpen(true)}
            id="add-office-hours-btn"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Office Hours
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Exported as ICS.")}
            id="export-btn"
          >
            <CalendarArrowDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Lecturer · Fall 2024
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Teaching Schedule
            </h1>
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
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 text-xs flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary/20 border-l-2 border-primary inline-block" />
            Teaching session
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-100 border-l-2 border-amber-500 inline-block" />
            Office hours
          </span>
        </div>

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
                const daySlots = allSlots.filter((s) => s.day === dayIdx);
                return (
                  <div
                    key={day}
                    className="flex-1 min-w-[120px] border-r border-border/40 last:border-r-0"
                  >
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
                    <div
                      className="relative"
                      style={{ height: CELL_H * HOURS.length }}
                    >
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          className="absolute w-full border-t border-border/25"
                          style={{ top: (h - 8) * CELL_H }}
                        />
                      ))}
                      {isToday && (
                        <div
                          className="absolute w-full flex items-center z-10"
                          style={{ top: (14.75 - 8) * CELL_H }}
                        >
                          <span className="w-2 h-2 rounded-full bg-destructive shrink-0 -ml-1" />
                          <div className="flex-1 border-t border-destructive" />
                        </div>
                      )}
                      {daySlots.map((s) => {
                        const isClass = s.type === "class";
                        const ts = s as TeachingSlot;
                        return (
                          <div
                            key={s.id}
                            className={`absolute left-1 right-1 rounded p-1.5 text-[11px] space-y-0.5 ${
                              isClass
                                ? "bg-primary/10 border-l-2 border-primary text-primary"
                                : "bg-amber-100 border-l-2 border-amber-500 text-amber-800"
                            }`}
                            style={{
                              top: (s.startHour - 8) * CELL_H + 2,
                              height: (s.endHour - s.startHour) * CELL_H - 4,
                            }}
                          >
                            {isClass ? (
                              <>
                                <p className="font-bold leading-tight">
                                  {ts.courseCode}
                                </p>
                                <p className="text-[10px] opacity-80 leading-tight truncate">
                                  {ts.room}
                                </p>
                                <p className="text-[10px] opacity-70">
                                  {ts.enrolledCount} students
                                </p>
                                <Link
                                  href="/dashboard/academic/attendance"
                                  className="text-[10px] underline leading-tight block"
                                >
                                  Take Attendance →
                                </Link>
                              </>
                            ) : (
                              <>
                                <p className="font-bold leading-tight flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  Office Hours
                                </p>
                                <p className="text-[10px] opacity-80 truncate">
                                  {s.room}
                                </p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Office Hours sheet */}
      <Sheet open={ohOpen} onOpenChange={(v) => !v && setOhOpen(false)}>
        <SheetContent className="sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Add Office Hours</SheetTitle>
            <SheetDescription>
              Set a one-time or recurring office hours block on your calendar.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={ohType}
                onValueChange={(v) => setOhType(v as "one-time" | "recurring")}
              >
                <SelectTrigger id="oh-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="recurring">Recurring (weekly)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Day</Label>
              <Select value={ohDay} onValueChange={setOhDay}>
                <SelectTrigger id="oh-day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                    (d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="oh-start">Start</Label>
                <Input
                  id="oh-start"
                  type="time"
                  value={ohStart}
                  onChange={(e) => setOhStart(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="oh-end">End</Label>
                <Input
                  id="oh-end"
                  type="time"
                  value={ohEnd}
                  onChange={(e) => setOhEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="oh-room">Room</Label>
              <Input
                id="oh-room"
                placeholder="e.g. Block B, Room 203"
                value={ohRoom}
                onChange={(e) => setOhRoom(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setOhOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addOfficeHours} id="add-office-hours-submit">
              Add
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
