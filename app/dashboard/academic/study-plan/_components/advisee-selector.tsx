"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Advisee = {
  id: string;
  name: string;
  programme: string;
  isEndorsed: boolean;
};

export const ADVISEES: Advisee[] = [
  {
    id: "s001",
    name: "Alex Rivers",
    programme: "BSc Computer Science",
    isEndorsed: false,
  },
  {
    id: "s002",
    name: "Jae Lee",
    programme: "BSc Computer Science",
    isEndorsed: true,
  },
  {
    id: "s003",
    name: "Sam Kaur",
    programme: "BSc Mathematics",
    isEndorsed: false,
  },
];

type AdviseeSelectorProps = {
  value: string;
  onValueChange: (id: string) => void;
};

export function AdviseeSelector({
  value,
  onValueChange,
}: AdviseeSelectorProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/20">
      <p className="text-sm font-medium shrink-0">Viewing advisee:</p>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-72" id="advisee-select">
          <SelectValue placeholder="Select a student to view their study plan…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">— Select advisee —</SelectItem>
          {ADVISEES.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.name} — {a.programme}
              {a.isEndorsed ? " ✓" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
