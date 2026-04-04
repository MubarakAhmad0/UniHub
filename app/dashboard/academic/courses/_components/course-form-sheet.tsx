"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import type { Course, CourseStatus } from "./course-card";

const FACULTIES = [
  "Computer Science",
  "Life Sciences",
  "Humanities",
  "Design",
  "Business",
  "Engineering",
  "Architecture",
  "Mathematics",
];

const LECTURERS = [
  "Prof. Elena Rossi",
  "Prof. James Vane",
  "Prof. Aisha Rahman",
  "Dr. Kim Seok-jin",
  "Dr. Priya Nair",
];

const EXISTING_CODES = [
  "CS 105",
  "CS 401",
  "CS 601",
  "MTH 301",
  "MTH 305",
  "BIO 201",
  "BIO 320",
  "CHM 102",
  "LIT 301",
  "LIT 440",
  "PHY 150",
  "DES 101",
  "DES 315",
  "AI 210",
];

type CourseFormSheetProps = {
  open: boolean;
  onClose: () => void;
  editingCourse?: Course | null;
  onSave: (course: Course) => void;
};

type FormState = {
  code: string;
  title: string;
  faculty: string;
  level: "Undergraduate" | "Graduate";
  credits: string;
  description: string;
  prerequisites: string[];
  seats: string;
  status: CourseStatus;
  lecturer: string;
};

const DEFAULT_FORM: FormState = {
  code: "",
  title: "",
  faculty: "Computer Science",
  level: "Undergraduate",
  credits: "3",
  description: "",
  prerequisites: [],
  seats: "30",
  status: "Open",
  lecturer: LECTURERS[0],
};

export function CourseFormSheet({
  open,
  onClose,
  editingCourse,
  onSave,
}: CourseFormSheetProps) {
  const [form, setForm] = useState<FormState>(() =>
    editingCourse
      ? {
          code: editingCourse.code,
          title: editingCourse.title,
          faculty: editingCourse.faculty,
          level: editingCourse.level,
          credits: editingCourse.credits.toString(),
          description: editingCourse.description,
          prerequisites: editingCourse.prerequisites,
          seats: editingCourse.seats.total.toString(),
          status: editingCourse.status,
          lecturer: editingCourse.lecturer,
        }
      : DEFAULT_FORM,
  );

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const togglePrereq = (code: string) => {
    setForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(code)
        ? prev.prerequisites.filter((p) => p !== code)
        : [...prev.prerequisites, code],
    }));
  };

  const handleSubmit = () => {
    if (!form.code.trim() || !form.title.trim()) {
      toast.error("Course code and title are required.");
      return;
    }

    const totalSeats = parseInt(form.seats) || 30;
    const credits = parseInt(form.credits) || 3;

    const saved: Course = {
      id: editingCourse?.id ?? Date.now(),
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      description: form.description.trim(),
      faculty: form.faculty,
      level: form.level,
      credits,
      seats: {
        total: totalSeats,
        available: editingCourse?.seats.available ?? totalSeats,
      },
      enrolledCount: editingCourse?.enrolledCount ?? 0,
      prerequisites: form.prerequisites,
      hasPrerequisites: true,
      status: form.status,
      lecturer: form.lecturer,
    };

    onSave(saved);
    toast.success(
      editingCourse ? "Course updated." : "Course added to catalog.",
    );
    setForm(DEFAULT_FORM);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {editingCourse ? "Edit Course" : "Add Course"}
          </SheetTitle>
          <SheetDescription>
            {editingCourse
              ? "Update the course details below."
              : "Add a new course to the catalog for the upcoming semester."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {/* Code + Credits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-code">Course Code *</Label>
              <Input
                id="c-code"
                placeholder="CS 601"
                value={form.code}
                onChange={(e) => set("code", e.target.value)}
                className="uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-credits">Credits *</Label>
              <Input
                id="c-credits"
                type="number"
                min={1}
                max={6}
                value={form.credits}
                onChange={(e) => set("credits", e.target.value)}
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="c-title">Title *</Label>
            <Input
              id="c-title"
              placeholder="Course title…"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          {/* Faculty + Level */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-faculty">Faculty</Label>
              <Select
                value={form.faculty}
                onValueChange={(v) => set("faculty", v)}
              >
                <SelectTrigger id="c-faculty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FACULTIES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-level">Level</Label>
              <Select
                value={form.level}
                onValueChange={(v) =>
                  set("level", v as "Undergraduate" | "Graduate")
                }
              >
                <SelectTrigger id="c-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lecturer */}
          <div className="space-y-1.5">
            <Label htmlFor="c-lecturer">Lecturer</Label>
            <Select
              value={form.lecturer}
              onValueChange={(v) => set("lecturer", v)}
            >
              <SelectTrigger id="c-lecturer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LECTURERS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="c-desc">Description</Label>
            <Textarea
              id="c-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Course overview…"
              className="resize-none min-h-24"
            />
          </div>

          {/* Seats + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-seats">Total Seats</Label>
              <Input
                id="c-seats"
                type="number"
                min={1}
                value={form.seats}
                onChange={(e) => set("seats", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as CourseStatus)}
              >
                <SelectTrigger id="c-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                  <SelectItem value="Full">Full</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-1.5">
            <Label>
              Prerequisites{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-md border bg-muted/20 min-h-[48px]">
              {EXISTING_CODES.filter((c) => c !== form.code).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => togglePrereq(code)}
                  className={`text-xs px-2 py-0.5 rounded font-mono font-medium transition-colors ${
                    form.prerequisites.includes(code)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70 text-muted-foreground"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-8 flex gap-2 flex-col sm:flex-row">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="w-full" onClick={handleSubmit}>
            {editingCourse ? "Save Changes" : "Add Course"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
