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
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import { AlertCircle, Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
// import { VenueManagePanel } from "./_components/venue-manage-panel";

/* ── Mock data ────────────────────────────────────────────────────── */

type Facility = {
  id: string;
  name: string;
  type: string;
  sport?: string;
  location: string;
  capacity: number;
  requiresApproval: boolean;
  maxHours: number;
  rules: string;
  isActive: boolean;
  slots: ("available" | "booked")[]; // 8 slots: 07-15
};

const SLOT_LABELS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
];

const facilities: Facility[] = [
  {
    id: "f1",
    name: "Basketball Court A",
    type: "Court",
    sport: "Basketball",
    location: "Sports Complex, Level 1",
    capacity: 10,
    requiresApproval: false,
    maxHours: 2,
    rules: "Bring your own equipment. Sports shoes mandatory.",
    isActive: true,
    slots: [
      "available",
      "booked",
      "booked",
      "available",
      "available",
      "available",
      "booked",
      "available",
    ],
  },
  {
    id: "f2",
    name: "Badminton Court 1",
    type: "Court",
    sport: "Badminton",
    location: "Sports Complex, Level 1",
    capacity: 4,
    requiresApproval: false,
    maxHours: 2,
    rules: "Rackets available at the counter.",
    isActive: true,
    slots: [
      "available",
      "available",
      "booked",
      "booked",
      "available",
      "booked",
      "available",
      "available",
    ],
  },
  {
    id: "f3",
    name: "Main Gym",
    type: "Gym",
    location: "Sports Complex, Level 2",
    capacity: 50,
    requiresApproval: false,
    maxHours: 2,
    rules: "No outside food or drinks. Towel required.",
    isActive: true,
    slots: [
      "booked",
      "available",
      "available",
      "available",
      "booked",
      "available",
      "available",
      "booked",
    ],
  },
  {
    id: "f4",
    name: "Multipurpose Hall A",
    type: "Hall",
    location: "Student Centre, Level 1",
    capacity: 200,
    requiresApproval: true,
    maxHours: 8,
    rules: "Setup and teardown time included in booking duration.",
    isActive: true,
    slots: [
      "available",
      "available",
      "available",
      "available",
      "available",
      "available",
      "available",
      "available",
    ],
  },
  {
    id: "f5",
    name: "Main Auditorium",
    type: "Hall",
    location: "Main Building, Level G",
    capacity: 800,
    requiresApproval: true,
    maxHours: 8,
    rules: "Formal request letter required for external guests.",
    isActive: true,
    slots: [
      "available",
      "available",
      "available",
      "available",
      "available",
      "available",
      "available",
      "available",
    ],
  },
  {
    id: "f6",
    name: "Futsal Court",
    type: "Field",
    sport: "Futsal",
    location: "Sports Complex, Outdoor",
    capacity: 14,
    requiresApproval: false,
    maxHours: 2,
    rules: "Outdoor field — rain may cause cancellation.",
    isActive: false,
    slots: [
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
      "booked",
    ],
  },
];

const FILTERS = ["All", "Courts", "Gym", "Halls", "Fields"];

const typeMap: Record<string, string> = {
  Courts: "Court",
  Gym: "Gym",
  Halls: "Hall",
  Fields: "Field",
};

const myBookings = [
  {
    id: "b1",
    facility: "Badminton Court 1",
    date: "Thu Apr 3",
    time: "16:00–17:00",
    status: "confirmed",
  },
];

const MY_TEACHING_COURSES = [
  { id: "mth301", code: "MTH 301 · Advanced Calculus II" },
  { id: "cs105", code: "CS 105 · Data Structures" },
];

export default function VenuesPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  const [filter, setFilter] = useState("All");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Manager Booking additions
  const [bookingType, setBookingType] = useState<"personal" | "academic">(
    "personal",
  );
  const [linkedCourse, setLinkedCourse] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  const filtered = facilities.filter(
    (f) => filter === "All" || f.type === typeMap[filter],
  );
  const pendingCount = 2; // Fixed mock for admin display

  function handleBook() {
    if (!selectedFacility || selectedSlot === null) return;
    setConfirmOpen(true);
  }

  function confirmBooking() {
    setConfirmOpen(false);
    setSelectedFacility(null);
    setSelectedSlot(null);

    if (isManager && bookingType === "academic") {
      toast.success("✓ Booking confirmed (Academic Priority)");
    } else {
      toast(
        selectedFacility?.requiresApproval
          ? "Booking request submitted"
          : "Booking confirmed!",
        {
          description: `${selectedFacility?.name} · ${selectedSlot !== null ? SLOT_LABELS[selectedSlot] : ""}`,
        },
      );
    }
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
              <BreadcrumbPage>Venue & Facilities</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Campus · Sports & Events
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Venue & Facilities
            </h1>
            <p className="text-sm text-muted-foreground">
              Book courts, the gym, or request event halls.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Browse Facilities</TabsTrigger>
            <TabsTrigger value="my">My Bookings</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="manage">
                Manage Venues{" "}
                {pendingCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 p-0 flex justify-center items-center rounded-full text-[9px]"
                  >
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse" className="mt-6 space-y-6">
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((facility) => (
                <Card
                  key={facility.id}
                  className={`border-0 shadow-sm transition-shadow ${facility.isActive ? "bg-card cursor-pointer hover:shadow" : "bg-muted/40 opacity-60"}`}
                  onClick={() =>
                    facility.isActive && setSelectedFacility(facility)
                  }
                >
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{facility.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {facility.location}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge variant="outline" className="text-[10px]">
                          {facility.type}
                        </Badge>
                        {facility.requiresApproval && (
                          <Badge variant="secondary" className="text-[10px]">
                            Approval req.
                          </Badge>
                        )}
                        {!facility.isActive && (
                          <Badge variant="destructive" className="text-[10px]">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>Capacity: {facility.capacity}</span>
                      {facility.sport && (
                        <>
                          <span>·</span>
                          <span>{facility.sport}</span>
                        </>
                      )}
                    </div>
                    {/* Availability dots */}
                    <div className="flex gap-1">
                      {facility.slots.map((s, i) => (
                        <span
                          key={i}
                          title={SLOT_LABELS[i]}
                          className={`w-4 h-4 rounded-sm ${s === "available" ? "bg-emerald-400/70" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {facility.slots.filter((s) => s === "available").length}{" "}
                      slots free today
                    </p>
                    <Button
                      size="sm"
                      variant={
                        facility.requiresApproval ? "outline" : "default"
                      }
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFacility(facility);
                      }}
                    >
                      {facility.requiresApproval
                        ? "Request Booking"
                        : "Book Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my" className="mt-6">
            {myBookings.length > 0 ? (
              <Card className="border-0 shadow-sm bg-card">
                <CardHeader className="pb-2 pt-4 px-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    My Upcoming Bookings
                  </p>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-2">
                  {myBookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
                    >
                      <div>
                        <span className="font-medium">{b.facility}</span>
                        <span className="text-muted-foreground ml-2">
                          {b.date} · {b.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{b.status}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <p className="text-sm text-muted-foreground">
                No upcoming bookings.
              </p>
            )}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="manage" className="mt-0">
              {/* <VenueManagePanel /> */}
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Select Slot Dialog */}
      <Dialog
        open={!!selectedFacility && !confirmOpen}
        onOpenChange={(o) => {
          if (!o) {
            setSelectedFacility(null);
            setSelectedSlot(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          {selectedFacility && (
            <>
              <DialogHeader>
                <DialogTitle>Book {selectedFacility.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2 text-sm">
                {selectedFacility.requiresApproval &&
                  (!isManager || bookingType === "personal") && (
                    <div className="flex items-start gap-2 bg-amber-50 text-amber-800 rounded p-3 text-xs">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        This venue requires admin approval. Booking will be{" "}
                        <strong>pending</strong> until reviewed within 2
                        business days.
                      </span>
                    </div>
                  )}

                {isManager &&
                  selectedFacility.requiresApproval &&
                  bookingType === "academic" && (
                    <div className="flex items-start gap-2 bg-emerald-50 text-emerald-800 rounded p-3 text-xs">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Academic Priority:</strong> Your request for
                        this venue will be auto-approved to support teaching
                        activities.
                      </span>
                    </div>
                  )}

                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                    Select Time Slot · Thu, Apr 3 2026
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedFacility.slots.map((state, i) => (
                      <button
                        key={i}
                        disabled={state === "booked"}
                        onClick={() =>
                          setSelectedSlot(i === selectedSlot ? null : i)
                        }
                        className={`py-2 rounded text-xs font-medium transition-colors ${
                          state === "booked"
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : selectedSlot === i
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 hover:bg-primary/10"
                        }`}
                      >
                        {SLOT_LABELS[i]}
                      </button>
                    ))}
                  </div>
                </div>

                {isManager && (
                  <div className="space-y-3 pt-3 border-t">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                        Booking Type
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            bookingType === "personal" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setBookingType("personal")}
                        >
                          Personal
                        </Button>
                        <Button
                          variant={
                            bookingType === "academic" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setBookingType("academic")}
                        >
                          Academic
                        </Button>
                      </div>
                    </div>
                    {bookingType === "academic" && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                        <Select
                          value={linkedCourse}
                          onValueChange={setLinkedCourse}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Linked course…" />
                          </SelectTrigger>
                          <SelectContent>
                            {MY_TEACHING_COURSES.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="recurring"
                            checked={isRecurring}
                            onCheckedChange={setIsRecurring}
                          />
                          <label htmlFor="recurring" className="text-sm">
                            Recurring booking
                          </label>
                        </div>
                        {isRecurring && (
                          <div className="flex gap-2 animate-in fade-in">
                            <Select defaultValue="Mon">
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Day" />
                              </SelectTrigger>
                              <SelectContent>
                                {["Mon", "Tue", "Wed", "Thu", "Fri"].map(
                                  (d) => (
                                    <SelectItem key={d} value={d}>
                                      {d}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                            <Input
                              type="date"
                              placeholder="End date"
                              className="flex-1"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 mt-2">
                    Rules
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFacility.rules}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFacility(null);
                    setSelectedSlot(null);
                  }}
                >
                  Cancel
                </Button>
                <Button disabled={selectedSlot === null} onClick={handleBook}>
                  {selectedFacility.requiresApproval &&
                  (!isManager || bookingType === "personal")
                    ? "Submit Request"
                    : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Screen */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedFacility?.requiresApproval &&
              (!isManager || bookingType === "personal")
                ? "Confirm Request"
                : "Confirm Booking"}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-2 py-2">
            <p>
              <span className="text-muted-foreground">Facility:</span>{" "}
              {selectedFacility?.name}
            </p>
            <p>
              <span className="text-muted-foreground">Date:</span> Thu, Apr 3
              2026
            </p>
            <p>
              <span className="text-muted-foreground">Time:</span>{" "}
              {selectedSlot !== null ? SLOT_LABELS[selectedSlot] : "—"} (1 hour)
            </p>
            {isManager && bookingType === "academic" && linkedCourse && (
              <p>
                <span className="text-muted-foreground">Course:</span>{" "}
                {MY_TEACHING_COURSES.find((c) => c.id === linkedCourse)?.code}
              </p>
            )}

            {selectedFacility?.requiresApproval &&
              (!isManager || bookingType === "personal") && (
                <p className="text-xs text-amber-700 bg-amber-50 rounded p-2">
                  Pending admin approval — you&apos;ll be notified within 2
                  business days.
                </p>
              )}
            {isManager &&
              bookingType === "academic" &&
              selectedFacility?.requiresApproval && (
                <p className="text-xs text-emerald-700 bg-emerald-50 rounded p-2">
                  Academic priority — immediately auto-confirmed.
                </p>
              )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Back
            </Button>
            <Button onClick={confirmBooking}>
              {selectedFacility?.requiresApproval &&
              (!isManager || bookingType === "personal")
                ? "Submit"
                : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
