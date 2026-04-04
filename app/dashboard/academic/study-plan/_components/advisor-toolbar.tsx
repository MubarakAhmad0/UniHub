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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight, CheckCircle, StickyNote } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PLAN_COURSES = [
  "CS 101 · Intro to Computing",
  "CS 102 · Data Structures",
  "CS 201 · Algorithms",
  "MTH 301 · Advanced Calculus II",
  "CS 401 · Machine Learning",
  "CS 410 · Database Systems",
];

const SUBSTITUTE_COURSES = [
  "CS 305 · Operating Systems",
  "CS 320 · Software Engineering",
  "CS 355 · Computer Networks",
  "AI 210 · Ethics in AI",
  "MTH 305 · Statistics",
];

type AdvisorToolbarProps = {
  adviseeName: string;
  isEndorsed: boolean;
  onEndorse: () => void;
};

export function AdvisorToolbar({
  adviseeName,
  isEndorsed,
  onEndorse,
}: AdvisorToolbarProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteCourse, setNoteCourse] = useState("");
  const [subReplace, setSubReplace] = useState("");
  const [subWith, setSubWith] = useState("");
  const [subReason, setSubReason] = useState("");

  const submitNote = () => {
    if (!noteText.trim() || !noteCourse) {
      toast.error("Select a course and add a note.");
      return;
    }
    toast.success(`Note added to ${noteCourse.split("·")[0].trim()}.`);
    setNoteOpen(false);
    setNoteText("");
    setNoteCourse("");
  };

  const submitSubstitution = () => {
    if (!subReplace || !subWith || !subReason.trim()) {
      toast.error("Fill in all substitution fields.");
      return;
    }
    toast.success("Substitution suggestion sent to admin for approval.");
    setSubOpen(false);
    setSubReplace("");
    setSubWith("");
    setSubReason("");
  };

  return (
    <>
      {/* Sticky toolbar */}
      <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t px-6 py-3 flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground mr-2 shrink-0">
          Advising: <strong>{adviseeName}</strong>
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setNoteOpen(true)}
          id="add-note-btn"
        >
          <StickyNote className="h-3.5 w-3.5 mr-1.5" />
          Add Note
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSubOpen(true)}
          id="suggest-sub-btn"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5" />
          Suggest Substitution
        </Button>

        <Button
          size="sm"
          variant={isEndorsed ? "secondary" : "default"}
          onClick={onEndorse}
          className={isEndorsed ? "text-emerald-700" : ""}
          id="endorse-plan-btn"
        >
          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
          {isEndorsed ? "Endorsed ✓" : "Endorse Plan"}
        </Button>
      </div>

      {/* Add Note dialog */}
      <Dialog open={noteOpen} onOpenChange={(v) => !v && setNoteOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note to a course slot in {adviseeName}&apos;s study plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="note-course">Course</Label>
              <Select value={noteCourse} onValueChange={setNoteCourse}>
                <SelectTrigger id="note-course">
                  <SelectValue placeholder="Select course…" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_COURSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note-text">Note</Label>
              <Textarea
                id="note-text"
                placeholder="e.g. Consider taking this before applying for internships…"
                rows={3}
                className="resize-none"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suggest Substitution dialog */}
      <Dialog open={subOpen} onOpenChange={(v) => !v && setSubOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Suggest Course Substitution</DialogTitle>
            <DialogDescription>
              This will be sent to the admin for approval before it appears on
              the student&apos;s plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="sub-replace">Replace</Label>
              <Select value={subReplace} onValueChange={setSubReplace}>
                <SelectTrigger id="sub-replace">
                  <SelectValue placeholder="Current course…" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_COURSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sub-with">With</Label>
              <Select value={subWith} onValueChange={setSubWith}>
                <SelectTrigger id="sub-with">
                  <SelectValue placeholder="Substitute course…" />
                </SelectTrigger>
                <SelectContent>
                  {SUBSTITUTE_COURSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sub-reason">Reason</Label>
              <Textarea
                id="sub-reason"
                placeholder="Reason for substitution…"
                rows={3}
                className="resize-none"
                value={subReason}
                onChange={(e) => setSubReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitSubstitution} id="submit-sub-btn">
              Submit Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
