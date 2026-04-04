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
import { MoreHorizontal, Search, ShieldAlert, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type AdminClubStatus = "active" | "pending" | "archived";

type AdminClub = {
  id: string;
  name: string;
  category: string;
  members: number;
  advisor: string;
  status: AdminClubStatus;
  budgetAllocated: number;
  budgetSpent: number;
};

const adminClubs: AdminClub[] = [
  {
    id: "c1",
    name: "Photography Society",
    category: "Arts",
    members: 84,
    advisor: "Prof. Alan Smith",
    status: "active",
    budgetAllocated: 1500,
    budgetSpent: 450,
  },
  {
    id: "c2",
    name: "Robotics & AI Club",
    category: "Tech",
    members: 120,
    advisor: "Dr. Elena Rostova",
    status: "active",
    budgetAllocated: 3000,
    budgetSpent: 2800,
  },
  {
    id: "c4",
    name: "Architecture Design Studio",
    category: "Academic",
    members: 56,
    advisor: "Pending Assignment",
    status: "pending",
    budgetAllocated: 0,
    budgetSpent: 0,
  },
];

export function ClubsManagePanel() {
  const [search, setSearch] = useState("");

  const pendingClubs = adminClubs.filter((c) => c.status === "pending");
  const activeClubs = adminClubs.filter((c) => c.status === "active");

  return (
    <div className="space-y-4 pt-4">
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Club Administration
          </p>
          <Button
            size="sm"
            onClick={() => toast("Opening Create Club form...")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Club
          </Button>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <Tabs defaultValue="active">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clubs..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <TabsList className="h-9">
                <TabsTrigger value="active" className="text-xs">
                  Active Clubs
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">
                  Approval Queue
                  {pendingClubs.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 h-4 px-1.5 text-[9px] rounded-full"
                    >
                      {pendingClubs.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="mt-0 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Club Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Advisor</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Budget (Utilized)</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeClubs
                    .filter((c) =>
                      c.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">
                            {c.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {c.advisor}
                        </TableCell>
                        <TableCell>{c.members}</TableCell>
                        <TableCell>
                          <div className="flex flex-col text-xs">
                            <span>${c.budgetAllocated}</span>
                            <span className="text-muted-foreground">
                              ${c.budgetSpent} spent
                            </span>
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
                              <DropdownMenuLabel>
                                Manage Status
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => toast("Opening edit modal...")}
                              >
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast("Re-assigning advisor...")}
                              >
                                Change Advisor
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast("Opening budget panel...")}
                              >
                                Manage Budget
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive font-medium"
                                onClick={() =>
                                  toast("Opening disciplinary action form...")
                                }
                              >
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Disciplinary Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  toast("Club successfully dissolved.")
                                }
                              >
                                Dissolve / Archive Club
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pending" className="mt-0 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposed Club</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Requested Advisor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingClubs.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {c.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground text-amber-600">
                        {c.advisor} (Awaiting Endorsement)
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-300 bg-amber-50"
                        >
                          Pending Setup
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
                              onClick={() => toast("Application approved.")}
                            >
                              Approve Registration
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => toast("Application rejected.")}
                            >
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
