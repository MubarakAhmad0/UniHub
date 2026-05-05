import { getCourses } from "./_lib/queries";
import { CoursesClient } from "./_components/courses-client";

export default async function CoursesPage() {
  const courses = await getCourses({});

  return <CoursesClient initialData={courses} />;
}
