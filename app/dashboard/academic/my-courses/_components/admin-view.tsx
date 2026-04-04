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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { MoreHorizontal, Search, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Types ── */
type CourseStatus = "Open" | "Limited" | "Full" | "Closed";

type AdminCourse = {
  id: number;
  code: string;
  title: string;
  faculty: string;
  lecturer: string;
  enrolledCount: number;
  capacity: number;
  status: CourseStatus;
};

/* ── Mock data ── */
const ALL_COURSES: AdminCourse[] = [
  {
    id: 1,
    code: "CS 601",
    title: "Advanced Neural Architectures",
    faculty: "Computer Science",
    lecturer: "Prof. Elena Rossi",
    enrolledCount: 18,
    capacity: 30,
    status: "Open",
  },
  {
    id: 2,
    code: "BIO 320",
    title: "Cellular Mechanics & Flow",
    faculty: "Life Sciences",
    lecturer: "Prof. James Vane",
    enrolledCount: 20,
    capacity: 25,
    status: "Limited",
  },
  {
    id: 3,
    code: "LIT 440",
    title: "Quantum Literary Theory",
    faculty: "Humanities",
    lecturer: "Prof. Aisha Rahman",
    enrolledCount: 2,
    capacity: 20,
    status: "Open",
  },
  {
    id: 4,
    code: "AI 210",
    title: "Ethics in Artificial Intelligence",
    faculty: "Computer Science",
    lecturer: "Dr. Kim Seok-jin",
    enrolledCount: 40,
    capacity: 40,
    status: "Full",
  },
  {
    id: 5,
    code: "DES 315",
    title: "Visual Systems & Brand",
    faculty: "Design",
    lecturer: "Dr. Priya Nair",
    enrolledCount: 8,
    capacity: 15,
    status: "Limited",
  },
  {
    id: 6,
    code: "MTH 301",
    title: "Advanced Calculus II",
    faculty: "Mathematics",
    lecturer: "Prof. Elena Rossi",
    enrolledCount: 32,
    capacity: 40,
    status: "Open",
  },
  {
    id: 7,
    code: "CS 105",
    title: "Data Structures",
    faculty: "Computer Science",
    lecturer: "Dr. Priya Nair",
    enrolledCount: 45,
    capacity: 50,
    status: "Open",
  },
];

const STATUS_VARIANT: Record<
  CourseStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Open: "default",
  Limited: "secondary",
  Full: "destructive",
  Closed: "outline",
};

type ActionDialogType = "enroll" | "drop" | null;

/* ── Force Enroll / Drop Dialog ── */
function ForceActionDialog({
  type,
  course,
  onClose,
}: {
  type: ActionDialogType;
  course: AdminCourse | null;
  onClose: () => void;
}) {
  const [student, setStudent] = useState("");
  const [reason, setReason] = useState("");

  if (!type || !course) return null;

  const isEnroll = type === "enroll";

  const handleConfirm = () => {
    if (!student.trim() || !reason.trim()) {
      toast.error("Student and reason are required.");
      return;
    }
    toast.success(
      isEnroll
        ? `${student} force-enrolled in ${course.code}.`
        : `${student} force-dropped from ${course.code}.`,
    );
    setStudent("");
    setReason("");
    onClose();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isEnroll ? "Force Enroll" : "Force Drop"} — {course.code}
          </DialogTitle>
          <DialogDescription>
            {isEnroll
              ? "Bypass capacity and prerequisites to enrol a student."
              : "Remove a student from this course. This action is logged."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="fa-student">
              {isEnroll ? "Student Name or ID" : "Select Student"}
            </Label>
            <Input
              id="fa-student"
              placeholder={
                isEnroll
                  ? "Search by name or student ID…"
                  : "Student name or ID…"
              }
              value={student}
              onChange={(e) => setStudent(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fa-reason">Reason *</Label>
            <Textarea
              id="fa-reason"
              placeholder="Reason for this action…"
              className="resize-none"
              rows={3}
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
            variant={isEnroll ? "default" : "destructive"}
            onClick={handleConfirm}
            id={`confirm-${type}`}
          >
            {isEnroll ? "Confirm Enroll" : "Confirm Drop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Admin View ── */
export function AdminAllCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>(ALL_COURSES);
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("all");

  const [dialogType, setDialogType] = useState<ActionDialogType>(null);
  const [dialogCourse, setDialogCourse] = useState<AdminCourse | null>(null);

  const openDialog = (type: ActionDialogType, course: AdminCourse) => {
    setDialogType(type);
    setDialogCourse(course);
  };

  const faculties = Array.from(new Set(ALL_COURSES.map((c) => c.faculty)));

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(search.toLowerCase());
    const matchFaculty = faculty === "all" || c.faculty === faculty;
    return matchSearch && matchFaculty;
  });

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
              <BreadcrumbPage>All Courses</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin View · Fall 2024
            </p>
            <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
            <p className="text-sm text-muted-foreground">
              {courses.length} courses across {faculties.length} faculties
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="admin-course-search"
              placeholder="Search code, title, lecturer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFaculty("all")}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${faculty === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              All
            </button>
            {faculties.map((f) => (
              <button
                key={f}
                onClick={() => setFaculty(f)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${faculty === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Code</TableHead>
                <TableHead className="w-[22%]">Title</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-sm text-muted-foreground"
                  >
                    No courses match your search.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((c) => (
                <TableRow key={c.id} className="group">
                  <TableCell className="font-mono text-xs font-semibold">
                    {c.code}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {c.title}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.faculty}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.lecturer}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {c.enrolledCount} / {c.capacity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[c.status]}
                      className="text-xs"
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          id={`admin-course-menu-${c.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => openDialog("enroll", c)}
                        >
                          <UserPlus className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                          Force Enroll
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog("drop", c)}>
                          <UserMinus className="h-3.5 w-3.5 mr-2 text-destructive" />
                          Force Drop
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <ForceActionDialog
        type={dialogType}
        course={dialogCourse}
        onClose={() => {
          setDialogType(null);
          setDialogCourse(null);
        }}
      />
    </div>
  );
}
