import CourseCard from "@/components/CourseCard";
import type { Course, Lesson, Video } from "@prisma/client";
import Link from "next/link";
import Button from "./Button";

type Props = {
  isAdmin?: boolean;
  courses: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })[];
};

const CourseGrid = async ({ courses, isAdmin = false }: Props) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} isAdmin={isAdmin} />
        ))}
      </div>

      {isAdmin && (
        <Link href="/admin/courses/new">
          <Button className="mt-8 bg-gray-700 text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-900 transition-all duration-300">
            Create a Course
          </Button>
        </Link>
      )}
    </div>
  );
};

export default CourseGrid;
