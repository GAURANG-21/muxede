"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LessonForm, { Inputs } from "@/components/forms/LessonForm";
import { SubmitHandler } from "react-hook-form";

// Define the correct lesson type
type LessonType = {
  id: number;
  name: string;
  description: string;
  slug: string;
  courseId: number;
};

export default function UpdateLessonForm({ lesson }: { lesson: LessonType }) {
  const updateLesson = async (data: Inputs) => {
    const response = await fetch(`/api/lessons/${lesson.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to update lesson");
    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateLesson,
    onSuccess: () => toast.success("Lesson updated successfully"),
    onError: () => toast.error("Something went wrong"),
  });

  // Ensure onSubmit has the correct type
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Update Lesson
      </h2>
      <LessonForm
        onSubmit={onSubmit}
        lesson={lesson}
        isLoading={mutation.isPending}
      />
      {mutation.isPending && (
        <div className="mt-4 text-center text-gray-500">Updating lesson...</div>
      )}
    </div>
  );
}
