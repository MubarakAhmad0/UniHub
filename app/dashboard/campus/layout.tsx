import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus | UniHub",
  description: "Timetable, campus map, bookings, events and more.",
};

export default function CampusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
