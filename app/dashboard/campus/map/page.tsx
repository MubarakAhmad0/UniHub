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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, X } from "lucide-react";
import { useState } from "react";

/* ── Types & mock data ────────────────────────────────────────────── */

type RoomStatus = "available" | "occupied";
type Room = {
  code: string;
  name: string;
  floor: number;
  type: string;
  capacity: number;
  hasProjector: boolean;
  hasAC: boolean;
  status: RoomStatus;
  occupiedUntil?: string;
};
type Building = {
  id: string;
  code: string;
  name: string;
  category: "academic" | "admin" | "facilities" | "sports" | "residential";
  floors: number;
  hours: string;
  rooms: Room[];
};

const CATEGORIES = ["All", "Academic", "Admin", "Facilities", "Sports"];

const buildings: Building[] = [
  {
    id: "a4",
    code: "A4",
    name: "Engineering Block A",
    category: "academic",
    floors: 6,
    hours: "07:00–22:00",
    rooms: [
      {
        code: "A4-101",
        name: "Lecture Hall 1",
        floor: 1,
        type: "Lecture Hall",
        capacity: 120,
        hasProjector: true,
        hasAC: true,
        status: "occupied",
        occupiedUntil: "15:00",
      },
      {
        code: "A4-201",
        name: "Seminar Room 1",
        floor: 2,
        type: "Seminar",
        capacity: 40,
        hasProjector: true,
        hasAC: true,
        status: "available",
      },
      {
        code: "A4-302",
        name: "Computer Lab 3",
        floor: 3,
        type: "Lab",
        capacity: 30,
        hasProjector: true,
        hasAC: true,
        status: "occupied",
        occupiedUntil: "16:00",
      },
    ],
  },
  {
    id: "d1",
    code: "D1",
    name: "Faculty of Design",
    category: "academic",
    floors: 4,
    hours: "07:00–22:00",
    rooms: [
      {
        code: "D1-101",
        name: "Studio C",
        floor: 1,
        type: "Studio",
        capacity: 35,
        hasProjector: false,
        hasAC: true,
        status: "occupied",
        occupiedUntil: "11:00",
      },
      {
        code: "D1-201",
        name: "Gallery Space",
        floor: 2,
        type: "Studio",
        capacity: 60,
        hasProjector: true,
        hasAC: true,
        status: "available",
      },
    ],
  },
  {
    id: "lib",
    code: "LIB",
    name: "Main Library",
    category: "facilities",
    floors: 3,
    hours: "08:00–22:00",
    rooms: [
      {
        code: "LIB-201",
        name: "Discussion Room 1",
        floor: 2,
        type: "Discussion Room",
        capacity: 6,
        hasProjector: false,
        hasAC: true,
        status: "available",
      },
      {
        code: "LIB-202",
        name: "Discussion Room 2",
        floor: 2,
        type: "Discussion Room",
        capacity: 6,
        hasProjector: true,
        hasAC: true,
        status: "occupied",
        occupiedUntil: "15:00",
      },
      {
        code: "LIB-301",
        name: "Silent Study Zone",
        floor: 3,
        type: "Study Area",
        capacity: 40,
        hasProjector: false,
        hasAC: true,
        status: "available",
      },
    ],
  },
  {
    id: "sc",
    code: "SC",
    name: "Sports Complex",
    category: "sports",
    floors: 2,
    hours: "07:00–22:00",
    rooms: [
      {
        code: "SC-101",
        name: "Basketball Court A",
        floor: 1,
        type: "Court",
        capacity: 20,
        hasProjector: false,
        hasAC: false,
        status: "available",
      },
      {
        code: "SC-102",
        name: "Badminton Court 1",
        floor: 1,
        type: "Court",
        capacity: 4,
        hasProjector: false,
        hasAC: false,
        status: "occupied",
        occupiedUntil: "16:00",
      },
    ],
  },
  {
    id: "adm",
    code: "ADM",
    name: "Administration Block",
    category: "admin",
    floors: 5,
    hours: "08:30–17:30",
    rooms: [
      {
        code: "ADM-101",
        name: "Registry Office",
        floor: 1,
        type: "Office",
        capacity: 5,
        hasProjector: false,
        hasAC: true,
        status: "available",
      },
      {
        code: "ADM-201",
        name: "Finance Office",
        floor: 2,
        type: "Office",
        capacity: 5,
        hasProjector: false,
        hasAC: true,
        status: "available",
      },
    ],
  },
];

const POIS = [
  { name: "Cafeteria", icon: "🍽️", location: "Student Centre, G" },
  { name: "Library", icon: "📚", location: "LIB, All floors" },
  { name: "Clinic", icon: "🏥", location: "SSC Block, Level 1" },
  { name: "ATM", icon: "🏧", location: "Main Entrance, G" },
  { name: "Prayer Room", icon: "🕌", location: "Multiple blocks, Level 1" },
  { name: "Parking", icon: "🅿️", location: "Basement, Block A" },
];

const catBadgeColor: Record<string, string> = {
  academic: "bg-primary/10 text-primary",
  admin: "bg-secondary/60 text-secondary-foreground",
  facilities: "bg-emerald-100 text-emerald-800",
  sports: "bg-orange-100 text-orange-800",
  residential: "bg-purple-100 text-purple-800",
};

export default function CampusMapPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeFloor, setActiveFloor] = useState(1);

  const filtered = buildings.filter((b) => {
    const matchCat =
      activeCategory === "All" || b.category === activeCategory.toLowerCase();
    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const floorRooms =
    selectedBuilding?.rooms.filter((r) => r.floor === activeFloor) ?? [];

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
              <BreadcrumbPage>Campus Map</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <aside className="w-72 shrink-0 border-r bg-muted/30 flex flex-col">
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms, buildings…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <ScrollArea className="flex-1 px-3 pb-4">
            <div className="space-y-1.5">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No buildings found
                </p>
              )}
              {filtered.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBuilding(b);
                    setActiveFloor(1);
                    setSelectedRoom(null);
                  }}
                  className={`w-full text-left p-3 rounded-md transition-colors ${selectedBuilding?.id === b.id ? "bg-primary/10" : "hover:bg-muted"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">{b.name}</span>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {b.code}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${catBadgeColor[b.category]}`}
                    >
                      {b.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {b.floors} floors · {b.hours}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* RIGHT PANEL */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {!selectedBuilding ? (
            <>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Campus · Overview
                </p>
                <h1 className="text-3xl font-bold tracking-tight">
                  Campus Map
                </h1>
                <p className="text-sm text-muted-foreground">
                  Select a building or search for a room.
                </p>
              </div>

              {/* Schematic placeholder */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0 h-64 flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Interactive campus map — coming soon
                  </p>
                </CardContent>
              </Card>

              {/* POI quick access */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Key Facilities
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {POIS.map((poi) => (
                    <Card
                      key={poi.name}
                      className="border-0 shadow-sm text-center py-4 bg-card"
                    >
                      <p className="text-2xl">{poi.icon}</p>
                      <p className="text-xs font-semibold mt-1">{poi.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {poi.location}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Building · {selectedBuilding.code}
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {selectedBuilding.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Open {selectedBuilding.hours}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedBuilding(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Floor tabs */}
              <div className="flex gap-2">
                {Array.from(
                  { length: selectedBuilding.floors },
                  (_, i) => i + 1,
                ).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFloor(f)}
                    className={`text-xs px-3 py-1 rounded font-medium transition-colors ${activeFloor === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                  >
                    Level {f}
                  </button>
                ))}
              </div>

              {/* Room grid */}
              {floorRooms.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No rooms listed for this floor.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {floorRooms.map((room) => (
                    <Card
                      key={room.code}
                      className="border-0 shadow-sm bg-card cursor-pointer hover:shadow transition-shadow"
                      onClick={() => setSelectedRoom(room)}
                    >
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                              {room.code}
                            </p>
                            <p className="font-semibold text-sm">{room.name}</p>
                          </div>
                          <Badge
                            variant={
                              room.status === "available"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-[10px] shrink-0"
                          >
                            {room.status === "available"
                              ? "Available"
                              : `Until ${room.occupiedUntil}`}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                          <span>{room.type}</span>
                          <span>·</span>
                          <span>Cap. {room.capacity}</span>
                          {room.hasProjector && (
                            <>
                              <span>·</span>
                              <span>Projector</span>
                            </>
                          )}
                          {room.hasAC && (
                            <>
                              <span>·</span>
                              <span>AC</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Room detail sheet */}
      <Sheet open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <SheetContent className="sm:max-w-sm">
          {selectedRoom && (
            <>
              <SheetHeader>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {selectedRoom.code}
                </p>
                <SheetTitle>{selectedRoom.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedRoom.status === "available"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {selectedRoom.status === "available"
                      ? "Available now"
                      : `Occupied until ${selectedRoom.occupiedUntil}`}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Type
                    </p>
                    <p>{selectedRoom.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Capacity
                    </p>
                    <p>{selectedRoom.capacity} people</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Floor
                    </p>
                    <p>Level {selectedRoom.floor}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Features
                    </p>
                    <p>
                      {[
                        selectedRoom.hasProjector && "Projector",
                        selectedRoom.hasAC && "AC",
                      ]
                        .filter(Boolean)
                        .join(", ") || "–"}
                    </p>
                  </div>
                </div>
                {selectedRoom.status === "available" && (
                  <Button className="w-full mt-4" asChild>
                    <a href="/dashboard/campus/library">Book this room</a>
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
