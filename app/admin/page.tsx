import { auth } from "@/lib/authHelper";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import Heading from "@/components/Heading";
import CourseGrid from "@/components/CourseGrid";
import Button from "@/components/Button";

const AdminIndex = async () => {
  const session = await auth(); // Fetch user session on the server

  if (!session) {
    return redirect("/"); // Redirect to home if not authenticated
  }

  const courses = await prisma.course.findMany({
    where: {
      authorId: session.user.id, // Fix: Use `authorId` instead of `author.id`
    },
    include: {
      lessons: {
        include: {
          video: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Heading>Admin Dashboard</Heading>
      <Heading as="h2">Your Courses</Heading>

      {courses.length > 0 ? (
        <div className="mt-8">
          <CourseGrid courses={courses} isAdmin />
        </div>
      ) : (
        <div className="mt-2 pt-4 flex flex-col items-start">
          <Heading as="h3">You don&apos;t have any courses yet.</Heading>
          <Link href="/admin/courses/new">
            <Button className="mt-6 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200">
              Create a Course
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminIndex;
