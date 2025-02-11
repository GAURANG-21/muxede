"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import MuxPlayer from "@mux/mux-player-react/lazy";
import Button from "@/components/Button";
import LessonForm, { Inputs } from "@/components/forms/LessonForm";
import { getLesson, deleteLessonAction, updateLessonAction } from "./actions";

export default function AdminLessonEdit({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [lessonId, setLessonId] = useState<string | null>(null);

  // Unwrap params and store lessonId
  useEffect(() => {
    params.then((resolvedParams) => setLessonId(resolvedParams.lessonId));
  }, [params]);

  // Fetch lesson data only when lessonId is available
  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => (lessonId ? getLesson(lessonId) : null),
    enabled: !!lessonId, // Only run query when lessonId is available
  });

  const updateMutation = useMutation({
    mutationFn: updateLessonAction,
    onSuccess: () => toast.success("Lesson updated successfully"),
    onError: () => toast.error("Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!lessonId) {
        return Promise.reject(new Error("Lesson ID is missing"));
      }
      return deleteLessonAction(lessonId);
    },
    onSuccess: () => {
      if (lesson) {
        router.push(`/admin/courses/${lesson.courseId}`);
        toast.success("Lesson deleted successfully");
      }
    },
    onError: () => toast.error("Something went wrong"),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (lessonId) {
      updateMutation.mutate({ lessonId, data });
    }
  };

  if (!session)
    return <p className="text-center text-red-500">Access Denied</p>;
  if (isLoading || !lessonId)
    return <p className="text-center text-gray-500">Loading...</p>;
  if (!lesson)
    return <p className="text-center text-gray-500">Lesson not found</p>;
  console.log("lesson: ", lesson);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Lesson</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Section */}
        <div>
          {lesson.video?.publicPlaybackId ? (
            <MuxPlayer
              className="mb-6 w-full aspect-video rounded-lg shadow-md border"
              playbackId={lesson.video.publicPlaybackId}
            />
          ) : (
            <div className="mb-6 w-full aspect-video bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
              No Video Available
            </div>
          )}

          <Button
            intent="danger"
            className="bg-pink-700 w-full mt-4 py-3"
            onClick={() => deleteMutation.mutate()}
          >
            Delete Lesson
          </Button>
        </div>

        {/* Lesson Form */}
        <div className="p-6 bg-white rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Update Lesson
          </h2>
          <LessonForm
            onSubmit={onSubmit}
            lesson={lesson}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
