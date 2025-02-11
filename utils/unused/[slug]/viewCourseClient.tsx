"use client";

import { useState } from "react";
import CourseViewer from "@/components/CourseViewer";

type CourseWithLessons = {
  id: number;
  name: string;
  slug: string;
  authorId: string;
  published: boolean;
  description: string;
  lessons: {
    id: number;
    name: string;
    description: string;
    slug: string;
    courseId: number;
    video: {
      id: number;
      lessonId: number | null;
      ownerId: string;
      uploadId: string;
      publicPlaybackId: string | null;
      privatePlaybackId: string | null;
      duration: number | null;
      aspectRatio: string | null;
      status: string;
      posterTime: number | null;
      placeholder?: string;
    } | null;
  }[];
  completedLessons: number[];
};

export function ViewCourseClient({ course }: { course: CourseWithLessons }) {
  const [lessonProgress, setLessonProgress] = useState(course.completedLessons);
  return (
    <CourseViewer
      course={course}
      lessonProgress={lessonProgress}
      setLessonProgress={setLessonProgress}
    />
  );
}
