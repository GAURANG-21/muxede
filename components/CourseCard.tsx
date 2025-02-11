import { Course, Lesson, Video } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import Heading from "./Heading";

type Props = {
  isAdmin: boolean;
  course: Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  };
};

const CourseCard = ({ course, isAdmin }: Props) => {
  const href = isAdmin
    ? `/admin/courses/${course.id}`
    : `/courses/${course.id}`;

  return (
    <Link
      href={href}
      className="w-full border rounded-lg transition-shadow shadow-sm hover:shadow-md cursor-pointer overflow-hidden"
    >
      {course.lessons[0]?.video?.privatePlaybackId && (
        <Image
          className="w-full h-48 object-cover" // Ensures the image covers the area and maintains aspect ratio
          src={`https://image.mux.com/${course.lessons[0]?.video?.publicPlaybackId}/thumbnail.jpg?width=640`}
          alt={`Video thumbnail preview for ${course.lessons[0]?.video?.publicPlaybackId}`}
          width={640} // Set width for responsive behavior
          height={360} // Set height for responsive behavior
        />
      )}

      <div className="p-4 sm:p-6 lg:p-8">
        {" "}
        {/* Adjust padding for different screen sizes */}
        {!course.published && (
          <span className="bg-slate-200 text-slate-700 rounded-full text-xs py-1 px-3 mb-2 inline-block">
            Draft
          </span>
        )}
        <Heading as="h3">{course.name}</Heading>
        <p className="text-slate-700 mt-2">{course.description}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
