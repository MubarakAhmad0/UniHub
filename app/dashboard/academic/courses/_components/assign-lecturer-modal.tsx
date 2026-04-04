"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useState } from "react";
import { toast } from "sonner";
import type { Course } from "./course-card";

const LECTURERS = [
  "Prof. Elena Rossi",
  "Prof. James Vane",
  "Prof. Aisha Rahman",
  "Dr. Kim Seok-jin",
  "Dr. Priya Nair",
];

type AssignLecturerModalProps = {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  onAssign: (courseId: number, lecturer: string) => void;
};

export function AssignLecturerModal({
  course,
  open,
  onClose,
  onAssign,
}: AssignLecturerModalProps) {
  const [selected, setSelected] = useState(course?.lecturer ?? LECTURERS[0]);

  // Keep picker in sync when course changes
  if (course && selected !== course.lecturer && !LECTURERS.includes(selected)) {
    setSelected(course.lecturer);
  }

  const handleSave = () => {
    if (!course) return;
    onAssign(course.id, selected);
    toast.success(`Lecturer assigned to ${course.code}.`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign Lecturer</DialogTitle>
          <DialogDescription>
            {course
              ? `Select a lecturer for ${course.code} · ${course.title}`
              : "Select a lecturer"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger id="assign-lecturer-select">
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
