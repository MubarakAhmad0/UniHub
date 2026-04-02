"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useState } from "react";

const roadmapSemesters = [
  {
    semester: "Year 1 · Semester 1",
    courses: [
      {
        code: "CS 101",
        title: "Intro to Computing",
        credits: 3,
        status: "Completed",
      },
      { code: "MTH 101", title: "Calculus I", credits: 3, status: "Completed" },
      {
        code: "ENG 101",
        title: "Academic Writing",
        credits: 2,
        status: "Completed",
      },
      { code: "PHY 101", title: "Physics I", credits: 3, status: "Completed" },
    ],
  },
  {
    semester: "Year 1 · Semester 2",
    courses: [
      {
        code: "CS 102",
        title: "Data Structures",
        credits: 3,
        status: "Completed",
      },
      {
        code: "MTH 102",
        title: "Calculus II",
        credits: 3,
        status: "Completed",
      },
      {
        code: "CS 150",
        title: "Discrete Mathematics",
        credits: 3,
        status: "Completed",
      },
    ],
  },
  {
    semester: "Year 2 · Semester 1",
    courses: [
      { code: "CS 201", title: "Algorithms", credits: 3, status: "Completed" },
      {
        code: "CS 210",
        title: "Computer Organisation",
        credits: 3,
        status: "Completed",
      },
      {
        code: "MTH 201",
        title: "Linear Algebra",
        credits: 3,
        status: "Completed",
      },
    ],
  },
  {
    semester: "Year 2 · Semester 2 (Current)",
    courses: [
      {
        code: "ARC 402",
        title: "Urban Design Theory",
        credits: 4,
        status: "In Progress",
      },
      {
        code: "MTH 301",
        title: "Advanced Calculus II",
        credits: 3,
        status: "In Progress",
      },
      {
        code: "HIS 215",
        title: "Renaissance Art History",
        credits: 3,
        status: "In Progress",
      },
      {
        code: "CS 105",
        title: "Data Structures (Advanced)",
        credits: 4,
        status: "At Risk",
      },
    ],
  },
  {
    semester: "Year 3 · Semester 1 (Upcoming)",
    courses: [
      {
        code: "CS 401",
        title: "Machine Learning",
        credits: 4,
        status: "Planned",
      },
      {
        code: "CS 410",
        title: "Database Systems",
        credits: 3,
        status: "Planned",
      },
      { code: "AI 210", title: "Ethics in AI", credits: 2, status: "Planned" },
    ],
  },
];

// Simplified dependency graph nodes
const graphNodes = [
  { id: "CS101", label: "CS 101", x: 60, y: 40, status: "Completed" },
  { id: "MTH101", label: "MTH 101", x: 280, y: 40, status: "Completed" },
  { id: "CS102", label: "CS 102", x: 60, y: 140, status: "Completed" },
  { id: "MTH102", label: "MTH 102", x: 280, y: 140, status: "Completed" },
  { id: "CS201", label: "CS 201", x: 60, y: 250, status: "Completed" },
  { id: "MTH201", label: "MTH 201", x: 280, y: 250, status: "Completed" },
  { id: "CS105", label: "CS 105", x: 60, y: 360, status: "At Risk" },
  { id: "MTH301", label: "MTH 301", x: 280, y: 360, status: "In Progress" },
  { id: "CS401", label: "CS 401", x: 170, y: 470, status: "Planned" },
];

const graphEdges = [
  { from: "CS101", to: "CS102" },
  { from: "MTH101", to: "MTH102" },
  { from: "CS102", to: "CS201" },
  { from: "MTH102", to: "MTH201" },
  { from: "CS201", to: "CS105" },
  { from: "MTH201", to: "MTH301" },
  { from: "CS105", to: "CS401" },
  { from: "MTH301", to: "CS401" },
];

const statusBadgeVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Completed: "secondary",
  "In Progress": "default",
  "At Risk": "destructive",
  Planned: "outline",
};

const statusColor: Record<string, string> = {
  Completed: "hsl(228 13% 40%)",
  "In Progress": "hsl(228 78% 65%)",
  "At Risk": "hsl(2 43% 43%)",
  Planned: "hsl(197 9% 70%)",
};

export default function StudyPlanPage() {
  const [semester, setSemester] = useState("all");

  const displaySemesters =
    semester === "all"
      ? roadmapSemesters
      : roadmapSemesters.filter((s) => s.semester.includes(semester));

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
              <BreadcrumbPage>Study Plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Degree Programme
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Study Plan</h1>
            <p className="text-sm text-muted-foreground">
              Your academic roadmap from enrolment to graduation.
            </p>
          </div>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger
              id="semester-select"
              className="w-[200px] bg-input border-0"
            >
              <SelectValue placeholder="Filter semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              <SelectItem value="Year 1">Year 1</SelectItem>
              <SelectItem value="Year 2">Year 2</SelectItem>
              <SelectItem value="Year 3">Year 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="roadmap">
          <TabsList className="bg-muted">
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="graph">Dependency Graph</TabsTrigger>
          </TabsList>

          {/* ── Roadmap Tab ──────────────────────────────────────────── */}
          <TabsContent value="roadmap" className="mt-6 space-y-6">
            {displaySemesters.map((sem) => (
              <div key={sem.semester} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {sem.semester}
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sem.courses.map((course) => (
                    <Card
                      key={course.code}
                      className="shadow-sm border-0 bg-card"
                    >
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {course.code}
                            </p>
                            <p className="text-sm font-medium leading-snug mt-0.5">
                              {course.title}
                            </p>
                          </div>
                          <Badge
                            variant={
                              statusBadgeVariant[course.status] ?? "outline"
                            }
                            className="shrink-0 text-xs"
                          >
                            {course.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0">
                        <p className="text-xs text-muted-foreground">
                          {course.credits} credits
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* ── Graph Tab ────────────────────────────────────────────── */}
          <TabsContent value="graph" className="mt-6">
            <Card className="shadow-sm border-0 bg-card overflow-hidden">
              <CardHeader className="pb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Course Dependencies
                </p>
                <p className="text-sm text-muted-foreground">
                  Visual map of prerequisite relationships between your courses.
                </p>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {Object.entries(statusColor).map(([label, color]) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                      {label}
                    </div>
                  ))}
                </div>

                {/* SVG Graph */}
                <div className="overflow-x-auto">
                  <svg
                    viewBox="0 0 480 560"
                    className="w-full max-w-lg mx-auto"
                    aria-label="Course dependency graph"
                  >
                    {/* Edges */}
                    {graphEdges.map((edge) => {
                      const from = graphNodes.find((n) => n.id === edge.from)!;
                      const to = graphNodes.find((n) => n.id === edge.to)!;
                      return (
                        <line
                          key={`${edge.from}-${edge.to}`}
                          x1={from.x + 55}
                          y1={from.y + 18}
                          x2={to.x + 55}
                          y2={to.y + 2}
                          stroke="hsl(197 16% 73%)"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                      );
                    })}

                    {/* Nodes */}
                    {graphNodes.map((node) => (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                      >
                        <rect
                          width="110"
                          height="36"
                          rx="4"
                          fill={statusColor[node.status]}
                          opacity="0.15"
                          stroke={statusColor[node.status]}
                          strokeWidth="1.5"
                        />
                        <rect
                          width="4"
                          height="36"
                          rx="2"
                          fill={statusColor[node.status]}
                        />
                        <text
                          x="14"
                          y="14"
                          fontSize="10"
                          fontWeight="600"
                          fill="hsl(203 13% 20%)"
                          fontFamily="Inter, system-ui, sans-serif"
                        >
                          {node.label}
                        </text>
                        <text
                          x="14"
                          y="27"
                          fontSize="9"
                          fill="hsl(197 9% 36%)"
                          fontFamily="Inter, system-ui, sans-serif"
                        >
                          {node.status}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
