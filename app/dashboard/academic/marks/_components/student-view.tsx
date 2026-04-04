"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const gpaData = {
  current: 3.82,
  cumulative: 3.76,
  target: 3.7,
  graduationRequirement: 3.5,
  coreCompletion: 85,
};

type AssignmentStatus = "Graded" | "Pending" | "Upcoming";

const courses = [
  {
    id: "arc-402",
    code: "ARC 402",
    title: "Urban Design Theory",
    professor: "Professor Julian Vane",
    credits: 4,
    weightedGrade: 94.5,
    status: "normal" as const,
    components: [
      {
        category: "Assignments (30%)",
        items: [
          {
            name: "Case Study 1",
            score: 18,
            total: 20,
            status: "Graded" as AssignmentStatus,
          },
          {
            name: "Site Analysis",
            score: 25,
            total: 25,
            status: "Graded" as AssignmentStatus,
          },
          {
            name: "Precedent Study",
            score: 22,
            total: 25,
            status: "Graded" as AssignmentStatus,
          },
        ],
      },
      {
        category: "Midterm (30%)",
        items: [
          {
            name: "Midterm Examination",
            score: 88,
            total: 100,
            status: "Graded" as AssignmentStatus,
          },
        ],
      },
      {
        category: "Final Project (40%)",
        items: [
          {
            name: "Final Project",
            score: null,
            total: 100,
            status: "Upcoming" as AssignmentStatus,
          },
        ],
      },
    ],
  },
  {
    id: "mth-301",
    code: "MTH 301",
    title: "Advanced Calculus II",
    professor: "Professor Elena Rossi",
    credits: 3,
    weightedGrade: 88.2,
    status: "normal" as const,
    components: [
      {
        category: "Problem Sets (40%)",
        items: [
          {
            name: "Problem Set 1",
            score: 92,
            total: 100,
            status: "Graded" as AssignmentStatus,
          },
          {
            name: "Problem Set 2",
            score: 85,
            total: 100,
            status: "Graded" as AssignmentStatus,
          },
          {
            name: "Problem Set 3",
            score: 88,
            total: 100,
            status: "Graded" as AssignmentStatus,
          },
        ],
      },
      {
        category: "Midterm (30%)",
        items: [
          {
            name: "Midterm Test",
            score: 84,
            total: 100,
            status: "Graded" as AssignmentStatus,
          },
        ],
      },
      {
        category: "Final Exam (30%)",
        items: [
          {
            name: "Final Examination",
            score: null,
            total: 100,
            status: "Upcoming" as AssignmentStatus,
          },
        ],
      },
    ],
  },
  {
    id: "cs-105",
    code: "CS 105",
    title: "Data Structures",
    professor: "Professor Sarah Chen",
    credits: 4,
    weightedGrade: 68.4,
    status: "risk" as const,
    components: [
      {
        category: "Assignments (40%)",
        items: [
          {
            name: "Assignment 1: Arrays & Linked Lists",
            score: 72,
            total: 100,
            status: "Graded" as AssignmentStatus,
          },
          {
            name: "Assignment 2: Trees & Graphs",
            score: 65,
            total: 100,
            status: "Graded" as AssignmentStatus,
          },
          {
            name: "Assignment 3: Sorting Algorithms",
            score: null,
            total: 100,
            status: "Pending" as AssignmentStatus,
          },
        ],
      },
      {
        category: "Midterm (30%)",
        items: [
          {
            name: "Midterm Examination",
            score: 68,
            total: 100,
            status: "Graded" as AssignmentStatus,
          },
        ],
      },
      {
        category: "Final Exam (30%)",
        items: [
          {
            name: "Final Examination",
            score: null,
            total: 100,
            status: "Upcoming" as AssignmentStatus,
          },
        ],
      },
    ],
  },
];

function gradeToLetterGrade(pct: number) {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

function pctToGpa(pct: number) {
  if (pct >= 90) return 4.0;
  if (pct >= 85) return 3.7;
  if (pct >= 80) return 3.3;
  if (pct >= 75) return 3.0;
  if (pct >= 70) return 2.7;
  if (pct >= 65) return 2.3;
  if (pct >= 60) return 2.0;
  return 1.0;
}

const STATUS_VARIANT: Record<
  AssignmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Graded: "secondary",
  Pending: "outline",
  Upcoming: "outline",
};

export function StudentMarksView() {
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
              <BreadcrumbPage>Marks & GPA</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fall 2024 · Academic Performance
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Marks & GPA</h1>
        </div>

        {/* GPA Summary Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-sm border-0 bg-card">
            <CardHeader className="pb-1 pt-5 px-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Current Semester GPA
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-4xl font-bold tracking-tight">
                {gpaData.current}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Target: {gpaData.target} · +
                {(gpaData.current - gpaData.target).toFixed(2)} above target
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-card">
            <CardHeader className="pb-1 pt-5 px-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Cumulative GPA
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-4xl font-bold tracking-tight">
                {gpaData.cumulative}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All semesters combined
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-accent text-accent-foreground">
            <CardHeader className="pb-1 pt-5 px-5">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
                Core Requirements
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              <p className="text-4xl font-bold tracking-tight">
                {gpaData.coreCompletion}%
              </p>
              <Progress value={gpaData.coreCompletion} className="h-1.5" />
              <p className="text-xs opacity-70">
                Maintain GPA ≥ {gpaData.graduationRequirement} for Honors
                Scholar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            defaultValue="arc-402"
          >
            {courses.map((course) => (
              <Card
                key={course.id}
                className="shadow-sm border-0 bg-card overflow-hidden"
              >
                <AccordionItem value={course.id} className="border-0">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {course.code}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {course.professor} · {course.credits} Credits
                          </p>
                        </div>
                        <p className="text-sm font-semibold">{course.title}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p
                            className={`text-xl font-bold ${course.status === "risk" ? "text-destructive" : "text-foreground"}`}
                          >
                            {course.weightedGrade.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {gradeToLetterGrade(course.weightedGrade)} ·{" "}
                            {pctToGpa(course.weightedGrade).toFixed(1)} pts
                          </p>
                        </div>
                        {course.status === "risk" && (
                          <Badge variant="destructive" className="text-xs">
                            Grade Alert
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-0">
                    <div className="space-y-5 pt-2">
                      {course.components.map((comp) => (
                        <div key={comp.category}>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            {comp.category}
                          </p>
                          <Table>
                            <TableHeader>
                              <TableRow className="border-0 hover:bg-transparent">
                                <TableHead className="pl-0 text-xs">
                                  Assessment
                                </TableHead>
                                <TableHead className="text-xs text-right">
                                  Score
                                </TableHead>
                                <TableHead className="text-xs text-right">
                                  Total
                                </TableHead>
                                <TableHead className="text-xs text-right pr-0">
                                  Status
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {comp.items.map((item) => (
                                <TableRow
                                  key={item.name}
                                  className="border-0 hover:bg-muted/40"
                                >
                                  <TableCell className="pl-0 py-2 text-sm">
                                    {item.name}
                                  </TableCell>
                                  <TableCell className="py-2 text-sm text-right font-medium">
                                    {item.score !== null ? item.score : "—"}
                                  </TableCell>
                                  <TableCell className="py-2 text-sm text-right text-muted-foreground">
                                    {item.total}
                                  </TableCell>
                                  <TableCell className="py-2 text-right pr-0">
                                    <Badge
                                      variant={STATUS_VARIANT[item.status]}
                                      className="text-xs"
                                    >
                                      {item.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="shadow-sm border-0 bg-card">
              <CardHeader className="pb-2 pt-5 px-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Academic Prediction
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <p className="text-2xl font-bold">3.82</p>
                <p className="text-sm text-muted-foreground">
                  Projected final GPA based on current trajectory. Exceeding
                  target by{" "}
                  <span className="font-medium text-foreground">
                    0.12 points
                  </span>
                  .
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 bg-card">
              <CardHeader className="pb-2 pt-5 px-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Graduation Eligibility
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Core Requirements
                    </span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-1.5" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Maintain GPA above{" "}
                  <span className="font-medium text-foreground">3.5</span> for{" "}
                  <span className="font-medium text-foreground">
                    Honors Scholar
                  </span>{" "}
                  distinction.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 bg-destructive/10">
              <CardHeader className="pb-2 pt-5 px-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
                  Action Required
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">CS 105</span> is
                  at risk. A score of{" "}
                  <span className="font-medium text-foreground">82+</span> in
                  the final exam is required to pass.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
