"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Download, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Types ── */
type AttStatus = "P" | "A" | "L" | "E";
type Session = { date: string; records: Record<string, AttStatus> };
type Student = {
  id: string;
  name: string;
  studentId: string;
  attendancePct: number;
};

type TeachingCourse = {
  id: string;
  code: string;
  title: string;
  students: Student[];
  sessions: Session[];
};

/* ── Mock data ── */
const TEACHING_COURSES: TeachingCourse[] = [
  {
    id: "cs-105",
    code: "CS 105",
    title: "Data Structures",
    students: [
      {
        id: "s001",
        name: "Alex Rivers",
        studentId: "U21001",
        attendancePct: 90,
      },
      { id: "s002", name: "Jae Lee", studentId: "U21002", attendancePct: 72 },
      { id: "s003", name: "Sam Kaur", studentId: "U21003", attendancePct: 85 },
      { id: "s004", name: "Ming Tao", studentId: "U21004", attendancePct: 60 },
      {
        id: "s005",
        name: "Priya Sharma",
        studentId: "U21005",
        attendancePct: 95,
      },
    ],
    sessions: [
      {
        date: "Mar 3",
        records: { s001: "P", s002: "A", s003: "L", s004: "A", s005: "P" },
      },
      {
        date: "Mar 10",
        records: { s001: "P", s002: "P", s003: "E", s004: "A", s005: "P" },
      },
      {
        date: "Mar 17",
        records: { s001: "P", s002: "A", s003: "P", s004: "P", s005: "P" },
      },
      {
        date: "Mar 24",
        records: { s001: "L", s002: "A", s003: "P", s004: "A", s005: "P" },
      },
    ],
  },
  {
    id: "mth-301",
    code: "MTH 301",
    title: "Advanced Calculus II",
    students: [
      {
        id: "s006",
        name: "Jamie Brooks",
        studentId: "U21010",
        attendancePct: 88,
      },
      {
        id: "s007",
        name: "Chris Dang",
        studentId: "U21011",
        attendancePct: 72,
      },
      {
        id: "s008",
        name: "Sofia Melo",
        studentId: "U21012",
        attendancePct: 95,
      },
    ],
    sessions: [
      { date: "Mar 5", records: { s006: "P", s007: "A", s008: "P" } },
      { date: "Mar 12", records: { s006: "P", s007: "P", s008: "P" } },
      { date: "Mar 19", records: { s006: "L", s007: "A", s008: "P" } },
    ],
  },
];

const STATUS_COLORS: Record<AttStatus, string> = {
  P: "bg-emerald-500 text-white",
  A: "bg-destructive text-white",
  L: "bg-amber-500 text-white",
  E: "bg-muted text-muted-foreground",
};

/* ── Quick-mark overlay ── */
type QuickMarkOverlayProps = {
  course: TeachingCourse;
  onSubmit: (records: Record<string, AttStatus>) => void;
  onCancel: () => void;
};

function QuickMarkOverlay({
  course,
  onSubmit,
  onCancel,
}: QuickMarkOverlayProps) {
  const [marks, setMarks] = useState<Record<string, AttStatus | null>>(
    Object.fromEntries(course.students.map((s) => [s.id, null])),
  );

  const mark = (studentId: string, status: AttStatus) =>
    setMarks((prev) => ({ ...prev, [studentId]: status }));

  const markedCount = Object.values(marks).filter(Boolean).length;

  const handleSubmit = () => {
    if (markedCount < course.students.length) {
      toast.error("Please mark all students before submitting.");
      return;
    }
    onSubmit(marks as Record<string, AttStatus>);
    toast.success("Session recorded.");
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
            {course.code}
          </p>
          <h2 className="text-xl font-bold">Session — {today}</h2>
        </div>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {course.students.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
              {s.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{s.name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {s.studentId}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {(["P", "A", "L", "E"] as AttStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => mark(s.id, st)}
                  className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
                    marks[s.id] === st
                      ? STATUS_COLORS[st]
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                  id={`qm-${s.id}-${st}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {markedCount} / {course.students.length} marked
        </p>
        <Button onClick={handleSubmit} id="submit-session-btn">
          Submit Session
        </Button>
      </div>
    </div>
  );
}

/* ── Edit reason dialog ── */
type EditReasonDialogProps = {
  open: boolean;
  date: string;
  studentName: string;
  oldStatus: AttStatus;
  newStatus: AttStatus;
  onSave: (reason: string) => void;
  onClose: () => void;
};

function EditReasonDialog({
  open,
  date,
  studentName,
  oldStatus,
  newStatus,
  onSave,
  onClose,
}: EditReasonDialogProps) {
  const [reason, setReason] = useState("");
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Past Session — {date}</DialogTitle>
          <DialogDescription>
            Student: <strong>{studentName}</strong>
            <br />
            {oldStatus} → {newStatus}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 space-y-1.5">
          <Label htmlFor="edit-reason">Reason *</Label>
          <Textarea
            id="edit-reason"
            rows={3}
            className="resize-none"
            placeholder="Reason for change…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!reason.trim()) {
                toast.error("Reason required.");
                return;
              }
              onSave(reason);
            }}
          >
            Save Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Manager View ── */
export function ManagerAttendanceView() {
  const [courses, setCourses] = useState<TeachingCourse[]>(TEACHING_COURSES);
  const [activeTab, setActiveTab] = useState(TEACHING_COURSES[0].id);
  const [quickMarkOpen, setQuickMarkOpen] = useState(false);

  type PendingEdit = {
    studentId: string;
    studentName: string;
    sessionDate: string;
    oldStatus: AttStatus;
    newStatus: AttStatus;
  } | null;
  const [pendingEdit, setPendingEdit] = useState<PendingEdit>(null);

  const course = courses.find((c) => c.id === activeTab)!;
  const threshold = 80;

  const addSession = (records: Record<string, AttStatus>) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    setCourses((prev) =>
      prev.map((c) =>
        c.id !== activeTab
          ? c
          : { ...c, sessions: [...c.sessions, { date: today, records }] },
      ),
    );
    setQuickMarkOpen(false);
  };

  const handleCellChange = (
    studentId: string,
    studentName: string,
    sessionDate: string,
    oldStatus: AttStatus,
    newStatus: AttStatus,
  ) => {
    setPendingEdit({
      studentId,
      studentName,
      sessionDate,
      oldStatus,
      newStatus,
    });
  };

  const confirmEdit = (_reason: string) => {
    if (!pendingEdit) return;
    setCourses((prev) =>
      prev.map((c) =>
        c.id !== activeTab
          ? c
          : {
              ...c,
              sessions: c.sessions.map((s) =>
                s.date !== pendingEdit.sessionDate
                  ? s
                  : {
                      ...s,
                      records: {
                        ...s.records,
                        [pendingEdit.studentId]: pendingEdit.newStatus,
                      },
                    },
              ),
            },
      ),
    );
    toast.success("Attendance updated.");
    setPendingEdit(null);
  };

  const attPct = (studentId: string) => {
    const total = course.sessions.length;
    if (total === 0) return 100;
    const attended = course.sessions.filter((s) =>
      ["P", "L", "E"].includes(s.records[studentId] ?? "A"),
    ).length;
    return Math.round((attended / total) * 100);
  };

  return (
    <>
      {quickMarkOpen && (
        <QuickMarkOverlay
          course={course}
          onSubmit={addSession}
          onCancel={() => setQuickMarkOpen(false)}
        />
      )}

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
                <BreadcrumbPage>Attendance Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("Exported as CSV.")}
              id="export-att-btn"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={() => setQuickMarkOpen(true)}
              id="start-session-btn"
            >
              <Play className="h-3.5 w-3.5 mr-1.5" />
              Start Session
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Lecturer · Fall 2024
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Attendance Management
            </h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {courses.map((c) => (
                <TabsTrigger key={c.id} value={c.id} className="text-xs">
                  {c.code}
                </TabsTrigger>
              ))}
            </TabsList>

            {courses.map((c) => (
              <TabsContent key={c.id} value={c.id} className="mt-4">
                {/* Attendance sheet */}
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead>Student</TableHead>
                        <TableHead className="text-xs font-mono">ID</TableHead>
                        {c.sessions.map((s) => (
                          <TableHead
                            key={s.date}
                            className="text-center text-xs min-w-[72px]"
                          >
                            {s.date}
                          </TableHead>
                        ))}
                        <TableHead className="text-center">Att%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {c.students.map((stu) => {
                        const pct = attPct(stu.id);
                        const atRisk = pct < threshold;
                        return (
                          <TableRow
                            key={stu.id}
                            className={atRisk ? "bg-destructive/5" : ""}
                          >
                            <TableCell className="font-medium text-sm flex items-center gap-1.5">
                              {atRisk && (
                                <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                              )}
                              {stu.name}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {stu.studentId}
                            </TableCell>
                            {c.sessions.map((sess) => {
                              const status = (sess.records[stu.id] ??
                                "A") as AttStatus;
                              return (
                                <TableCell
                                  key={sess.date}
                                  className="text-center p-1"
                                >
                                  <Select
                                    value={status}
                                    onValueChange={(newVal) =>
                                      handleCellChange(
                                        stu.id,
                                        stu.name,
                                        sess.date,
                                        status,
                                        newVal as AttStatus,
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      className={`h-7 w-14 mx-auto text-xs font-bold border-0 ${STATUS_COLORS[status]} focus:ring-0`}
                                      id={`att-${stu.id}-${sess.date}`}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="P">
                                        P — Present
                                      </SelectItem>
                                      <SelectItem value="A">
                                        A — Absent
                                      </SelectItem>
                                      <SelectItem value="L">
                                        L — Late
                                      </SelectItem>
                                      <SelectItem value="E">
                                        E — Excused
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center">
                              <span
                                className={`text-xs font-bold ${atRisk ? "text-destructive" : "text-emerald-600"}`}
                              >
                                {pct}%
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* At-risk callout */}
                {c.students.filter((s) => attPct(s.id) < threshold).length >
                  0 && (
                  <Card className="border-0 bg-destructive/5 mt-3">
                    <CardContent className="px-5 py-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                      <p className="text-sm text-destructive">
                        <strong>
                          {
                            c.students.filter((s) => attPct(s.id) < threshold)
                              .length
                          }
                        </strong>{" "}
                        student(s) below {threshold}% — consider sending a
                        warning.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>

      {pendingEdit && (
        <EditReasonDialog
          open
          date={pendingEdit.sessionDate}
          studentName={pendingEdit.studentName}
          oldStatus={pendingEdit.oldStatus}
          newStatus={pendingEdit.newStatus}
          onSave={confirmEdit}
          onClose={() => setPendingEdit(null)}
        />
      )}
    </>
  );
}
