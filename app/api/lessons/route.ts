import { prisma } from "@/utils/prisma";
import { auth } from "@/lib/authHelper";
import slugify from "@sindresorhus/slugify";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, courseId, uploadId } = await req.json();
    const userId = session.user.id;
    console.log(name, description, userId, uploadId);

    if (!userId) {
      return NextResponse.json(
        { error: "Cannot create course: missing user ID" },
        { status: 400 }
      );
    }

    // Check if the course exists and the user is the author
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(courseId),
        authorId: userId,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Unauthorized: Course not found or not owned by user" },
        { status: 401 }
      );
    }

    // Check if the video exists and is owned by the user
    const video = await prisma.video.findFirst({
      where: {
        uploadId,
        ownerId: userId,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Unauthorized: Video not found or not owned by user" },
        { status: 411 }
      );
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        name,
        description,
        slug: slugify(name),
        courseId: course.id,
        video: {
          connect: {
            id: video.id,
          },
        },
      },
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
