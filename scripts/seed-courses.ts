import { db } from "../db";
import { courses } from "../db/schema/core";

const sampleCourses = [
  {
    code: "CS 601",
    title: "Advanced Neural Architectures",
    description:
      "An in-depth study of modern deep learning architectures including transformers, diffusion models, and neural ODEs applied to real-world problem settings.",
    faculty: "Computer Science",
    level: "GRADUATE" as const,
    credits: 4,
    seatsTotal: 30,
    seatsAvailable: 12,
    status: "OPEN" as const,
    prerequisites: ["CS 401", "MTH 305"],
  },
  {
    code: "BIO 320",
    title: "Cellular Mechanics & Flow",
    description:
      "Examination of cytoskeletal dynamics, membrane topology, and inter-cellular signaling pathways using modern biophysical measurement techniques.",
    faculty: "Life Sciences",
    level: "UNDERGRADUATE" as const,
    credits: 3,
    seatsTotal: 25,
    seatsAvailable: 5,
    status: "LIMITED" as const,
    prerequisites: ["BIO 201", "CHM 102"],
  },
  {
    code: "LIT 440",
    title: "Quantum Literary Theory",
    description:
      "Application of observer-effect and superposition metaphors to postmodern textual analysis. Cross-disciplinary exploration of physics-adjacent interpretive frameworks.",
    faculty: "Humanities",
    level: "GRADUATE" as const,
    credits: 3,
    seatsTotal: 20,
    seatsAvailable: 18,
    status: "OPEN" as const,
    prerequisites: ["LIT 301", "PHY 150"],
  },
  {
    code: "AI 210",
    title: "Ethics in Artificial Intelligence",
    description:
      "Exploration of moral frameworks applied to algorithmic decision making, autonomous systems, and the future of human-machine agency.",
    faculty: "Computer Science",
    level: "UNDERGRADUATE" as const,
    credits: 2,
    seatsTotal: 40,
    seatsAvailable: 0,
    status: "FULL" as const,
    prerequisites: [],
  },
  {
    code: "DES 315",
    title: "Visual Systems & Brand Identity",
    description:
      "Comprehensive study of visual communication systems, brand strategy, and identity design across digital and physical media.",
    faculty: "Design",
    level: "UNDERGRADUATE" as const,
    credits: 3,
    seatsTotal: 25,
    seatsAvailable: 20,
    status: "OPEN" as const,
    prerequisites: ["DES 201"],
  },
  {
    code: "MTH 401",
    title: "Advanced Differential Equations",
    description:
      "Graduate-level treatment of partial differential equations, distribution theory, and applications in physics and engineering.",
    faculty: "Mathematics",
    level: "GRADUATE" as const,
    credits: 4,
    seatsTotal: 20,
    seatsAvailable: 8,
    status: "OPEN" as const,
    prerequisites: ["MTH 301"],
  },
  {
    code: "PHY 420",
    title: "Quantum Computing",
    description:
      "Introduction to quantum computation, quantum algorithms, and the physical implementation of quantum computers.",
    faculty: "Physics",
    level: "GRADUATE" as const,
    credits: 3,
    seatsTotal: 15,
    seatsAvailable: 15,
    status: "OPEN" as const,
    prerequisites: ["PHY 301", "MTH 201"],
  },
  {
    code: "ARC 101",
    title: "Introduction to Architecture",
    description:
      "Foundational studio course exploring architectural design principles, spatial thinking, and representation techniques.",
    faculty: "Architecture",
    level: "UNDERGRADUATE" as const,
    credits: 4,
    seatsTotal: 40,
    seatsAvailable: 22,
    status: "OPEN" as const,
    prerequisites: [],
  },
  {
    code: "PSY 201",
    title: "Developmental Psychology",
    description:
      "Study of human development across the lifespan, covering cognitive, social, and emotional development.",
    faculty: "Psychology",
    level: "UNDERGRADUATE" as const,
    credits: 3,
    seatsTotal: 50,
    seatsAvailable: 35,
    status: "OPEN" as const,
    prerequisites: [],
  },
  {
    code: "ENG 301",
    title: "Technical Writing",
    description:
      "Advanced writing for technical and professional contexts, including reports, proposals, and documentation.",
    faculty: "English",
    level: "UNDERGRADUATE" as const,
    credits: 2,
    seatsTotal: 30,
    seatsAvailable: 18,
    status: "OPEN" as const,
    prerequisites: ["ENG 101"],
  },
];

async function seed() {
  console.log("Seeding courses...");

  for (const course of sampleCourses) {
    await db.insert(courses).values(course);
    console.log(`  ✓ ${course.code} - ${course.title}`);
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
