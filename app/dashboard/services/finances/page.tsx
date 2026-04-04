"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { AlertCircle, Download, ExternalLink, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth/use-auth";
import { AdminFinancialDashboard } from "./_components/admin-financial-dashboard";

/* ── Mock data ────────────────────────────────────────────────────── */

const currentSemester = "Fall 2024";
const totalFees = 12800;
const totalPaid = 8480;
const outstanding = 4320;
const dueDate = "15 Apr 2026";
const isOverdue = false;

const feeItems = [
  {
    type: "Tuition",
    description: "Bachelor of Architecture — Semester 7",
    amount: 10500,
    isDeduction: false,
  },
  {
    type: "Lab Fee",
    description: "Architecture Studio Lab",
    amount: 800,
    isDeduction: false,
  },
  {
    type: "Library Fee",
    description: "Annual Library Access",
    amount: 150,
    isDeduction: false,
  },
  {
    type: "Sports Fee",
    description: "Recreational Facilities",
    amount: 100,
    isDeduction: false,
  },
  {
    type: "Scholarship",
    description: "MyBrainSc Scholarship Deduction",
    amount: 3250,
    isDeduction: true,
  },
];

const payments = [
  {
    id: "p1",
    date: "Jan 2, 2026",
    reference: "TXN-2026-0012",
    amount: 3980,
    method: "Online",
    status: "completed" as const,
  },
  {
    id: "p2",
    date: "Aug 15, 2025",
    reference: "TXN-2025-0088",
    amount: 5200,
    method: "Bank Transfer",
    status: "completed" as const,
  },
  {
    id: "p3",
    date: "Jan 5, 2025",
    reference: "TXN-2025-0010",
    amount: 5100,
    method: "Online",
    status: "completed" as const,
  },
];

const semesterHistory = [
  {
    semester: "Fall 2024",
    fees: 12800,
    paid: 8480,
    status: "outstanding" as const,
  },
  {
    semester: "Spring 2024",
    fees: 11500,
    paid: 11500,
    status: "clear" as const,
  },
  { semester: "Fall 2023", fees: 11200, paid: 11200, status: "clear" as const },
];

function formatRM(amount: number) {
  return `RM ${amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
}

export default function FinancesPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  if (isManager && !isAdmin) {
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
                <BreadcrumbPage>Student Finances</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 p-6 lg:p-8 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-bold tracking-tight mb-2">
            Restricted Area
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            This module is exclusively for student financial accounts. Staff
            payroll operations have been moved to the primary HR system.
          </p>
        </main>
      </div>
    );
  }

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
              <BreadcrumbPage>My Finances</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {isAdmin
              ? "Registry & Bursary"
              : `Admin & Services · ${currentSemester}`}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "Financial Administration" : "My Finances"}
          </h1>
        </div>

        {isAdmin ? (
          <AdminFinancialDashboard />
        ) : (
          <>
            {/* Status banner */}
            <div
              className={`flex items-center justify-between gap-4 p-4 rounded-md border-l-4 ${isOverdue ? "border-destructive bg-destructive/10" : "border-amber-400 bg-amber-50"}`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle
                  className={`h-5 w-5 shrink-0 ${isOverdue ? "text-destructive" : "text-amber-600"}`}
                />
                <div>
                  <p
                    className={`font-semibold text-sm ${isOverdue ? "text-destructive" : "text-amber-800"}`}
                  >
                    {isOverdue
                      ? "Payment Overdue"
                      : `Outstanding Balance — Due ${dueDate}`}
                  </p>
                  <p
                    className={`text-xl font-bold ${isOverdue ? "text-destructive" : "text-amber-800"}`}
                  >
                    {formatRM(outstanding)}
                  </p>
                </div>
              </div>
              <Button asChild>
                <a href="#pay" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Pay Now
                </a>
              </Button>
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Total Fees",
                  value: totalFees,
                  color: "text-foreground",
                },
                {
                  label: "Amount Paid",
                  value: totalPaid,
                  color: "text-emerald-600",
                },
                {
                  label: "Outstanding",
                  value: outstanding,
                  color: "text-amber-600",
                },
              ].map(({ label, value, color }) => (
                <Card key={label} className="border-0 shadow-sm bg-card">
                  <CardContent className="pt-5 pb-5 px-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${color}`}>
                      {formatRM(value)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="current">
              <TabsList>
                <TabsTrigger value="current">Current Semester</TabsTrigger>
                <TabsTrigger value="history">Payment History</TabsTrigger>
                <TabsTrigger value="all">All Semesters</TabsTrigger>
              </TabsList>

              {/* Current semester fee breakdown */}
              <TabsContent value="current" className="mt-4 space-y-4">
                <Card className="border-0 shadow-sm bg-card overflow-hidden">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/40">
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feeItems.map((item) => (
                          <TableRow
                            key={item.type}
                            className="border-border/20"
                          >
                            <TableCell className="font-medium text-sm">
                              {item.type}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.description}
                            </TableCell>
                            <TableCell
                              className={`text-right text-sm font-medium ${item.isDeduction ? "text-emerald-600" : ""}`}
                            >
                              {item.isDeduction
                                ? `−${formatRM(item.amount)}`
                                : formatRM(item.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-border/20 bg-muted/20">
                          <TableCell className="font-bold text-sm">
                            Total Fees
                          </TableCell>
                          <TableCell />
                          <TableCell className="text-right font-bold text-sm">
                            {formatRM(
                              feeItems
                                .filter((i) => !i.isDeduction)
                                .reduce((a, b) => a + b.amount, 0) -
                                feeItems
                                  .filter((i) => i.isDeduction)
                                  .reduce((a, b) => a + b.amount, 0),
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border/20">
                          <TableCell className="text-sm text-emerald-600">
                            Paid
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            Payment on Jan 2, 2026
                          </TableCell>
                          <TableCell className="text-right text-sm text-emerald-600">
                            −
                            {formatRM(
                              totalPaid -
                                (totalFees -
                                  feeItems
                                    .filter((i) => !i.isDeduction)
                                    .reduce((a, b) => a + b.amount, 0) +
                                  feeItems
                                    .filter((i) => i.isDeduction)
                                    .reduce((a, b) => a + b.amount, 0)),
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-amber-50">
                          <TableCell className="font-bold text-amber-800">
                            Outstanding
                          </TableCell>
                          <TableCell />
                          <TableCell className="text-right font-bold text-amber-800">
                            {formatRM(outstanding)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Button>
                    Pay Now <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Statement
                  </Button>
                </div>
              </TabsContent>

              {/* Payment history */}
              <TabsContent value="history" className="mt-4">
                <Card className="border-0 shadow-sm bg-card overflow-hidden">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/40">
                          <TableHead>Date</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((p) => (
                          <TableRow key={p.id} className="border-border/20">
                            <TableCell className="text-sm">{p.date}</TableCell>
                            <TableCell className="text-sm font-mono text-muted-foreground">
                              {p.reference}
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              {formatRM(p.amount)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {p.method}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {p.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" className="h-7">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* All semesters */}
              <TabsContent value="all" className="mt-4 space-y-3">
                {semesterHistory.map((s) => (
                  <Card key={s.semester} className="border-0 shadow-sm bg-card">
                    <CardContent className="px-5 py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-sm">{s.semester}</p>
                        <p className="text-xs text-muted-foreground">
                          Total: {formatRM(s.fees)} · Paid: {formatRM(s.paid)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {s.status === "clear" ? (
                          <Badge
                            variant="secondary"
                            className="text-[10px] text-emerald-700 bg-emerald-100"
                          >
                            Cleared
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] text-amber-700 bg-amber-100"
                          >
                            Outstanding
                          </Badge>
                        )}
                        <Button size="sm" variant="ghost">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
