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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/use-auth";
import { AlertTriangle, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Types ── */
type RoomStatus = "available" | "occupied";
type BuildingCat =
  | "academic"
  | "admin"
  | "facilities"
  | "sports"
  | "residential";
type MarkerType =
  | "Academic Building"
  | "Admin Office"
  | "Library"
  | "Sports"
  | "Dining"
  | "Parking"
  | "Services";

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
  category: BuildingCat;
  floors: number;
  hours: string;
  rooms: Room[];
  underMaintenance?: boolean;
  isManagerOffice?: boolean;
};

/* ── Mock data ── */
const CATEGORIES = ["All", "Academic", "Admin", "Facilities", "Sports"];

const INITIAL_BUILDINGS: Building[] = [
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
  {
    id: "blk-b",
    code: "B2",
    name: "Block B — Faculty Offices",
    category: "admin",
    floors: 4,
    hours: "08:30–17:30",
    underMaintenance: false,
    isManagerOffice: true,
    rooms: [
      {
        code: "B2-203",
        name: "Room 203 (Dr. Chen's Office)",
        floor: 2,
        type: "Office",
        capacity: 3,
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

// Manager: today's teaching rooms
const TODAYS_ROOMS = [
  {
    courseCode: "MTH 301",
    room: "Block A, LT1",
    time: "10:00–12:00",
    buildingId: "a4",
  },
  {
    courseCode: "MTH 301",
    room: "Block A, LT1",
    time: "14:00–16:00",
    buildingId: "a4",
  },
  {
    courseCode: "CS 105",
    room: "Lab 4, CS Block",
    time: "No class today",
    buildingId: null,
  },
];

const MARKER_TYPES: MarkerType[] = [
  "Academic Building",
  "Admin Office",
  "Library",
  "Sports",
  "Dining",
  "Parking",
  "Services",
];

/* ── Marker Form Sheet (admin) ── */
type MarkerFormProps = {
  building: Building | null;
  onSave: (data: Partial<Building> & { id: string }) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

function MarkerFormSheet({
  building,
  onSave,
  onDelete,
  onClose,
}: MarkerFormProps) {
  const isEdit = !!building;
  const [name, setName] = useState(building?.name ?? "");
  const [floors, setFloors] = useState(String(building?.floors ?? 1));
  const [hours, setHours] = useState(building?.hours ?? "08:00–18:00");
  const [maint, setMaint] = useState(building?.underMaintenance ?? false);
  const [markerType, setMarkerType] = useState<MarkerType>("Academic Building");
  const [desc, setDesc] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <Sheet open onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? `Edit: ${building!.name}` : "Add Marker"}
          </SheetTitle>
          <SheetDescription>
            Changes are reflected locally — students see them on next refresh.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-6">
          <div className="space-y-1.5">
            <Label htmlFor="mk-name">Name</Label>
            <Input
              id="mk-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Block A — Computing"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={markerType}
              onValueChange={(v) => setMarkerType(v as MarkerType)}
            >
              <SelectTrigger id="mk-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKER_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mk-desc">Description</Label>
            <Textarea
              id="mk-desc"
              rows={2}
              className="resize-none"
              placeholder="Optional description…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="mk-floors">Floors</Label>
              <Input
                id="mk-floors"
                type="number"
                min={1}
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mk-hours">Hours</Label>
              <Input
                id="mk-hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="07:00–22:00"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Under Maintenance</p>
              <p className="text-xs text-muted-foreground">
                Shows ⚠ badge to all users
              </p>
            </div>
            <Switch checked={maint} onCheckedChange={setMaint} id="mk-maint" />
          </div>
          {isEdit && (
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="font-medium text-foreground/50">Coordinates</p>
              <p>Set by clicking the map (read-only in this view)</p>
            </div>
          )}
        </div>
        <SheetFooter className="flex-col gap-2">
          {isEdit && !confirmDel && (
            <Button
              variant="outline"
              className="text-destructive border-destructive/40 w-full"
              onClick={() => setConfirmDel(true)}
              id="delete-marker-btn"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete Marker
            </Button>
          )}
          {isEdit && confirmDel && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 flex items-center gap-3">
              <p className="text-xs text-destructive flex-1">
                Delete this marker?
              </p>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  onDelete(building!.id);
                  onClose();
                }}
                id="confirm-delete-marker"
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmDel(false)}
              >
                No
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onSave({
                  id: building?.id ?? `mk-${Date.now()}`,
                  name,
                  floors: parseInt(floors) || 1,
                  hours,
                  underMaintenance: maint,
                });
                toast.success(isEdit ? "Marker updated." : "Marker added.");
                onClose();
              }}
              id="save-marker-btn"
            >
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ── Page ── */
export default function CampusMapPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeFloor, setActiveFloor] = useState(1);

  // Admin state
  const [editMode, setEditMode] = useState(false);
  const [markerFormFor, setMarkerFormFor] = useState<Building | "new" | null>(
    null,
  );

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

  const saveMarker = (data: Partial<Building> & { id: string }) => {
    setBuildings((prev) => {
      const exists = prev.find((b) => b.id === data.id);
      if (exists)
        return prev.map((b) => (b.id === data.id ? { ...b, ...data } : b));
      return [
        ...prev,
        {
          id: data.id,
          code: "NEW",
          name: data.name ?? "New Building",
          category: "academic",
          floors: data.floors ?? 1,
          hours: data.hours ?? "08:00–18:00",
          rooms: [],
          underMaintenance: data.underMaintenance,
        },
      ];
    });
  };

  const deleteMarker = (id: string) => {
    setBuildings((prev) => prev.filter((b) => b.id !== id));
    if (selectedBuilding?.id === id) setSelectedBuilding(null);
    toast.success("Marker deleted.");
  };

  const locateRoom = (buildingId: string | null) => {
    if (!buildingId) {
      toast.info("No room to locate today.");
      return;
    }
    const b = buildings.find((bd) => bd.id === buildingId);
    if (b) {
      setSelectedBuilding(b);
      setActiveFloor(1);
      setSelectedRoom(null);
    }
  };

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

        {/* Admin controls */}
        {isAdmin && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Edit Map</span>
            <Switch
              checked={editMode}
              onCheckedChange={setEditMode}
              id="edit-map-toggle"
            />
            {editMode && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMarkerFormFor("new")}
                id="add-marker-btn"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Marker
              </Button>
            )}
          </div>
        )}
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
                id="map-search"
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

          {/* Manager: Today's rooms panel */}
          {isManager && (
            <div className="px-3 pb-3">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2 pt-3 px-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Today&apos;s Teaching
                  </p>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2">
                  {TODAYS_ROOMS.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-medium">{r.courseCode}</p>
                        <p className="text-muted-foreground">
                          {r.room} · {r.time}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => locateRoom(r.buildingId)}
                        id={`locate-${i}`}
                      >
                        Locate →
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

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
                    if (editMode && isAdmin) {
                      setMarkerFormFor(b);
                      return;
                    }
                    setSelectedBuilding(b);
                    setActiveFloor(1);
                    setSelectedRoom(null);
                  }}
                  className={`w-full text-left p-3 rounded-md transition-colors group relative ${
                    selectedBuilding?.id === b.id
                      ? "bg-primary/10"
                      : b.isManagerOffice && isManager
                        ? "bg-amber-50 ring-1 ring-amber-300"
                        : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm flex items-center gap-1.5">
                      {b.isManagerOffice && isManager && (
                        <span className="text-[9px] bg-amber-400 text-white rounded px-1 py-0.5 font-bold shrink-0">
                          MY OFFICE
                        </span>
                      )}
                      {b.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {b.underMaintenance && (
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      )}
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {b.code}
                      </Badge>
                    </div>
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
                  {b.underMaintenance && (
                    <span className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      Under Maintenance
                    </span>
                  )}
                  {editMode && isAdmin && (
                    <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-muted rounded p-1">
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </span>
                  )}
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
                  Campus ·{" "}
                  {isAdmin ? "Admin View" : isManager ? "Advisor" : "Overview"}
                </p>
                <h1 className="text-3xl font-bold tracking-tight">
                  Campus Map
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isManager
                    ? "Your office is highlighted in the panel. Use Today's Teaching to locate classrooms."
                    : "Select a building or search for a room."}
                </p>
              </div>

              {editMode && isAdmin && (
                <div className="rounded-md bg-primary/5 border border-primary/20 px-4 py-2 text-xs text-primary flex items-center gap-2">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit mode — click any building in the list to edit its marker,
                  or use the Add Marker button.
                </div>
              )}

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
                  <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    {selectedBuilding.name}
                    {selectedBuilding.underMaintenance && (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-400 text-xs gap-1"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        Maintenance
                      </Badge>
                    )}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Open {selectedBuilding.hours}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && editMode && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setMarkerFormFor(selectedBuilding)}
                      id="edit-selected-marker"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit Marker
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedBuilding(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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

      {/* Admin: marker form sheet */}
      {markerFormFor !== null && isAdmin && (
        <MarkerFormSheet
          building={markerFormFor === "new" ? null : markerFormFor}
          onSave={saveMarker}
          onDelete={deleteMarker}
          onClose={() => setMarkerFormFor(null)}
        />
      )}
    </div>
  );
}
