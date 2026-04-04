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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth/use-auth";
import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { useState } from "react";
import { AssignLecturerModal } from "./_components/assign-lecturer-modal";
import { CourseCard, type Course } from "./_components/course-card";
import { CourseFormSheet } from "./_components/course-form-sheet";
import { CoursesTable } from "./_components/courses-table";

/* ── Mock data ──────────────────────────────────────────────────────────────── */

const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    code: "CS 601",
    title: "Advanced Neural Architectures",
    description:
      "An in-depth study of modern deep learning architectures including transformers, diffusion models, and neural ODEs applied to real-world problem settings.",
    faculty: "Computer Science",
    level: "Graduate",
    credits: 4,
    seats: { available: 12, total: 30 },
    enrolledCount: 18,
    prerequisites: ["CS 401", "MTH 305"],
    hasPrerequisites: true,
    status: "Open",
    lecturer: "Prof. Elena Rossi",
  },
  {
    id: 2,
    code: "BIO 320",
    title: "Cellular Mechanics & Flow",
    description:
      "Examination of cytoskeletal dynamics, membrane topology, and inter-cellular signaling pathways using modern biophysical measurement techniques.",
    faculty: "Life Sciences",
    level: "Undergraduate",
    credits: 3,
    seats: { available: 5, total: 25 },
    enrolledCount: 20,
    prerequisites: ["BIO 201", "CHM 102"],
    hasPrerequisites: true,
    status: "Limited",
    lecturer: "Prof. James Vane",
  },
  {
    id: 3,
    code: "LIT 440",
    title: "Quantum Literary Theory",
    description:
      "Application of observer-effect and superposition metaphors to postmodern textual analysis. Cross-disciplinary exploration of physics-adjacent interpretive frameworks.",
    faculty: "Humanities",
    level: "Graduate",
    credits: 3,
    seats: { available: 18, total: 20 },
    enrolledCount: 2,
    prerequisites: ["LIT 301", "PHY 150"],
    hasPrerequisites: false,
    status: "Open",
    lecturer: "Prof. Aisha Rahman",
  },
  {
    id: 4,
    code: "AI 210",
    title: "Ethics in Artificial Intelligence",
    description:
      "Exploration of moral frameworks applied to algorithmic decision making, autonomous systems, and the future of human-machine agency.",
    faculty: "Computer Science",
    level: "Undergraduate",
    credits: 2,
    seats: { available: 0, total: 40 },
    enrolledCount: 40,
    prerequisites: [],
    hasPrerequisites: true,
    status: "Full",
    lecturer: "Dr. Kim Seok-jin",
  },
  {
    id: 5,
    code: "DES 315",
    title: "Visual Systems & Brand",
    description:
      "Systematic approach to identity design: semiotics, colour theory in applied contexts, and the construction of coherent visual languages across digital and physical media.",
    faculty: "Design",
    level: "Undergraduate",
    credits: 3,
    seats: { available: 7, total: 15 },
    enrolledCount: 8,
    prerequisites: ["DES 101"],
    hasPrerequisites: true,
    status: "Limited",
    lecturer: "Dr. Priya Nair",
  },
];

// Course codes the current manager is teaching (in reality from user profile)
const MANAGER_TEACHING_CODES = ["CS 601", "AI 210"];

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function CourseCatalogPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  // Filters
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [level, setLevel] = useState("all");

  // Admin view
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [assignTarget, setAssignTarget] = useState<Course | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchFaculty = faculty === "all" || c.faculty === faculty;
    const matchLevel = level === "all" || c.level === level;
    return matchSearch && matchFaculty && matchLevel;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (course: Course) => {
    setCourses((prev) => {
      const idx = prev.findIndex((c) => c.id === course.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = course;
        return next;
      }
      return [...prev, course];
    });
  };

  const handleDelete = (id: number) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));

  const handleArchive = (id: number) =>
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Closed" as const } : c)),
    );

  const handleAssign = (courseId: number, lecturer: string) =>
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, lecturer } : c)),
    );

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const openAssign = (course: Course) => {
    setAssignTarget(course);
    setAssignOpen(true);
  };

  return (
    <div className="flex flex-col min-h-svh">
      {/* ── Header ── */}
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
              <BreadcrumbPage>Course Catalog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          {/* Admin view toggle */}
          {isAdmin && (
            <div className="flex border rounded-md overflow-hidden">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                className="rounded-none h-8 px-2.5"
                onClick={() => setViewMode("grid")}
                id="view-grid-btn"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "table" ? "default" : "ghost"}
                className="rounded-none h-8 px-2.5"
                onClick={() => setViewMode("table")}
                id="view-table-btn"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Admin add course */}
          {isAdmin && (
            <Button
              size="sm"
              onClick={() => {
                setEditingCourse(null);
                setFormOpen(true);
              }}
              id="add-course-btn"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Course
            </Button>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 p-6 lg:p-8 space-y-8">
        {/* Page title */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fall 2024
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Curated selection of academic modules for the upcoming semester. Use
            filters to refine by faculty, level, and prerequisites.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="course-search"
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-input border-0"
            />
          </div>

          <Select value={faculty} onValueChange={setFaculty}>
            <SelectTrigger
              id="faculty-filter"
              className="w-[160px] bg-input border-0"
            >
              <SelectValue placeholder="Faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Faculties</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Life Sciences">Life Sciences</SelectItem>
              <SelectItem value="Humanities">Humanities</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
            </SelectContent>
          </Select>

          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger
              id="level-filter"
              className="w-[160px] bg-input border-0"
            >
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Undergraduate">Undergraduate</SelectItem>
              <SelectItem value="Graduate">Graduate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── Grid or Table ── */}
        {isAdmin && viewMode === "table" ? (
          <CoursesTable
            courses={filtered}
            onEdit={openEdit}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onAssignLecturer={openAssign}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isTeaching={
                  isManager && MANAGER_TEACHING_CODES.includes(course.code)
                }
                canAdmin={isAdmin}
                onEdit={() => openEdit(course)}
                onDelete={() => handleDelete(course.id)}
                onArchive={() => handleArchive(course.id)}
                onAssignLecturer={() => openAssign(course)}
              />
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Showing {filtered.length} of {courses.length} course modules
        </p>
      </main>

      {/* ── Admin: Course form sheet ── */}
      {isAdmin && (
        <CourseFormSheet
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingCourse(null);
          }}
          editingCourse={editingCourse}
          onSave={handleSave}
        />
      )}

      {/* ── Admin: Assign lecturer modal ── */}
      {isAdmin && (
        <AssignLecturerModal
          course={assignTarget}
          open={assignOpen}
          onClose={() => {
            setAssignOpen(false);
            setAssignTarget(null);
          }}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
}
