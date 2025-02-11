import { prisma } from "@/utils/prisma";
import { auth } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lessonId = (await params).id;
  if (!lessonId)
    return NextResponse.json({ error: "Missing lesson ID" }, { status: 400 });

  try {
    const { name, description } = await req.json();

    // Check if the user is the course author
    const checkLesson = await prisma.lesson.findFirst({
      where: { id: parseInt(lessonId) },
      include: { course: true },
    });

    if (checkLesson?.course?.authorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lesson = await prisma.lesson.update({
      where: { id: parseInt(lessonId) },
      data: { name, description },
    });

    return NextResponse.json(lesson, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lessonId = (await params).id;
  if (!lessonId)
    return NextResponse.json({ error: "Missing lesson ID" }, { status: 400 });

  try {
    // Check if the user is the course author
    const checkLesson = await prisma.lesson.findFirst({
      where: { id: parseInt(lessonId) },
      include: { course: true },
    });

    if (checkLesson?.course?.authorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.lesson.delete({ where: { id: parseInt(lessonId) } });

    return NextResponse.json({ message: "Lesson deleted" }, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
