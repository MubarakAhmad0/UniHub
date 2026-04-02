"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search, Users } from "lucide-react";
import { useState } from "react";

const courses = [
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
    prerequisites: ["CS 401", "MTH 305"],
    hasPrerequisites: true,
    status: "Open",
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
    prerequisites: ["BIO 201", "CHM 102"],
    hasPrerequisites: true,
    status: "Limited",
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
    prerequisites: ["LIT 301", "PHY 150"],
    hasPrerequisites: false,
    status: "Open",
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
    prerequisites: [],
    hasPrerequisites: true,
    status: "Full",
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
    prerequisites: ["DES 101"],
    hasPrerequisites: true,
    status: "Limited",
  },
];

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Open: "default",
  Limited: "secondary",
  Full: "destructive",
};

export default function CourseCatalogPage() {
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [level, setLevel] = useState("all");

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchFaculty = faculty === "all" || c.faculty === faculty;
    const matchLevel = level === "all" || c.level === level;
    return matchSearch && matchFaculty && matchLevel;
  });

  return (
    <div className="flex flex-col min-h-svh">
      {/* ── Header ─────────────────────────────────────────────────────── */}
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
      </header>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <main className="flex-1 p-6 lg:p-8 space-y-8">
        {/* Page title */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fall 2024
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Curated selection of academic modules for the upcoming semester. Use
            filters to refine your search by faculty, intensity, and
            prerequisites.
          </p>
        </div>

        {/* ── Filters ──────────────────────────────────────────────────── */}
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

        {/* ── Course Grid ──────────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col bg-card shadow-sm border-0"
            >
              <CardHeader className="pb-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {course.code} · {course.credits} Credits
                    </p>
                    <h2 className="text-base font-semibold leading-snug">
                      {course.title}
                    </h2>
                  </div>
                  <Badge variant={statusVariant[course.status] ?? "outline"}>
                    {course.status}
                  </Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{course.faculty}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                {course.prerequisites.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Prerequisites
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {course.prerequisites.map((p) => (
                        <Badge
                          key={p}
                          variant={
                            course.hasPrerequisites
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {p}
                        </Badge>
                      ))}
                    </div>
                    {!course.hasPrerequisites && (
                      <p className="text-xs text-destructive mt-1">
                        Missing prerequisites
                      </p>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    {course.seats.available} / {course.seats.total} seats
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={course.status === "Full" ? "secondary" : "default"}
                  disabled={
                    course.status === "Full" || !course.hasPrerequisites
                  }
                  id={`enroll-${course.id}`}
                >
                  {course.status === "Full" ? "Join Waitlist" : "Enroll"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* ── Footer count ─────────────────────────────────────────────── */}
        <p className="text-sm text-muted-foreground text-center">
          Showing {filtered.length} of 142 course modules
        </p>
      </main>
    </div>
  );
}
