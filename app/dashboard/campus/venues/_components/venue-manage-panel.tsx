"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Plus, Calendar, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { SetStatusDialog } from "./set-status-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pendingApprovals = [
  {
    id: "p1",
    requester: "Alex Rivers",
    venue: "Main Hall",
    date: "Apr 10",
    time: "14:00–16:00",
    purpose: "Club meeting",
    submitted: "Apr 3",
  },
];

const mockAdminVenues = [
  {
    id: "v1",
    name: "Main Hall",
    type: "Hall",
    building: "Main Building",
    capacity: 800,
    status: "available",
  },
  {
    id: "v2",
    name: "Futsal Court",
    type: "Field",
    building: "Sports Complex",
    capacity: 14,
    status: "maintenance",
  },
];

export function VenueManagePanel() {
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [selectedVenueForStatus, setSelectedVenueForStatus] = useState<
    (typeof mockAdminVenues)[0] | null
  >(null);

  const handleApproval = (id: string, action: "approve" | "reject") => {
    setApprovals((prev) => prev.filter((p) => p.id !== id));
    toast.success(`Booking ${action === "approve" ? "approved" : "rejected"}.`);
  };

  const savePolicies = () => {
    toast.success("Venue policies updated.");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Manage Venues</h2>
        <p className="text-sm text-muted-foreground">
          Approve requests, manage facilities, and set booking rules.
        </p>
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Approval Queue</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold">Pending Approvals</h3>
            <Badge variant="secondary">{approvals.length}</Badge>
          </div>

          {approvals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending booking requests.
            </p>
          ) : (
            approvals.map((req) => (
              <Card key={req.id} className="border-0 shadow-sm bg-card">
                <CardContent className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{req.venue}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested by{" "}
                      <span className="font-medium text-foreground">
                        {req.requester}
                      </span>{" "}
                      on {req.submitted}
                    </p>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {req.date} · {req.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="bg-muted px-3 py-2 rounded text-xs space-y-0.5">
                      <span className="font-medium text-muted-foreground block text-[10px] uppercase">
                        Purpose
                      </span>
                      <p>{req.purpose}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproval(req.id, "reject")}
                        className="h-7 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproval(req.id, "approve")}
                        className="h-7 text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="venues" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Venue
            </Button>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Venue Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdminVenues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell className="font-semibold text-sm">
                      {venue.name}
                    </TableCell>
                    <TableCell>{venue.type}</TableCell>
                    <TableCell>{venue.building}</TableCell>
                    <TableCell>{venue.capacity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          venue.status === "available"
                            ? "secondary"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {venue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedVenueForStatus(venue)}
                          >
                            Set Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <Card className="border-0 shadow-sm bg-card flex items-center justify-center h-64">
            <CardContent className="text-center space-y-2 pt-6">
              <Calendar className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                Swimlane booking calendar coming soon.
                <br />
                (Interactive mock scope limit)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4 space-y-4">
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="adv-notice">
                    Student max advance notice (days)
                  </Label>
                  <Input id="adv-notice" type="number" defaultValue={14} />
                </div>
                <div className="space-y-1.5">
                  <Label>Blocked Dates</Label>
                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground justify-start font-normal"
                  >
                    Select date range...
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pol-student">
                    Student max duration (hours)
                  </Label>
                  <Input id="pol-student" type="number" defaultValue={2} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pol-manager">
                    Manager max duration (hours)
                  </Label>
                  <Input id="pol-manager" type="number" defaultValue={8} />
                </div>
              </div>
              <div className="pt-2">
                <Button onClick={savePolicies}>Save Policies</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedVenueForStatus && (
        <SetStatusDialog
          venueName={selectedVenueForStatus.name}
          open={!!selectedVenueForStatus}
          onOpenChange={(v) => !v && setSelectedVenueForStatus(null)}
        />
      )}
    </div>
  );
}
