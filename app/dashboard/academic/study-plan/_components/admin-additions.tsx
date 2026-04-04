"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Mock data ── */
type SubstitutionRequest = {
  id: string;
  student: string;
  replace: string;
  with: string;
  reason: string;
  submitted: string;
  status: "Pending" | "Approved" | "Rejected";
};

const INITIAL_SUBS: SubstitutionRequest[] = [
  {
    id: "r1",
    student: "Alex Rivers",
    replace: "CS 301",
    with: "CS 320",
    reason: "Scheduling conflict with work placement",
    submitted: "Apr 1",
    status: "Pending",
  },
  {
    id: "r2",
    student: "Sam Kaur",
    replace: "MTH 201",
    with: "MTH 305",
    reason: "Advisor recommends for Statistics major",
    submitted: "Apr 2",
    status: "Pending",
  },
  {
    id: "r3",
    student: "Jae Lee",
    replace: "AI 210",
    with: "CS 355",
    reason: "Better alignment with research track",
    submitted: "Apr 3",
    status: "Approved",
  },
];

type DegreeProgram = {
  id: string;
  name: string;
  totalCredits: number;
  coreCredits: number;
  electiveCredits: number;
  requiredCourses: string[];
};

const PROGRAMS: DegreeProgram[] = [
  {
    id: "p1",
    name: "BSc Computer Science",
    totalCredits: 120,
    coreCredits: 80,
    electiveCredits: 40,
    requiredCourses: ["CS 101", "CS 102", "CS 201", "CS 401"],
  },
  {
    id: "p2",
    name: "BSc Mathematics",
    totalCredits: 118,
    coreCredits: 78,
    electiveCredits: 40,
    requiredCourses: ["MTH 101", "MTH 102", "MTH 201", "MTH 301"],
  },
  {
    id: "p3",
    name: "BA Humanities",
    totalCredits: 110,
    coreCredits: 60,
    electiveCredits: 50,
    requiredCourses: ["ENG 101", "HIS 215", "LIT 301"],
  },
];

export function AdminStudyPlanAdditions() {
  const [studentSearch, setStudentSearch] = useState("");
  const [subs, setSubs] = useState<SubstitutionRequest[]>(INITIAL_SUBS);
  const [editingProgram, setEditingProgram] = useState<DegreeProgram | null>(
    null,
  );

  const actOnSub = (id: string, action: "Approved" | "Rejected") => {
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: action } : s)),
    );
    toast.success(`Request ${action.toLowerCase()}.`);
  };

  return (
    <Tabs defaultValue="substitutions" className="mt-4">
      <TabsList>
        <TabsTrigger value="substitutions">Substitutions</TabsTrigger>
        <TabsTrigger value="programs">Programs</TabsTrigger>
      </TabsList>

      {/* ── Student Plan Search (outside tabs, always visible) ── */}
      <div className="relative max-w-sm mt-4 mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="admin-student-search"
          placeholder="Search student to view their plan…"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* ── Substitutions Tab ── */}
      <TabsContent value="substitutions" className="mt-2">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Student</TableHead>
                <TableHead>Replace</TableHead>
                <TableHead>With</TableHead>
                <TableHead className="w-[25%]">Reason</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-sm">
                    {s.student}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {s.replace}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{s.with}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.reason}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.submitted}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.status === "Approved"
                          ? "default"
                          : s.status === "Rejected"
                            ? "destructive"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {s.status === "Pending" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="h-6 text-xs px-2"
                          onClick={() => actOnSub(s.id, "Approved")}
                          id={`approve-${s.id}`}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs px-2"
                          onClick={() => actOnSub(s.id, "Rejected")}
                          id={`reject-${s.id}`}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* ── Programs Tab ── */}
      <TabsContent value="programs" className="mt-2 space-y-3">
        {PROGRAMS.map((p) => (
          <Card key={p.id} className="border-0 shadow-sm">
            <CardContent className="px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.totalCredits} credits · {p.coreCredits} core ·{" "}
                  {p.electiveCredits} elective
                </p>
                <div className="flex gap-1.5 flex-wrap mt-1.5">
                  {p.requiredCourses.map((c) => (
                    <Badge
                      key={c}
                      variant="outline"
                      className="text-[10px] font-mono"
                    >
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingProgram(p)}
                id={`edit-program-${p.id}`}
              >
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      {/* Program edit sheet */}
      {editingProgram && (
        <Sheet open onOpenChange={(v) => !v && setEditingProgram(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Edit Program</SheetTitle>
              <SheetDescription>{editingProgram.name}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-6">
              <div className="space-y-1.5">
                <Label>Program Name</Label>
                <Input defaultValue={editingProgram.name} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Total Credits</Label>
                  <Input
                    type="number"
                    defaultValue={editingProgram.totalCredits}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Core</Label>
                  <Input
                    type="number"
                    defaultValue={editingProgram.coreCredits}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Elective</Label>
                  <Input
                    type="number"
                    defaultValue={editingProgram.electiveCredits}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Required Courses (comma-separated)</Label>
                <Input
                  defaultValue={editingProgram.requiredCourses.join(", ")}
                />
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setEditingProgram(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Program updated.");
                  setEditingProgram(null);
                }}
                id="save-program-btn"
              >
                Save
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </Tabs>
  );
}
