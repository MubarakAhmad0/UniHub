"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  MoreHorizontal,
  Search,
  Download,
  Plus,
  TrendingUp,
  HandCoins,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminFinancialDashboard() {
  const [search, setSearch] = useState("");

  const studentAccounts = [
    {
      id: "s1",
      name: "Ahmed, Mubarak",
      program: "BSc Comp Sci",
      balance: 5400,
      lastPayment: "Jan 10, 2026",
      status: "outstanding",
    },
    {
      id: "s2",
      name: "Wang, Amy",
      program: "BArch",
      balance: 0,
      lastPayment: "Feb 02, 2026",
      status: "clear",
    },
    {
      id: "s3",
      name: "Lee, Michael",
      program: "BA Business",
      balance: 12000,
      lastPayment: "None",
      status: "overdue",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Term Revenue
            </p>
            <div className="text-2xl font-bold mt-1 text-emerald-600">
              RM 4.2M
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Outstanding
            </p>
            <div className="text-2xl font-bold mt-1 text-destructive">
              RM 850K
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Overdue Acc
            </p>
            <div className="text-2xl font-bold mt-1 text-amber-600">142</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Aid Disbursed
            </p>
            <div className="text-2xl font-bold mt-1">RM 120K</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students">
        <TabsList className="mb-4">
          <TabsTrigger value="students">Student Accounts</TabsTrigger>
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-0 space-y-4">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-3 px-5 flex flex-row justify-between items-center bg-muted/20">
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by ID or name..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAccounts.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="pl-5 font-medium">
                        {s.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.program}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${s.balance > 0 ? "text-amber-600" : "text-emerald-600"}`}
                      >
                        RM {s.balance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{s.lastPayment}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${s.status === "clear" ? "bg-emerald-100 text-emerald-700" : s.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-700"}`}
                        >
                          {s.status.toUpperCase()}
                        </Badge>
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
                            <DropdownMenuItem
                              onClick={() =>
                                toast("Opening full fee statement...")
                              }
                            >
                              View Account
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast("Recording manual payment...")
                              }
                            >
                              Record Payment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-amber-600"
                              onClick={() =>
                                toast("Issue credit dialog opened.")
                              }
                            >
                              Issue Credit / Waiver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structures" className="mt-0">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-lg">Tuition Matrix (2026)</CardTitle>
                <CardDescription>
                  Manage standard unit costs per faculty.
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-md border border-dashed">
                <Building2 className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm">
                  Fee structure matrices are managed via the Registry subsystem.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scholarships" className="mt-0">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-lg">
                  Financial Aid Programs
                </CardTitle>
                <CardDescription>
                  Review and assign scholarships to students.
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> New Fund
              </Button>
            </CardHeader>
            <CardContent>
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-md border border-dashed">
                <HandCoins className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm">
                  No new scholarship applications pending review.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="pt-6">
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-md border border-dashed">
                <TrendingUp className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm">
                  Connect a BI module to generate advanced financial reporting.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
