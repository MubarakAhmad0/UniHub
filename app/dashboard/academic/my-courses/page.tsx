"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { BookOpen, Calendar } from "lucide-react";

const enrolledCourses = [
  {
    id: 1,
    code: "ARC 402",
    title: "Urban Design Theory",
    professor: "Prof. Julian Vane",
    credits: 4,
    weeksDone: 10,
    weeksTotal: 15,
    status: "In Progress",
    nextClass: "Mon, Apr 7 · 10:00 AM",
    room: "Studio C, Block 3",
  },
  {
    id: 2,
    code: "MTH 301",
    title: "Advanced Calculus II",
    professor: "Prof. Elena Rossi",
    credits: 3,
    weeksDone: 10,
    weeksTotal: 15,
    status: "In Progress",
    nextClass: "Tue, Apr 8 · 2:00 PM",
    room: "Hall 9A",
  },
  {
    id: 3,
    code: "HIS 215",
    title: "Renaissance Art History",
    professor: "Prof. Mark Sterling",
    credits: 3,
    weeksDone: 10,
    weeksTotal: 15,
    status: "In Progress",
    nextClass: "Wed, Apr 9 · 11:00 AM",
    room: "Lecture Theatre 2",
  },
  {
    id: 4,
    code: "CS 105",
    title: "Data Structures",
    professor: "Prof. Sarah Chen",
    credits: 4,
    weeksDone: 10,
    weeksTotal: 15,
    status: "At Risk",
    nextClass: "Thu, Apr 10 · 9:00 AM",
    room: "Lab 4, Computing Block",
  },
];

const statusStyles: Record<
  string,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  }
> = {
  "In Progress": { variant: "default", label: "In Progress" },
  Completed: { variant: "secondary", label: "Completed" },
  "At Risk": { variant: "destructive", label: "At Risk" },
};

export default function MyCoursesPage() {
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
              <BreadcrumbPage>My Courses</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fall 2024 · 4 Enrolled
          </p>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-sm text-muted-foreground">
            Your active enrolments for the current semester.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {enrolledCourses.map((course) => {
            const progress = Math.round(
              (course.weeksDone / course.weeksTotal) * 100,
            );
            const style = statusStyles[course.status];
            return (
              <Card
                key={course.id}
                className="flex flex-col shadow-sm border-0 bg-card"
              >
                <CardHeader className="pb-3 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {course.code} · {course.credits} Credits
                      </p>
                      <h2 className="text-base font-semibold">
                        {course.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {course.professor}
                      </p>
                    </div>
                    <Badge variant={style.variant}>{style.label}</Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Week {course.weeksDone} of {course.weeksTotal}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{course.nextClass}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-5">
                    {course.room}
                  </p>
                </CardContent>

                <CardFooter className="pt-3 border-t flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1"
                    id={`materials-${course.id}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    Materials
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    id={`schedule-${course.id}`}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Schedule
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
