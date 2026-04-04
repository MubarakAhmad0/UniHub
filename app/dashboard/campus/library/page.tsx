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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth/use-auth";
import { toast } from "sonner";
import { useState } from "react";
import { AcquisitionRequestSheet } from "./_components/acquisition-request-sheet";
import { LibraryManagePanel } from "./_components/library-manage-panel";

/* ── Mock data ────────────────────────────────────────────────────── */

const SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

type SlotState = "available" | "booked" | "selected" | "closed";

type Resource = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  features: string[];
  slots: SlotState[];
};

const seats: Resource[] = [
  {
    id: "s1",
    name: "Seat A12",
    location: "Level 2, North Wing",
    capacity: 1,
    features: ["silent_zone"],
    slots: [
      "available",
      "available",
      "booked",
      "booked",
      "available",
      "available",
      "available",
      "available",
      "available",
      "available",
      "closed",
      "closed",
      "closed",
    ],
  },
  {
    id: "s2",
    name: "Seat B07",
    location: "Level 2, South Wing",
    capacity: 1,
    features: ["silent_zone", "power_outlet"],
    slots: [
      "available",
      "available",
      "available",
      "booked",
      "booked",
      "available",
      "selected",
      "available",
      "available",
      "available",
      "closed",
      "closed",
      "closed",
    ],
  },
  {
    id: "s3",
    name: "Seat C15",
    location: "Level 3, Quiet Zone",
    capacity: 1,
    features: ["silent_zone"],
    slots: [
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "closed",
      "closed",
      "closed",
    ],
  },
];
const rooms: Resource[] = [
  {
    id: "r1",
    name: "Discussion Room 1",
    location: "Level 2, North Wing",
    capacity: 6,
    features: ["whiteboard", "hdmi"],
    slots: [
      "available",
      "available",
      "booked",
      "booked",
      "available",
      "selected",
      "available",
      "available",
      "available",
      "available",
      "closed",
      "closed",
      "closed",
    ],
  },
  {
    id: "r2",
    name: "Discussion Room 2",
    location: "Level 2, South Wing",
    capacity: 6,
    features: ["whiteboard", "projector"],
    slots: [
      "available",
      "available",
      "available",
      "available",
      "booked",
      "booked",
      "available",
      "available",
      "available",
      "available",
      "closed",
      "closed",
      "closed",
    ],
  },
  {
    id: "r3",
    name: "Discussion Room 3",
    location: "Level 3",
    capacity: 4,
    features: ["whiteboard"],
    slots: [
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "closed",
      "closed",
      "closed",
    ],
  },
];
const equipment: Resource[] = [
  {
    id: "e1",
    name: "MacBook Loan #1",
    location: "Library Counter, Level 1",
    capacity: 1,
    features: ["laptop"],
    slots: [
      "available",
      "available",
      "available",
      "booked",
      "booked",
      "available",
      "available",
      "available",
      "available",
      "available",
      "closed",
      "closed",
      "closed",
    ],
  },
  {
    id: "e2",
    name: "HDMI Adapter Set",
    location: "Library Counter, Level 1",
    capacity: 1,
    features: ["adapter"],
    slots: [
      "available",
      "available",
      "available",
      "available",
      "available",
      "booked",
      "available",
      "available",
      "available",
      "available",
      "closed",
      "closed",
      "closed",
    ],
  },
];

const myBookings = [
  {
    id: "b1",
    resource: "Seat B07",
    date: "Thu, Apr 3 2026",
    time: "12:00–13:00",
    status: "confirmed",
    type: "personal",
    linkedCourse: null,
  },
  {
    id: "b2",
    resource: "Discussion Room 1",
    date: "Thu, Apr 3 2026",
    time: "13:00–14:00",
    status: "confirmed",
    type: "class",
    linkedCourse: "MTH 301",
  },
];

const myTeachingCourses = [
  { id: "c1", code: "MTH 301" },
  { id: "c2", code: "CS 105" },
];

function slotColor(state: SlotState) {
  if (state === "available")
    return "bg-background hover:bg-primary/10 cursor-pointer border border-border/30";
  if (state === "booked")
    return "bg-muted/60 text-muted-foreground cursor-not-allowed border border-border/20";
  if (state === "selected")
    return "bg-primary text-primary-foreground cursor-pointer";
  return "bg-muted/30 text-muted-foreground/40 cursor-not-allowed bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.05)_4px,rgba(0,0,0,0.05)_8px)]";
}

export default function LibraryPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acquisitionOpen, setAcquisitionOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{
    resource: Resource;
    slot: string;
  } | null>(null);

  // Manager class booking toggle
  const [isClassBooking, setIsClassBooking] = useState(false);
  const [linkedCourse, setLinkedCourse] = useState<string>("");

  function handleSlotClick(resource: Resource, slotIdx: number) {
    if (resource.slots[slotIdx] !== "available") return;
    setPendingBooking({ resource, slot: SLOTS[slotIdx] });
    setConfirmOpen(true);
  }

  function confirmBooking() {
    setConfirmOpen(false);
    toast("Booking confirmed!", {
      description: `${pendingBooking?.resource.name} · ${pendingBooking?.slot}${isClassBooking && linkedCourse ? ` (Class: ${myTeachingCourses.find((c) => c.id === linkedCourse)?.code})` : ""}`,
    });
    // Reset booking form
    setIsClassBooking(false);
    setLinkedCourse("");
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
              <BreadcrumbPage>Library Booking</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isManager && (
          <div className="ml-auto flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAcquisitionOpen(true)}
            >
              Request Acquisition
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Main Library {isAdmin && "· Admin View"}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Library Booking
            </h1>
            <p className="text-sm text-muted-foreground">
              Open 08:00–22:00 · Your bookings today:{" "}
              <strong>1 of {isManager ? "8" : "2"} max hours</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-background border border-border/30" />{" "}
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-muted/60" />{" "}
              Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-primary" />{" "}
              Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-muted/30 border border-dashed" />{" "}
              Closed
            </span>
          </div>
        </div>

        <Tabs defaultValue="rooms">
          <TabsList className="flex flex-wrap h-auto justify-start">
            <TabsTrigger value="seats">Seats</TabsTrigger>
            <TabsTrigger value="rooms">Discussion Rooms</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="my">My Bookings</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="manage">Manage (Admin)</TabsTrigger>
            )}
          </TabsList>

          {[
            { key: "seats", data: seats },
            { key: "rooms", data: rooms },
            { key: "equipment", data: equipment },
          ].map(({ key, data }) => (
            <TabsContent key={key} value={key} className="space-y-4 mt-4">
              {data.map((resource) => (
                <Card
                  key={resource.id}
                  className="border-0 shadow-sm bg-card overflow-hidden"
                >
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">{resource.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {resource.location} · Cap. {resource.capacity}
                        </p>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {resource.features.map((f) => (
                          <Badge
                            key={f}
                            variant="secondary"
                            className="text-[10px] capitalize"
                          >
                            {f.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="overflow-x-auto">
                      <div className="flex gap-1 min-w-max">
                        {resource.slots.map((state, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <span className="text-[9px] text-muted-foreground">
                              {SLOTS[i]}
                            </span>
                            <button
                              onClick={() => handleSlotClick(resource, i)}
                              className={`w-10 h-6 rounded-sm text-[10px] font-medium transition-colors ${slotColor(state)}`}
                            >
                              {state === "booked"
                                ? "Busy"
                                : state === "selected"
                                  ? "Sel."
                                  : state === "closed"
                                    ? "—"
                                    : ""}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}

          <TabsContent value="my" className="space-y-3 mt-4">
            {myBookings.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No upcoming bookings.
              </p>
            )}
            {myBookings.map((b) => (
              <Card key={b.id} className="border-0 shadow-sm bg-card">
                <CardContent className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{b.resource}</p>
                      <Badge
                        variant={b.type === "class" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {b.type === "class"
                          ? `Class (${b.linkedCourse})`
                          : "Personal"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {b.date} · {b.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{b.status}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="manage" className="mt-4">
              <LibraryManagePanel />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Dialog
        open={confirmOpen}
        onOpenChange={(v) => {
          setConfirmOpen(v);
          if (!v) {
            setIsClassBooking(false);
            setLinkedCourse("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-4 py-2">
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground">Resource:</span>{" "}
                {pendingBooking?.resource.name}
              </p>
              <p>
                <span className="text-muted-foreground">Date:</span> Thu, Apr 3
                2026
              </p>
              <p>
                <span className="text-muted-foreground">Time:</span>{" "}
                {pendingBooking?.slot} –{" "}
                {pendingBooking
                  ? (SLOTS[SLOTS.indexOf(pendingBooking.slot) + 1] ?? "end")
                  : ""}
              </p>
              <p>
                <span className="text-muted-foreground">Location:</span>{" "}
                {pendingBooking?.resource.location}
              </p>
            </div>

            {isManager && (
              <div className="bg-muted/40 p-3 rounded-lg space-y-3 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="class-booking"
                      className="text-sm font-medium"
                    >
                      Book for a class
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Overrides standard booking limits.
                    </p>
                  </div>
                  <Switch
                    id="class-booking"
                    checked={isClassBooking}
                    onCheckedChange={setIsClassBooking}
                  />
                </div>
                {isClassBooking && (
                  <div className="pt-1">
                    <Select
                      value={linkedCourse}
                      onValueChange={setLinkedCourse}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course…" />
                      </SelectTrigger>
                      <SelectContent>
                        {myTeachingCourses.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBooking}
              disabled={isClassBooking && !linkedCourse}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AcquisitionRequestSheet
        open={acquisitionOpen}
        onOpenChange={setAcquisitionOpen}
      />
    </div>
  );
}
