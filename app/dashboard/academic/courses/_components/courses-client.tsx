"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
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
import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { CourseCard, type Course } from "./course-card";
import { CoursesTable } from "./courses-table";
import { CourseFormSheet } from "./course-form-sheet";
import { AssignLecturerModal } from "./assign-lecturer-modal";
import { createCourse, deleteCourse, updateCourse } from "../_lib/actions";

interface CoursesClientProps {
  initialData: {
    id: number;
    code: string;
    title: string;
    description: string | null;
    faculty: string | null;
    level: "UNDERGRADUATE" | "GRADUATE";
    credits: number;
    seatsTotal: number | null;
    seatsAvailable: number | null;
    status: "OPEN" | "LIMITED" | "FULL" | "CLOSED";
    prerequisites: string[] | null;
    lecturer: number | null;
    enrolledCount: number;
    hasPrerequisites: boolean;
  }[];
}

export function CoursesClient({ initialData }: CoursesClientProps) {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const canEdit = isAdmin || hasRole("lecturer");

  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const courses: Course[] = initialData.map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    description: c.description || "",
    faculty: c.faculty || "",
    level: c.level === "GRADUATE" ? "Graduate" : "Undergraduate",
    credits: c.credits,
    seats: {
      available: c.seatsAvailable ?? 0,
      total: c.seatsTotal ?? 0,
    },
    enrolledCount: c.enrolledCount,
    prerequisites: c.prerequisites || [],
    hasPrerequisites: c.hasPrerequisites,
    status:
      c.status === "OPEN"
        ? "Open"
        : c.status === "LIMITED"
          ? "Limited"
          : c.status === "FULL"
            ? "Full"
            : "Closed",
    lecturer: c.lecturer ? String(c.lecturer) : "TBA",
  }));

  const filtered = courses.filter((c) => {
    if (
      search &&
      !c.code.toLowerCase().includes(search.toLowerCase()) &&
      !c.title.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (levelFilter !== "all" && c.level !== levelFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const handleSave = async (course: Course) => {
    const courseData = {
      code: course.code,
      title: course.title,
      description: course.description,
      faculty: course.faculty,
      level: (course.level === "Graduate" ? "GRADUATE" : "UNDERGRADUATE") as
        | "UNDERGRADUATE"
        | "GRADUATE",
      credits: course.credits,
      seatsTotal: course.seats?.total,
    };

    if (editingCourse) {
      await updateCourse(editingCourse.id, courseData);
    } else {
      await createCourse(
        courseData as {
          code: string;
          title: string;
          level: "UNDERGRADUATE" | "GRADUATE";
        },
      );
    }
    setFormOpen(false);
    setEditingCourse(null);
  };

  const handleDelete = async (id: number) => {
    await deleteCourse(id);
  };

  const handleAssignLecturer = async (courseId: number, lecturer: string) => {
    // Optional: hook up actual update logic here if lecturer name-to-id mapping is implemented
    setAssignOpen(false);
    setEditingCourse(null);
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
              <BreadcrumbLink href="/dashboard/academic">
                Academic
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Courses</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
        {canEdit && (
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Course
          </Button>
        )}
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Academic Portal
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
            <p className="text-sm text-muted-foreground">
              Browse and manage available courses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Undergraduate">Undergraduate</SelectItem>
              <SelectItem value="Graduate">Graduate</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Limited">Limited</SelectItem>
              <SelectItem value="Full">Full</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex gap-1">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No courses found.
          </p>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isTeaching={hasRole("lecturer")}
                onEdit={() => handleEdit(course)}
                onDelete={() => handleDelete(course.id)}
                onArchive={() => {}}
                onAssignLecturer={() => {
                  setEditingCourse(course);
                  setAssignOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <CoursesTable
            courses={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onArchive={() => {}}
            onAssignLecturer={(course) => {
              setEditingCourse(course);
              setAssignOpen(true);
            }}
          />
        )}
      </main>

      <CourseFormSheet
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCourse(null);
        }}
        editingCourse={editingCourse}
        onSave={handleSave}
      />

      <AssignLecturerModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        course={editingCourse}
        onAssign={handleAssignLecturer}
      />
    </div>
  );
}
