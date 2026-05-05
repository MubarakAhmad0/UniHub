import { db } from "../db";
import { announcements } from "../db/schema/core";

const sampleAnnouncements = [
  {
    title: "Final Exam Schedule Released",
    body: "The final examination schedule for Fall 2024 has been published. Please review your individual exam slots on the Academic Calendar portal. Venue assignments will follow next week.",
    type: "SYSTEM" as const,
    priority: "HIGH" as const,
    isPinned: true,
    status: "PUBLISHED" as const,
    audience: "University-wide",
    authorName: "Registry Office",
    publishedAt: new Date("2026-04-02"),
  },
  {
    title: "Urban Design Theory — Studio Brief Updated",
    body: "Professor Vane has updated the Week 11 studio brief for ARC 402. The revised scope reduces the site analysis section and expands the concept development deliverable. Refer to the course materials page for the updated brief PDF.",
    type: "FACULTY" as const,
    priority: "NORMAL" as const,
    isPinned: false,
    status: "PUBLISHED" as const,
    courseCode: "ARC 402",
    authorName: "Prof. James Vane",
    publishedAt: new Date("2026-04-01"),
  },
  {
    title: "Library Extended Hours — Exam Period",
    body: "The university library will operate extended hours from Apr 15 through May 10. Monday–Friday: 07:00–24:00. Saturday–Sunday: 09:00–22:00.",
    type: "EVENT" as const,
    priority: "NORMAL" as const,
    isPinned: false,
    status: "PUBLISHED" as const,
    audience: "University-wide",
    authorName: "Library Services",
    publishedAt: new Date("2026-03-29"),
  },
  {
    title: "Data Structures — Assignment 3 Deadline Extended",
    body: "Due to multiple students reporting issues with the Judge system, the deadline for CS 105 Assignment 3 has been extended by 48 hours to Friday, Apr 4 at 23:59.",
    type: "FACULTY" as const,
    priority: "HIGH" as const,
    isPinned: false,
    status: "PUBLISHED" as const,
    courseCode: "CS 105",
    authorName: "Prof. Elena Rossi",
    publishedAt: new Date("2026-03-28"),
  },
  {
    title: "Campus Wi-Fi Maintenance — Apr 5",
    body: "Scheduled maintenance on the campus wireless infrastructure will cause intermittent disruptions between 02:00–06:00 on Saturday, April 5. Wired connections will not be affected.",
    type: "SYSTEM" as const,
    priority: "NORMAL" as const,
    isPinned: false,
    status: "PUBLISHED" as const,
    audience: "University-wide",
    authorName: "IT Department",
    publishedAt: new Date("2026-03-25"),
  },
  {
    title: "Student Research Symposium — Call for Abstracts",
    body: "The annual Student Research Symposium will be held on May 20–21. Submit a 250-word abstract via the portal by Apr 10 to present your work. All disciplines welcome.",
    type: "EVENT" as const,
    priority: "NORMAL" as const,
    isPinned: false,
    status: "PUBLISHED" as const,
    audience: "University-wide",
    authorName: "Research Office",
    publishedAt: new Date("2026-03-22"),
  },
];

async function seed() {
  console.log("Seeding announcements...");

  for (const item of sampleAnnouncements) {
    await db.insert(announcements).values(item);
    console.log(`  ✓ ${item.title}`);
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
