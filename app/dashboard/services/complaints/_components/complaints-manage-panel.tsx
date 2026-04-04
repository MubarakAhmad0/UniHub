"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  Download,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Priority = "low" | "medium" | "high" | "urgent";

type AdminCase = {
  id: string;
  reference: string;
  title: string;
  category: string;
  student: string;
  priority: Priority;
  status: "under_review" | "info_requested" | "resolved" | "escalated";
  assignedTo: string;
  submitted: string;
};

const adminCases: AdminCase[] = [
  {
    id: "c1",
    reference: "APP-2026-0012",
    title: "Grade Appeal — MTH 301 Final Exam",
    category: "Academic Appeal",
    student: "jdoe_99",
    priority: "high",
    status: "under_review",
    assignedTo: "Academic Affairs",
    submitted: "Mar 15, 2026",
  },
  {
    id: "c2",
    reference: "GRV-2026-0008",
    title: "Air Conditioning in Studio C",
    category: "Grievance",
    student: "amy_w",
    priority: "medium",
    status: "info_requested",
    assignedTo: "Facilities Management",
    submitted: "Mar 28, 2026",
  },
  {
    id: "c4",
    reference: "CON-2026-0001",
    title: "Harassment Report - Library",
    category: "Conduct",
    student: "hidden_user",
    priority: "urgent",
    status: "escalated",
    assignedTo: "Student Conduct Board",
    submitted: "Apr 02, 2026",
  },
];

const PKPI = [
  { label: "Active Cases", value: "34" },
  { label: "High / Urgent Priority", value: "6", alert: true },
  { label: "Avg Resolution Time", value: "4.2 days" },
];

export function ComplaintsManagePanel() {
  const [search, setSearch] = useState("");

  const activeCases = adminCases.filter((c) => c.status !== "resolved");

  return (
    <div className="space-y-4 pt-4">
      {/* Quick KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {PKPI.map((kpi, i) => (
          <Card
            key={i}
            className={`border-0 shadow-sm ${kpi.alert ? "bg-destructive/10" : "bg-card"}`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${kpi.alert ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {kpi.label}
                </p>
                <div
                  className={`text-2xl font-bold mt-1 ${kpi.alert ? "text-destructive" : ""}`}
                >
                  {kpi.value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Complaint Administration Board
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast("Downloading CSV export...")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <Tabs defaultValue="active">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ref or title..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <TabsList className="h-9">
                <TabsTrigger value="active" className="text-xs">
                  Active ({activeCases.length})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="text-xs">
                  Resolved
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="mt-0 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status & Priority</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCases
                    .filter(
                      (c) =>
                        c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.reference
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                    .map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs">
                          {c.reference}
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-sm">{c.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {c.category}
                          </p>
                        </TableCell>
                        <TableCell className="text-xs">
                          {c.assignedTo}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 items-start">
                            <Badge
                              variant={
                                c.status === "escalated"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-[9px]"
                            >
                              {c.status.replace("_", " ")}
                            </Badge>
                            {c.priority === "urgent" && (
                              <Badge
                                variant="outline"
                                className="text-destructive border-destructive text-[9px]"
                              >
                                <AlertTriangle className="h-2 w-2 mr-1" />{" "}
                                URGENT
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  toast("Viewing full case file...")
                                }
                              >
                                Inspect Case
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  toast("Opening assignment dialog...")
                                }
                              >
                                Reassign Department
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast("Priority updated.")}
                              >
                                Edit Priority
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-amber-600"
                                onClick={() =>
                                  toast("Case escalated successfully.")
                                }
                              >
                                <ArrowUpRight className="mr-2 h-4 w-4" />{" "}
                                Escalate to Leadership
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-indigo-600"
                                onClick={() => toast("Message sent.")}
                              >
                                <Mail className="mr-2 h-4 w-4" /> Message
                                Assigned Staff
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-emerald-600 font-medium"
                                onClick={() => toast("Case forcefully closed.")}
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" /> Force
                                Resolve
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="resolved">
              <div className="py-8 text-center text-sm text-muted-foreground">
                No resolved cases match your criteria.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
