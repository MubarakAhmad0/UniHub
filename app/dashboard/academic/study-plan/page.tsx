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
import { useAuth } from "@/lib/auth/use-auth";
import { useState } from "react";
import { AdminStudyPlanAdditions } from "./_components/admin-additions";
import { ADVISEES, AdviseeSelector } from "./_components/advisee-selector";
import { AdvisorToolbar } from "./_components/advisor-toolbar";
import { DependencyGraph } from "./_components/dependency-graph";
import { EndorsementBanner } from "./_components/endorsement-banner";

/* ── Static plan data ── */
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

/* ── Shared plan renderer ── */
function StudyPlanContent({ readOnly = false }: { readOnly?: boolean }) {
  const [semester, setSemester] = useState("all");
  const displaySemesters =
    semester === "all"
      ? roadmapSemesters
      : roadmapSemesters.filter((s) => s.semester.includes(semester));

  return (
    <>
      <div className="flex justify-end">
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

      {readOnly && (
        <div className="rounded-md bg-muted/50 border px-4 py-2 text-xs text-muted-foreground">
          👁 You are viewing this plan in read-only mode as an advisor.
        </div>
      )}

      <Tabs defaultValue="roadmap">
        <TabsList className="bg-muted">
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="graph">Dependency Graph</TabsTrigger>
        </TabsList>

        {/* Roadmap */}
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

        {/* Dependency Graph */}
        <TabsContent value="graph" className="mt-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Course Dependencies
              </p>
              <p className="text-sm text-muted-foreground">
                Visual map of prerequisite relationships between courses.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
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
            <DependencyGraph />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

/* ── Page ── */
export default function StudyPlanPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  // Manager: advisee state
  const [selectedAdviseeId, setSelectedAdviseeId] = useState("");
  const [endorsedIds, setEndorsedIds] = useState<Set<string>>(
    new Set(ADVISEES.filter((a) => a.isEndorsed).map((a) => a.id)),
  );

  const selectedAdvisee =
    ADVISEES.find((a) => a.id === selectedAdviseeId) ?? null;
  const selectedIsEndorsed = selectedAdviseeId
    ? endorsedIds.has(selectedAdviseeId)
    : false;

  const toggleEndorse = () => {
    setEndorsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(selectedAdviseeId)) {
        next.delete(selectedAdviseeId);
      } else {
        next.add(selectedAdviseeId);
      }
      return next;
    });
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
              <BreadcrumbPage>
                {isManager ? "Advisee Study Plans" : "Study Plan"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {isAdmin
              ? "Admin View"
              : isManager
                ? "Advisor Mode"
                : "Degree Programme"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            {isManager ? "Advisee Study Plans" : "Study Plan"}
          </h1>
          {!isManager && !isAdmin && (
            <p className="text-sm text-muted-foreground">
              Your academic roadmap from enrolment to graduation.
            </p>
          )}
        </div>

        {/* ── Student: endorsement banner ── */}
        {!isManager && !isAdmin && (
          <EndorsementBanner isEndorsed advisorName="Prof. Elena Rossi" />
        )}

        {/* ── Manager: advisee selector ── */}
        {isManager && (
          <AdviseeSelector
            value={selectedAdviseeId}
            onValueChange={setSelectedAdviseeId}
          />
        )}

        {/* ── Admin: extra tabs below the plan ── */}
        {isAdmin && (
          <div className="rounded-md bg-primary/5 border border-primary/20 px-4 py-2 text-xs text-primary">
            Admin mode — use the search below to view any student&apos;s plan,
            or manage substitutions and programs.
          </div>
        )}

        {/* ── Main plan view ── */}
        {isManager && !selectedAdviseeId ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <p className="text-2xl">👤</p>
            <p className="text-sm">
              Select a student above to view their study plan.
            </p>
          </div>
        ) : (
          <StudyPlanContent readOnly={isManager} />
        )}

        {/* ── Admin additions (substitution queue + programs) ── */}
        {isAdmin && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Admin Tools
              </p>
              <h2 className="text-lg font-semibold">
                Substitution Requests & Programs
              </h2>
            </div>
            <AdminStudyPlanAdditions />
          </>
        )}
      </main>

      {/* ── Manager: sticky advisor toolbar ── */}
      {isManager && selectedAdvisee && (
        <AdvisorToolbar
          adviseeName={selectedAdvisee.name}
          isEndorsed={selectedIsEndorsed}
          onEndorse={toggleEndorse}
        />
      )}
    </div>
  );
}
