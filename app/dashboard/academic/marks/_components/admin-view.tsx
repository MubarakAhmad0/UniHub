"use client";

import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Types ── */
type CoursePublishStatus = "Draft" | "Published";

type AuditEntry = {
  id: string;
  course: string;
  student: string;
  component: string;
  oldVal: number;
  newVal: number;
  changedBy: string;
  reason: string;
  ts: string;
};

type AdminCourse = {
  id: string;
  code: string;
  title: string;
  lecturer: string;
  publishStatus: CoursePublishStatus;
  students: {
    id: string;
    name: string;
    studentId: string;
    a1: number;
    a2: number;
    midterm: number;
    final: number;
  }[];
};

/* ── Mock data ── */
const COURSES: AdminCourse[] = [
  {
    id: "cs-105",
    code: "CS 105",
    title: "Data Structures",
    lecturer: "Prof. Sarah Chen",
    publishStatus: "Draft",
    students: [
      {
        id: "s001",
        name: "Alex Rivers",
        studentId: "U21001",
        a1: 18,
        a2: 16,
        midterm: 24,
        final: 0,
      },
      {
        id: "s002",
        name: "Jae Lee",
        studentId: "U21002",
        a1: 20,
        a2: 19,
        midterm: 28,
        final: 0,
      },
      {
        id: "s003",
        name: "Sam Kaur",
        studentId: "U21003",
        a1: 12,
        a2: 14,
        midterm: 18,
        final: 0,
      },
    ],
  },
  {
    id: "mth-301",
    code: "MTH 301",
    title: "Advanced Calculus II",
    lecturer: "Prof. Elena Rossi",
    publishStatus: "Published",
    students: [
      {
        id: "s006",
        name: "Jamie Brooks",
        studentId: "U21010",
        a1: 15,
        a2: 17,
        midterm: 21,
        final: 18,
      },
      {
        id: "s007",
        name: "Chris Dang",
        studentId: "U21011",
        a1: 19,
        a2: 18,
        midterm: 27,
        final: 20,
      },
    ],
  },
];

const INITIAL_AUDIT: AuditEntry[] = [
  {
    id: "au1",
    course: "CS 105",
    student: "Alex Rivers",
    component: "A1",
    oldVal: 15,
    newVal: 18,
    changedBy: "Prof. Sarah Chen",
    reason: "Marking error — wrong rubric applied",
    ts: "2026-04-02 14:32",
  },
  {
    id: "au2",
    course: "MTH 301",
    student: "Jamie Brooks",
    component: "Midterm",
    oldVal: 19,
    newVal: 21,
    changedBy: "Prof. Elena Rossi",
    reason: "Partial credit for attempted question 4",
    ts: "2026-04-03 09:10",
  },
];

/* ── Override dialog ── */
type OverrideDialogProps = {
  open: boolean;
  studentName: string;
  component: string;
  originalValue: number;
  onSave: (newVal: number, reason: string) => void;
  onClose: () => void;
};

function OverrideDialog({
  open,
  studentName,
  component,
  originalValue,
  onSave,
  onClose,
}: OverrideDialogProps) {
  const [val, setVal] = useState(originalValue.toString());
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Override Mark — {studentName}</DialogTitle>
          <DialogDescription>
            Component: <strong>{component}</strong> · Original:{" "}
            <strong>{originalValue}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="ov-val">New Value</Label>
            <Input
              id="ov-val"
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ov-reason">Reason *</Label>
            <Textarea
              id="ov-reason"
              placeholder="Reason for override…"
              rows={3}
              className="resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!reason.trim()) {
                toast.error("Reason is required.");
                return;
              }
              onSave(parseInt(val) || 0, reason);
            }}
            id="confirm-override-btn"
          >
            Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Admin View ── */
export function AdminMarksView() {
  const [courses, setCourses] = useState<AdminCourse[]>(COURSES);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT);
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0].id);

  type OverrideTarget = {
    studentId: string;
    studentName: string;
    field: string;
    originalValue: number;
  } | null;
  const [overrideTarget, setOverrideTarget] = useState<OverrideTarget>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)!;

  const COLS = [
    { field: "a1", label: "A1 (20)", max: 20 },
    { field: "a2", label: "A2 (20)", max: 20 },
    { field: "midterm", label: "Midterm (30)", max: 30 },
    { field: "final", label: "Final (20)", max: 20 },
  ] as const;

  const togglePublish = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id !== courseId
          ? c
          : {
              ...c,
              publishStatus:
                c.publishStatus === "Published" ? "Draft" : "Published",
            },
      ),
    );
    const c = courses.find((c) => c.id === courseId)!;
    toast.success(
      c.publishStatus === "Published"
        ? "Marks unpublished."
        : `Marks published for ${c.code}.`,
    );
  };

  const handleOverride = (newVal: number, reason: string) => {
    if (!overrideTarget) return;
    const { studentId, studentName, field, originalValue } = overrideTarget;

    setCourses((prev) =>
      prev.map((c) =>
        c.id !== selectedCourseId
          ? c
          : {
              ...c,
              students: c.students.map((s) =>
                s.id !== studentId ? s : { ...s, [field]: newVal },
              ),
            },
      ),
    );

    setAuditLog((prev) => [
      {
        id: `au-${Date.now()}`,
        course: selectedCourse.code,
        student: studentName,
        component: field.toUpperCase(),
        oldVal: originalValue,
        newVal,
        changedBy: "Admin",
        reason,
        ts: new Date().toLocaleString(),
      },
      ...prev,
    ]);

    toast.success("Override applied and logged.");
    setOverrideTarget(null);
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
              <BreadcrumbPage>Marks Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Admin · Fall 2024
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Marks Management
          </h1>
        </div>

        <Tabs defaultValue="by-course">
          <TabsList>
            <TabsTrigger value="by-course">By Course</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>

          {/* ── By Course ── */}
          <TabsContent value="by-course" className="space-y-4 mt-4">
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
            >
              <SelectTrigger className="w-72" id="admin-course-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.code} · {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Student</TableHead>
                    <TableHead className="text-xs font-mono">ID</TableHead>
                    {COLS.map((c) => (
                      <TableHead key={c.field} className="text-center">
                        {c.label}
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCourse.students.map((s) => {
                    const t = s.a1 + s.a2 + s.midterm + s.final;
                    const pct = (t / 90) * 100;
                    const grade =
                      pct >= 85
                        ? "A"
                        : pct >= 75
                          ? "B"
                          : pct >= 65
                            ? "C"
                            : pct >= 50
                              ? "D"
                              : "F";
                    return (
                      <TableRow key={s.id} className="group">
                        <TableCell className="font-medium text-sm">
                          {s.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {s.studentId}
                        </TableCell>
                        {COLS.map((col) => (
                          <TableCell key={col.field} className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-sm">
                                {(s as any)[col.field]}
                              </span>
                              <button
                                onClick={() =>
                                  setOverrideTarget({
                                    studentId: s.id,
                                    studentName: s.name,
                                    field: col.field,
                                    originalValue: (s as any)[col.field],
                                  })
                                }
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                id={`override-${s.id}-${col.field}`}
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                            </div>
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold text-sm">
                          {t}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              grade === "F" ? "destructive" : "secondary"
                            }
                            className="text-xs"
                          >
                            {grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Audit Log ── */}
          <TabsContent value="audit" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Course</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead className="text-center">Old</TableHead>
                    <TableHead className="text-center">New</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead className="w-[25%]">Reason</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-sm text-muted-foreground"
                      >
                        No changes logged yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {auditLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs">
                        {entry.course}
                      </TableCell>
                      <TableCell className="text-sm">{entry.student}</TableCell>
                      <TableCell className="text-xs font-semibold">
                        {entry.component}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground line-through">
                        {entry.oldVal}
                      </TableCell>
                      <TableCell className="text-center text-sm font-bold">
                        {entry.newVal}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {entry.changedBy}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {entry.reason}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {entry.ts}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Publish ── */}
          <TabsContent value="publish" className="mt-4 space-y-3">
            {courses.map((c) => (
              <Card key={c.id} className="border-0 shadow-sm">
                <CardContent className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm">
                      {c.code} · {c.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.lecturer}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={
                        c.publishStatus === "Published" ? "default" : "outline"
                      }
                      className="text-xs"
                    >
                      {c.publishStatus}
                    </Badge>
                    <Button
                      size="sm"
                      variant={
                        c.publishStatus === "Published" ? "outline" : "default"
                      }
                      onClick={() => togglePublish(c.id)}
                      id={`publish-${c.id}`}
                    >
                      {c.publishStatus === "Published"
                        ? "Unpublish"
                        : "Publish Marks"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {overrideTarget && (
        <OverrideDialog
          open
          studentName={overrideTarget.studentName}
          component={overrideTarget.field.toUpperCase()}
          originalValue={overrideTarget.originalValue}
          onSave={handleOverride}
          onClose={() => setOverrideTarget(null)}
        />
      )}
    </div>
  );
}
