"use server";

import { db } from "@/db";
import { announcements } from "@/db/schema/core";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(input: {
  title: string;
  body: string;
  type: "SYSTEM" | "FACULTY" | "EVENT";
  priority: "LOW" | "NORMAL" | "HIGH";
  audience?: string;
  courseCode?: string;
  authorName: string;
  authorId?: number;
}) {
  const result = await db
    .insert(announcements)
    .values({
      ...input,
      status: "PUBLISHED",
      isPinned: false,
      publishedAt: new Date(),
    })
    .returning();

  revalidatePath("/dashboard/announcements");
  return { success: true, data: result[0] };
}

export async function updateAnnouncement(
  id: number,
  input: {
    title?: string;
    body?: string;
    type?: "SYSTEM" | "FACULTY" | "EVENT";
    priority?: "LOW" | "NORMAL" | "HIGH";
    audience?: string;
    courseCode?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    isPinned?: boolean;
  },
) {
  const result = await db
    .update(announcements)
    .set(input)
    .where(eq(announcements.id, id))
    .returning();

  revalidatePath("/dashboard/announcements");
  return { success: true, data: result[0] };
}

export async function deleteAnnouncement(id: number) {
  await db.delete(announcements).where(eq(announcements.id, id));

  revalidatePath("/dashboard/announcements");
  return { success: true };
}

export async function togglePinAnnouncement(id: number) {
  const existing = await db.query.announcements.findFirst({
    where: eq(announcements.id, id),
  });

  if (!existing) {
    return { success: false, error: "Announcement not found" };
  }

  await db
    .update(announcements)
    .set({ isPinned: !existing.isPinned })
    .where(eq(announcements.id, id));

  revalidatePath("/dashboard/announcements");
  return { success: true };
}

export type CreateAnnouncementInput = Parameters<typeof createAnnouncement>[0];
export type UpdateAnnouncementInput = Parameters<typeof updateAnnouncement>[1];
