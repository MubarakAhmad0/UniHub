import { getAnnouncements } from "./_lib/queries";
import { AnnouncementsClient } from "./_components/announcements-client";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements({});

  return <AnnouncementsClient initialData={announcements} />;
}
