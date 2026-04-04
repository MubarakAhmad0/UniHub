"use client";

import { CheckCircle } from "lucide-react";

type EndorsementBannerProps = {
  isEndorsed: boolean;
  advisorName?: string;
};

export function EndorsementBanner({
  isEndorsed,
  advisorName = "Prof. Elena Rossi",
}: EndorsementBannerProps) {
  if (isEndorsed) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 px-4 py-2.5 text-sm">
        <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
        <span className="text-emerald-800 dark:text-emerald-300">
          Your plan has been endorsed by <strong>{advisorName}</strong>.
          Enrolment is clear for the next semester.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
      ℹ️ Your plan hasn&apos;t been endorsed by an advisor yet. You can still
      browse and enroll in courses.
    </div>
  );
}
