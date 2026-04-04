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
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Types ── */
type GradeRow = {
  id: string;
  name: string;
  studentId: string;
  a1: number;
  a2: number;
  midterm: number;
  final: number;
};

type TeachingCourse = {
  courseId: string;
  courseName: string;
  isSubmitted: boolean;
  students: GradeRow[];
};

/* ── Helpers ── */
function total(r: GradeRow) {
  return r.a1 + r.a2 + r.midterm + r.final;
}
const MAX_TOTAL = 90; // a1(20)+a2(20)+midterm(30)+final(20) — final max 20 here

function gradeFromTotal(t: number): string {
  const pct = (t / MAX_TOTAL) * 100;
  if (pct >= 85) return "A";
  if (pct >= 75) return "B";
  if (pct >= 65) return "C";
  if (pct >= 50) return "D";
  return "F";
}

/* ── Mock data ── */
const INITIAL_COURSES: TeachingCourse[] = [
  {
    courseId: "cs-105",
    courseName: "CS 105 · Data Structures",
    isSubmitted: false,
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
      {
        id: "s004",
        name: "Ming Tao",
        studentId: "U21004",
        a1: 17,
        a2: 15,
        midterm: 22,
        final: 0,
      },
      {
        id: "s005",
        name: "Priya Sharma",
        studentId: "U21005",
        a1: 20,
        a2: 20,
        midterm: 29,
        final: 0,
      },
    ],
  },
  {
    courseId: "mth-301",
    courseName: "MTH 301 · Advanced Calculus II",
    isSubmitted: true,
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
      {
        id: "s008",
        name: "Sofia Melo",
        studentId: "U21012",
        a1: 20,
        a2: 20,
        midterm: 30,
        final: 20,
      },
    ],
  },
];

/* ── Edit-after-submission reason dialog ── */
type EditReasonDialogProps = {
  open: boolean;
  originalValue: number;
  newValue: number;
  onSave: (newValue: number, reason: string) => void;
  onCancel: () => void;
};

function EditReasonDialog({
  open,
  originalValue,
  newValue,
  onSave,
  onCancel,
}: EditReasonDialogProps) {
  const [val, setVal] = useState(newValue.toString());
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Submitted Mark</DialogTitle>
          <DialogDescription>
            Original value: <strong>{originalValue}</strong>. Provide a reason —
            the change will be flagged for admin review.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="er-val">New Value</Label>
            <Input
              id="er-val"
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="er-reason">Reason *</Label>
            <Textarea
              id="er-reason"
              placeholder="Reason for change…"
              rows={3}
              className="resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
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
          >
            Save & Flag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Grade table ── */
type GradeTableProps = {
  students: GradeRow[];
  isSubmitted: boolean;
  onUpdate: (id: string, field: keyof GradeRow, value: number) => void;
};

type DirtyCell = {
  studentId: string;
  field: keyof GradeRow;
  originalValue: number;
  pendingValue: number;
} | null;

function GradeTable({ students, isSubmitted, onUpdate }: GradeTableProps) {
  const [dirtyRows, setDirtyRows] = useState<Set<string>>(new Set());
  const [editDialog, setEditDialog] = useState<DirtyCell>(null);

  const COLUMNS: { field: keyof GradeRow; label: string; max: number }[] = [
    { field: "a1", label: "A1 (20)", max: 20 },
    { field: "a2", label: "A2 (20)", max: 20 },
    { field: "midterm", label: "Midterm (30)", max: 30 },
    { field: "final", label: "Final (20)", max: 20 },
  ];

  const handleCellChange = (
    row: GradeRow,
    field: keyof GradeRow,
    rawValue: string,
  ) => {
    const value = Math.max(0, parseInt(rawValue) || 0);
    if (isSubmitted) {
      setEditDialog({
        studentId: row.id,
        field,
        originalValue: row[field] as number,
        pendingValue: value,
      });
    } else {
      onUpdate(row.id, field, value);
      setDirtyRows((prev) => new Set(prev).add(row.id));
    }
  };

  const saveRow = (rowId: string) => {
    setDirtyRows((prev) => {
      const s = new Set(prev);
      s.delete(rowId);
      return s;
    });
    toast.success("Row saved.");
  };

  const classAvg =
    students.reduce((sum, s) => sum + total(s), 0) / students.length;

  return (
    <>
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Student</TableHead>
              <TableHead className="text-xs font-mono">ID</TableHead>
              {COLUMNS.map((c) => (
                <TableHead key={c.field} className="text-center">
                  {c.label}
                </TableHead>
              ))}
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((row) => {
              const isDirty = dirtyRows.has(row.id);
              const rowTotal = total(row);
              return (
                <TableRow
                  key={row.id}
                  className={isDirty ? "ring-1 ring-inset ring-amber-400" : ""}
                >
                  <TableCell className="font-medium text-sm">
                    {row.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {row.studentId}
                  </TableCell>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.field} className="text-center p-1">
                      <Input
                        type="number"
                        min={0}
                        max={col.max}
                        value={(row[col.field] as number).toString()}
                        onChange={(e) =>
                          handleCellChange(row, col.field, e.target.value)
                        }
                        className={`h-7 w-16 text-center text-xs mx-auto ${isSubmitted ? "ring-1 ring-primary/30" : ""}`}
                        id={`cell-${row.id}-${col.field}`}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold text-sm">
                    {rowTotal}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        gradeFromTotal(rowTotal) === "F"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {gradeFromTotal(rowTotal)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isDirty && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                        onClick={() => saveRow(row.id)}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm text-muted-foreground pt-1">
        <span>
          Avg: <strong>{classAvg.toFixed(1)}</strong>
        </span>
        <span>
          High: <strong>{Math.max(...students.map(total))}</strong>
        </span>
        <span>
          Low: <strong>{Math.min(...students.map(total))}</strong>
        </span>
      </div>

      {/* Edit-after-submit dialog */}
      {editDialog && (
        <EditReasonDialog
          open
          originalValue={editDialog.originalValue}
          newValue={editDialog.pendingValue}
          onSave={(newVal, reason) => {
            onUpdate(editDialog.studentId, editDialog.field, newVal);
            toast.success("Change flagged for admin review.");
            setEditDialog(null);
          }}
          onCancel={() => setEditDialog(null)}
        />
      )}
    </>
  );
}

/* ── Manager View ── */
export function ManagerMarksView() {
  const [courses, setCourses] = useState<TeachingCourse[]>(INITIAL_COURSES);
  const [selectedId, setSelected] = useState(INITIAL_COURSES[0].courseId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const course = courses.find((c) => c.courseId === selectedId)!;

  const updateGrade = (
    courseId: string,
    studentId: string,
    field: keyof GradeRow,
    value: number,
  ) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.courseId !== courseId
          ? c
          : {
              ...c,
              students: c.students.map((s) =>
                s.id !== studentId ? s : { ...s, [field]: value },
              ),
            },
      ),
    );
  };

  const submitToRegistry = () => {
    setCourses((prev) =>
      prev.map((c) =>
        c.courseId === course.courseId ? { ...c, isSubmitted: true } : c,
      ),
    );
    toast.success("Marks submitted to registry.");
    setConfirmOpen(false);
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
              <BreadcrumbPage>Grade Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Lecturer · Fall 2024
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Grade Management
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedId} onValueChange={setSelected}>
              <SelectTrigger className="w-64" id="course-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.courseId} value={c.courseId}>
                    {c.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {course.isSubmitted ? (
              <Badge variant="secondary" className="text-xs shrink-0">
                ✓ Submitted to Registry
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => setConfirmOpen(true)}
                id="submit-registry-btn"
              >
                Submit to Registry
              </Button>
            )}
          </div>
        </div>

        {course.isSubmitted && (
          <div className="rounded-md bg-primary/5 border border-primary/20 px-4 py-2 text-xs text-primary">
            Marks are submitted. Any edits will be flagged for admin review.
          </div>
        )}

        <GradeTable
          students={course.students}
          isSubmitted={course.isSubmitted}
          onUpdate={(studentId, field, value) =>
            updateGrade(course.courseId, studentId, field, value)
          }
        />
      </main>

      {/* Confirm submit dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Submit to Registry?</DialogTitle>
            <DialogDescription>
              Marks will be flagged for admin review on any further edits. You
              will still be able to make changes, but each edit will require a
              reason.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitToRegistry} id="confirm-submit-btn">
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
