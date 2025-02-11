"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MuxUploader from "@mux/mux-uploader-react";
import Heading from "@/components/Heading";
import TextInput from "@/components/forms/TextInput";
import TextAreaInput from "@/components/forms/TextAreaInput";
import Field from "@/components/forms/Field";

type Inputs = {
  name: string;
  description: string;
  uploadId: string;
  courseId: string;
};

const AdminNewLesson = ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [uploadData, setUploadData] = useState<{
    uploadId: string;
    uploadUrl: string;
  } | null>(null);

  const methods = useForm<Inputs>();

  // Resolve the promise and set courseId
  useEffect(() => {
    params.then((resolvedParams) => setCourseId(resolvedParams.courseId));
  }, [params]);

  const fetchUploadUrl = async () => {
    try {
      const res = await fetch("/api/videos", { method: "POST" });
      const data = await res.json();
      setUploadData(data);
    } catch {
      toast.error("Failed to fetch upload URL");
    }
  };

  // Fetch Mux Upload URL
  useEffect(() => {
    fetchUploadUrl();
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status !== 200) {
        throw new Error("Failed to create lesson");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.id) {
        toast.error("Lesson ID is missing in response");
        return;
      }
      router.push(`/admin/courses/${courseId}/lessons/${data.id}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutation.mutate(data);
  };

  if (!uploadData || !courseId)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <Heading>New Lesson</Heading>

        <FormProvider {...methods}>
          <form
            className="flex flex-col space-y-6"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <TextInput label="Name" name="name" options={{ required: true }} />
            <TextAreaInput
              label="Description"
              name="description"
              options={{ required: true }}
            />

            <Field>
              <MuxUploader
                endpoint={uploadData.uploadUrl}
                type="bar"
                className="w-full border border-gray-300 rounded-lg p-4 bg-gray-50"
                style={
                  { "--button-border-radius": "40px" } as React.CSSProperties
                }
                onSuccess={() => {
                  setIsVideoUploaded(true);
                  fetchUploadUrl();
                }}
              />
            </Field>

            <input
              type="hidden"
              {...methods.register("uploadId", {
                value: uploadData.uploadId,
                required: true,
              })}
            />
            <input
              type="hidden"
              {...methods.register("courseId", {
                value: courseId,
                required: true,
              })}
            />

            <button
              type="submit"
              className={`bg-gray-600 text-white font-semibold py-3 rounded-xl hover:bg-gray-700 transition-all ${
                !isVideoUploaded ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isVideoUploaded}
            >
              Create Lesson
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AdminNewLesson;
