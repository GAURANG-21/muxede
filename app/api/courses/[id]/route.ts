import { prisma } from "@/utils/prisma";
import { auth } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const courseId = (await params).id;
  if (!courseId)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        lessons: true,
      },
    });

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ PUT Request Handler
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const courseId = params.id;
  if (!courseId)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description } = await req.json();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Cannot update course: missing user id");

    // Check if the course exists and belongs to the user
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: parseInt(courseId),
        authorId: userId, // Assuming `authorId` is the correct field name in Prisma schema
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Unauthorized or Course Not Found" },
        { status: 403 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: { name, description },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
