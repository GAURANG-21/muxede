"use client";

import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

import Heading from "@/components/Heading";
import Button from "@/components/Button";
import CourseForm, { Inputs } from "@/components/forms/CourseForm";

type Course = {
  id: number;
  name: string;
  description: string;
  slug: string;
  authorId: string;
  published: boolean;
  lessons: {
    id: number;
    name: string;
    video?: {
      publicPlaybackId?: string;
    } | null;
  }[];
};

const AdminCourseEdit = () => {
  const { data: session } = useSession();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!courseId) return;
    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCourse({
            id: data.id,
            name: data.name,
            description: data.description,
            slug: data.slug,
            authorId: data.authorId,
            published: data.published,
            lessons: data.lessons || [],
          });
        }
      })
      .catch(() => toast.error("Failed to load course"));
  }, [courseId]);

  const updateCourse = async (data: Inputs) => {
    const res = await fetch(`/api/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update course");

    return res.json();
  };

  const mutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => toast.success("Course updated successfully"),
    onError: () => toast.error("Something went wrong"),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => mutation.mutate(data);

  if (!session)
    return (
      <p className="text-center text-red-500 font-medium">Access Denied</p>
    );
  if (!course) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="bg-white shadow-lg p-6 rounded-xl">
          <Heading as="h2">{course.name}</Heading>
          <CourseForm
            onSubmit={onSubmit}
            course={course}
            isLoading={mutation.isPending}
          />
        </div>

        {/* Right Section (Lessons) */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md">
          <Heading as="h4">Lessons</Heading>

          {course.lessons.length > 0 ? (
            <div className="space-y-4">
              {course.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                >
                  {lesson.video?.publicPlaybackId && (
                    <Image
                      src={`https://image.mux.com/${lesson.video.publicPlaybackId}/thumbnail.jpg?width=640`}
                      alt={`Video thumbnail preview for ${lesson.name}`}
                      width={120}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <Heading as="h5">{lesson.name}</Heading>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No lessons yet.</p>
          )}

          <div className="mt-6">
            <Link href={`/admin/courses/${course.id}/lessons/new`}>
              <Button
                intent="secondary"
                className="w-full md:w-auto px-6 py-2 text-white bg-gray-600 hover:bg-gray-800 transition rounded-lg"
              >
                Add a Lesson
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseEdit;
