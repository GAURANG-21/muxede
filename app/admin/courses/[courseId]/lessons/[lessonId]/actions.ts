"use server";

import { prisma } from "@/utils/prisma";
import { auth } from "@/lib/authHelper";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client"; // Import Prisma types

export async function getLesson(lessonId: string) {
  const session = await auth();
  if (!session) return null;

  return await prisma.lesson.findUnique({
    where: { id: parseInt(lessonId) },
    include: { video: true },
  });
}

// Define a type for lesson updates using Prisma's generated types
type LessonUpdateInput = Prisma.LessonUpdateInput;

export async function updateLessonAction({
  lessonId,
  data,
}: {
  lessonId: string;
  data: LessonUpdateInput;
}) {
  await prisma.lesson.update({
    where: { id: parseInt(lessonId) },
    data,
  });

  revalidatePath(`/admin/lessons/${lessonId}`);
}

export async function deleteLessonAction(lessonId: string) {
  await prisma.lesson.delete({
    where: { id: parseInt(lessonId) },
  });

  revalidatePath(`/admin/courses`);
}
