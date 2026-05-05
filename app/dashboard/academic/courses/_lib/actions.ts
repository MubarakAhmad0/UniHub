"use server";

import { db } from "@/db";
import { courses } from "@/db/schema/core";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCourse(input: {
  code: string;
  title: string;
  description?: string;
  faculty?: string;
  level: "UNDERGRADUATE" | "GRADUATE";
  credits?: number;
  seatsTotal?: number;
  prerequisites?: string[];
}) {
  const result = await db
    .insert(courses)
    .values({
      ...input,
      credits: input.credits ?? 3,
      seatsTotal: input.seatsTotal ?? 30,
      seatsAvailable: input.seatsTotal ?? 30,
      status: "OPEN",
    })
    .returning();

  revalidatePath("/dashboard/academic/courses");
  return { success: true, data: result[0] };
}

export async function updateCourse(
  id: number,
  input: {
    code?: string;
    title?: string;
    description?: string;
    faculty?: string;
    level?: "UNDERGRADUATE" | "GRADUATE";
    credits?: number;
    seatsTotal?: number;
    seatsAvailable?: number;
    status?: "OPEN" | "LIMITED" | "FULL" | "CLOSED";
    lecturerId?: number;
    prerequisites?: string[];
  },
) {
  if (input.seatsTotal !== undefined && input.seatsAvailable === undefined) {
    const current = await db.query.courses.findFirst({
      where: eq(courses.id, id),
    });
    if (
      current &&
      current.seatsTotal !== null &&
      current.seatsAvailable !== null
    ) {
      const enrolled = current.seatsTotal - current.seatsAvailable;
      input.seatsAvailable = Math.max(0, input.seatsTotal - enrolled);
    }
  }

  const result = await db
    .update(courses)
    .set(input)
    .where(eq(courses.id, id))
    .returning();

  revalidatePath("/dashboard/academic/courses");
  return { success: true, data: result[0] };
}

export async function deleteCourse(id: number) {
  await db.delete(courses).where(eq(courses.id, id));

  revalidatePath("/dashboard/academic/courses");
  return { success: true };
}

export type CreateCourseInput = Parameters<typeof createCourse>[0];
export type UpdateCourseInput = Parameters<typeof updateCourse>[1];
