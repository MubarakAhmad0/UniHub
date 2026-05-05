import { db } from "@/db";
import { courses } from "@/db/schema/core";
import { eq, ilike, desc, or, and } from "drizzle-orm";

export async function getCourses({
  search,
  level,
  status,
}: {
  search?: string;
  level?: "UNDERGRADUATE" | "GRADUATE";
  status?: "OPEN" | "LIMITED" | "FULL" | "CLOSED";
} = {}) {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(courses.code, `%${search}%`),
        ilike(courses.title, `%${search}%`),
        ilike(courses.faculty, `%${search}%`),
      ),
    );
  }

  if (level) {
    conditions.push(eq(courses.level, level));
  }

  if (status) {
    conditions.push(eq(courses.status, status));
  }

  const result = await db
    .select()
    .from(courses)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(courses.code));

  return result.map((row) => ({
    ...row,
    level: row.level as "UNDERGRADUATE" | "GRADUATE",
    status: row.status as "OPEN" | "LIMITED" | "FULL" | "CLOSED",
    enrolledCount: (row.seatsTotal ?? 0) - (row.seatsAvailable ?? 0),
    hasPrerequisites: row.prerequisites ? row.prerequisites.length > 0 : false,
    lecturer: row.lecturerId,
    credits: row.credits ?? 3,
  }));
}

export async function getCourseById(id: number) {
  const result = await db.query.courses.findFirst({
    where: eq(courses.id, id),
  });

  if (!result) return null;

  return {
    ...result,
    level: result.level as "UNDERGRADUATE" | "GRADUATE",
    status: result.status as "OPEN" | "LIMITED" | "FULL" | "CLOSED",
    enrolledCount: (result.seatsTotal ?? 0) - (result.seatsAvailable ?? 0),
    hasPrerequisites: result.prerequisites
      ? result.prerequisites.length > 0
      : false,
  };
}

export type GetCoursesInput = Parameters<typeof getCourses>[0];
