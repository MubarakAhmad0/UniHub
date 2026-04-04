"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

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

const COURSES = [
  {
    id: 1,
    code: "ARC 402",
    title: "Urban Design Theory",
    professor: "Prof. Julian Vane",
    schedule: "Mon · Wed",
    sessionsHeld: 20,
    sessionsAttended: 19,
    minimumRequired: 80,
    status: "Good" as const,
    weekly: [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      null,
      null,
      null,
      null,
      null,
    ] as AttendanceDay[],
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
    status: "Good" as const,
    weekly: [
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      null,
      null,
      null,
      null,
      null,
    ] as AttendanceDay[],
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
    status: "Warning" as const,
    weekly: [
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      null,
      null,
      null,
      null,
      null,
    ] as AttendanceDay[],
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
    status: "At Risk" as const,
    weekly: [
      1,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      1,
      null,
      null,
      null,
      null,
      null,
    ] as AttendanceDay[],
  },
];

const STATUS_VARIANT: Record<
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

type DisputeSession = {
  courseCode: string;
  week: string;
  professor: string;
} | null;

export function StudentAttendanceView() {
  const [disputeSession, setDisputeSession] = useState<DisputeSession>(null);
  const [disputeReason, setDisputeReason] = useState("");

  const totalPercent = Math.round(
    (COURSES.reduce((s, c) => s + c.sessionsAttended, 0) /
      COURSES.reduce((s, c) => s + c.sessionsHeld, 0)) *
      100,
  );

  const submitDispute = () => {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }
    toast.success(`Dispute sent to ${disputeSession?.professor} for review.`);
    setDisputeSession(null);
    setDisputeReason("");
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

        {/* Summary strip */}
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
                {COURSES.reduce((s, c) => s + c.sessionsAttended, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                of {COURSES.reduce((s, c) => s + c.sessionsHeld, 0)} total
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
                {COURSES.filter((c) => c.status === "At Risk").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Below 80% attendance threshold
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Per-course cards */}
        <div className="space-y-4">
          {COURSES.map((course) => {
            const pct = Math.round(
              (course.sessionsAttended / course.sessionsHeld) * 100,
            );
            const absentWeeks = course.weekly
              .map((v, i) => ({ v, w: weeks[i] }))
              .filter((x) => x.v === 0)
              .map((x) => x.w);
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
                      <Badge variant={STATUS_VARIANT[course.status]}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={pct} className="h-1.5 mt-3" />
                </CardHeader>
                <CardContent className="px-5 pb-5">
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
                              {/* Absent weeks get a Dispute button on hover */}
                              {day === 0 ? (
                                <button
                                  className="group flex flex-col items-center gap-0.5"
                                  onClick={() =>
                                    setDisputeSession({
                                      courseCode: course.code,
                                      week: weeks[i],
                                      professor: course.professor,
                                    })
                                  }
                                  title="Dispute this absence"
                                  id={`dispute-${course.id}-${i}`}
                                >
                                  <AttendanceDot value={day} />
                                  <span className="text-[9px] text-destructive opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                                    dispute
                                  </span>
                                </button>
                              ) : (
                                <AttendanceDot value={day} />
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded-sm bg-primary opacity-80" />
                        Present
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded-sm bg-destructive opacity-70" />
                        Absent (hover to dispute)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded-sm bg-muted/40" />
                        No class
                      </span>
                    </div>
                    {absentWeeks.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-muted-foreground h-7"
                        onClick={() =>
                          setDisputeSession({
                            courseCode: course.code,
                            week: absentWeeks[0],
                            professor: course.professor,
                          })
                        }
                        id={`dispute-all-${course.id}`}
                      >
                        Dispute absence
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Dispute dialog */}
      <Dialog
        open={!!disputeSession}
        onOpenChange={(v) => !v && setDisputeSession(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Dispute Attendance — {disputeSession?.week}
            </DialogTitle>
            <DialogDescription>
              Course: {disputeSession?.courseCode} · Current status:{" "}
              <strong>Absent</strong>
              <br />
              Your dispute will be sent to{" "}
              <strong>{disputeSession?.professor}</strong> for review.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-1.5">
            <Label htmlFor="dispute-reason">Reason *</Label>
            <Textarea
              id="dispute-reason"
              placeholder="Explain why this attendance record is incorrect…"
              rows={4}
              className="resize-none"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeSession(null)}>
              Cancel
            </Button>
            <Button onClick={submitDispute} id="submit-dispute-btn">
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
