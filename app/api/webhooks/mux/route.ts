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
    console.log("Creating lesson:", { name, description, courseId, uploadId, userId });

    if (!userId) {
      return NextResponse.json(
        { error: "Cannot create lesson: missing user ID" },
        { status: 412 }
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
        { error: "Course not found or not owned by user" },
        { status: 411 }
      );
    }

    // Check if the video exists and is owned by the user
    const video = await prisma.video.findFirst({
      where: {
        uploadId: uploadId,
        ownerId: userId,
      },
    });

    console.log("Found video:", video);

    if (!video) {
      console.log("Video not found for uploadId:", uploadId);
      return NextResponse.json(
        { error: "Video not found or not owned by user" },
        { status: 404 }
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
    console.error("Request error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}