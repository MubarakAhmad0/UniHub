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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import type { Announcement, AnnouncementType } from "./announcement-card";

// Mock teaching courses — replaced with real data when API is wired
const MY_TEACHING_COURSES = [
  { id: "mth-301", code: "MTH 301", name: "Advanced Calculus II" },
  { id: "cs-105", code: "CS 105", name: "Data Structures" },
];

const MANAGER_TYPES: { value: AnnouncementType; label: string }[] = [
  { value: "faculty", label: "Faculty Update" },
  { value: "event", label: "Event" },
];

const ADMIN_TYPES: { value: AnnouncementType; label: string }[] = [
  { value: "system", label: "System" },
  { value: "faculty", label: "Faculty Update" },
  { value: "event", label: "Event" },
];

const AUDIENCE_OPTIONS = [
  "University-wide",
  "Faculty of Computing",
  "Faculty of Architecture",
  "Faculty of Business",
  "Year 1 Students",
  "Year 2 Students",
  "Year 3 Students",
  "Postgraduate Students",
];

type PostAnnouncementSheetProps = {
  open: boolean;
  onClose: () => void;
  role: "manager" | "admin";
  editingItem?: Announcement | null;
  onSave: (item: Announcement) => void;
};

type FormState = {
  title: string;
  type: AnnouncementType;
  courseCode: string;
  audience: string;
  priority: boolean;
  pin: boolean;
  body: string;
};

const DEFAULT_FORM: FormState = {
  title: "",
  type: "faculty",
  courseCode: "",
  audience: "University-wide",
  priority: false,
  pin: false,
  body: "",
};

export function PostAnnouncementSheet({
  open,
  onClose,
  role,
  editingItem,
  onSave,
}: PostAnnouncementSheetProps) {
  const isAdmin = role === "admin";
  const typeOptions = isAdmin ? ADMIN_TYPES : MANAGER_TYPES;

  const [form, setForm] = useState<FormState>(() => {
    if (editingItem) {
      return {
        title: editingItem.title,
        type: editingItem.type,
        courseCode: editingItem.courseCode ?? "",
        audience: editingItem.audience ?? "University-wide",
        priority: editingItem.priority === "high",
        pin: editingItem.isPinned,
        body: editingItem.body,
      };
    }
    return DEFAULT_FORM;
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required.");
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newItem: Announcement = {
      id: editingItem?.id ?? Date.now(),
      date: editingItem?.date ?? dateStr,
      title: form.title,
      body: form.body,
      type: form.type,
      priority: form.priority ? "high" : "normal",
      read: editingItem?.read ?? false,
      author: isAdmin ? "Admin" : "Prof. [Manager Name]",
      isPinned: form.pin,
      status: "published",
      audience: form.audience,
      courseCode: form.courseCode || undefined,
    };

    onSave(newItem);
    toast.success(
      editingItem ? "Announcement updated." : "Announcement posted.",
    );
    setForm(DEFAULT_FORM);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {editingItem ? "Edit Announcement" : "New Announcement"}
          </SheetTitle>
          <SheetDescription>
            {isAdmin
              ? "Post to any channel. Published immediately unless scheduled."
              : "Post a faculty update or event announcement for your courses."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="ann-title">Title</Label>
            <Input
              id="ann-title"
              placeholder="Announcement title…"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label htmlFor="ann-type">Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => set("type", v as AnnouncementType)}
            >
              <SelectTrigger id="ann-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course selector — manager only */}
          {!isAdmin && (
            <div className="space-y-1.5">
              <Label htmlFor="ann-course">
                Linked Course{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Select
                value={form.courseCode}
                onValueChange={(v) => set("courseCode", v)}
              >
                <SelectTrigger id="ann-course">
                  <SelectValue placeholder="Select a course…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (general faculty)</SelectItem>
                  {MY_TEACHING_COURSES.map((c) => (
                    <SelectItem key={c.id} value={c.code}>
                      {c.code} · {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Audience — admin only */}
          {isAdmin && (
            <div className="space-y-1.5">
              <Label htmlFor="ann-audience">Audience</Label>
              <Select
                value={form.audience}
                onValueChange={(v) => set("audience", v)}
              >
                <SelectTrigger id="ann-audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Body */}
          <div className="space-y-1.5">
            <Label htmlFor="ann-body">Message</Label>
            <Textarea
              id="ann-body"
              placeholder="Write the announcement body…"
              className="min-h-32 resize-none"
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
            />
          </div>

          {/* Priority toggle */}
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">High Priority</p>
              <p className="text-xs text-muted-foreground">
                Shows a red Priority badge on the card
              </p>
            </div>
            <Switch
              id="ann-priority"
              checked={form.priority}
              onCheckedChange={(v) => set("priority", v)}
            />
          </div>

          {/* Pin toggle — admin only */}
          {isAdmin && (
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Pin Announcement</p>
                <p className="text-xs text-muted-foreground">
                  Pinned posts appear at the top of each tab
                </p>
              </div>
              <Switch
                id="ann-pin"
                checked={form.pin}
                onCheckedChange={(v) => set("pin", v)}
              />
            </div>
          )}
        </div>

        <SheetFooter className="mt-8 flex gap-2 flex-col sm:flex-row">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="w-full" onClick={handleSubmit}>
            {editingItem ? "Save Changes" : "Post Announcement"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
