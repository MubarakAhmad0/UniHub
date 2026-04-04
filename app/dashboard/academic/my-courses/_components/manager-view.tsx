"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowRight,
  FileText,
  Plus,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

/* ── Types ── */
type Material = {
  id: string;
  name: string;
  date: string;
  status: "published" | "draft";
};
type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  maxMarks: number;
  visible: boolean;
};
type Student = {
  id: string;
  name: string;
  studentId: string;
  attendance: number;
};

type TeachingCourse = {
  id: string;
  code: string;
  title: string;
  enrolledCount: number;
  assignmentCount: number;
  avgAttendance: number;
  materials: Material[];
  assignments: Assignment[];
  roster: Student[];
};

/* ── Mock data ── */
const TEACHING_COURSES: TeachingCourse[] = [
  {
    id: "c-mth",
    code: "MTH 301",
    title: "Advanced Calculus II",
    enrolledCount: 32,
    assignmentCount: 3,
    avgAttendance: 78,
    materials: [
      {
        id: "m1",
        name: "Week 1 Slides.pdf",
        date: "Mar 1",
        status: "published",
      },
      { id: "m2", name: "Week 9 Notes.pdf", date: "Mar 28", status: "draft" },
      {
        id: "m3",
        name: "Past Exam 2023.pdf",
        date: "Feb 10",
        status: "published",
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "Assignment 1",
        dueDate: "Feb 20",
        maxMarks: 20,
        visible: true,
      },
      {
        id: "a2",
        title: "Assignment 2",
        dueDate: "Mar 14",
        maxMarks: 20,
        visible: true,
      },
      {
        id: "a3",
        title: "Assignment 3",
        dueDate: "Apr 4",
        maxMarks: 20,
        visible: false,
      },
    ],
    roster: [
      { id: "s1", name: "Alex Rivers", studentId: "U21001", attendance: 85 },
      { id: "s2", name: "Jae Lee", studentId: "U21002", attendance: 92 },
      { id: "s3", name: "Sam Kaur", studentId: "U21003", attendance: 61 },
      { id: "s4", name: "Ming Tao", studentId: "U21004", attendance: 78 },
      { id: "s5", name: "Priya Sharma", studentId: "U21005", attendance: 100 },
    ],
  },
  {
    id: "c-cs",
    code: "CS 105",
    title: "Data Structures",
    enrolledCount: 45,
    assignmentCount: 4,
    avgAttendance: 82,
    materials: [
      {
        id: "m4",
        name: "Lecture 1 — Arrays.pdf",
        date: "Jan 15",
        status: "published",
      },
      {
        id: "m5",
        name: "Lab Sheet 4.pdf",
        date: "Mar 22",
        status: "published",
      },
    ],
    assignments: [
      {
        id: "a4",
        title: "Lab Task 1",
        dueDate: "Feb 7",
        maxMarks: 10,
        visible: true,
      },
      {
        id: "a5",
        title: "Lab Task 2",
        dueDate: "Mar 7",
        maxMarks: 10,
        visible: true,
      },
      {
        id: "a6",
        title: "Midterm",
        dueDate: "Mar 21",
        maxMarks: 40,
        visible: true,
      },
      {
        id: "a7",
        title: "Final Proj",
        dueDate: "Apr 18",
        maxMarks: 40,
        visible: false,
      },
    ],
    roster: [
      { id: "s6", name: "Jamie Brooks", studentId: "U21010", attendance: 88 },
      { id: "s7", name: "Chris Dang", studentId: "U21011", attendance: 72 },
      { id: "s8", name: "Sofia Melo", studentId: "U21012", attendance: 95 },
    ],
  },
];

/* ── Course Drawer ── */
function CourseDrawer({
  course,
  onClose,
}: {
  course: TeachingCourse;
  onClose: () => void;
}) {
  const [materials, setMaterials] = useState<Material[]>(course.materials);
  const [assignments, setAssignments] = useState<Assignment[]>(
    course.assignments,
  );

  // New assignment form state
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newMaxMarks, setNewMaxMarks] = useState("20");
  const [showNewForm, setShowNewForm] = useState(false);

  const togglePublish = (id: string) =>
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "published" ? "draft" : "published" }
          : m,
      ),
    );

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    toast.success("Material removed.");
  };

  const toggleVisible = (id: string) =>
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, visible: !a.visible } : a)),
    );

  const postAssignment = () => {
    if (!newTitle.trim() || !newDueDate.trim()) {
      toast.error("Title and due date are required.");
      return;
    }
    const a: Assignment = {
      id: `a-${Date.now()}`,
      title: newTitle.trim(),
      dueDate: newDueDate,
      maxMarks: parseInt(newMaxMarks) || 20,
      visible: false,
    };
    setAssignments((prev) => [...prev, a]);
    setNewTitle("");
    setNewDueDate("");
    setNewMaxMarks("20");
    setShowNewForm(false);
    toast.success("Assignment created (hidden from students).");
  };

  return (
    <Sheet open onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Badge className="text-[10px] bg-primary/15 text-primary border-0">
              Teaching
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {course.code}
            </span>
          </div>
          <SheetTitle className="text-xl">{course.title}</SheetTitle>
          <div className="flex gap-4 text-xs text-muted-foreground pt-1">
            <span>
              <Users className="h-3 w-3 inline mr-1" />
              {course.enrolledCount} students
            </span>
            <span>📋 {course.assignments.length} assignments</span>
            <span>📊 {course.avgAttendance}% avg attendance</span>
          </div>
        </SheetHeader>

        <Tabs defaultValue="materials">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="materials" className="flex-1 text-xs">
              Materials
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex-1 text-xs">
              Assignments
            </TabsTrigger>
            <TabsTrigger value="roster" className="flex-1 text-xs">
              Roster
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex-1 text-xs">
              Grades
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex-1 text-xs">
              Attendance
            </TabsTrigger>
          </TabsList>

          {/* ── Materials ── */}
          <TabsContent value="materials" className="space-y-3">
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info("File picker would open here.")}
                id={`upload-material-${course.id}`}
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload
              </Button>
            </div>
            {materials.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              >
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-semibold ${m.status === "published" ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {m.status === "published" ? "Published" : "Draft"}
                  </span>
                  <Switch
                    checked={m.status === "published"}
                    onCheckedChange={() => togglePublish(m.id)}
                    id={`publish-${m.id}`}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMaterial(m.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* ── Assignments ── */}
          <TabsContent value="assignments" className="space-y-3">
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNewForm((v) => !v)}
                id={`new-assignment-${course.id}`}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New Assignment
              </Button>
            </div>

            {showNewForm && (
              <div className="p-4 rounded-lg border bg-muted/20 space-y-3">
                <p className="text-sm font-semibold">New Assignment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="na-title">Title</Label>
                    <Input
                      id="na-title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Assignment title…"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="na-due">Due Date</Label>
                    <Input
                      id="na-due"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      placeholder="e.g. Apr 18"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="na-marks">Max Marks</Label>
                    <Input
                      id="na-marks"
                      type="number"
                      value={newMaxMarks}
                      onChange={(e) => setNewMaxMarks(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={postAssignment}>
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowNewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {assignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {a.dueDate} · {a.maxMarks} marks
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-semibold ${a.visible ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {a.visible ? "Visible" : "Hidden"}
                  </span>
                  <Switch
                    checked={a.visible}
                    onCheckedChange={() => toggleVisible(a.id)}
                    id={`vis-${a.id}`}
                  />
                </div>
              </div>
            ))}
          </TabsContent>

          {/* ── Roster ── */}
          <TabsContent value="roster">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead className="text-right">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.roster.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-sm">
                        {s.name}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {s.studentId}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`text-xs font-semibold ${s.attendance < 75 ? "text-destructive" : "text-emerald-600"}`}
                        >
                          {s.attendance}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Grades ── */}
          <TabsContent value="grades" className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Class Average",
                  value: "71%",
                  color: "text-foreground",
                },
                { label: "Highest", value: "96%", color: "text-emerald-600" },
                { label: "Lowest", value: "38%", color: "text-destructive" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border p-4 text-center"
                >
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/academic/marks">
                Go to Grade Entry <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </TabsContent>

          {/* ── Attendance ── */}
          <TabsContent value="attendance" className="space-y-4">
            <div className="rounded-lg border p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Class Attendance</span>
                <span className="font-bold">{course.avgAttendance}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${course.avgAttendance}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Threshold: 75% —{" "}
                {course.roster.filter((s) => s.attendance < 75).length}{" "}
                student(s) below threshold
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/academic/attendance">
                Go to Attendance <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

/* ── Manager View ── */
export function ManagerMyCourses() {
  const [activeCourse, setActiveCourse] = useState<TeachingCourse | null>(null);

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
              <BreadcrumbPage>My Teaching Courses</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fall 2024 · {TEACHING_COURSES.length} Courses
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            My Teaching Courses
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage materials, assignments, and student records for your courses.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {TEACHING_COURSES.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col shadow-sm border-0 bg-card"
            >
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                      {course.code}
                    </p>
                    <h2 className="text-base font-semibold">{course.title}</h2>
                  </div>
                  <Badge className="text-[10px] bg-primary/15 text-primary border-0 shrink-0">
                    Teaching
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.enrolledCount} students
                  </span>
                  <span>📋 {course.assignmentCount} assignments</span>
                  <span
                    className={
                      course.avgAttendance < 75
                        ? "text-destructive font-semibold"
                        : ""
                    }
                  >
                    📊 {course.avgAttendance}% attendance
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => setActiveCourse(course)}
                  id={`manage-${course.id}`}
                >
                  Manage Course <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {activeCourse && (
        <CourseDrawer
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
        />
      )}
    </div>
  );
}
