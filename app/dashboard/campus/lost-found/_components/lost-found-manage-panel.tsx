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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Search, Settings, Archive } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

type AdminReportStatus =
  | "open"
  | "claimed"
  | "returned"
  | "archived"
  | "disputed";

type AdminReport = {
  id: string;
  type: "lost" | "found";
  category: string;
  title: string;
  location: string;
  date: string;
  postedBy: string;
  status: AdminReportStatus;
};

const adminReports: AdminReport[] = [
  {
    id: "1",
    type: "lost",
    category: "electronics",
    title: "Black Samsung Phone",
    location: "Block C Canteen",
    date: "Apr 1, 2026",
    postedBy: "Ahmed (Student)",
    status: "open",
  },
  {
    id: "3",
    type: "lost",
    category: "bag",
    title: "Blue Backpack",
    location: "Lecture Theatre 2",
    date: "Mar 30, 2026",
    postedBy: "Sarah (Student)",
    status: "claimed",
  },
  {
    id: "7",
    type: "found",
    category: "electronics",
    title: "Black Calculator (Casio)",
    location: "Hall 9A, Main Building",
    date: "Apr 2, 2026",
    postedBy: "Dr. Lin (Manager)",
    status: "returned",
  },
  {
    id: "8",
    type: "found",
    category: "id_card",
    title: "Student ID Card",
    location: "Library Entrance",
    date: "Apr 1, 2026",
    postedBy: "Security Officer Mike",
    status: "archived",
  },
];

const statusVariant: Record<
  AdminReportStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  open: "default",
  claimed: "secondary",
  returned: "outline",
  archived: "outline",
  disputed: "destructive",
};

export function LostFoundManagePanel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [policyOpen, setPolicyOpen] = useState(false);

  // Derived filtered state
  const filteredReports = adminReports.filter((r) => {
    const sMatch = statusFilter === "all" || r.status === statusFilter;
    const searchMatch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    return sMatch && searchMatch;
  });

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Administration Tools
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setPolicyOpen(true)}
            >
              <Settings className="mr-2 h-3.5 w-3.5" />
              Policy Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              onClick={() =>
                toast("Archived 12 overdue items based on retention policy.")
              }
            >
              <Archive className="mr-2 h-3.5 w-3.5" />
              Archive Overdue Items
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="flex gap-4 mb-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items or locations..."
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="h-9 px-3 rounded-md border text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="claimed">Claimed</option>
              <option value="returned">Returned</option>
              <option value="archived">Archived</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date & Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {r.type}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{r.date}</span>
                        <span className="text-xs text-muted-foreground">
                          {r.postedBy}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant[r.status]}
                        className="capitalize"
                      >
                        {r.status}
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {r.status === "claimed" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  toast("Claim verified. Marked as returned.")
                                }
                              >
                                Review & Verify Claim
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => toast("Claim rejected.")}
                              >
                                Reject Claim
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              toast("Item marked as returned manually.")
                            }
                          >
                            Mark as Returned
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast("Notification SMS sent to owner.")
                            }
                          >
                            Notify Claimant
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={
                              r.status === "archived" ? "opacity-50" : ""
                            }
                            onClick={() => toast("Item archived.")}
                          >
                            Archive Item
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => toast("Report deleted permanently.")}
                          >
                            Delete Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Policy Settings Dialog */}
      <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Retention Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Configure how long unclaimed items stay active before being
              flagged for archive or disposal.
            </p>
            <div className="space-y-2">
              <Label>Days to Retain High-Value Items (Electronics, IDs)</Label>
              <Input type="number" defaultValue={60} />
            </div>
            <div className="space-y-2">
              <Label>Days to Retain General Items (Clothing, Bottles)</Label>
              <Input type="number" defaultValue={30} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPolicyOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPolicyOpen(false);
                toast("Retention policy updated successfully.");
              }}
            >
              Save Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
