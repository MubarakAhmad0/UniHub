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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Search,
  ShieldAlert,
  FileText,
  Ban,
  Trash2,
  Settings,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type ReportedListing = {
  id: string;
  title: string;
  reporter: string;
  seller: string;
  reason: string;
  date: string;
  status: "pending" | "reviewed";
};

type BannedUser = {
  id: string;
  name: string;
  dateBanned: string;
  duration: string;
  reason: string;
};

const reportedListings: ReportedListing[] = [
  {
    id: "r1",
    title: "Organic Chemistry Textbook",
    reporter: "student_89",
    seller: "alex_m",
    reason: "Counterfeit/Photocopied material",
    date: "2024-04-05",
    status: "pending",
  },
  {
    id: "r2",
    title: "Used Lab Equipment",
    reporter: "staff_4",
    seller: "unknown_33",
    reason: "Prohibited item (chem supplies)",
    date: "2024-04-04",
    status: "pending",
  },
];

const bannedUsers: BannedUser[] = [
  {
    id: "u1",
    name: "John Doe",
    dateBanned: "2024-03-20",
    duration: "30 Days",
    reason: "Multiple scam reports",
  },
];

export function MarketplaceModerationPanel() {
  const [search, setSearch] = useState("");
  const [catDialogOpen, setCatDialogOpen] = useState(false);

  return (
    <div className="space-y-4 pt-4">
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Marketplace Moderation
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast("Opening Policy Settings...")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Policies
            </Button>
            <Button size="sm" onClick={() => setCatDialogOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Categories
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <Tabs defaultValue="reports">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <TabsList className="h-9">
                <TabsTrigger value="reports" className="text-xs">
                  Reported Listings
                  {reportedListings.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 h-4 px-1.5 text-[9px] rounded-full"
                    >
                      {reportedListings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="banned" className="text-xs">
                  Banned Users
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="reports" className="mt-0 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Listing</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportedListings.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-amber-700">
                        <ShieldAlert className="inline h-3 w-3 mr-1" />
                        {r.title}
                        <p className="text-xs text-muted-foreground font-normal">
                          Seller: {r.seller}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs">{r.reporter}</TableCell>
                      <TableCell className="text-xs">{r.reason}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.date}
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
                                toast("Opening listing details...")
                              }
                            >
                              Inspect Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-amber-600"
                              onClick={() => toast("Seller sent warning.")}
                            >
                              Warn Seller
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive font-medium"
                              onClick={() => toast("Listing removed.")}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Take Down
                              Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => toast("User banned.")}
                            >
                              <Ban className="mr-2 h-4 w-4" /> Ban Seller
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reportedListings.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-sm text-muted-foreground h-24"
                      >
                        Hooray! No pending reports.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="banned" className="mt-0 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date Banned</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bannedUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-destructive border-destructive/30 bg-destructive/5 text-[10px]"
                        >
                          {u.duration}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{u.reason}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {u.dateBanned}
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
                              onClick={() => toast("Ban lifted.")}
                            >
                              Lift Ban / Restore Access
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

      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add, remove, or edit marketplace root categories.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              <Input
                placeholder="New Category Name..."
                className="flex-1 text-sm"
              />
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
            <div className="border rounded-md mt-4 divide-y">
              {[
                "Textbook",
                "Equipment",
                "Notes",
                "Stationery",
                "Electronics",
                "Clothing",
                "Other",
              ].map((cat) => (
                <div
                  key={cat}
                  className="flex justify-between items-center p-3 text-sm"
                >
                  <span>{cat}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-destructive px-2"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
