import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/utils/prisma";
import Heading from "@/components/Heading";
import CourseGrid from "@/components/CourseGrid";
import Nav from "@/components/Nav";
import { Book } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = !!session?.user.id; // Simplified boolean check
  const courses = await prisma.course.findMany({
    where: {
      OR: [{ published: true }, { author: { id: session?.user?.id } }],
    },
    include: { lessons: { include: { video: true } } },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Nav />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 opacity-70" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            {courses.length > 0 ? (
              <>
                <div className="flex items-center justify-center mb-4">
                  <Book className="w-8 h-8 text-blue-500 mr-2" />
                </div>
                <Heading>Explore Our Video Courses</Heading>
                <p className="mt-4 text-lg text-gray-600">
                  Enhance your skills with our carefully curated video courses
                </p>
              </>
            ) : (
              <>
                <Heading>No Courses Available</Heading>
                <p className="mt-4 text-lg text-gray-600">
                  Check back soon for new courses
                </p>
              </>
            )}

            {courses.find((course) => !course.published) && (
              <div className="mt-4 inline-block px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-blue-600">
                  Draft courses are only visible to you
                </p>
              </div>
            )}
          </div>

          {/* Courses Grid Section */}
          <div className="mt-12">
            <CourseGrid courses={courses} isAdmin={isAdmin} />
          </div>
        </div>

        {/* Bottom fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
    </div>
  );
}
