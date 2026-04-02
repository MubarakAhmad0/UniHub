"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

/* ──────────────────────────────────────────────────────────────────────
   Mock data
────────────────────────────────────────────────────────────────────── */

// 1 = attended, 0 = absent, null = no class / future
type AttendanceDay = 1 | 0 | null;

const weeks = [
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "W7",
  "W8",
  "W9",
  "W10",
  "W11",
  "W12",
  "W13",
  "W14",
  "W15",
];

const courses: {
  id: number;
  code: string;
  title: string;
  professor: string;
  schedule: string;
  sessionsHeld: number;
  sessionsAttended: number;
  minimumRequired: number;
  status: "Good" | "Warning" | "At Risk";
  weekly: AttendanceDay[];
}[] = [
  {
    id: 1,
    code: "ARC 402",
    title: "Urban Design Theory",
    professor: "Prof. Julian Vane",
    schedule: "Mon · Wed",
    sessionsHeld: 20,
    sessionsAttended: 19,
    minimumRequired: 80,
    status: "Good",
    weekly: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, null, null, null, null, null],
  },
  {
    id: 2,
    code: "MTH 301",
    title: "Advanced Calculus II",
    professor: "Prof. Elena Rossi",
    schedule: "Tue · Thu",
    sessionsHeld: 20,
    sessionsAttended: 18,
    minimumRequired: 80,
    status: "Good",
    weekly: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, null, null, null, null, null],
  },
  {
    id: 3,
    code: "HIS 215",
    title: "Renaissance Art History",
    professor: "Prof. Mark Sterling",
    schedule: "Wed",
    sessionsHeld: 10,
    sessionsAttended: 8,
    minimumRequired: 80,
    status: "Warning",
    weekly: [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, null, null, null, null, null],
  },
  {
    id: 4,
    code: "CS 105",
    title: "Data Structures",
    professor: "Prof. Sarah Chen",
    schedule: "Mon · Wed · Fri",
    sessionsHeld: 30,
    sessionsAttended: 21,
    minimumRequired: 80,
    status: "At Risk",
    weekly: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, null, null, null, null, null],
  },
];

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Good: "secondary",
  Warning: "default",
  "At Risk": "destructive",
};

function AttendanceDot({ value }: { value: AttendanceDay }) {
  if (value === null)
    return <span className="inline-block w-5 h-5 rounded-sm bg-muted/40" />;
  if (value === 1)
    return (
      <span
        className="inline-block w-5 h-5 rounded-sm bg-primary opacity-80"
        title="Present"
      />
    );
  return (
    <span
      className="inline-block w-5 h-5 rounded-sm bg-destructive opacity-70"
      title="Absent"
    />
  );
}

export default function AttendancePage() {
  const totalPercent = Math.round(
    (courses.reduce((s, c) => s + c.sessionsAttended, 0) /
      courses.reduce((s, c) => s + c.sessionsHeld, 0)) *
      100,
  );

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
              <BreadcrumbPage>Attendance</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fall 2024 · Week 10 of 15
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Attendance Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Session-by-session record for all enrolled courses.
          </p>
        </div>

        {/* ── Summary strip ───────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-sm border-0 bg-card">
            <CardHeader className="pb-1 pt-5 px-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Overall Attendance
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              <p className="text-4xl font-bold">{totalPercent}%</p>
              <Progress value={totalPercent} className="h-1.5" />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-card">
            <CardHeader className="pb-1 pt-5 px-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Sessions Attended
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-4xl font-bold">
                {courses.reduce((s, c) => s + c.sessionsAttended, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                of {courses.reduce((s, c) => s + c.sessionsHeld, 0)} total
                sessions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-destructive/10">
            <CardHeader className="pb-1 pt-5 px-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
                Courses At Risk
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-4xl font-bold text-destructive">
                {courses.filter((c) => c.status === "At Risk").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Below 80% attendance threshold
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Per-course table ─────────────────────────────────────────── */}
        <div className="space-y-4">
          {courses.map((course) => {
            const pct = Math.round(
              (course.sessionsAttended / course.sessionsHeld) * 100,
            );
            return (
              <Card
                key={course.id}
                className="shadow-sm border-0 bg-card overflow-hidden"
              >
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {course.code} · {course.schedule}
                      </p>
                      <h2 className="text-base font-semibold">
                        {course.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {course.professor}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${course.status === "At Risk" ? "text-destructive" : ""}`}
                        >
                          {pct}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.sessionsAttended}/{course.sessionsHeld}{" "}
                          sessions
                        </p>
                      </div>
                      <Badge variant={statusVariant[course.status]}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={pct} className="h-1.5 mt-3" />
                </CardHeader>

                <CardContent className="px-5 pb-5">
                  {/* Weekly heatmap */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-0 hover:bg-transparent">
                          {weeks.map((w) => (
                            <TableHead
                              key={w}
                              className="text-center text-xs px-1 py-1 min-w-[36px]"
                            >
                              {w}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-0 hover:bg-transparent">
                          {course.weekly.map((day, i) => (
                            <TableCell
                              key={i}
                              className="text-center px-1 py-2"
                            >
                              <AttendanceDot value={day} />
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 rounded-sm bg-primary opacity-80" />
                      Present
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 rounded-sm bg-destructive opacity-70" />
                      Absent
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 rounded-sm bg-muted/40" />
                      No class
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
