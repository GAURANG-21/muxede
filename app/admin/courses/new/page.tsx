"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import Heading from "@/components/Heading";
import CourseForm, { Inputs } from "@/components/forms/CourseForm";

type CourseCreateResult = {
  id: number;
};

export default function Page() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (newCourse: Inputs) => {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!res.ok) throw new Error("Failed to create course");
      return res.json();
    },
    onSuccess: (data: CourseCreateResult) => {
      router.push(`/admin/courses/${data.id}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => mutation.mutate(data);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-6 bg-white p-8 shadow-lg rounded-2xl">
        <Heading>Create a New Course</Heading>

        <p className="text-center text-gray-600 mb-4">
          Fill in the details below to create a new course.
        </p>

        <CourseForm onSubmit={onSubmit} isLoading={mutation.isPending} />

        {mutation.isPending && (
          <div className="mt-4 text-center text-gray-500">
            Creating course...
          </div>
        )}
      </div>
    </div>
  );
}
