import { prisma } from "@/utils/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Banner from "@/components/Banner";
import Link from "next/link";
import { Suspense } from "react";
import { ViewCourseClient } from "./viewCourseClient";

// ✅ Fetch course data inside a Server Component
async function getCourseData(slug: string, userId: string | null) {
  const courseId = parseInt(slug, 10);
  if (isNaN(courseId)) return null;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          include: {
            video: true,
          },
        },
      },
    });

    if (!course) return null;
    if (!course.published && course.authorId !== userId) return null;

    // Fetch completed lessons for the user
    const completedLessons = userId
      ? await prisma.userLessonProgress
          .findMany({
            where: {
              userId,
              lessonId: {
                in: course.lessons.map((lesson) => lesson.id),
              },
            },
          })
          .then((progress) => progress.map((p) => p.lessonId))
      : [];

    return { ...course, completedLessons };
  } catch (error) {
    console.error("Error fetching course data:", error);
    return null;
  }
}

// ✅ Server Component (Fetch Data & Render Layout)
export default async function ViewCoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  const course = await getCourseData(params.slug, userId);

  if (!course) return notFound();

  return (
    <>
      <Nav />
      {!session && (
        <Banner>
          <p className="text-center">
            <Link href="/api/auth/signin" className="underline">
              Sign in
            </Link>{" "}
            to track your progress &rarr;
          </p>
        </Banner>
      )}
      <Suspense fallback={<p>Loading course...</p>}>
        <ViewCourseClient course={course} />
      </Suspense>
    </>
  );
}
