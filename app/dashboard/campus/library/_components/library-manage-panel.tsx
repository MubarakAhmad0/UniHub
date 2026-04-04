"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Check, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const mockAcquisitions = [
  {
    id: "aq1",
    title: "Introduction to Algorithms (4th Ed.)",
    type: "Book",
    requestedBy: "Prof. Rossi",
    justification: "Replace outdated 3rd edition for CS 105",
  },
];

const mockRooms = [
  {
    id: "lr1",
    name: "Study Room A",
    floor: 1,
    capacity: 6,
    equipment: ["Whiteboard", "TV Screen"],
    status: "available",
  },
  {
    id: "lr2",
    name: "Computer Lab",
    floor: 2,
    capacity: 20,
    equipment: ["PCs x20", "Projector"],
    status: "available",
  },
];

export function LibraryManagePanel() {
  const [acquisitions, setAcquisitions] = useState(mockAcquisitions);
  const [rooms, setRooms] = useState(mockRooms);

  const handleAcqAction = (id: string, action: "approve" | "reject") => {
    setAcquisitions((prev) => prev.filter((a) => a.id !== id));
    toast.success(
      `Request ${action === "approve" ? "approved for purchase" : "rejected"}.`,
    );
  };

  const handleRemoveRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    toast.success("Room removed.");
  };

  const savePolicies = () => {
    toast.success("Policies updated successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Library Management</h2>
        <p className="text-sm text-muted-foreground">
          Configure library rooms, manage resources, and review requests.
        </p>
      </div>

      <Tabs defaultValue="acquisitions">
        <TabsList>
          <TabsTrigger value="acquisitions">Acquisitions</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="acquisitions" className="mt-4 space-y-4">
          {acquisitions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending acquisition requests.
            </p>
          ) : (
            acquisitions.map((req) => (
              <Card key={req.id} className="border-0 shadow-sm bg-card">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{req.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Requested by {req.requestedBy}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {req.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-3">
                  <p className="text-sm">&quot;{req.justification}&quot;</p>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcqAction(req.id, "reject")}
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAcqAction(req.id, "approve")}
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rooms" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Room
            </Button>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Room Name</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-semibold text-sm">
                      {room.name}
                    </TableCell>
                    <TableCell>Level {room.floor}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {room.equipment.map((e) => (
                          <Badge
                            key={e}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {e}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          room.status === "available"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveRoom(room.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Resource
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Manage books, equipment, and digital resources here.
          </p>
        </TabsContent>

        <TabsContent value="policies" className="mt-4 space-y-4">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-3 border-b border-border/40">
              <h3 className="font-semibold text-sm">Booking Policies</h3>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pol-student">
                    Student max booking duration (hours)
                  </Label>
                  <Input id="pol-student" type="number" defaultValue={2} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pol-manager">
                    Manager max booking duration (hours)
                  </Label>
                  <Input id="pol-manager" type="number" defaultValue={8} />
                </div>
              </div>
              <div className="space-y-1.5 w-1/2">
                <Label htmlFor="pol-concurrent">
                  Max concurrent bookings per student
                </Label>
                <Input id="pol-concurrent" type="number" defaultValue={2} />
              </div>
              <div className="pt-2">
                <Button onClick={savePolicies}>Save Policies</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
