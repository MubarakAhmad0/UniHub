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
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const CELL_H = 56;
const TODAY_IDX = 2;

const COURSE_COLORS: Record<string, string> = {
  "ARC 402": "bg-primary/15 border-l-2 border-primary text-primary",
  "MTH 301": "bg-blue-100/70 border-l-2 border-blue-400 text-blue-800",
  "HIS 215": "bg-emerald-100/70 border-l-2 border-emerald-500 text-emerald-800",
  "CS 105": "bg-orange-100/70 border-l-2 border-orange-400 text-orange-800",
};

type Slot = {
  id: string;
  code: string;
  day: number;
  startHour: number;
  endHour: number;
  room: string;
  lecturer: string;
};

const INITIAL_SLOTS: Slot[] = [
  {
    id: "1",
    code: "ARC 402",
    day: 0,
    startHour: 9,
    endHour: 11,
    room: "Studio C",
    lecturer: "Prof. Julian Vane",
  },
  {
    id: "2",
    code: "CS 105",
    day: 0,
    startHour: 14,
    endHour: 16,
    room: "Lab 4",
    lecturer: "Prof. Sarah Chen",
  },
  {
    id: "3",
    code: "MTH 301",
    day: 1,
    startHour: 10,
    endHour: 12,
    room: "Hall 9A",
    lecturer: "Prof. Elena Rossi",
  },
  {
    id: "4",
    code: "ARC 402",
    day: 2,
    startHour: 9,
    endHour: 11,
    room: "Studio C",
    lecturer: "Prof. Julian Vane",
  },
  {
    id: "5",
    code: "HIS 215",
    day: 2,
    startHour: 14,
    endHour: 17,
    room: "LT 2",
    lecturer: "Prof. Mark Sterling",
  },
  {
    id: "6",
    code: "MTH 301",
    day: 3,
    startHour: 10,
    endHour: 12,
    room: "Hall 9A",
    lecturer: "Prof. Elena Rossi",
  },
  {
    id: "7",
    code: "CS 105",
    day: 3,
    startHour: 14,
    endHour: 16,
    room: "Lab 4",
    lecturer: "Prof. Sarah Chen",
  },
  {
    id: "8",
    code: "HIS 215",
    day: 4,
    startHour: 11,
    endHour: 13,
    room: "LT 2",
    lecturer: "Prof. Mark Sterling",
  },
];

type Room = {
  id: string;
  code: string;
  building: string;
  floor: number;
  capacity: number;
  equipment: string[];
};

const INITIAL_ROOMS: Room[] = [
  {
    id: "r1",
    code: "Studio C",
    building: "Block 3",
    floor: 1,
    capacity: 40,
    equipment: ["Projector", "Drawing Tables"],
  },
  {
    id: "r2",
    code: "Lab 4",
    building: "CS Block",
    floor: 2,
    capacity: 30,
    equipment: ["PCs", "Projector"],
  },
  {
    id: "r3",
    code: "Hall 9A",
    building: "Main Building",
    floor: 1,
    capacity: 80,
    equipment: ["Projector", "Whiteboard"],
  },
  {
    id: "r4",
    code: "LT 2",
    building: "Arts Block",
    floor: 1,
    capacity: 120,
    equipment: ["Projector", "Mic"],
  },
];

const ALL_COURSES = [
  "ARC 402",
  "CS 105",
  "MTH 301",
  "HIS 215",
  "AI 210",
  "CS 401",
];
const ALL_LECTURERS = [
  "Prof. Julian Vane",
  "Prof. Sarah Chen",
  "Prof. Elena Rossi",
  "Prof. Mark Sterling",
  "Dr. Priya Nair",
];

const WEEK_LABELS: Record<number, string> = {
  "-1": "Mar 24–30, 2026",
  0: "Mar 31–Apr 6, 2026",
  1: "Apr 7–13, 2026",
};

/* ── Conflict detection helper ── */
function hasConflict(
  slots: Slot[],
  newSlot: Omit<Slot, "id">,
  excludeId?: string,
) {
  return slots.some((s) => {
    if (s.id === excludeId) return false;
    if (s.room !== newSlot.room || s.day !== newSlot.day) return false;
    return newSlot.startHour < s.endHour && newSlot.endHour > s.startHour;
  });
}

export function AdminTimetableView() {
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [editMode, setEditMode] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [roomsOpen, setRoomsOpen] = useState(false);

  // Slot form
  type SlotForm = {
    code: string;
    lecturer: string;
    room: string;
    day: string;
    startHour: string;
    endHour: string;
  };
  const emptyForm: SlotForm = {
    code: "",
    lecturer: "",
    room: "",
    day: "Monday",
    startHour: "09:00",
    endHour: "11:00",
  };
  const [slotForm, setSlotForm] = useState<SlotForm>(emptyForm);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [slotOpen, setSlotOpen] = useState(false);

  // Rooms form
  const [newRoomCode, setNewRoomCode] = useState("");
  const [newRoomBldg, setNewRoomBldg] = useState("");
  const [newRoomCap, setNewRoomCap] = useState("30");

  const weekLabel = WEEK_LABELS[weekOffset] ?? `Week ${weekOffset}`;

  const openNewSlot = (day: number, hour: number) => {
    setEditingSlot(null);
    setSlotForm({
      ...emptyForm,
      day: DAYS[day],
      startHour: `${String(hour).padStart(2, "0")}:00`,
      endHour: `${String(Math.min(hour + 2, 20)).padStart(2, "0")}:00`,
    });
    setSlotOpen(true);
  };

  const openEditSlot = (s: Slot) => {
    setEditingSlot(s);
    setSlotForm({
      code: s.code,
      lecturer: s.lecturer,
      room: s.room,
      day: DAYS[s.day],
      startHour: `${String(s.startHour).padStart(2, "0")}:00`,
      endHour: `${String(s.endHour).padStart(2, "0")}:00`,
    });
    setSlotOpen(true);
  };

  const saveSlot = () => {
    const dayIdx = DAYS.indexOf(slotForm.day.slice(0, 3));
    const startH = parseInt(slotForm.startHour.split(":")[0]);
    const endH = parseInt(slotForm.endHour.split(":")[0]);
    const candidate = {
      code: slotForm.code,
      day: dayIdx,
      startHour: startH,
      endHour: endH,
      room: slotForm.room,
      lecturer: slotForm.lecturer,
    };
    const conflict = hasConflict(slots, candidate, editingSlot?.id);
    if (conflict) {
      toast.error(
        `⚠ Room conflict detected for ${slotForm.room} at this time.`,
      );
      return;
    }

    if (editingSlot) {
      setSlots((prev) =>
        prev.map((s) => (s.id === editingSlot.id ? { ...s, ...candidate } : s)),
      );
    } else {
      setSlots((prev) => [...prev, { id: `s-${Date.now()}`, ...candidate }]);
    }
    toast.success("Slot saved — students will see this on next refresh.");
    setSlotOpen(false);
  };

  const deleteSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    toast.success("Slot deleted.");
  };

  const addRoom = () => {
    if (!newRoomCode.trim() || !newRoomBldg.trim()) {
      toast.error("Code and building required.");
      return;
    }
    setRooms((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        code: newRoomCode,
        building: newRoomBldg,
        floor: 1,
        capacity: parseInt(newRoomCap) || 30,
        equipment: [],
      },
    ]);
    toast.success("Room added.");
    setNewRoomCode("");
    setNewRoomBldg("");
    setNewRoomCap("30");
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
              <BreadcrumbPage>Timetable (Admin)</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Edit Mode</span>
          <Switch
            checked={editMode}
            onCheckedChange={setEditMode}
            id="edit-mode-switch"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRoomsOpen(true)}
            id="manage-rooms-btn"
          >
            Manage Rooms
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin · Fall 2024
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((w) => w - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {weekLabel}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((w) => w + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(0)}
            >
              Today
            </Button>
          </div>
        </div>

        {editMode && (
          <div className="rounded-md bg-primary/5 border border-primary/20 px-4 py-2 text-xs text-primary flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5" />
            Edit mode active — click empty slots to add, existing slots to edit.
          </div>
        )}

        <Card className="border-0 shadow-sm overflow-auto">
          <CardContent className="p-0">
            <div className="flex">
              {/* Time axis */}
              <div className="flex flex-col shrink-0 w-14 pt-10 border-r border-border/40">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="text-[11px] text-muted-foreground text-right pr-2 shrink-0"
                    style={{ height: CELL_H }}
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((day, dayIdx) => {
                const isToday = dayIdx === TODAY_IDX && weekOffset === 0;
                const daySlots = slots.filter((s) => s.day === dayIdx);
                return (
                  <div
                    key={day}
                    className="flex-1 min-w-[120px] border-r border-border/40 last:border-r-0"
                  >
                    <div
                      className={`h-10 flex flex-col items-center justify-center text-xs font-semibold uppercase tracking-wider ${isToday ? "bg-primary text-primary-foreground rounded-t" : "text-muted-foreground"}`}
                    >
                      {day}
                      {isToday && (
                        <span className="text-[9px] font-normal opacity-80">
                          Today
                        </span>
                      )}
                    </div>
                    <div
                      className="relative"
                      style={{ height: CELL_H * HOURS.length }}
                    >
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          className={`absolute w-full border-t border-border/25 ${editMode ? "hover:bg-muted/30 cursor-cell" : ""}`}
                          style={{ top: (h - 8) * CELL_H, height: CELL_H }}
                          onClick={() => {
                            if (
                              editMode &&
                              !daySlots.some(
                                (s) => s.startHour <= h && s.endHour > h,
                              )
                            )
                              openNewSlot(dayIdx, h);
                          }}
                        />
                      ))}
                      {isToday && (
                        <div
                          className="absolute w-full flex items-center z-10"
                          style={{ top: (14.75 - 8) * CELL_H }}
                        >
                          <span className="w-2 h-2 rounded-full bg-destructive shrink-0 -ml-1" />
                          <div className="flex-1 border-t border-destructive" />
                        </div>
                      )}
                      {daySlots.map((s) => {
                        const conflict = hasConflict(slots, s, s.id);
                        return (
                          <div
                            key={s.id}
                            className={`absolute left-1 right-1 rounded p-1.5 text-[11px] group ${COURSE_COLORS[s.code] ?? "bg-muted border-l-2 border-muted-foreground text-muted-foreground"}`}
                            style={{
                              top: (s.startHour - 8) * CELL_H + 2,
                              height: (s.endHour - s.startHour) * CELL_H - 4,
                            }}
                          >
                            <p className="font-bold leading-tight">{s.code}</p>
                            <p className="text-[10px] opacity-80 truncate">
                              {s.room}
                            </p>
                            {conflict && (
                              <span className="flex items-center gap-0.5 text-[9px] text-destructive font-semibold mt-0.5">
                                <AlertTriangle className="h-2.5 w-2.5" />
                                Room conflict
                              </span>
                            )}
                            {editMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditSlot(s);
                                }}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 rounded p-0.5"
                                id={`edit-slot-${s.id}`}
                              >
                                <Pencil className="h-2.5 w-2.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit slot sheet */}
      <Sheet open={slotOpen} onOpenChange={(v) => !v && setSlotOpen(false)}>
        <SheetContent className="sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>
              {editingSlot ? "Edit" : "New"} Schedule Slot
            </SheetTitle>
            <SheetDescription>
              Configure the timetable slot. A conflict warning will show if the
              room is double-booked.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-1.5">
              <Label>Course</Label>
              <Select
                value={slotForm.code}
                onValueChange={(v) => setSlotForm((f) => ({ ...f, code: v }))}
              >
                <SelectTrigger id="slot-course">
                  <SelectValue placeholder="Select course…" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_COURSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Lecturer</Label>
              <Select
                value={slotForm.lecturer}
                onValueChange={(v) =>
                  setSlotForm((f) => ({ ...f, lecturer: v }))
                }
              >
                <SelectTrigger id="slot-lecturer">
                  <SelectValue placeholder="Select lecturer…" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_LECTURERS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Room</Label>
              <Select
                value={slotForm.room}
                onValueChange={(v) => setSlotForm((f) => ({ ...f, room: v }))}
              >
                <SelectTrigger id="slot-room">
                  <SelectValue placeholder="Select room…" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.code}>
                      {r.code} — {r.building} (cap {r.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Day</Label>
              <Select
                value={slotForm.day}
                onValueChange={(v) => setSlotForm((f) => ({ ...f, day: v }))}
              >
                <SelectTrigger id="slot-day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                    (d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="slot-start">Start</Label>
                <Input
                  id="slot-start"
                  type="time"
                  value={slotForm.startHour}
                  onChange={(e) =>
                    setSlotForm((f) => ({ ...f, startHour: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slot-end">End</Label>
                <Input
                  id="slot-end"
                  type="time"
                  value={slotForm.endHour}
                  onChange={(e) =>
                    setSlotForm((f) => ({ ...f, endHour: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col gap-2">
            {editingSlot && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteSlot(editingSlot.id);
                  setSlotOpen(false);
                }}
                id="delete-slot-btn"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete Slot
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSlotOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={saveSlot} id="save-slot-btn">
                Save
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Manage Rooms sheet */}
      <Sheet open={roomsOpen} onOpenChange={(v) => !v && setRoomsOpen(false)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Manage Rooms</SheetTitle>
            <SheetDescription>{rooms.length} rooms on record</SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            {/* Add room inline form */}
            <div className="p-3 rounded-lg border bg-muted/20 space-y-3">
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add Room
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Code, e.g. LT3"
                  value={newRoomCode}
                  onChange={(e) => setNewRoomCode(e.target.value)}
                  id="room-code"
                />
                <Input
                  placeholder="Building"
                  value={newRoomBldg}
                  onChange={(e) => setNewRoomBldg(e.target.value)}
                  id="room-building"
                />
                <Input
                  placeholder="Capacity"
                  type="number"
                  value={newRoomCap}
                  onChange={(e) => setNewRoomCap(e.target.value)}
                  id="room-capacity"
                />
              </div>
              <Button size="sm" onClick={addRoom} id="add-room-btn">
                Add Room
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Code</TableHead>
                    <TableHead>Building</TableHead>
                    <TableHead className="text-center">Cap</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-semibold text-sm">
                        {r.code}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.building}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {r.capacity}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {r.equipment.map((e) => (
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
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            setRooms((prev) =>
                              prev.filter((rm) => rm.id !== r.id),
                            );
                            toast.success("Room removed.");
                          }}
                          id={`delete-room-${r.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
