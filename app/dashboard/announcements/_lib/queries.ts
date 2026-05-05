import { db } from "@/db";
import { announcements } from "@/db/schema/core";
import { eq, sql, desc, and } from "drizzle-orm";

export async function getAnnouncements({
  type,
  status = "PUBLISHED",
}: {
  type?: "SYSTEM" | "FACULTY" | "EVENT";
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
} = {}) {
  const conditions = [eq(announcements.status, status)];

  if (type) {
    conditions.push(eq(announcements.type, type));
  }

  const result = await db
    .select()
    .from(announcements)
    .where(and(...conditions))
    .orderBy(
      desc(sql`${announcements.isPinned}::int`),
      desc(announcements.publishedAt),
    );

  return result.map((row) => ({
    ...row,
    isPinned: row.isPinned ?? false,
    date: row.publishedAt
      ? new Date(row.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : new Date(row.createdAt!).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    read: false,
    author: row.authorName,
    type: row.type as "SYSTEM" | "FACULTY" | "EVENT",
    priority: row.priority as "LOW" | "NORMAL" | "HIGH",
    status: row.status as "PUBLISHED" | "DRAFT" | "ARCHIVED",
  }));
}

export async function getAnnouncementById(id: number) {
  const result = await db.query.announcements.findFirst({
    where: eq(announcements.id, id),
  });

  if (!result) return null;

  return {
    ...result,
    isPinned: result.isPinned ?? false,
    date: result.publishedAt
      ? new Date(result.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : new Date(result.createdAt!).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    read: false,
    author: result.authorName,
    type: result.type as "SYSTEM" | "FACULTY" | "EVENT",
    priority: result.priority as "LOW" | "NORMAL" | "HIGH",
    status: result.status as "PUBLISHED" | "DRAFT" | "ARCHIVED",
  };
}

export type GetAnnouncementsInput = Parameters<typeof getAnnouncements>[0];
