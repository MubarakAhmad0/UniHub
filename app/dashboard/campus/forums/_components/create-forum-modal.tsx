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

export type ForumType = "course" | "university" | "study_group" | "interest";

export type Forum = {
  id: string;
  name: string;
  description: string;
  type: ForumType;
  unread: number;
  threads: number;
  icon: string;
  status?: "active" | "archived" | "pending";
};

const EMOJI_SUGGESTIONS = [
  "📘",
  "📐",
  "💻",
  "🎨",
  "🏫",
  "❓",
  "👥",
  "📷",
  "⚗️",
  "🎵",
  "🌍",
  "💡",
];

const MANAGER_TYPE_OPTIONS: { value: ForumType; label: string }[] = [
  { value: "course", label: "Course Forum" },
];

const ADMIN_TYPE_OPTIONS: { value: ForumType; label: string }[] = [
  { value: "course", label: "Course Forum" },
  { value: "university", label: "University Board" },
  { value: "study_group", label: "Study Group" },
  { value: "interest", label: "Interest Group" },
];

const MY_TEACHING_COURSES = [
  { code: "MTH 301", name: "Advanced Calculus II" },
  { code: "CS 105", name: "Data Structures" },
];

type CreateForumModalProps = {
  open: boolean;
  onClose: () => void;
  role: "student" | "manager" | "admin";
  onSave: (forum: Forum) => void;
};

export function CreateForumModal({
  open,
  onClose,
  role,
  onSave,
}: CreateForumModalProps) {
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isStudent = role === "student";

  const typeOptions = isAdmin
    ? ADMIN_TYPE_OPTIONS
    : isManager
      ? MANAGER_TYPE_OPTIONS
      : [
          { value: "study_group" as ForumType, label: "Study Group" },
          { value: "interest" as ForumType, label: "Interest Group" },
        ];

  const [name, setName] = useState("");
  const [type, setType] = useState<ForumType>(typeOptions[0].value);
  const [icon, setIcon] = useState("💬");
  const [description, setDescription] = useState("");
  const [linkedCourse, setLinkedCourse] = useState("");

  const reset = () => {
    setName("");
    setType(typeOptions[0].value);
    setIcon("💬");
    setDescription("");
    setLinkedCourse("");
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a forum name.");
      return;
    }

    const newForum: Forum = {
      id: `f-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || type,
      type,
      icon,
      unread: 0,
      threads: 0,
      status: isStudent ? "pending" : "active",
    };

    onSave(newForum);

    if (isStudent) {
      toast.success(
        "Room request submitted — admin will review it before it goes live.",
      );
    } else {
      toast.success(`Forum "${newForum.name}" created.`);
    }

    reset();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {isStudent
              ? "Apply to Create a Room"
              : isAdmin
                ? "Create Forum"
                : "Create Course Forum"}
          </SheetTitle>
          <SheetDescription>
            {isStudent
              ? "Your request will be reviewed by an admin before the room is visible."
              : isManager
                ? "Create a new forum linked to one of your teaching courses."
                : "Create a new forum visible across the platform."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {/* Icon picker */}
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setIcon(e)}
                  className={`w-9 h-9 rounded-md text-lg flex items-center justify-center transition-colors ${
                    icon === e
                      ? "bg-primary/15 ring-1 ring-primary"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="forum-name">Forum Name</Label>
            <Input
              id="forum-name"
              placeholder='e.g. "CS 301 Study Group"'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Type — admin sees all options; manager only sees "course"; student sees study/interest */}
          {(isAdmin || isStudent) && (
            <div className="space-y-1.5">
              <Label htmlFor="forum-type">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as ForumType)}
              >
                <SelectTrigger id="forum-type">
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
          )}

          {/* Linked course — manager only */}
          {isManager && (
            <div className="space-y-1.5">
              <Label htmlFor="forum-course">Linked Course</Label>
              <Select value={linkedCourse} onValueChange={setLinkedCourse}>
                <SelectTrigger id="forum-course">
                  <SelectValue placeholder="Select a course…" />
                </SelectTrigger>
                <SelectContent>
                  {MY_TEACHING_COURSES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} · {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="forum-desc">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="forum-desc"
              placeholder="What is this forum for?"
              className="resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="mt-8 flex gap-2 flex-col sm:flex-row">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="w-full" onClick={handleSubmit}>
            {isStudent ? "Submit Request" : "Create Forum"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
