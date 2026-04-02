import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | UniHub Academic",
    default: "Academic Portal | UniHub",
  },
  description:
    "UniHub Academic Portal — courses, grades, attendance and study plans.",
};

export default function AcademicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
