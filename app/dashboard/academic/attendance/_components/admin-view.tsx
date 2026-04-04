"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Mock at-risk data ── */
const AT_RISK = [
  {
    id: "r1",
    student: "Jae Lee",
    studentId: "U21002",
    course: "CS 105",
    pct: 72,
    lastSession: "Mar 24",
    missed: 3,
  },
  {
    id: "r2",
    student: "Ming Tao",
    studentId: "U21004",
    course: "CS 105",
    pct: 60,
    lastSession: "Mar 24",
    missed: 5,
  },
  {
    id: "r3",
    student: "Chris Dang",
    studentId: "U21011",
    course: "MTH 301",
    pct: 72,
    lastSession: "Mar 19",
    missed: 2,
  },
  {
    id: "r4",
    student: "Sam Kaur",
    studentId: "U21003",
    course: "HIS 215",
    pct: 78,
    lastSession: "Mar 17",
    missed: 1,
  },
];

const COURSES = [
  "All Courses",
  "CS 105 · Data Structures",
  "MTH 301 · Advanced Calculus II",
  "HIS 215 · Renaissance Art History",
];

export function AdminAttendanceView() {
  const [threshold, setThreshold] = useState(80);
  const [pendingThreshold, setPendingThreshold] = useState("80");

  // Bulk excuse state
  const [excuseFrom, setExcuseFrom] = useState("");
  const [excuseTo, setExcuseTo] = useState("");
  const [excuseCourse, setExcuseCourse] = useState("All Courses");
  const [excuseReason, setExcuseReason] = useState("");
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  const savePolicy = () => {
    const val = parseInt(pendingThreshold);
    if (isNaN(val) || val < 0 || val > 100) {
      toast.error("Enter a value between 0 and 100.");
      return;
    }
    setThreshold(val);
    toast.success(`Attendance warning threshold set to ${val}%.`);
  };

  const previewExcuse = () => {
    // Mock preview — in reality would query the DB
    setPreviewCount(excuseCourse === "All Courses" ? 12 : 4);
  };

  const applyExcuse = () => {
    if (!excuseFrom || !excuseTo || !excuseReason.trim()) {
      toast.error("Fill in all fields before applying.");
      return;
    }
    toast.success(`Excuse applied to ${previewCount ?? "selected"} sessions.`);
    setExcuseFrom("");
    setExcuseTo("");
    setExcuseReason("");
    setPreviewCount(null);
  };

  const atRiskFiltered = AT_RISK.filter((r) => r.pct < threshold);

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
              <BreadcrumbPage>Attendance Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin · Fall 2024
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Attendance Overview
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span>
              <strong className="text-destructive">
                {atRiskFiltered.length}
              </strong>{" "}
              students below {threshold}% threshold
            </span>
          </div>
        </div>

        <Tabs defaultValue="at-risk">
          <TabsList>
            <TabsTrigger value="at-risk">At Risk</TabsTrigger>
            <TabsTrigger value="policy">Policy</TabsTrigger>
            <TabsTrigger value="bulk-excuse">Bulk Excuse</TabsTrigger>
          </TabsList>

          {/* ── At Risk ── */}
          <TabsContent value="at-risk" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Student</TableHead>
                    <TableHead className="text-xs font-mono">ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-center">Attendance</TableHead>
                    <TableHead>Last Session</TableHead>
                    <TableHead className="text-center">
                      Sessions Missed
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atRiskFiltered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-sm text-muted-foreground"
                      >
                        No students below the {threshold}% threshold — great
                        attendance across the board.
                      </TableCell>
                    </TableRow>
                  )}
                  {atRiskFiltered.map((r) => (
                    <TableRow key={r.id} className="bg-destructive/5">
                      <TableCell className="font-medium text-sm flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                        {r.student}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {r.studentId}
                      </TableCell>
                      <TableCell className="text-xs">{r.course}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive" className="text-xs">
                          {r.pct}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.lastSession}
                      </TableCell>
                      <TableCell className="text-center text-sm font-bold text-destructive">
                        {r.missed}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Policy ── */}
          <TabsContent value="policy" className="mt-4 max-w-md">
            <Card className="border-0 shadow-sm">
              <CardContent className="px-6 py-6 space-y-5">
                <div className="space-y-1">
                  <h2 className="font-semibold">
                    Attendance Warning Threshold
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Students below this percentage will be flagged as &quot;At
                    Risk&quot; across all views.
                  </p>{" "}
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    id="threshold-input"
                    type="number"
                    min={0}
                    max={100}
                    value={pendingThreshold}
                    onChange={(e) => setPendingThreshold(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Current threshold: <strong>{threshold}%</strong>
                  </p>
                  <Button size="sm" onClick={savePolicy} id="save-policy-btn">
                    Save Policy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Bulk Excuse ── */}
          <TabsContent value="bulk-excuse" className="mt-4 max-w-lg">
            <Card className="border-0 shadow-sm">
              <CardContent className="px-6 py-6 space-y-5">
                <div className="space-y-1">
                  <h2 className="font-semibold">Bulk Excuse Absences</h2>
                  <p className="text-sm text-muted-foreground">
                    Excuse all absences within a date range — useful for public
                    holidays, campus events, or disasters.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="excuse-from">From</Label>
                    <Input
                      id="excuse-from"
                      placeholder="e.g. Mar 15"
                      value={excuseFrom}
                      onChange={(e) => {
                        setExcuseFrom(e.target.value);
                        setPreviewCount(null);
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="excuse-to">To</Label>
                    <Input
                      id="excuse-to"
                      placeholder="e.g. Mar 20"
                      value={excuseTo}
                      onChange={(e) => {
                        setExcuseTo(e.target.value);
                        setPreviewCount(null);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="excuse-course">Course</Label>
                  <Select
                    value={excuseCourse}
                    onValueChange={(v) => {
                      setExcuseCourse(v);
                      setPreviewCount(null);
                    }}
                  >
                    <SelectTrigger id="excuse-course">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="excuse-reason">Reason *</Label>
                  <Textarea
                    id="excuse-reason"
                    placeholder="e.g. Public holiday — campus closed"
                    rows={3}
                    className="resize-none"
                    value={excuseReason}
                    onChange={(e) => setExcuseReason(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previewExcuse}
                    id="preview-excuse-btn"
                  >
                    Preview Affected
                  </Button>
                  {previewCount !== null && (
                    <p className="text-sm text-muted-foreground">
                      {previewCount} session(s) will be excused.
                    </p>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={applyExcuse}
                  id="apply-excuse-btn"
                >
                  Apply Excuse
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
